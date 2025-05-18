import { z } from "zod";

// Define a schema for login validation
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password is required.",
  }),
  rememberMe: z.boolean().optional(),
});
