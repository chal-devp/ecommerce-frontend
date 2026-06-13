// src/schemas/authSchema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// You can also export the TypeScript type derived from the schema
export type LoginInput = z.infer<typeof loginSchema>;
