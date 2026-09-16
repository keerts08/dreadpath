import HomeLayout from "@/components/home-layout";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Home() {
  return (
    <HomeLayout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="relative z-10 max-w-sm w-full text-center space-y-8 py-16 bg-void/50 rounded-xl px-4">
          <div className="space-y-2">
            <h1 className="font-display text-4xl sm:text-5xl text-bone">
              RAVENSHADE <br /> MANOR
            </h1>
            <p className="text-xs tracking-widest text-ink-faint caret">
              SOMETHING ELSE LIVES HERE
            </p>

            <div className="space-y-3">
              <button className="w-full border border-line px-6 py-3 text-sm tracking-widest hover:border-amber hover:text-amber transition-colors">
                PLAY
              </button>
              <Dialog>
                <DialogTrigger
                  render={
                    <button className="w-full border border-line px-6 py-3 text-sm tracking-widest hover:border-ink-dim hover:text-ink transition-colors">
                      HOW TO PLAY
                    </button>
                  }
                />
                <DialogContent className="max-w-md border bg-panel p-5 space-y-3 text-sm text-ink-dim leading-relaxed text-left border-line">
                  <h2 className="font-display text-base text-bone tracking-widest">
                    HOW TO PLAY
                  </h2>
                  <p>
                    You wake up inside Ravenshade Manor with no memory of how you
                    got there. Explore the house, gather what you find, and get
                    out.
                  </p>
                  <p>
                    You are not alone. Every action — moving, searching, forcing
                    something open — makes noise, and noise draws it closer.
                    Careful, quiet play is safer than rushing.
                  </p>
                  <p>
                    If it gets close, look for somewhere to hide. Staying hidden
                    too long isn&rsquo;t free either — it will start to check.
                  </p>
                  <p>
                    There may be more than one way for your night in this house
                    to end.
                  </p>
                  <DialogClose
                    render={
                      <button className="mt-2 border border-line px-4 py-2 text-xs tracking-widest hover:border-amber hover:text-amber">
                        CLOSE
                      </button>
                    }
                  />
                </DialogContent>
              </Dialog>
            </div>

            <p className="text-[11px] text-ink-faint leading-relaxed">
              made by keerthii
            </p>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
