type CarouselButtonProps = {
  direction: "previous" | "next";
  label: string;
  className?: string;
};

export function CarouselButton({ direction, label, className = "" }: CarouselButtonProps) {
  const isNext = direction === "next";

  return (
    <button className={`carousel-button${className ? ` ${className}` : ""}`} aria-label={label} type="button">
      <svg
        className="carousel-button-svg"
        width="52"
        height="52"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="0.5" y="0.5" width="51" height="51" rx="25.5" fill="#141414" />
        <rect x="0.5" y="0.5" width="51" height="51" rx="25.5" stroke="#262626" />
        {isNext ? (
          <path
            d="M18.5 26L33.5 26M26.75 19.25L33.5 26L26.75 32.75"
            stroke="#999999"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M33.5 26L18.5 26M25.25 19.25L18.5 26L25.25 32.75"
            stroke="#999999"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
