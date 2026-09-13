interface AtlLogoProps {
  className?: string;
}

const AtlLogo = ({ className = "h-8 w-auto" }: AtlLogoProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 40"
    role="img"
    aria-labelledby="atl-title"
    className={className}
    width="160"
    height="32"
  >
    <title id="atl-title">Developed by ATL</title>
    <rect x="0" y="0" width="200" height="40" fill="transparent" />
    <text
      x="0"
      y="25"
      fill="#9ca3af"
      fontFamily="Arial, Helvetica, sans-serif"
      fontSize="11"
      fontWeight="500"
      letterSpacing="0.5"
    >
      developed by
    </text>
    <g transform="translate(76, 4)">
      <rect
        x="0"
        y="0"
        width="86"
        height="32"
        rx="8"
        fill="#ffffff"
        stroke="#0B63CE"
        strokeWidth="2"
      />
      <g fill="#0B63CE">
        <rect x="6" y="16" width="3.5" height="5.5" rx="1.5" />
        <rect x="11.5" y="11" width="3.5" height="10.5" rx="1.5" fill="#084A9E" />
        <rect x="17" y="13.5" width="3.5" height="8" rx="1.5" />
        <rect x="22.5" y="7" width="3.5" height="14.5" rx="1.5" fill="#084A9E" />
      </g>
      <path
        d="M5 25h20"
        fill="none"
        stroke="#084A9E"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      <text
        x="51"
        y="23"
        fill="#0B63CE"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="16"
        fontWeight="900"
        letterSpacing="1.5"
        textAnchor="middle"
      >
        ATL
      </text>
    </g>
  </svg>
);

export default AtlLogo;
