import z from "zod";

export const titleSchema = z.object({
  title: z.string().min(5, "Title is required"),
});

export type titleType = z.infer<typeof titleSchema>;
