import { TerminalDemo } from "@/components/TerminalDemo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  Check,
  Command,
  Cpu,
  Github,
  Layers,
  Star,
  Terminal,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router";
import logo from "@/assets/logo.svg";

// ---------------------------------------------------------------------------
// Static showcase data (the dashboard reads the live Convex registry instead).
// ---------------------------------------------------------------------------
const SHELLS = ["fish", "zsh", "bash", "Ghostty", "Kitty", "VS Code", "WezTerm", "iTerm2", "Alacritty", "Hyper"];

const FEATURES = [
  {
    icon: Layers,
    title: "Subcommands, options & args",
    body: "Every command ships with its full grammar — subcommands, flags, and positional arguments, each with a description so you never guess what a flag does.",
  },
  {
    icon: Command,
    title: "Context-aware suggestions",
    body: "Tilde parses exactly where you are in the command and only offers what's valid next. No more irrelevant flags after you've already picked a subcommand.",
  },
  {
    icon: Zap,
    title: "Keystroke-fast",
    body: "Sub-10ms filtering keeps pace with your fingers. Suggestions are computed locally, so there's no network round-trip between you and the popup.",
  },
  {
    icon: Cpu,
    title: "Local-first AI",
    body: "A latency-optimized model runs on your machine to rank suggestions and fill in argument values. Your command history never leaves your device.",
  },
  {
    icon: Boxes,
    title: "TypeScript & Rust specs",
    body: "Specs are just code. Author them in TypeScript or Rust, review them in a pull request, and ship them to thousands of users the same day.",
  },
  {
    icon: Terminal,
    title: "Works everywhere",
    body: "First-class support for fish, zsh, and bash — inside Ghostty, Kitty, the VS Code integrated terminal, and every other emulator you use.",
  },
];

const STEPS = [
  { n: "01", title: "Install Tilde", body: "A one-line installer plugs into your shell config and detects your setup." },
  { n: "02", title: "Start typing", body: "Type git, docker, or npm and the popup appears as you go." },
  { n: "03", title: "Tab to complete", body: "Navigate with arrows, accept with Enter or Tab, and keep moving." },
];

