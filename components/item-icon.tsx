import { ItemId } from "@/game/types";

export default function ItemIcon({
  id,
  className,
}: {
  id: ItemId;
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };

  switch (id) {
    case "letterOpener":
      return (
        <svg {...common}>
          <path
            d="M4 20 L15 9 M15 9 L20 4 L18 6 M15 9 L18 12"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case "rustyKey":
    case "atticKey":
      return (
        <svg {...common}>
          <circle
            cx="7"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
          />
          <path
            d="M10 10 L19 19 M15 15 L17 13 M17.5 17.5 L19.5 15.5"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case "journalPage1":
    case "journalPage2":
      return (
        <svg {...common}>
          <path
            d="M6 3 H16 L19 7 V21 H6 Z M15 3 V8 H19"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
            strokeLinejoin="round"
          />
          <path
            d="M9 12 H15 M9 15 H15 M9 18 H13"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      );
    case "matches":
      return (
        <svg {...common}>
          <rect
            x="5"
            y="4"
            width="14"
            height="16"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
          />
          <path
            d="M9 20 L11 9"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="11.3" cy="8" r="1.6" fill="currentColor" />
        </svg>
      );
    case "kitchenKnife":
      return (
        <svg {...common}>
          <path
            d="M4 20 L13 11 L19 5 C20 6 20 7 19 8 L13 14 Z"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "copperFuse":
      return (
        <svg {...common}>
          <rect
            x="6"
            y="9"
            width="12"
            height="6"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
          />
          <path
            d="M3 12 H6 M18 12 H21"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "sigilMoon":
      return (
        <svg {...common}>
          <circle
            cx="12"
            cy="12"
            r="8.5"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="none"
          />
          <path
            d="M14 6.5 A6.5 6.5 0 1 0 14 17.5 A5.2 5.2 0 0 1 14 6.5 Z"
            fill="currentColor"
            opacity="0.85"
          />
        </svg>
      );
    case "sigilSun":
      return (
        <svg {...common}>
          <circle
            cx="12"
            cy="12"
            r="8.5"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="none"
          />
          <circle cx="12" cy="12" r="3.4" fill="currentColor" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="12"
              y1="12"
              x2={12 + Math.cos((deg * Math.PI) / 180) * 7.5}
              y2={12 + Math.sin((deg * Math.PI) / 180) * 7.5}
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </svg>
      );
    case "sigilVine":
      return (
        <svg {...common}>
          <circle
            cx="12"
            cy="12"
            r="8.5"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="none"
          />
          <path
            d="M12 5 C 9 8 15 10 12 13 C 9 16 15 17 12 19"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="9" cy="9" r="0.9" fill="currentColor" />
          <circle cx="15" cy="15" r="0.9" fill="currentColor" />
        </svg>
      );
    case "fadedPhotograph":
      return (
        <svg {...common}>
          <rect
            x="4"
            y="3"
            width="16"
            height="18"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
          />
          <rect
            x="6"
            y="5"
            width="12"
            height="10"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M6 17.5 H18 M6 19.5 H14"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" fill="currentColor" />
        </svg>
      );
  }
}
