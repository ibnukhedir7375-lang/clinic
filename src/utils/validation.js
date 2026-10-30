// Client-side validation mirrors the server rules so users get instant feedback.
// The server still validates everything; never trust the browser alone.
import { z } from "zod";

// Turns "" into undefined and "42" into 42 for number inputs.
const numberField = (message) =>
  z.preprocess((value) => (value === "" || value == null ? undefined : Number(value)), z.number(message));

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^(?=(?:\D*\d){10}\D*$)[0-9\s\-+]+$/, "Phone number must contain exactly 10 digits");

export const loginSchema = z.object({
  email: z.string().trim().pipe(z.email("Enter a valid email address")),
  password: z.string().min(1, "Password is required"),
});

export const patientSchema = z.object({
  name: z.string().trim().min(2, "Name is too short"),
  phone: phoneSchema,
  gender: z.enum(["male", "female"], "Pick a gender"),
  age: numberField("Age is required").pipe(z.number().int("Whole years only").min(0).max(130)),
});

export const visitSchema = z.object({
  reason: z.string().trim().max(200),
  fee: numberField("Fee is required").pipe(z.number().min(0, "Fee can't be negative")),
});

export const vitalsSchema = z.object({
  bloodPressure: z.string().trim().regex(/^\d{2,3}\/\d{2,3}$/, "Use the format 120/80"),
  temperature: numberField("Required").pipe(z.number().min(30, "Too low").max(45, "Too high")),
  pulse: numberField("Required").pipe(z.number().int().min(20, "Too low").max(250, "Too high")),
  saturation: numberField("Required").pipe(z.number().min(50, "Too low").max(100, "Max 100")),
  weight: numberField("Required").pipe(z.number().positive().max(400)),
  sugar: z.preprocess(
    (value) => (value === "" || value == null ? undefined : Number(value)),
    z.number().min(10).max(1000).optional(),
  ),
});

export const staffSchema = z.object({
  name: z.string().trim().min(2, "Name is too short"),
  email: z.string().trim().pipe(z.email("Enter a valid email address")),
  password: z.string().min(6, "At least 6 characters"),
  role: z.string().min(1, "Pick a role"),
});

export const consultationSchema = z.object({
  diagnosis: z.string().trim().min(2, "Enter a diagnosis"),
  notes: z.string().trim().max(2000),
});
