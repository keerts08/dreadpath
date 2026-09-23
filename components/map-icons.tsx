import { RoomId } from "@/game/types";
import { ReactElement } from "react";

function Foyer() {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <line x1="7" y1="6" x2="17" y2="6" />
      <line x1="12" y1="3" x2="12" y2="6" />
      <line x1="8" y1="6" x2="8" y2="11" />
      <path
        d="M7.4 11.6 h1.2 l-0.2 0.8 h-0.8 Z"
        fill="currentColor"
        stroke="none"
        opacity="0.85"
      />
      <line x1="12" y1="6" x2="12" y2="13" />
      <path
        d="M11.4 13.6 h1.2 l-0.2 0.8 h-0.8 Z"
        fill="currentColor"
        stroke="none"
        opacity="0.85"
      />
      <line x1="16" y1="6" x2="16" y2="11" />
      <path
        d="M15.4 11.6 h1.2 l-0.2 0.8 h-0.8 Z"
        fill="currentColor"
        stroke="none"
        opacity="0.85"
      />
    </g>
  );
}

function Study() {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    >
      <path d="M12 6.5 C10 5.3 6 5.3 4 6.3 V18 C6 17 10 17 12 18 C14 17 18 17 20 18 V6.3 C18 5.3 14 5.3 12 6.5 Z" />
      <line x1="12" y1="6.5" x2="12" y2="18" />
      <g opacity="0.5" strokeWidth="0.7">
        <line x1="6" y1="8.5" x2="10.5" y2="9" />
        <line x1="6" y1="11" x2="10.5" y2="11.5" />
        <line x1="13.5" y1="9" x2="18" y2="8.5" />
        <line x1="13.5" y1="11.5" x2="18" y2="11" />
      </g>
    </g>
  );
}

function Library() {
  return (
    <g fill="currentColor" stroke="none">
      <rect x="4" y="19" width="16" height="1.2" />
      <rect x="5" y="9" width="2.3" height="10" />
      <rect x="8" y="6" width="2.3" height="13" />
      <rect x="11" y="11" width="2.3" height="8" />
      <rect x="14" y="7" width="2.3" height="12" />
      <rect x="17" y="10" width="2.3" height="9" />
      <rect x="4" y="4.6" width="16" height="1" opacity="0.5" />
    </g>
  );
}

function DiningHall() {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    >
      <circle cx="12" cy="7.5" r="2.1" />
      <line x1="10" y1="9.2" x2="9" y2="12.5" />
      <line x1="14" y1="9.2" x2="15" y2="12.5" />
      <rect
        x="3.5"
        y="13"
        width="17"
        height="2.3"
        rx="1"
        fill="currentColor"
        stroke="none"
      />
      <line x1="6.5" y1="15.3" x2="6.5" y2="19" />
      <line x1="17.5" y1="15.3" x2="17.5" y2="19" />
      <g opacity="0.55" strokeWidth="0.7">
        <line x1="5.3" y1="15.3" x2="5.3" y2="18" />
        <line x1="18.7" y1="15.3" x2="18.7" y2="18" />
      </g>
    </g>
  );
}

function Kitchen() {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    >
      <path d="M4 20 L13 11 L19 5 C20 6 20 7 19 8 L13 14 Z" />
      <circle
        cx="5.4"
        cy="18.6"
        r="0.5"
        fill="currentColor"
        stroke="none"
        opacity="0.6"
      />
    </g>
  );
}

function Hallway() {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    >
      <path d="M4 20 L9 4 M20 20 L15 4 M9 4 H15" />
      <rect x="10.4" y="10" width="3.2" height="6.5" />
      <line x1="2" y1="20" x2="22" y2="20" strokeWidth="0.8" opacity="0.5" />
    </g>
  );
}

function Bathroom() {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    >
      <path d="M4 13.5 a8 5 0 0 0 16 0" />
      <path d="M4 13.5 V11.5 a2 2 0 0 1 2 -2" />
      <line x1="20" y1="13.5" x2="20" y2="11.5" />
      <line x1="2.5" y1="18" x2="21.5" y2="18" />
      <path d="M11.5 9.2 q0.5 -1 0 -2" strokeWidth="0.8" opacity="0.5" />
    </g>
  );
}

function Bedroom() {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M3 19 V10 H21 V19" />
      <path d="M3 14.5 H21" />
      <rect
        x="5"
        y="11.5"
        width="4.5"
        height="2.6"
        rx="0.8"
        fill="currentColor"
        stroke="none"
        opacity="0.9"
      />
      <g opacity="0.45" strokeWidth="0.7">
        <line x1="4" y1="10" x2="4" y2="19" />
        <line x1="20" y1="10" x2="20" y2="19" />
      </g>
    </g>
  );
}

function Cellar() {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 8 H9 V12 H14 V16 H19 V20" />
      <g opacity="0.4" strokeWidth="0.7">
        <line x1="4" y1="8.6" x2="9" y2="8.6" />
        <line x1="9" y1="12.6" x2="14" y2="12.6" />
        <line x1="14" y1="16.6" x2="19" y2="16.6" />
      </g>
    </g>
  );
}

function Attic() {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    >
      <path d="M4 14.5 L12 5 L20 14.5" />
      <path d="M6.3 13 V19 H17.7 V13" />
      <path d="M8 11 L12 7 L16 11" strokeWidth="0.7" opacity="0.5" />
      <rect
        x="10.5"
        y="15"
        width="3"
        height="2"
        opacity="0.5"
        strokeWidth="0.8"
      />
    </g>
  );
}

function Crawlspace() {
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    >
      <path d="M8 10 C8 7 16 7 16 10 C18 12.5 17 18 12 19 C7 18 6 12.5 8 10 Z" />
      <path d="M9 9.3 L15 9.3" />
      <path d="M9.5 12.5 q2.5 1.5 5 0" strokeWidth="0.7" opacity="0.45" />
    </g>
  );
}

export const ROOM_ICONS: Partial<Record<RoomId, () => ReactElement>> = {
  foyer: Foyer,
  study: Study,
  library: Library,
  diningHall: DiningHall,
  kitchen: Kitchen,
  hallway: Hallway,
  bathroom: Bathroom,
  bedroom: Bedroom,
  cellar: Cellar,
  attic: Attic,
  crawlspace: Crawlspace,
};