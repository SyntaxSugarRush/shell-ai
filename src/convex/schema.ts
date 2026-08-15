import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Curated completion specs (the community spec registry).
    specs: defineTable({
      name: v.string(), // command name, e.g. "git"
      slug: v.string(), // normalized, url-safe name
      description: v.string(),
      category: v.string(), // e.g. "Version control"
      icon: v.string(), // short emoji / glyph shown on cards
      stars: v.number(),
      downloads: v.number(),
      version: v.string(),
      verified: v.boolean(),
      author: v.string(),
      tags: v.array(v.string()),
      subcommands: v.array(
        v.object({ name: v.string(), description: v.string() }),
      ),
      options: v.array(
        v.object({ name: v.string(), description: v.string() }),
      ),
      args: v.array(
        v.object({ name: v.string(), description: v.string() }),
      ),
      sourceCode: v.string(), // TypeScript / Rust spec source
    })
      .index("by_slug", ["slug"])
      .index("by_stars", ["stars"]),

    // Which specs a user has starred.
    specStars: defineTable({
      specId: v.id("specs"),
      userId: v.id("users"),
    })
      .index("by_user_spec", ["userId", "specId"])
      .index("by_spec", ["specId"]),

    // Community-contributed spec proposals awaiting review.
    submissions: defineTable({
      name: v.string(),
      description: v.string(),
      category: v.string(),
      language: v.union(v.literal("typescript"), v.literal("rust")),
      sourceCode: v.string(),
      authorId: v.id("users"),
      authorName: v.string(),
      status: v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected"),
      ),
      createdAt: v.number(),
    }).index("by_author", ["authorId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
