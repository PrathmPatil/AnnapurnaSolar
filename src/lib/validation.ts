export type LeadPayload = {
  type?: string;
  name?: string;
  phone?: string;
  pincode?: string;
  city?: string;
  company?: string;
  society?: string;
  monthlyBill?: string;
  designation?: string;
  agmStatus?: string;
  consent?: boolean;
};

export function validateLead(payload: LeadPayload) {
  const errors: Record<string, string> = {};

  if (!payload.type) errors.type = "Lead type is required.";
  if (!payload.name || payload.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!payload.phone || !/^\d{10}$/.test(payload.phone)) errors.phone = "Enter a valid 10-digit number.";
  if (!payload.pincode || !/^\d{6}$/.test(payload.pincode)) errors.pincode = "Enter a valid 6-digit pincode.";
  if (!payload.monthlyBill) errors.monthlyBill = "Please select or enter a monthly bill.";
  if (!payload.consent) errors.consent = "You must agree before submitting.";

  if (payload.type === "commercial" && (!payload.company || payload.company.trim().length < 2)) {
    errors.company = "Please enter your company name.";
  }

  if (payload.type === "society") {
    if (!payload.society || payload.society.trim().length < 2) {
      errors.society = "Please enter your housing society name.";
    }
    if (!payload.agmStatus) errors.agmStatus = "Please select AGM approval status.";
    if (!payload.designation) errors.designation = "Please select your designation.";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
  };
}

export function jsonError(message: string, status = 400, errors?: Record<string, string>) {
  return Response.json({ ok: false, message, errors }, { status });
}
