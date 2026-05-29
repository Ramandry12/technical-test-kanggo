import { z } from "zod";

const taskStatusEnum = z.enum(["pending", "in-progress", "done"]);

export const createTaskSchema = z.object({
  title: z
    .string({ error: "Title wajib diisi" })
    .min(1, "Title tidak boleh kosong")
    .max(255, "Title maksimal 255 karakter")
    .trim(),
  description: z
    .string()
    .max(5000, "Deskripsi maksimal 5000 karakter")
    .trim()
    .optional()
    .nullable(),
  status: taskStatusEnum.optional().default("pending"),
  deadline: z
    .string()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "Format tanggal tidak valid"
    )
    .optional()
    .nullable(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title tidak boleh kosong")
    .max(255, "Title maksimal 255 karakter")
    .trim()
    .optional(),
  description: z
    .string()
    .max(5000, "Deskripsi maksimal 5000 karakter")
    .trim()
    .optional()
    .nullable(),
  status: taskStatusEnum.optional(),
  deadline: z
    .string()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "Format tanggal tidak valid"
    )
    .optional()
    .nullable(),
});

export const taskQuerySchema = z.object({
  status: taskStatusEnum.optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
