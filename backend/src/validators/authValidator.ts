import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ error: "Nama wajib diisi" })
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .trim(),
  email: z
    .string({ error: "Email wajib diisi" })
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter")
    .trim()
    .toLowerCase(),
  password: z
    .string({ error: "Password wajib diisi" })
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password maksimal 100 karakter"),
});

export const loginSchema = z.object({
  email: z
    .string({ error: "Email wajib diisi" })
    .email("Format email tidak valid")
    .trim()
    .toLowerCase(),
  password: z
    .string({ error: "Password wajib diisi" })
    .min(1, "Password wajib diisi"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
