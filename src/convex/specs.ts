import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

type SpecEntry = {
  name: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  stars: number;
  downloads: number;
  version: string;
  verified: boolean;
  author: string;
  tags: string[];
  subcommands: { name: string; description: string }[];
  options: { name: string; description: string }[];
  args: { name: string; description: string }[];
};

// ---------------------------------------------------------------------------
// Curated starter catalog. This is what the community registry grows from.
// ---------------------------------------------------------------------------
const CATALOG: SpecEntry[] = [
  {
    name: "git",
    slug: "git",
    description: "Distributed version control for every project.",
    category: "Version control",
    icon: "🌿",
    stars: 18420,
    downloads: 128000000,
    version: "2.46.0",
    verified: true,
    author: "Tilde core",
    tags: ["vcs", "branch", "merge"],
    subcommands: [
      { name: "commit", description: "Record changes to the repository" },
      { name: "push", description: "Update remote refs along with objects" },
      { name: "pull", description: "Fetch from and integrate with another repo" },
      { name: "branch", description: "List, create, or delete branches" },
      { name: "checkout", description: "Switch branches or restore files" },
      { name: "merge", description: "Join two or more development histories" },
      { name: "rebase", description: "Reapply commits on top of another base" },
      { name: "status", description: "Show the working tree status" },
      { name: "log", description: "Show commit logs" },
      { name: "diff", description: "Show changes between commits" },
      { name: "stash", description: "Stash changes in a dirty working tree" },
      { name: "remote", description: "Manage tracked repositories" },
      { name: "tag", description: "Create, list, or delete tags" },
      { name: "reset", description: "Reset current HEAD to a state" },
    ],
    options: [
      { name: "--version", description: "Print the git version" },
      { name: "-C <path>", description: "Run as if git was started in <path>" },
      { name: "--git-dir <path>", description: "Set the path to the repository" },
      { name: "-c <name=value>", description: "Pass a configuration value" },
      { name: "--no-pager", description: "Do not pipe output into a pager" },
    ],
    args: [{ name: "path", description: "A file or directory within a repo" }],
  },
  {
    name: "docker",
    slug: "docker",
    description: "Build, ship, and run containers anywhere.",
    category: "Containers",
    icon: "🐳",
    stars: 12730,
    downloads: 96000000,
    version: "27.1.0",
    verified: true,
    author: "Tilde core",
    tags: ["containers", "images", "compose"],
    subcommands: [
      { name: "run", description: "Run a command in a new container" },
      { name: "build", description: "Build an image from a Dockerfile" },
      { name: "ps", description: "List running containers" },
      { name: "images", description: "List local images" },
      { name: "pull", description: "Pull an image or a repository" },
      { name: "push", description: "Push an image to a registry" },
      { name: "compose", description: "Define and run multi-container apps" },
      { name: "exec", description: "Run a command in a running container" },
      { name: "logs", description: "Fetch the logs of a container" },
      { name: "network", description: "Manage container networks" },
      { name: "volume", description: "Manage named volumes" },
      { name: "rm", description: "Remove one or more containers" },
      { name: "tag", description: "Tag an image into a repository" },
    ],
    options: [
      { name: "--help", description: "Show help for a command" },
      { name: "--version", description: "Print version information" },
      { name: "--context <name>", description: "Set the client context" },
      { name: "-D, --debug", description: "Enable debug mode" },
      { name: "-H, --host <list>", description: "Daemon socket to connect to" },
    ],
    args: [
      { name: "container", description: "A container id or name" },
      { name: "image", description: "An image reference" },
    ],
  },
  {
    name: "npm",
    slug: "npm",
    description: "The default package manager for Node.js.",
    category: "Package managers",
    icon: "📦",
    stars: 9400,
    downloads: 150000000,
    version: "10.8.2",
    verified: true,
    author: "Tilde core",
    tags: ["node", "javascript", "registry"],
    subcommands: [
      { name: "install", description: "Install a package and its deps" },
      { name: "init", description: "Create a package.json file" },
      { name: "run", description: "Run a script from package.json" },
      { name: "test", description: "Run the test script" },
      { name: "publish", description: "Publish a package to the registry" },
      { name: "update", description: "Update installed packages" },
      { name: "uninstall", description: "Remove a package" },
      { name: "audit", description: "Scan for known vulnerabilities" },
      { name: "ci", description: "Clean install for CI environments" },
      { name: "exec", description: "Run a package binary without installing" },
      { name: "ls", description: "List installed packages" },
      { name: "outdated", description: "Check for outdated packages" },
    ],
    options: [
      { name: "--save", description: "Save to dependencies (default)" },
      { name: "--save-dev", description: "Save to devDependencies" },
      { name: "-g, --global", description: "Install globally" },
      { name: "--prefix <dir>", description: "Set install location" },
      { name: "-y, --yes", description: "Skip all interactive prompts" },
      { name: "-f, --force", description: "Force reinstall from registry" },
    ],
    args: [{ name: "package", description: "A package name or specifier" }],
  },
  {
    name: "yarn",
    slug: "yarn",
    description: "Fast, reliable, and secure dependency management.",
    category: "Package managers",
    icon: "🧶",
    stars: 6210,
    downloads: 62000000,
    version: "4.4.1",
    verified: true,
    author: "Community",
    tags: ["node", "javascript", "workspaces"],
    subcommands: [
      { name: "add", description: "Install a package and add it to deps" },
      { name: "install", description: "Install all project dependencies" },
      { name: "remove", description: "Remove a package" },
      { name: "upgrade", description: "Upgrade packages interactively" },
      { name: "run", description: "Run a script from package.json" },
      { name: "create", description: "Scaffold a project from a template" },
      { name: "dlx", description: "Run a package without installing it" },
      { name: "init", description: "Initialize a new project" },
      { name: "workspace", description: "Manage workspaces" },
    ],
    options: [
      { name: "-D, --dev", description: "Add as a devDependency" },
      { name: "--cwd <dir>", description: "Run in a specific directory" },
      { name: "--silent", description: "Suppress non-error output" },
      { name: "--verbose", description: "Print verbose logs" },
    ],
    args: [{ name: "package", description: "A package name or specifier" }],
  },
  {
    name: "pnpm",
    slug: "pnpm",
    description: "Fast, disk-efficient package manager for Node.",
    category: "Package managers",
    icon: "⚡",
    stars: 5480,
    downloads: 41000000,
    version: "9.9.0",
    verified: true,
    author: "Community",
    tags: ["node", "monorepo", "fast"],
    subcommands: [
      { name: "install", description: "Install all dependencies" },
      { name: "add", description: "Add a dependency" },
      { name: "update", description: "Update dependencies" },
      { name: "remove", description: "Remove a dependency" },
      { name: "run", description: "Run a script" },
      { name: "exec", description: "Run a package binary" },
      { name: "dlx", description: "Fetch a package and run it" },
      { name: "why", description: "Show why a package is installed" },
      { name: "list", description: "List installed packages" },
      { name: "outdated", description: "Check for outdated packages" },
    ],
    options: [
      { name: "--filter <pattern>", description: "Scope to matching packages" },
      { name: "-r, --recursive", description: "Run on all workspace packages" },
      { name: "-g, --global", description: "Install globally" },
      { name: "--reporter <name>", description: "Set the log reporter" },
    ],
    args: [{ name: "package", description: "A package name or specifier" }],
  },
  {
    name: "kubectl",
    slug: "kubectl",
    description: "Control Kubernetes clusters from the command line.",
    category: "Orchestration",
    icon: "☸️",
    stars: 8900,
    downloads: 73000000,
    version: "1.31.0",
    verified: true,
    author: "Tilde core",
    tags: ["kubernetes", "cluster", "cloud"],
    subcommands: [
      { name: "get", description: "Display one or many resources" },
      { name: "apply", description: "Apply a configuration to a resource" },
      { name: "delete", description: "Delete resources by file or name" },
      { name: "describe", description: "Show details of a resource" },
      { name: "logs", description: "Print the logs of a container" },
      { name: "exec", description: "Execute a command in a container" },
      { name: "port-forward", description: "Forward local ports to a pod" },
      { name: "rollout", description: "Manage a resource rollout" },
      { name: "scale", description: "Set a new size for a deployment" },
      { name: "config", description: "Modify kubeconfig files" },
      { name: "top", description: "Display resource usage" },
    ],
    options: [
      { name: "-n, --namespace <ns>", description: "Namespace to operate in" },
      { name: "--context <name>", description: "kubeconfig context to use" },
      { name: "-o, --output <fmt>", description: "Output format (json, yaml…)" },
      { name: "--kubeconfig <file>", description: "Path to a kubeconfig file" },
      { name: "-w, --watch", description: "Watch for changes" },
    ],
    args: [{ name: "resource", description: "A resource type or name" }],
  },
  {
    name: "terraform",
    slug: "terraform",
    description: "Provision infrastructure as code.",
    category: "Infrastructure",
    icon: "🏗️",
    stars: 7300,
    downloads: 58000000,
    version: "1.9.5",
    verified: true,
    author: "Tilde core",
    tags: ["iac", "cloud", "provision"],
    subcommands: [
      { name: "init", description: "Prepare a working directory" },
      { name: "plan", description: "Show the changes to be applied" },
      { name: "apply", description: "Create or update infrastructure" },
      { name: "destroy", description: "Destroy managed infrastructure" },
      { name: "validate", description: "Validate configuration files" },
      { name: "fmt", description: "Reformat configuration files" },
      { name: "import", description: "Associate existing resources" },
      { name: "state", description: "Inspect the state file" },
      { name: "workspace", description: "Manage workspaces" },
      { name: "output", description: "Show output values" },
    ],
    options: [
      { name: "-auto-approve", description: "Skip interactive approval" },
      { name: "-var <k=v>", description: "Set an input variable" },
      { name: "-var-file <file>", description: "Load variables from a file" },
      { name: "-target <resource>", description: "Target a specific resource" },
      { name: "-state <path>", description: "Path to the state file" },
    ],
    args: [{ name: "dir", description: "A configuration directory" }],
  },
  {
    name: "gh",
    slug: "gh",
    description: "GitHub on the command line.",
    category: "Developer tools",
    icon: "🐈",
    stars: 11500,
    downloads: 84000000,
    version: "2.55.0",
    verified: true,
    author: "Community",
    tags: ["github", "pr", "issues"],
    subcommands: [
      { name: "repo", description: "Create, clone, or fork repositories" },
      { name: "pr", description: "Manage pull requests" },
      { name: "issue", description: "Manage issues" },
      { name: "auth", description: "Authenticate with GitHub" },
      { name: "run", description: "View and manage Actions runs" },
      { name: "release", description: "Manage releases" },
      { name: "gist", description: "Manage gists" },
      { name: "codespace", description: "Manage Codespaces" },
      { name: "api", description: "Make an authenticated API request" },
    ],
    options: [
      { name: "--repo <owner/repo>", description: "Select a repository" },
      { name: "--help", description: "Show help for a command" },
      { name: "--version", description: "Show the gh version" },
    ],
    args: [{ name: "command", description: "A nested gh command" }],
  },
  {
    name: "cargo",
    slug: "cargo",
    description: "The Rust package manager and build tool.",
    category: "Package managers",
    icon: "🦀",
    stars: 6100,
    downloads: 37000000,
    version: "1.80.0",
    verified: true,
    author: "Community",
    tags: ["rust", "build", "crates"],
    subcommands: [
      { name: "build", description: "Compile the current package" },
      { name: "run", description: "Run the current package" },
      { name: "test", description: "Run the tests" },
      { name: "check", description: "Analyze without producing binaries" },
      { name: "add", description: "Add dependencies to Cargo.toml" },
      { name: "new", description: "Create a new cargo package" },
      { name: "init", description: "Create a package in an existing dir" },
      { name: "publish", description: "Publish a package to crates.io" },
      { name: "install", description: "Install a Rust binary" },
      { name: "clippy", description: "Run the Rust linter" },
      { name: "fmt", description: "Format the Rust code" },
      { name: "doc", description: "Build the documentation" },
    ],
    options: [
      { name: "--release", description: "Build in release mode" },
      { name: "--target <triple>", description: "Build for a target" },
      { name: "--features <list>", description: "Enable features" },
      { name: "-p, --package <spec>", description: "Package to operate on" },
      { name: "--all", description: "Run on all workspace members" },
    ],
    args: [{ name: "crate", description: "A crate name or path" }],
  },
  {
    name: "brew",
    slug: "brew",
    description: "The missing package manager for macOS and Linux.",
    category: "System",
    icon: "🍺",
    stars: 8100,
    downloads: 67000000,
    version: "4.3.14",
    verified: true,
    author: "Community",
    tags: ["homebrew", "packages", "linux"],
    subcommands: [
      { name: "install", description: "Install a formula or cask" },
      { name: "update", description: "Update Homebrew and formulae" },
      { name: "upgrade", description: "Upgrade outdated formulae" },
      { name: "search", description: "Search for formulae" },
      { name: "info", description: "Display info about a formula" },
      { name: "list", description: "List installed formulae" },
      { name: "uninstall", description: "Remove a formula" },
      { name: "tap", description: "Add a formula repository" },
      { name: "doctor", description: "Check the installation" },
      { name: "cleanup", description: "Remove old versions" },
    ],
    options: [
      { name: "--verbose", description: "Print extra details" },
      { name: "--force", description: "Overwrite existing files" },
      { name: "--dry-run", description: "Show what would happen" },
      { name: "--cask", description: "Treat the arg as a cask" },
    ],
    args: [{ name: "formula", description: "A formula or cask name" }],
  },
  {
    name: "curl",
    slug: "curl",
    description: "Transfer data to or from a server.",
    category: "Developer tools",
    icon: "🔁",
    stars: 6900,
    downloads: 110000000,
    version: "8.9.1",
    verified: true,
    author: "Tilde core",
    tags: ["http", "networking", "api"],
    subcommands: [],
    options: [
      { name: "-X, --request <method>", description: "HTTP method to use" },
      { name: "-H, --header <header>", description: "Pass a custom header" },
      { name: "-d, --data <data>", description: "HTTP POST body data" },
      { name: "-L, --location", description: "Follow redirects" },
      { name: "-I, --head", description: "Fetch headers only" },
      { name: "-o, --output <file>", description: "Write output to a file" },
      { name: "-s, --silent", description: "Silent mode" },
      { name: "-u, --user <user:pass>", description: "Server credentials" },
      { name: "--fail", description: "Fail silently on server errors" },
      { name: "--retry <num>", description: "Retry on transient errors" },
    ],
    args: [{ name: "url", description: "The URL to transfer" }],
  },
  {
    name: "tmux",
    slug: "tmux",
    description: "A terminal multiplexer for persistent sessions.",
    category: "Developer tools",
    icon: "🪟",
    stars: 5200,
    downloads: 29000000,
    version: "3.5a",
    verified: true,
    author: "Community",
    tags: ["terminal", "sessions", "panes"],
    subcommands: [
      { name: "new", description: "Create a new session" },
      { name: "attach", description: "Attach to an existing session" },
      { name: "kill-session", description: "Destroy a session" },
      { name: "list-sessions", description: "List open sessions" },
      { name: "split-window", description: "Split the current pane" },
      { name: "send-keys", description: "Send keys to a pane" },
      { name: "select-pane", description: "Focus another pane" },
      { name: "rename-session", description: "Rename the session" },
      { name: "source", description: "Run a tmux config file" },
    ],
    options: [
      { name: "-s <name>", description: "Target a session" },
      { name: "-t <target>", description: "Target a session or pane" },
      { name: "-f <file>", description: "Use a config file" },
      { name: "-L", description: "Log server output" },
    ],
    args: [{ name: "command", description: "A command to run" }],
  },
  {
    name: "jq",
    slug: "jq",
    description: "A lightweight JSON processor for the shell.",
    category: "Developer tools",
    icon: "🎛️",
    stars: 7800,
    downloads: 64000000,
    version: "1.7.1",
    verified: true,
    author: "Community",
    tags: ["json", "filter", "pipeline"],
    subcommands: [],
    options: [
      { name: "-r, --raw-output", description: "Output raw strings" },
      { name: "-c, --compact-output", description: "Compact output" },
      { name: "-s, --slurp", description: "Read all inputs into an array" },
      { name: "--arg <name> <value>", description: "Bind a variable" },
      { name: "-n, --null-input", description: "Use null as input" },
    ],
    args: [
      { name: "filter", description: "A jq filter expression" },
      { name: "file", description: "A JSON input file" },
    ],
  },
  {
    name: "aws",
    slug: "aws",
    description: "The unified AWS Command Line Interface.",
    category: "Cloud",
    icon: "☁️",
    stars: 10300,
    downloads: 88000000,
    version: "2.17.0",
    verified: true,
    author: "Tilde core",
    tags: ["aws", "cloud", "cli"],
    subcommands: [
      { name: "s3", description: "Work with S3 buckets and objects" },
      { name: "ec2", description: "Manage EC2 instances" },
      { name: "lambda", description: "Manage Lambda functions" },
      { name: "iam", description: "Manage identities and access" },
      { name: "sts", description: "Manage security tokens" },
      { name: "cloudformation", description: "Manage CloudFormation stacks" },
      { name: "logs", description: "Work with CloudWatch Logs" },
      { name: "dynamodb", description: "Work with DynamoDB tables" },
      { name: "eks", description: "Manage Elastic Kubernetes Service" },
    ],
    options: [
      { name: "--profile <name>", description: "Use a named profile" },
      { name: "--region <region>", description: "Set the AWS region" },
      { name: "--output <fmt>", description: "Output format (json, text…)" },
      { name: "--endpoint-url <url>", description: "Override the endpoint URL" },
    ],
    args: [{ name: "service", description: "An AWS service name" }],
  },
];

