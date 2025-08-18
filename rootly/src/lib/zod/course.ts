// src/lib/zod/course.ts
import { z } from "zod";

export const url = z
  .string()
  .url("Must be a valid URL")
  .optional()
  .or(z.literal(""));

export const courseSchema = z.object({
  instructor: z.string().min(2, "Instructor required"),
  title: z.string().min(2, "Title required"),
  links: z.object({
    course: url,
    repo: url,
    docs: url,
  }),
  version: z.string().optional(),
  startedAt: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date"),
  tags: z
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
    .min(1, "Pick at least one topic"),
});
export type CourseInput = z.infer<typeof courseSchema>;
