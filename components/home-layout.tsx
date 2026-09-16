import Image from "next/image";
import NoiseBackground from "./bg";
import { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#050505] bg-linear-to-b from-[#010101] via-[#061930] to-[#054E96]">
      <div className="pointer-events-none fixed left-0 top-0 z-50 h-screen w-full">
        <div className="crt pointer-events-none fixed left-0 top-0 z-50 h-screen w-full" />
        <div className="lines" />
        <NoiseBackground />
      </div>
      <div className="relative h-screen w-full overflow-auto">
        <div className="relative w-full h-screen overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/blurhouse.png"
              alt="Horror House"
              fill
              className="mask-[radial-gradient(circle,#000_10%,transparent_80%)] object-cover blur-sm"
            />
          </div>
          {children}
          <div className="absolute inset-0 z-5">
            <Image
              src="/forest-black.svg"
              alt="Forest"
              fill
              className="-bottom-2 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
