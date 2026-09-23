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
          <path
            d="M13.5 10.5 L17 7"
            stroke="currentColor"
            strokeWidth="0.7"
            opacity="0.5"
            strokeLinecap="round"
          />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${5.2 + i * 1.4} ${18.8 - i * 1.4} l1 -1`}
              stroke="currentColor"
              strokeWidth="0.9"
              opacity="0.6"
              strokeLinecap="round"
            />
          ))}
          <circle cx="4" cy="20" r="1" fill="currentColor" opacity="0.7" />
        </svg>
      );
    case "rustyKey":
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
            d="M7 4.4 L7 5.4 M9.6 7 L8.6 7 M7 9.6 L7 8.6 M4.4 7 L5.4 7"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.6"
            strokeLinecap="round"
          />
          <path
            d="M10 10 L19 19 M15 15 L17 13 M17.5 17.5 L19.5 15.5"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />
          {[
            [11.5, 11.5],
            [14, 8.2],
            [16.8, 16.8],
          ].map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="0.5"
              fill="currentColor"
              opacity="0.5"
            />
          ))}
        </svg>
      );
    case "atticKey":
      return (
        <svg {...common}>
          <circle
            cx="6.5"
            cy="6.5"
            r="3"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M8.6 8.6 L18 18 M15.5 15.5 L17.2 13.8"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
    case "journalPage1":
      return (
        <svg {...common}>
          <path
            d="M6 3 H16 L19 7 V21 H6.6 L6.2 17 L6.8 13.4 L6.1 9.8 Z"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
            strokeLinejoin="round"
          />
          <path
            d="M15 3 V8 H19"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
          />
          <path
            d="M9 12 H15 M9 15 H15 M9 18 H13"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle
            cx="10.5"
            cy="9.5"
            r="0.9"
            fill="currentColor"
            opacity="0.35"
          />
        </svg>
      );
    case "journalPage2":
      return (
        <svg {...common}>
          <path
            d="M6 3 H16 L19 7 V21 H6.3 L5.9 16.5 L6.5 12.2 L6 3 Z"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
            strokeLinejoin="round"
          />
          <path
            d="M15 3 V8 H19"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
          />
          <path
            d="M9 12 H15 M9 15 H15 M9 18 H13"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle
            cx="13"
            cy="14"
            r="2.1"
            stroke="currentColor"
            strokeWidth="0.6"
            fill="none"
            opacity="0.4"
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
            d="M7 9 L17 9"
            stroke="currentColor"
            strokeWidth="0.9"
            opacity="0.45"
          />
          <path
            d="M9 20 L11 9"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="11.3" cy="8" r="1.6" fill="currentColor" />
          <path
            d="M13.5 19 L14.6 10.5 M16 18 L16.6 12"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.55"
          />
          <circle
            cx="14.7"
            cy="9.8"
            r="1.1"
            fill="currentColor"
            opacity="0.55"
          />
          <circle
            cx="16.7"
            cy="11.3"
            r="0.8"
            fill="currentColor"
            opacity="0.4"
          />
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
          <path
            d="M5.5 18.5 L13.5 10.5"
            stroke="currentColor"
            strokeWidth="0.6"
            opacity="0.5"
          />
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={4.6 + i * 1.15}
              cy={19.4 - i * 1.15}
              r="0.5"
              fill="currentColor"
              opacity="0.6"
            />
          ))}
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
          {[8, 10, 12, 14, 16].map((x) => (
            <path
              key={x}
              d={`M${x} 9 v6`}
              stroke="currentColor"
              strokeWidth="0.6"
              opacity="0.4"
            />
          ))}
          <path
            d="M3 12 H6 M18 12 H21"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="6.6" cy="12" r="0.6" fill="currentColor" opacity="0.6" />
          <circle cx="17.4" cy="12" r="0.6" fill="currentColor" opacity="0.6" />
        </svg>
      );
    case "sigilMoon":
      return (
        <svg {...common}>
          <circle
            cx="12"
            cy="12"
            r="9.3"
            stroke="currentColor"
            strokeWidth="0.6"
            fill="none"
            opacity="0.4"
          />
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
            r="9.3"
            stroke="currentColor"
            strokeWidth="0.6"
            fill="none"
            opacity="0.4"
          />
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
            r="9.3"
            stroke="currentColor"
            strokeWidth="0.6"
            fill="none"
            opacity="0.4"
          />
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
          <path
            d="M4.5 21 L6 4 M19.5 3.5 L18 20"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.4"
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
          {[7.3, 8.9, 10.5, 12.1, 13.7, 15.3].map((x, i) =>
            i === 4 ? (
              <path
                key={x}
                d={`M${x - 0.5} 13.6 l1 -1.4 M${x + 0.5} 13.6 l-1 -1.4`}
                stroke="currentColor"
                strokeWidth="0.55"
                opacity="0.5"
                strokeLinecap="round"
              />
            ) : (
              <circle
                key={x}
                cx={x}
                cy={13}
                r="0.55"
                fill="currentColor"
                opacity="0.65"
              />
            ),
          )}
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