const LIBRARY = [
  { icon: "🌿", name: "git", category: "Version control", stars: "18.4k", sub: 14, desc: "Distributed version control." },
  { icon: "🐳", name: "docker", category: "Containers", stars: "12.7k", sub: 13, desc: "Build, ship, and run containers." },
  { icon: "📦", name: "npm", category: "Package managers", stars: "9.4k", sub: 12, desc: "The Node.js package manager." },
  { icon: "☸️", name: "kubectl", category: "Orchestration", stars: "8.9k", sub: 11, desc: "Control Kubernetes clusters." },
  { icon: "🏗️", name: "terraform", category: "Infrastructure", stars: "7.3k", sub: 10, desc: "Infrastructure as code." },
  { icon: "🦀", name: "cargo", category: "Rust", stars: "6.1k", sub: 12, desc: "The Rust build tool." },
  { icon: "☁️", name: "aws", category: "Cloud", stars: "10.3k", sub: 9, desc: "The AWS CLI." },
  { icon: "🍺", name: "brew", category: "System", stars: "8.1k", sub: 10, desc: "The Homebrew package manager." },
  { icon: "🐈", name: "gh", category: "Developer tools", stars: "11.5k", sub: 9, desc: "GitHub on the command line." },
  { icon: "🔁", name: "curl", category: "Developer tools", stars: "6.9k", sub: 0, desc: "Transfer data from URLs." },
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.55, delay, ease: "easeOut" as const },
  };
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-medium tracking-wide text-emerald-300">
      {children}
    </span>
  );
}

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();
  const appHref = isAuthenticated && !isLoading ? "/dashboard" : "/auth";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.72_0.17_162/0.14),transparent_70%)]"
      />

      {/* ---------------- Nav ---------------- */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="Tilde logo" className="size-8 rounded-lg" />
            <span className="text-lg font-semibold tracking-tight">Tilde</span>
            <Badge variant="secondary" className="ml-1 hidden text-[10px] sm:inline-flex">
              beta
            </Badge>
          </Link>

          <div className="ml-2 hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#specs" className="transition-colors hover:text-foreground">Spec library</a>
            <a href="#ai" className="transition-colors hover:text-foreground">Local AI</a>
            <a href="#community" className="transition-colors hover:text-foreground">Contribute</a>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {!isAuthenticated && (
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/auth">Sign in</Link>
              </Button>
            )}
            <Button asChild className="gap-1.5">
              <Link to={appHref}>
                {isAuthenticated ? "Open dashboard" : "Get started"}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-24">
        <div>
          <motion.div {...fadeUp(0)}>
            <Eyebrow>
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Open source · Linux-first
            </Eyebrow>
          </motion.div>

          <motion.h1
            {...fadeUp(0.05)}
            className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
          >
            IDE-grade autocomplete
            <br />
            for your{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
              terminal
            </span>
            .
          </motion.h1>

          <motion.p
            {...fadeUp(0.1)}
            className="mt-5 max-w-xl text-lg leading-7 text-muted-foreground"
          >
            Tilde pops up a searchable list of subcommands, options, and
            arguments the moment you type — for git, docker, npm, and hundreds
            more. Works in fish, zsh, and bash, in every terminal you love.
          </motion.p>

          <motion.div {...fadeUp(0.15)} className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gap-1.5">
              <Link to={appHref}>
                Get started free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#specs">Explore the spec library</a>
            </Button>
          </motion.div>

          <motion.dl {...fadeUp(0.2)} className="mt-10 grid max-w-md grid-cols-3 gap-6">
            {[
              ["250+", "commands covered"],
              ["8ms", "median latency"],
              ["100%", "on-device"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="text-2xl font-semibold tracking-tight text-emerald-300">{v}</dt>
                <dd className="mt-1 text-xs text-muted-foreground">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <TerminalDemo />
        </motion.div>
      </section>

      {/* ---------------- Shells strip ---------------- */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-2 px-4 py-6 sm:px-6">
          <span className="mr-2 text-xs uppercase tracking-wider text-muted-foreground">
            Works in
          </span>
          {SHELLS.map((s) => (
            <span
              key={s}
              className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* ---------------- Features ---------------- */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <motion.div {...fadeUp()} className="mx-auto max-w-2xl text-center">
          <Eyebrow>Why Tilde</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything an editor gives you, in your shell
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tilde reimagines the Fig experience for Linux — fast, private, and
            infinitely extensible.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp(0.05 * i)}
              className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-emerald-400/30"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div key={s.n} {...fadeUp(0.05 * i)} className="relative">
                <span className="font-mono text-4xl font-bold text-emerald-400/20">{s.n}</span>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Spec library ---------------- */}
      <section id="specs" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <motion.div {...fadeUp()} className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <Eyebrow>Spec library</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              A growing library, ready out of the box
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every command ships with descriptions for its subcommands,
              options, and arguments — contributed by the community.
            </p>
          </div>
          <Button asChild variant="outline" className="gap-1.5">
            <Link to={appHref}>
              Browse all specs
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {LIBRARY.map((s, i) => (
            <motion.div
              key={s.name}
              {...fadeUp(0.03 * i)}
              className="flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-emerald-400/30"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{s.icon}</span>
                <span className="font-mono text-sm font-semibold">{s.name}</span>
              </div>
              <p className="mt-2 flex-1 text-xs leading-5 text-muted-foreground">{s.desc}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  {s.stars}
                </span>
                <span>{s.sub} subcommands</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- Local AI ---------------- */}
      <section id="ai" className="border-y border-border/60 bg-card/40">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2">
          <motion.div {...fadeUp()}>
            <Eyebrow>Local AI</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              An AI model that lives on your machine
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tilde bundles a latency-optimized model that runs entirely
              offline. It re-ranks suggestions to match how you work, fills in
              argument values from context, and adapts to your habits — with
              zero round-trip to a server.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Quantized, sub-8ms inference on consumer hardware",
                "Ranks and reorders suggestions contextually",
                "Your history and keystrokes never leave the device",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                  <span className="text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="rounded-2xl border border-border bg-[#0c1310] p-6 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Cpu className="size-4 text-emerald-400" />
                on-device inference
              </span>
              <span className="rounded bg-emerald-400/10 px-2 py-0.5 text-emerald-300">0 network</span>
            </div>
            <div className="mt-4 space-y-2 font-mono text-sm">
              {[
                ["docker", "compose", "1.00 · your top pick"],
                ["docker", "build", "0.94 · recent project"],
                ["docker", "run", "0.91 · contextual"],
                ["docker", "ps", "0.87"],
              ].map(([a, b, c]) => (
                <div key={b} className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-3 py-2">
                  <span className="text-foreground/90">
                    {a} <span className="text-emerald-300">{b}</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">{c}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- Community ---------------- */}
      <section id="community" className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2">
        <motion.div {...fadeUp()} className="order-2 lg:order-1">
          <div className="overflow-hidden rounded-2xl border border-border bg-[#0c1310] shadow-2xl shadow-black/40">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="size-2.5 rounded-full bg-border" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">specs/git.ts</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-6">
              <code>
                <span className="text-sky-300">import</span>{" "}
                <span className="text-foreground">{"{ completionSpec }"}</span>{" "}
                <span className="text-sky-300">from</span>{" "}
                <span className="text-amber-300">"@tilde/specs"</span>;
                {"\n\n"}
                <span className="text-sky-300">export const</span>{" "}
                <span className="text-foreground">completionSpec</span>{" "}
                <span className="text-muted-foreground">=</span> {"{"}
                {"\n"}
                <span className="text-muted-foreground">  name:</span>{" "}
                <span className="text-amber-300">"git"</span>,{"\n"}
                <span className="text-muted-foreground">  subcommands:</span> [{"\n"}
                {"    {"} <span className="text-muted-foreground">name:</span>{" "}
                <span className="text-amber-300">"commit"</span>,{"\n"}
                {"      "}<span className="text-muted-foreground">description:</span>{" "}
                <span className="text-amber-300">"Record changes"</span>,{"\n"}
                {"      "}<span className="text-muted-foreground">options:</span> [{"{"}
                <span className="text-muted-foreground"> name:</span>{" "}
                <span className="text-amber-300">"-m"</span> {"}"}],{"\n"}
                {"    }"},{",\n"}
                {"  ]"},{",\n"}
                {"}"};
                {"\n"}
              </code>
            </pre>
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.1)} className="order-1 lg:order-2">
          <Eyebrow>Extensible by design</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Write a spec. Open a PR. Done.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Completion definitions are plain code — authored in TypeScript or
            Rust — so the community can add support for hundreds of tools
            without waiting on the core team.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "A typed, declarative schema for subcommands and options",
              "Generators for dynamic values like branches and image names",
              "CI validation and a review queue for every contribution",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                <span className="text-muted-foreground">{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-3">
            <Button asChild className="gap-1.5">
              <Link to={appHref}>
                <Users className="size-4" />
                Contribute a spec
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-1.5">
              <a href="https://github.com/withfig/autocomplete" target="_blank" rel="noopener noreferrer">
                <Github className="size-4" />
                Inspired by Fig
              </a>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <motion.div
          {...fadeUp()}
          className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 via-card to-card p-10 text-center sm:p-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(50%_100%_at_50%_0%,oklch(0.72_0.17_162/0.25),transparent_70%)]"
          />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your terminal is waiting.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Stop memorizing flags. Install Tilde and let your shell keep up
            with you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="gap-1.5">
              <Link to={appHref}>
                Get started free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-1.5">
              <a href="https://github.com/withfig/autocomplete" target="_blank" rel="noopener noreferrer">
                <Github className="size-4" />
                View the reference
              </a>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Tilde logo" className="size-7 rounded-lg" />
            <span className="font-semibold">Tilde</span>
            <span className="text-sm text-muted-foreground">— terminal autocomplete for Linux</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#specs" className="transition-colors hover:text-foreground">Specs</a>
            <a
              href="https://github.com/withfig/autocomplete"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Github className="size-4" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
