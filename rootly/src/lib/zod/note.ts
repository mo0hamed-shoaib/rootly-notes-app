// src/lib/zod/note.ts
import { z } from "zod";

export const noteSchema = z.object({
  courseId: z.string().min(1),
  question: z.string().min(5, "Write the question as a full sentence"),
  topics: z
    .array(
      z.enum([
        "hooks",
        "reconciliation",
        "rendering",
        "state",
        "routing",
        "performance",
        "other",
      ])
    )
    .min(1),
  status: z.enum(["draft", "active", "answered"]).default("active"),
  understanding: z.number().min(0).max(100),
  flags: z
    .object({
      focus: z.boolean().optional(),
      blackBox: z.boolean().optional(),
      mastered: z.boolean().optional(),
    })
    .partial(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type NoteInput = z.infer<typeof noteSchema>;
