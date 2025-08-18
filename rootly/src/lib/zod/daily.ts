// src/lib/zod/daily.ts
import { z } from "zod";

export const dailySchema = z.object({
  date: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Invalid date"),
  studiedMinutes: z.number().int().min(0).max(1440),
  summary: z.string().min(3),
  topicsTouched: z
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
    .optional(),
  mood: z.enum(["energized", "ok", "tired"]).optional(),
});
export type DailyInput = z.infer<typeof dailySchema>;
