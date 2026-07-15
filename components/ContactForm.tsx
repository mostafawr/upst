"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useId,
  useRef,
  useState,
} from "react";
import { ArrowGlyph } from "./EditorialPrimitives";
import {
  budgetChoices as BUDGET_OPTIONS,
  engagementChoices as ENGAGEMENT_OPTIONS,
  referralChoices as REFERRAL_OPTIONS,
  servicesNeededChoices as SERVICE_OPTIONS,
  timelineChoices as TIMELINE_OPTIONS,
} from "@/lib/content";

interface ContactFormState {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  website: string;
  phone: string;
  engagementType: string;
  servicesNeeded: string[];
  timeline: string;
  budget: string;
  details: string;
  referralSource: string;
}

type ContactField = keyof ContactFormState;
type ContactErrors = Partial<Record<ContactField, string>>;
type SubmitStatus = "idle" | "submitting" | "success";

const INITIAL_FORM: ContactFormState = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  website: "",
  phone: "",
  engagementType: "",
  servicesNeeded: [],
  timeline: "",
  budget: "",
  details: "",
  referralSource: "",
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
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

  if (!form.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!form.lastName.trim()) errors.lastName = "Enter your last name.";

  if (!form.email.trim()) {
    errors.email = "Enter your work email.";
  } else if (!isValidEmail(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.company.trim()) errors.company = "Enter your company name.";

  if (!form.website.trim()) {
    errors.website = "Enter your company website.";
  } else if (!isValidWebsite(form.website.trim())) {
    errors.website = "Enter a valid website address.";
  }

  if (!form.engagementType) {
    errors.engagementType = "Choose an engagement type.";
  }

  if (form.servicesNeeded.length === 0) {
    errors.servicesNeeded = "Choose at least one service.";
  }

  if (!form.timeline) errors.timeline = "Choose a project timeline.";
  if (!form.details.trim()) {
    errors.details = "Tell us a little about the project.";
  }
  if (!form.referralSource.trim()) {
    errors.referralSource = "Tell us how you heard about Upstack.";
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

  const updateField = (field: ContactField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    clearFieldError(field);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const field = event.target.name as ContactField;
    updateField(field, event.target.value);
  };

  const toggleService = (service: string) => {
    setForm((current) => ({
      ...current,
      servicesNeeded: current.servicesNeeded.includes(service)
        ? current.servicesNeeded.filter((item) => item !== service)
        : [...current.servicesNeeded, service],
    }));
    clearFieldError("servicesNeeded");
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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...form,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          website: normalizeWebsite(form.website.trim()),
          phone: form.phone.trim(),
          details: form.details.trim(),
          referralSource: form.referralSource.trim(),
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
      <div className="contact-form__grid contact-form__grid--two-columns">
        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={fieldId("firstName")}>
            First name <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId("firstName")}
            className="contact-form__input"
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={form.firstName}
            required
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? errorId("firstName") : undefined}
            onChange={handleInputChange}
          />
          <FieldError id={errorId("firstName")} message={errors.firstName} />
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={fieldId("lastName")}>
            Last name <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId("lastName")}
            className="contact-form__input"
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={form.lastName}
            required
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? errorId("lastName") : undefined}
            onChange={handleInputChange}
          />
          <FieldError id={errorId("lastName")} message={errors.lastName} />
        </div>
      </div>

      <div className="contact-form__grid contact-form__grid--two-columns">
        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={fieldId("email")}>
            Work email <span aria-hidden="true">*</span>
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

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={fieldId("phone")}>
            Phone <span className="contact-form__optional">Optional</span>
          </label>
          <input
            id={fieldId("phone")}
            className="contact-form__input"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="contact-form__grid contact-form__grid--two-columns">
        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={fieldId("company")}>
            Company <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId("company")}
            className="contact-form__input"
            name="company"
            type="text"
            autoComplete="organization"
            value={form.company}
            required
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? errorId("company") : undefined}
            onChange={handleInputChange}
          />
          <FieldError id={errorId("company")} message={errors.company} />
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={fieldId("website")}>
            Website <span aria-hidden="true">*</span>
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
            required
            aria-invalid={Boolean(errors.website)}
            aria-describedby={errors.website ? errorId("website") : undefined}
            onChange={handleInputChange}
          />
          <FieldError id={errorId("website")} message={errors.website} />
        </div>
      </div>

      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor={fieldId("engagementType")}>
          Engagement type <span aria-hidden="true">*</span>
        </label>
        <select
          id={fieldId("engagementType")}
          className="contact-form__select"
          name="engagementType"
          value={form.engagementType}
          required
          aria-invalid={Boolean(errors.engagementType)}
          aria-describedby={
            errors.engagementType ? errorId("engagementType") : undefined
          }
          onChange={handleInputChange}
        >
          <option value="">Select an engagement</option>
          {ENGAGEMENT_OPTIONS.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
        <FieldError
          id={errorId("engagementType")}
          message={errors.engagementType}
        />
      </div>

      <fieldset
        className="contact-form__fieldset"
        aria-describedby={
          errors.servicesNeeded ? errorId("servicesNeeded") : undefined
        }
      >
        <legend className="contact-form__legend">
          Services needed <span aria-hidden="true">*</span>
        </legend>
        <div className="contact-form__checkbox-grid">
          {SERVICE_OPTIONS.map((service, index) => {
            const optionId = `${fieldId("servicesNeeded")}-${index}`;
            return (
              <label className="contact-form__checkbox-label" htmlFor={optionId} key={service}>
                <input
                  id={optionId}
                  className="contact-form__checkbox"
                  name="servicesNeeded"
                  type="checkbox"
                  value={service}
                  checked={form.servicesNeeded.includes(service)}
                  aria-invalid={Boolean(errors.servicesNeeded)}
                  onChange={() => toggleService(service)}
                />
                <span>{service}</span>
              </label>
            );
          })}
        </div>
        <FieldError
          id={errorId("servicesNeeded")}
          message={errors.servicesNeeded}
        />
      </fieldset>

      <div className="contact-form__grid contact-form__grid--two-columns">
        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={fieldId("timeline")}>
            Project timeline <span aria-hidden="true">*</span>
          </label>
          <select
            id={fieldId("timeline")}
            className="contact-form__select"
            name="timeline"
            value={form.timeline}
            required
            aria-invalid={Boolean(errors.timeline)}
            aria-describedby={errors.timeline ? errorId("timeline") : undefined}
            onChange={handleInputChange}
          >
            <option value="">Select a timeline</option>
            {TIMELINE_OPTIONS.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError id={errorId("timeline")} message={errors.timeline} />
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={fieldId("budget")}>
            Budget range <span className="contact-form__optional">Optional</span>
          </label>
          <select
            id={fieldId("budget")}
            className="contact-form__select"
            name="budget"
            value={form.budget}
            onChange={handleInputChange}
          >
            <option value="">Select a range</option>
            {BUDGET_OPTIONS.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor={fieldId("details")}>
          Project details <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={fieldId("details")}
          className="contact-form__textarea"
          name="details"
          rows={7}
          value={form.details}
          required
          aria-invalid={Boolean(errors.details)}
          aria-describedby={errors.details ? errorId("details") : undefined}
          onChange={handleInputChange}
        />
        <FieldError id={errorId("details")} message={errors.details} />
      </div>

      <div className="contact-form__field">
        <label className="contact-form__label" htmlFor={fieldId("referralSource")}>
          Referral source <span aria-hidden="true">*</span>
        </label>
        <select
          id={fieldId("referralSource")}
          className="contact-form__select"
          name="referralSource"
          value={form.referralSource}
          required
          aria-invalid={Boolean(errors.referralSource)}
          aria-describedby={
            errors.referralSource ? errorId("referralSource") : undefined
          }
          onChange={handleInputChange}
        >
          <option value="">Select a source</option>
          {REFERRAL_OPTIONS.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
        <FieldError
          id={errorId("referralSource")}
          message={errors.referralSource}
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
