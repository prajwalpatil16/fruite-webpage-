#!/usr/bin/env python3
"""
Numbered, repeatable schema migrations.

Source of truth: models.py
Run:  python migrate.py
Safe to re-run (idempotent checks).
"""
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / '.env')

from app import create_app
from extensions import db
from sqlalchemy import inspect, text


def column_names(table):
    insp = inspect(db.engine)
    if table not in insp.get_table_names():
        return set()
    return {c['name'] for c in insp.get_columns(table)}


def add_column_if_missing(table, column_def, sqlite_def=None):
    cols = column_names(table)
    col_name = column_def.split()[0]
    if col_name in cols:
        print(f'  · {table}.{col_name} already exists')
        return
    dialect = db.engine.dialect.name
    ddl = sqlite_def if dialect == 'sqlite' and sqlite_def else column_def
    sql = f'ALTER TABLE {table} ADD COLUMN {ddl}'
    db.session.execute(text(sql))
    db.session.commit()
    print(f'  + added {table}.{col_name}')


def migrate_users_password_nullable_sqlite():
    """SQLite cannot ALTER COLUMN nullability — rebuild users if needed."""
    if db.engine.dialect.name != 'sqlite':
        return
    cols = {c['name']: c for c in inspect(db.engine).get_columns('users')}
    if 'password_hash' not in cols:
        return
    if cols['password_hash'].get('nullable', False):
        print('  · users.password_hash already nullable')
        return

    print('  ~ rebuilding users to allow NULL password_hash (SQLite)')
    db.session.execute(text('PRAGMA foreign_keys=OFF'))
    db.session.execute(text('''
        CREATE TABLE users_new (
            id INTEGER PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(120) NOT NULL UNIQUE,
            password_hash VARCHAR(255),
            google_id VARCHAR(64) UNIQUE,
            phone VARCHAR(15),
            profile_photo VARCHAR(255),
            role VARCHAR(20) DEFAULT 'customer',
            created_at DATETIME
        )
    '''))
    # Copy existing columns that exist
    existing = column_names('users')
    select_cols = ['id', 'name', 'email', 'password_hash']
    insert_cols = list(select_cols)
    if 'google_id' in existing:
        select_cols.append('google_id')
        insert_cols.append('google_id')
    for c in ('phone', 'profile_photo', 'role', 'created_at'):
        if c in existing:
            select_cols.append(c)
            insert_cols.append(c)
    db.session.execute(text(
        f"INSERT INTO users_new ({', '.join(insert_cols)}) "
        f"SELECT {', '.join(select_cols)} FROM users"
    ))
    db.session.execute(text('DROP TABLE users'))
    db.session.execute(text('ALTER TABLE users_new RENAME TO users'))
    db.session.execute(text('PRAGMA foreign_keys=ON'))
    db.session.commit()
    print('  ✓ users.password_hash is now nullable')


def run():
    app = create_app()
    with app.app_context():
        print('Creating any missing tables from models.py…')
        import models  # noqa: F401
        db.create_all()

        print('Applying column migrations…')
        # SQLite cannot ADD COLUMN … UNIQUE — add plain column, then unique index
        add_column_if_missing(
            'users',
            'google_id VARCHAR(64) NULL',
            sqlite_def='google_id VARCHAR(64)',
        )
        try:
            db.session.execute(text(
                'CREATE UNIQUE INDEX IF NOT EXISTS ix_users_google_id ON users(google_id)'
            ))
            db.session.commit()
            print('  · unique index on users.google_id ok')
        except Exception as e:
            db.session.rollback()
            print(f'  · google_id index skipped: {e}')

        add_column_if_missing(
            'farmer_profiles',
            'is_new_seller BOOLEAN DEFAULT TRUE',
            sqlite_def='is_new_seller BOOLEAN DEFAULT 1',
        )

        add_column_if_missing(
            'blog_posts',
            'related_product_ids VARCHAR(255) NULL',
            sqlite_def='related_product_ids VARCHAR(255)',
        )

        add_column_if_missing(
            'orders',
            'delivery_fee FLOAT DEFAULT 0',
            sqlite_def='delivery_fee FLOAT DEFAULT 0',
        )

        # New tables (auth_otps, return_requests, etc.)
        db.create_all()
        print('  · tables ensured via create_all')

        if db.engine.dialect.name == 'sqlite':
            migrate_users_password_nullable_sqlite()
        else:
            try:
                db.session.execute(text(
                    'ALTER TABLE users MODIFY password_hash VARCHAR(255) NULL'
                ))
                db.session.commit()
                print('  ✓ users.password_hash nullable (MySQL)')
            except Exception as e:
                db.session.rollback()
                print(f'  · password_hash nullability skipped: {e}')

        print('Migration complete.')
        return 0


if __name__ == '__main__':
    sys.exit(run())
