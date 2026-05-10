interface FloralMarkProps {
  size?: number;
  className?: string;
}

export function FloralMark({ size = 32, className }: FloralMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M32 54 L32 32" />
        <path d="M32 44 Q26 41 23 36" />
        <path d="M32 44 Q38 41 41 36" />
        <path d="M32 36 Q27 33 25 28" />
        <path d="M32 36 Q37 33 39 28" />
      </g>
      <g fill="currentColor">
        <circle cx="32" cy="22" r="3.5" />
        <circle cx="25" cy="22" r="2" />
        <circle cx="39" cy="22" r="2" />
        <circle cx="29" cy="16" r="1.5" />
        <circle cx="35" cy="16" r="1.5" />
      </g>
    </svg>
  );
}
