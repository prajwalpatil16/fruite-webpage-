import os
from pathlib import Path
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()

_BACKEND_DIR = Path(__file__).resolve().parent


def _build_database_uri():
    """
    Traditional shop-style MySQL settings (MYSQL_HOST / USER / PASSWORD / DB).
    Optional: DB_ENGINE=sqlite for local fallback without MySQL.
    """
    engine = (os.environ.get('DB_ENGINE') or 'mysql').strip().lower()
    if engine == 'sqlite':
        db_path = _BACKEND_DIR / 'fruitbasket.db'
        return f'sqlite:///{db_path}'

    host = os.environ.get('MYSQL_HOST', 'localhost').strip()
    user = os.environ.get('MYSQL_USER', 'root').strip()
    password = os.environ.get('MYSQL_PASSWORD') or ''
    db_name = os.environ.get('MYSQL_DB', 'fruitbasket_db').strip()
    port = os.environ.get('MYSQL_PORT', '3306').strip()

    if not user or not db_name:
        raise RuntimeError('MYSQL_USER and MYSQL_DB are required in .env')

    safe_password = quote_plus(password) if password else ''
    auth = f'{user}:{safe_password}' if password else user
    return f'mysql+mysqlconnector://{auth}@{host}:{port}/{db_name}'


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    if not SECRET_KEY:
        raise RuntimeError('SECRET_KEY environment variable is required')

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    if not JWT_SECRET_KEY:
        raise RuntimeError('JWT_SECRET_KEY environment variable is required')

    SQLALCHEMY_DATABASE_URI = _build_database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 1 day

    GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', '').strip()