// Generates a readable TypeScript spec source from a catalog entry so the
// registry always has something concrete to show for every command.
function sourceFor(spec: SpecEntry): string {
  const sub = spec.subcommands
    .map((s) => `    { name: "${s.name}", description: "${s.description}" },`)
    .join("\n");
  const opt = spec.options
    .map((o) => `    { name: "${o.name}", description: "${o.description}" },`)
    .join("\n");
  const args = spec.args
    .map((a) => `    { name: "${a.name}", description: "${a.description}" },`)
    .join("\n");
  return [
    `import { completionSpec } from "@tilde/specs";`,
    ``,
    `export const completionSpec = {`,
    `  name: "${spec.name}",`,
    `  description: "${spec.description}",`,
    `  subcommands: [`,
    sub,
    `  ],`,
    `  options: [`,
    opt,
    `  ],`,
    `  args: [`,
    args,
    `  ],`,
    `};`,
    ``,
  ].join("\n");
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const specs = await ctx.db.query("specs").collect();
    return specs.sort((a, b) => b.stars - a.stars);
  },
});

// Idempotent seed: inserts any missing catalog entries. Called from the
// dashboard so the registry has data on first open.
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    let inserted = 0;
    for (const entry of CATALOG) {
      const existing = await ctx.db
        .query("specs")
        .withIndex("by_slug", (q) => q.eq("slug", entry.slug))
        .first();
      if (existing) continue;
      await ctx.db.insert("specs", { ...entry, sourceCode: sourceFor(entry) });
      inserted += 1;
    }
    return { inserted };
  },
});

