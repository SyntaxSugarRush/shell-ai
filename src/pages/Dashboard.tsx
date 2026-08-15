import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@/components/ui";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import {
  Boxes,
  CheckCircle2,
  Clock,
  Download,
  FileCode2,
  GitBranch,
  LayoutGrid,
  Loader2,
  LogOut,
  Search,
  Sparkles,
  Star,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAction, useMutation, useQuery } from "convex/react";
import logo from "@/assets/logo.svg";

type Spec = Doc<"specs">;
type View = "discover" | "contribute" | "library";

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function initials(name?: string, email?: string) {
  const src = name?.trim() || email?.split("@")[0] || "?";
  return src.slice(0, 2).toUpperCase();
}

// ---------------------------------------------------------------------------
// Star button
// ---------------------------------------------------------------------------
function StarButton({ spec }: { spec: Spec }) {
  const [pending, setPending] = useState(false);
  const toggleStar = useMutation(api.specs.toggleStar);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1.5"
      disabled={pending}
      onClick={(e) => {
        e.stopPropagation();
        setPending(true);
        void toggleStar({ specId: spec._id })
          .catch(() => toast.error("Could not update star."))
          .finally(() => setPending(false));
      }}
    >
      <Star
        className={`size-4 ${
          spec.stars > 0 ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
        }`}
      />
      {formatCount(spec.stars)}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Spec card
// ---------------------------------------------------------------------------
function SpecCard({ spec, onOpen }: { spec: Spec; onOpen: (s: Spec) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(spec)}
      className="group flex w-full flex-col rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-emerald-400/40 hover:bg-card/80"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{spec.icon}</span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-sm font-semibold">{spec.name}</span>
              {spec.verified && (
                <CheckCircle2 className="size-3.5 text-emerald-400" />
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">{spec.category}</span>
          </div>
        </div>
        <StarButton spec={spec} />
      </div>

      <p className="mt-3 line-clamp-2 flex-1 text-xs leading-5 text-muted-foreground">
        {spec.description}
      </p>

      <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <GitBranch className="size-3" />
          {spec.subcommands.length} subcommands
        </span>
        <span className="inline-flex items-center gap-1">
          <Download className="size-3" />
          {formatCount(spec.downloads)}
        </span>
        <span className="ml-auto font-mono text-emerald-400/80">v{spec.version}</span>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Spec detail dialog
// ---------------------------------------------------------------------------
function SpecDialog({
  spec,
  onClose,
}: {
  spec: Spec | null;
  onClose: () => void;
}) {
  if (!spec) return null;
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{spec.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <DialogTitle className="font-mono">{spec.name}</DialogTitle>
                {spec.verified && (
                  <Badge className="gap-1 bg-emerald-400/10 text-emerald-300">
                    <CheckCircle2 className="size-3" /> verified
                  </Badge>
                )}
              </div>
              <DialogDescription className="mt-1">{spec.description}</DialogDescription>
            </div>
            <StarButton spec={spec} />
          </div>
        </DialogHeader>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-md bg-muted px-2 py-1">{spec.category}</span>
          <span className="rounded-md bg-muted px-2 py-1">by {spec.author}</span>
          <span className="rounded-md bg-muted px-2 py-1 font-mono">v{spec.version}</span>
          <span className="rounded-md bg-muted px-2 py-1">
            {formatCount(spec.downloads)} downloads
          </span>
        </div>

        <Tabs defaultValue="subcommands" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="subcommands" className="flex-1">
              Subcommands ({spec.subcommands.length})
            </TabsTrigger>
            <TabsTrigger value="options" className="flex-1">
              Options ({spec.options.length})
            </TabsTrigger>
            <TabsTrigger value="args" className="flex-1">
              Arguments ({spec.args.length})
            </TabsTrigger>
            <TabsTrigger value="source" className="flex-1">
              Source
            </TabsTrigger>
          </TabsList>

          <div className="mt-3 max-h-[46vh] overflow-y-auto pr-1">
            <TabsContent value="subcommands" className="mt-0 space-y-1">
              {spec.subcommands.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No subcommands — this command uses flags and arguments.
                </p>
              )}
              {spec.subcommands.map((s) => (
                <div
                  key={s.name}
                  className="flex items-baseline gap-3 rounded-lg px-3 py-2 hover:bg-muted/50"
                >
                  <span className="shrink-0 font-mono text-sm font-medium text-emerald-300">
                    {s.name}
                  </span>
                  <span className="text-sm text-muted-foreground">{s.description}</span>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="options" className="mt-0 space-y-1">
              {spec.options.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No options defined.
                </p>
              )}
              {spec.options.map((o) => (
                <div
                  key={o.name}
                  className="flex items-baseline gap-3 rounded-lg px-3 py-2 hover:bg-muted/50"
                >
                  <span className="shrink-0 font-mono text-sm font-medium text-amber-300">
                    {o.name}
                  </span>
                  <span className="text-sm text-muted-foreground">{o.description}</span>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="args" className="mt-0 space-y-1">
              {spec.args.length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No positional arguments defined.
                </p>
              )}
              {spec.args.map((a) => (
                <div
                  key={a.name}
                  className="flex items-baseline gap-3 rounded-lg px-3 py-2 hover:bg-muted/50"
                >
                  <span className="shrink-0 font-mono text-sm font-medium text-sky-300">
                    {a.name}
                  </span>
                  <span className="text-sm text-muted-foreground">{a.description}</span>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="source" className="mt-0">
              <pre className="overflow-x-auto rounded-lg border border-border bg-[#0c1310] p-4 font-mono text-xs leading-6 text-foreground/90">
                {spec.sourceCode}
              </pre>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Discover view
// ---------------------------------------------------------------------------
function DiscoverView({
  specs,
  loading,
  onOpen,
}: {
  specs: Spec[] | undefined;
  loading: boolean;
  onOpen: (s: Spec) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    (specs ?? []).forEach((s) => set.add(s.category));
    return ["All", ...Array.from(set).sort()];
  }, [specs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (specs ?? []).filter((s) => {
      const matchesCategory = category === "All" || s.category === category;
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [specs, query, category]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search specs — try git, docker, kubectl…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              category === c
                ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {!specs || loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">No specs match your search.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <SpecCard key={s._id} spec={s} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contribute view
// ---------------------------------------------------------------------------
function ContributeView({ onSubmitted }: { onSubmitted: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Developer tools");
  const [language, setLanguage] = useState<"typescript" | "rust">("typescript");
  const [sourceCode, setSourceCode] = useState("");
  const [helpText, setHelpText] = useState("");

  const submit = useMutation(api.specs.submitSpec);
  const generateSpec = useAction(api.generateSpec.generateSpec);

  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const handleGenerate = async () => {
    if (!helpText.trim()) {
      setAiError("Paste a command's --help output first.");
      return;
    }
    setAiLoading(true);
    setAiError("");
    try {
      const res = await generateSpec({
        command: name.trim() || "command",
        helpText,
        language,
      });
      if (res.ok) {
        setSourceCode(res.content);
        toast.success("Spec drafted — review and submit it.");
      } else {
        setAiError(res.error || "Generation failed. Check your AI key and try again.");
      }
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sourceCode.trim()) {
      toast.error("A command name and spec source are required.");
      return;
    }
    setSubmitting(true);
    try {
      await submit({
        name: name.trim(),
        description: description.trim() || `${name.trim()} completion spec`,
        category: category.trim() || "Developer tools",
        language,
        sourceCode,
      });
      toast.success("Spec submitted for review.");
      setName("");
      setDescription("");
      setSourceCode("");
      setHelpText("");
      onSubmitted();
    } catch {
      toast.error("Could not submit the spec. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold">Spec metadata</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Command name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. rsync"
                className="font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Developer tools"
              />
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A one-line summary shown in the popup."
              rows={2}
            />
          </div>
          <div className="mt-4 max-w-xs space-y-1.5">
            <Label>Language</Label>
            <Select
              value={language}
              onValueChange={(v) => setLanguage(v as "typescript" | "rust")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="rust">Rust</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Spec source</h3>
            <FileCode2 className="size-4 text-muted-foreground" />
          </div>
          <Textarea
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            placeholder={"import { completionSpec } from \"@tilde/specs\";\n\nexport const completionSpec = { … }"}
            rows={16}
            className="mt-4 font-mono text-xs leading-6"
          />
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-emerald-300" />
            <h3 className="text-sm font-semibold">Draft with AI</h3>
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Paste a command's <span className="font-mono">--help</span> output and
            the local model drafts a ready-to-review spec in {language === "typescript" ? "TypeScript" : "Rust"}.
          </p>
          <Textarea
            value={helpText}
            onChange={(e) => setHelpText(e.target.value)}
            placeholder={"$ git --help\n\nusage: git [--version] [--help] …"}
            rows={8}
            className="mt-3 font-mono text-xs leading-5"
          />
          {aiError && <p className="mt-2 text-xs text-red-400">{aiError}</p>}
          <Button
            type="button"
            variant="secondary"
            className="mt-3 w-full gap-1.5"
            disabled={aiLoading}
            onClick={handleGenerate}
          >
            {aiLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {aiLoading ? "Drafting…" : "Generate spec"}
          </Button>
        </div>

        <Button type="submit" size="lg" className="w-full gap-1.5" disabled={submitting}>
          {submitting && <Loader2 className="size-4 animate-spin" />}
          Submit for review
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Library view
// ---------------------------------------------------------------------------
function LibraryView({ onOpen }: { onOpen: (s: Spec) => void }) {
  const starred = useQuery(api.specs.listStarred);
  const submissions = useQuery(api.specs.mySubmissions);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Star className="size-5 text-amber-400" /> Starred specs
        </h2>
        {!starred ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        ) : starred.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            You haven't starred any specs yet. Find a favorite in{" "}
            <span className="text-emerald-300">Discover</span>.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {starred.map((s) => (
              <SpecCard key={s._id} spec={s} onOpen={onOpen} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Boxes className="size-5 text-emerald-300" /> Your submissions
        </h2>
        {!submissions ? (
          <div className="mt-4 space-y-2">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        ) : submissions.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            No submissions yet. Contribute your first spec and it'll show up here.
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {submissions.map((s) => (
              <div
                key={s._id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3"
              >
                <FileCode2 className="size-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold">{s.name}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {s.language}
                    </Badge>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{s.description}</p>
                </div>
                <span className="hidden text-xs text-muted-foreground sm:block">
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
                {s.status === "pending" && (
                  <Badge className="gap-1 bg-amber-400/10 text-amber-300">
                    <Clock className="size-3" /> pending
                  </Badge>
                )}
                {s.status === "approved" && (
                  <Badge className="gap-1 bg-emerald-400/10 text-emerald-300">
                    <CheckCircle2 className="size-3" /> approved
                  </Badge>
                )}
                {s.status === "rejected" && (
                  <Badge className="gap-1 bg-red-400/10 text-red-300">
                    <XCircle className="size-3" /> rejected
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard shell
// ---------------------------------------------------------------------------
const NAV: { id: View; label: string; icon: typeof LayoutGrid }[] = [
  { id: "discover", label: "Discover", icon: LayoutGrid },
  { id: "contribute", label: "Contribute", icon: Sparkles },
  { id: "library", label: "My Library", icon: Star },
];

const VIEW_TITLES: Record<View, { title: string; subtitle: string }> = {
  discover: {
    title: "Discover specs",
    subtitle: "Browse the completion registry for every command your terminal knows.",
  },
  contribute: {
    title: "Contribute a spec",
    subtitle: "Author a completion definition in TypeScript or Rust — or let AI draft it.",
  },
  library: {
    title: "My Library",
    subtitle: "Your starred specs and submissions, in one place.",
  },
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<View>("discover");
  const [selected, setSelected] = useState<Spec | null>(null);

  const specs = useQuery(api.specs.list);
  const seed = useMutation(api.specs.seed);
  const seeded = useRef(false);
  const [seeding, setSeeding] = useState(true);

  useEffect(() => {
    if (seeded.current || !user) return;
    seeded.current = true;
    void seed()
      .catch(() => {
        /* catalog may already be seeded */
      })
      .finally(() => setSeeding(false));
  }, [seed, user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const meta = VIEW_TITLES[view];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border md:flex">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <img src={logo} alt="Tilde logo" className="size-8 rounded-lg" />
          <div>
            <div className="font-semibold tracking-tight">Tilde</div>
            <div className="text-[11px] text-muted-foreground">Spec registry</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                view === item.id
                  ? "bg-emerald-400/10 text-emerald-300"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="size-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-semibold text-emerald-300">
              {initials(user?.name, user?.email)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">
                {user?.name || user?.email || "Guest"}
              </div>
              {user?.email && (
                <div className="truncate text-[11px] text-muted-foreground">{user.email}</div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={handleSignOut}
              title="Sign out"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:hidden">
          <img src={logo} alt="Tilde logo" className="size-7 rounded-lg" />
          <span className="font-semibold">Tilde</span>
          <div className="ml-auto flex items-center gap-1">
            {NAV.map((item) => (
              <Button
                key={item.id}
                variant={view === item.id ? "secondary" : "ghost"}
                size="sm"
                className="gap-1.5"
                onClick={() => setView(item.id)}
              >
                <item.icon className="size-4" />
                {item.label}
              </Button>
            ))}
            <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
          <header className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">{meta.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{meta.subtitle}</p>
          </header>

          {view === "discover" && (
            <DiscoverView specs={specs} loading={seeding} onOpen={setSelected} />
          )}
          {view === "contribute" && <ContributeView onSubmitted={() => setView("library")} />}
          {view === "library" && <LibraryView onOpen={setSelected} />}
        </main>
      </div>

      <SpecDialog spec={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
