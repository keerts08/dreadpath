import { Ending } from "@/game/types";

const CONTENT: Record<
  Exclude<Ending, null>,
  { title: string; body: string[]; tone: string }
> = {
  escaped: {
    title: "YOU LEFT",
    tone: "text-bone",
    body: [
      "The door gives, and cold outside air hits you like a slap. You don't look back — you've learned better than that.",
      "By morning you will have convinced yourself most of it was shock, and rain, and an unfamiliar house playing tricks. Most of it.",
      "Blackwell Manor stands exactly as it always has, its door bolted three times over, waiting for the next set of headlights in the rain.",
    ],
  },
  banished: {
    title: "IT KNOWS YOUR NAME NOW TOO",
    tone: "text-amber",
    body: [
      "Something in the house lets go of you, all at once, like a held breath finally released.",
      "You walk out the front door under your own power, into ordinary daylight, and you understand — dimly, uselessly — that you have traded something for this. You don't yet know what.",
      "The house is quiet behind you. For the first time since you woke here, you believe that it actually is.",
    ],
  },
  caught: {
    title: "IT HAS YOU",
    tone: "text-blood-bright",
    body: [
      "There is no more house. There is no more hallway, no more staircase, no more door.",
      "There is only the dark, and the thing that was always closer than you let yourself believe.",
    ],
  },
  madness: {
    title: "YOU ARE STILL IN THE HOUSE",
    tone: "text-sick",
    body: [
      "You stop being able to tell which of the sounds are real. Then you stop being able to tell which of the rooms are.",
      "Somewhere, distantly, a part of you keeps walking the halls, counting doors, always arriving at nine, never at the way out.",
    ],
  },
};

export default function EndingScreen({
  ending,
  onRestart,
}: {
  ending: Ending;
  onRestart: () => void;
}) {
  if (!ending) return null;
  const c = CONTENT[ending];

  return (
    <div className="fixed inset-0">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1
          className={`font-display text-3xl sm:text-4xl tracking-widest ${c.tone}`}
        >
          {c.title}
        </h1>
        <div className="space-y-4 text-ink-dim leading-relaxed">
          {c.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <button
          onClick={onRestart}
          className="mt-4 border border-line px-6 py-3 text-sm tracking-widest hover:border-amber hover:text-amber transition-colors"
        >
          RETURN TO THE GATE
        </button>
      </div>
    </div>
  );
}
