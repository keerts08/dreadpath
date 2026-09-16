export const AMBIENT_NOTICED = [
  "Somewhere, a floorboard creaks that you're sure you didn't step on.",
  "You hear a door you didn't touch settle back into its frame.",
];

export const AMBIENT_CLOSE = [
  "Something drags itself, unhurried, across a floor above you.",
  "The temperature drops enough that you can see your breath.",
];

export const AMBIENT_VERY_CLOSE = [
  "Your pulse is the loudest thing in the house, and it isn't quiet.",
  "Something is breathing on the other side of the nearest wall.",
];

export const CLOSE_CALL_LINES = [
  "It passes so near you feel the air move. Then, nothing. It's gone - for now.",
];

export const HALLUCINATION_ROOM_LINES: Record<string, string[]> = {
  foyer: [
    "For a heartbeat there are two staircases. You blink, and there is only one.",
  ],
  study: [
    "The portrait's eyes are closed now. You are certain they weren't, a moment ago.",
  ],
};

export const SANITY_LOW_SYSTEM_LINES = [
  "You're no longer sure how long you've been in this house.",
];

export function pick<K>(arr: K[]): K {
  return arr[Math.floor(Math.random() * arr.length)];
}
