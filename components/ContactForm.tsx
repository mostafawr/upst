"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useId,
  useRef,
  useState,
} from "react";
import { trackEvent } from "@/lib/analytics";
import { ArrowGlyph } from "./EditorialPrimitives";
import { budgetChoices as BUDGET_OPTIONS } from "@/lib/content";

interface ContactFormState {
  fullName: string;
  email: string;
  phone: string;
  budget: string;
  website: string;
  details: string;
}

type ContactField = keyof ContactFormState;
type ContactErrors = Partial<Record<ContactField, string>>;
type SubmitStatus = "idle" | "submitting" | "success";

const INITIAL_FORM: ContactFormState = {
  fullName: "",
  email: "",
  phone: "",
  budget: "",
  website: "",
  details: "",
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Accepts international formats; requires enough digits to be callable. */
function isValidPhone(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  return digits.length >= 7 && digits.length <= 15 && /^[\d\s()+\-.]+$/.test(value);
}

function normalizeWebsite(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function isValidWebsite(value: string) {
  try {
    const url = new URL(normalizeWebsite(value));
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.hostname.includes(".")
    );
  } catch {
    return false;
  }
}

function validateForm(form: ContactFormState): ContactErrors {
  const errors: ContactErrors = {};

  if (!form.fullName.trim()) {
    errors.fullName = "Enter your name.";
  }

  if (!form.email.trim()) {
    errors.email = "Enter your email.";
  } else if (!isValidEmail(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.phone.trim()) {
    errors.phone = "Enter a phone number we can reach you on.";
  } else if (!isValidPhone(form.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!form.budget) {
    errors.budget = "Choose a budget range.";
  }

  // Optional, but must be usable when provided.
  if (form.website.trim() && !isValidWebsite(form.website.trim())) {
    errors.website = "Enter a valid website address.";
  }

  return errors;
}

async function readResponseMessage(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      const payload: unknown = await response.json();
      if (
        payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof payload.message === "string"
      ) {
        return payload.message;
      }
      return "";
    }

    return (await response.text()).trim();
  } catch {
    return "";
  }
}

interface FieldErrorProps {
  id: string;
  message?: string;
}

function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null;

  return (
    <span className="contact-form__field-error" id={id}>
      {message}
    </span>
  );
}

export interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className }: ContactFormProps) {
  const idPrefix = useId().replace(/:/g, "");
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fieldId = (field: ContactField) => `${idPrefix}-${field}`;
  const errorId = (field: ContactField) => `${fieldId(field)}-error`;

  const clearFieldError = (field: ContactField) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setSubmitError("");
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const field = event.target.name as ContactField;
    const { value } = event.target;
    setForm((current) => ({ ...current, [field]: value }));
    clearFieldError(field);
  };

  const focusFirstError = () => {
    requestAnimationFrame(() => {
      formRef.current
        ?.querySelector<HTMLElement>("[aria-invalid='true']")
        ?.focus();
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    const nextErrors = validateForm(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitError("Please review the marked fields and try again.");
      focusFirstError();
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const website = form.website.trim();
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          budget: form.budget,
          website: website ? normalizeWebsite(website) : "",
          details: form.details.trim(),
        }),
      });

      const responseMessage = await readResponseMessage(response);

      if (!response.ok) {
        setStatus("idle");
        setSubmitError(
          responseMessage ||
            "We could not submit your enquiry. Please try again in a moment.",
        );
        return;
      }

      trackEvent("project_brief_submitted", {
        budget: form.budget,
        has_website: Boolean(form.website.trim()),
        has_details: Boolean(form.details.trim()),
      });

      setForm(INITIAL_FORM);
      setSuccessMessage(
        responseMessage || "Your enquiry was submitted successfully.",
      );
      setStatus("success");
    } catch {
      setStatus("idle");
      setSubmitError(
        "We could not connect to the submission service. Please try again.",
      );
    }
  };

  if (status === "success") {
    return (
      <section
        className={["contact-form", "contact-form--success", className]
          .filter(Boolean)
          .join(" ")}
        aria-labelledby={`${idPrefix}-success-title`}
      >
        <p className="contact-form__success-kicker">Submission complete</p>
        <h2 className="contact-form__success-title" id={`${idPrefix}-success-title`}>
          Enquiry received.
        </h2>
        <p className="contact-form__success-message" role="status">
          {successMessage}
        </p>
        <button
          className="contact-form__secondary-button"
          type="button"
          onClick={() => {
            setStatus("idle");
            setSuccessMessage("");
          }}
        >
          Send another enquiry
          <ArrowGlyph />
        </button>
      </section>
    );
  }

  return (
    <form
      ref={formRef}
      className={["contact-form", className].filter(Boolean).join(" ")}
      aria-label="Project enquiry"
      aria-busy={status === "submitting"}
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor={fieldId("fullName")}>
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          id={fieldId("fullName")}
          className="contact-form__input"
          name="fullName"
          type="text"
          autoComplete="name"
          value={form.fullName}
          required
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? errorId("fullName") : undefined}
          onChange={handleInputChange}
        />
        <FieldError id={errorId("fullName")} message={errors.fullName} />
      </div>

      <div className="contact-form__grid contact-form__grid--two-columns">
        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={fieldId("phone")}>
            Phone <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId("phone")}
            className="contact-form__input"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            required
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? errorId("phone") : undefined}
            onChange={handleInputChange}
          />
          <FieldError id={errorId("phone")} message={errors.phone} />
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={fieldId("email")}>
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId("email")}
            className="contact-form__input"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={form.email}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? errorId("email") : undefined}
            onChange={handleInputChange}
          />
          <FieldError id={errorId("email")} message={errors.email} />
        </div>
      </div>

      <div className="contact-form__grid contact-form__grid--two-columns">
        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={fieldId("budget")}>
            Budget <span aria-hidden="true">*</span>
          </label>
          <select
            id={fieldId("budget")}
            className="contact-form__select"
            name="budget"
            value={form.budget}
            required
            aria-invalid={Boolean(errors.budget)}
            aria-describedby={errors.budget ? errorId("budget") : undefined}
            onChange={handleInputChange}
          >
            <option value="">Select a range</option>
            {BUDGET_OPTIONS.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError id={errorId("budget")} message={errors.budget} />
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={fieldId("website")}>
            Website <span className="contact-form__optional">Optional</span>
          </label>
          <input
            id={fieldId("website")}
            className="contact-form__input"
            name="website"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="example.com"
            value={form.website}
            aria-invalid={Boolean(errors.website)}
            aria-describedby={errors.website ? errorId("website") : undefined}
            onChange={handleInputChange}
          />
          <FieldError id={errorId("website")} message={errors.website} />
        </div>
      </div>

      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor={fieldId("details")}>
          What do you need?{" "}
          <span className="contact-form__optional">Optional</span>
        </label>
        <textarea
          id={fieldId("details")}
          className="contact-form__textarea"
          name="details"
          rows={5}
          placeholder="A Shopify store, an Odoo setup, or the connection between them."
          value={form.details}
          onChange={handleInputChange}
        />
      </div>

      <div className="contact-form__submission">
        <p className="contact-form__required-note">
          <span aria-hidden="true">*</span> Required fields
        </p>
        {submitError ? (
          <p className="contact-form__submit-error" role="alert">
            {submitError}
          </p>
        ) : null}
        <button
          className="contact-form__submit-button"
          type="submit"
          disabled={status === "submitting"}
        >
          <span>{status === "submitting" ? "Sending…" : "Submit Enquiry"}</span>
          <ArrowGlyph />
        </button>
      </div>
    </form>
  );
}

export default ContactForm;
