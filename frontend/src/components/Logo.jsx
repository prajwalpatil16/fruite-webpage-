import React from 'react';
import { Link } from 'react-router-dom';

/**
 * FruitBasket brand mark.
 * variant: "full" | "icon" | "white"
 * compact: icon-only on narrow screens when variant is full
 */
const Logo = ({
  className = '',
  variant = 'full',
  compact = false,
  to = '/',
  height = 40,
}) => {
  const src =
    variant === 'white'
      ? '/fruitbasket-logo-white.svg'
      : variant === 'icon'
        ? '/fruitbasket-icon.svg'
        : '/fruitbasket-logo.svg';

  const img = (
    <>
      {compact && variant === 'full' ? (
        <>
          <img
            src="/fruitbasket-icon.svg"
            alt="FruitBasket"
            className="h-9 w-9 sm:hidden"
            height={36}
            width={36}
          />
          <img
            src={src}
            alt="FruitBasket"
            className="hidden h-9 w-auto sm:block md:h-10"
            style={{ height }}
          />
        </>
      ) : (
        <img
          src={src}
          alt="FruitBasket"
          className={variant === 'icon' ? 'h-9 w-9' : 'h-9 w-auto md:h-10'}
          style={variant === 'icon' ? undefined : { height }}
        />
      )}
    </>
  );

  if (!to) {
    return <span className={`inline-flex items-center ${className}`}>{img}</span>;
  }

  return (
    <Link to={to} className={`inline-flex shrink-0 items-center ${className}`} aria-label="FruitBasket home">
      {img}
    </Link>
  );
};

export default Logo;
