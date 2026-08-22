/** The validated enquiry shape shared by the API route and its notification sinks. */
export interface LeadPayload {
  fullName: string;
  email: string;
  phone: string;
  budget: string;
  website: string;
  details: string;
  submittedAt: string;
  source: string;
}
