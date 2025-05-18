import { z } from "zod";

export const UserSchema = z
  .object({
    firstName: z
      .string()
      .min(1, {
        message: "First name must be at least 1 characters.",
      })
      .regex(/^[A-Za-z]+$/, {
        message: "First name can only contain letters (A-Z, a-z).",
      }),
    lastName: z
      .string()
      .min(1, {
        message: "Last name must be at least 1 character.",
      })
      .regex(/^[A-Za-z]+$/, {
        message: "Last name can only contain letters (A-Z, a-z).",
      }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
