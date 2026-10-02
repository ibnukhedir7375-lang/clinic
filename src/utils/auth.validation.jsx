import * as z from "zod";

export const phoneValidator = z
  .string()
  .trim()
  // Matches exactly 10 digits with exactly one optional allowed character inside
  .regex(/^(?=(?:\D*\d){10}\D*$)[0-9\s\-+]+$/, {
    message:
      "Phone number must contain exactly 10 digits and at most one special character (- or spaces)",
  });

export const passwordValidation = z.string();
