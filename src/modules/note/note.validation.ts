import { z } from "zod";

export const createNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),

  content: z
    .string()
    .trim()
    .min(1, "Content is required"),
});

export const updateNoteSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty")
      .max(200, "Title cannot exceed 200 characters")
      .optional(),

    content: z
      .string()
      .trim()
      .min(1, "Content cannot be empty")
      .optional(),
  })
  .refine(
    (data) => data.title !== undefined || data.content !== undefined,
    {
      message: "At least one field is required",
    }
  );

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;