export const toggleStar = mutation({
  args: { specId: v.id("specs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const spec = await ctx.db.get(args.specId);
    if (!spec) throw new Error("Spec not found");

    const existing = await ctx.db
      .query("specStars")
      .withIndex("by_user_spec", (q) =>
        q.eq("userId", userId).eq("specId", args.specId),
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      const stars = Math.max(0, spec.stars - 1);
      await ctx.db.patch(args.specId, { stars });
      return { starred: false, stars };
    }

    await ctx.db.insert("specStars", { specId: args.specId, userId });
    const stars = spec.stars + 1;
    await ctx.db.patch(args.specId, { stars });
    return { starred: true, stars };
  },
});

export const listStarred = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const stars = await ctx.db
      .query("specStars")
      .withIndex("by_user_spec", (q) => q.eq("userId", userId))
      .collect();
    const specs = await Promise.all(stars.map((s) => ctx.db.get(s.specId)));
    return specs.filter(
      (s): s is NonNullable<typeof s> => s !== null,
    );
  },
});

export const submitSpec = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.string(),
    language: v.union(v.literal("typescript"), v.literal("rust")),
    sourceCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    const authorName = user?.name ?? user?.email ?? "Anonymous";
    return await ctx.db.insert("submissions", {
      name: args.name,
      description: args.description,
      category: args.category,
      language: args.language,
      sourceCode: args.sourceCode,
      authorId: userId,
      authorName,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const mySubmissions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const subs = await ctx.db
      .query("submissions")
      .withIndex("by_author", (q) => q.eq("authorId", userId))
      .collect();
    return subs.sort((a, b) => b.createdAt - a.createdAt);
  },
});
