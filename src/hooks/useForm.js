import { useState } from "react";
import { z } from "zod";
import { ApiError } from "../api/client";

// Minimal form state helper shared by every form in the app.
//   const form = useForm({ name: "" });
//   <input name="name" value={form.values.name} onChange={form.handleChange} />
export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  // Validates with an optional zod schema, then runs `action(parsedValues)`.
  // Server validation errors are mapped back onto the matching fields.
  async function submit(action, schema) {
    setFormError("");
    let data = values;
    if (schema) {
      const result = schema.safeParse(values);
      if (!result.success) {
        setErrors(firstMessages(z.flattenError(result.error).fieldErrors));
        return false;
      }
      data = result.data;
    }

    setSubmitting(true);
    try {
      await action(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fields).length) {
        setErrors(firstMessages(error.fields));
      }
      setFormError(error.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  const reset = (next = initialValues) => {
    setValues(next);
    setErrors({});
    setFormError("");
  };

  return { values, setValues, errors, formError, submitting, handleChange, submit, reset };
}

function firstMessages(fieldErrors) {
  return Object.fromEntries(Object.entries(fieldErrors).map(([key, messages]) => [key, messages?.[0]]));
}
