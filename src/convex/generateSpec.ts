"use node";

import { v } from "convex/values";
import { vly } from "../lib/vly-integrations";
import { action } from "./_generated/server";

const SYSTEM_PROMPT = `You are an expert at authoring shell completion specs in the Fig/Amazon-Q style.
Given a command name, its --help output, and a target language, produce a complete, ready-to-paste completion spec.

Rules:
- For TypeScript, output a single "completionSpec" object with name, description, subcommands, options, and args arrays.
- For Rust, output idiomatic Rust using a similar structure (name, description, subcommands, options, args).
- Every subcommand and option needs a concise, human-readable description derived from the help text.
- Prefer long option names (--force) but include short aliases when the help text documents them.
- Mark obviously destructive subcommands (reset --hard, rm -rf, purge, drop) with a "danger" flag when the schema supports it.
- Output ONLY the code. No markdown fences, no commentary.`;

export const generateSpec = action({
  args: {
    command: v.string(),
    helpText: v.string(),
    language: v.union(v.literal("typescript"), v.literal("rust")),
  },
  handler: async (_ctx, args) => {
    const user = [
      `Command: ${args.command}`,
      `Target language: ${args.language}`,
      ``,
      `--help output:`,
      args.helpText.slice(0, 8000),
    ].join("\n");

    try {
      const result = await vly.ai.completion({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: user },
        ],
        temperature: 0.2,
        maxTokens: 2500,
      });

      if (!result.success || !result.data) {
        return {
          ok: false,
          content: "",
          error: result.error ?? "The model returned no result.",
        };
      }

      const content = result.data.choices?.[0]?.message?.content ?? "";
      if (!content.trim()) {
        return { ok: false, content: "", error: "The model returned empty output." };
      }

      return { ok: true, content, error: "" };
    } catch (error) {
      return {
        ok: false,
        content: "",
        error: error instanceof Error ? error.message : "AI generation failed.",
      };
    }
  },
});
