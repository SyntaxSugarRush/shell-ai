import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SUGGESTIONS = [
  { name: "commit", desc: "Record changes to the repository", kind: "subcommand" },
  { name: "push", desc: "Update remote refs along with objects", kind: "subcommand" },
  { name: "pull", desc: "Fetch from and integrate with another repo", kind: "subcommand" },
  { name: "branch", desc: "List, create, or delete branches", kind: "subcommand" },
  { name: "--amend", desc: "Replace the tip of the current branch", kind: "option" },
];

const CMD = "git";

function useTypedText(text: string, speed = 90) {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setTyped("");
    setDone(false);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);

  return { typed, done };
}

export function TerminalDemo() {
  const { typed, done } = useTypedText(CMD);

  return (
    <div className="relative">
      {/* glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-3xl bg-emerald-500/10 blur-3xl"
      />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-[#0c1310] shadow-2xl shadow-black/50">
        {/* title bar */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-muted-foreground">
            tilde — zsh
          </span>
          <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70 sm:block">
            local model · 8ms
          </span>
        </div>

        {/* body */}
        <div className="p-5 font-mono text-[13px] leading-6 sm:p-6 sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">❯</span>
            <span className="text-foreground">
              {typed}
              {!done && (
                <span className="ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 animate-pulse bg-emerald-400" />
              )}
              {done && <span className="text-muted-foreground/40"> </span>}
            </span>
          </div>

          {done && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="mt-4 overflow-hidden rounded-lg border border-border bg-card"
            >
              {SUGGESTIONS.map((s, i) => (
                <div
                  key={s.name}
                  className={`flex items-center gap-3 border-b border-border/50 px-3 py-2 last:border-b-0 ${
                    i === 0 ? "bg-emerald-500/10" : ""
                  }`}
                >
                  <span
                    className={`shrink-0 font-semibold ${
                      i === 0 ? "text-emerald-300" : "text-foreground/90"
                    }`}
                  >
                    {s.name}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-muted-foreground">
                    {s.desc}
                  </span>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      s.kind === "subcommand"
                        ? "bg-sky-400/10 text-sky-300"
                        : "bg-amber-400/10 text-amber-300"
                    }`}
                  >
                    {s.kind}
                  </span>
                  {i === 0 && (
                    <span className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      Tab
                    </span>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {done && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground/80"
            >
              <span>↑↓ navigate</span>
              <span>↵ accept</span>
              <span>Tab complete</span>                <span className="ml-auto hidden text-emerald-400/80 sm:block">
                214 plugins loaded
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
