import { calculateSolarSavings, isValidPincode } from "@/lib/solar-calculator";
import { jsonError } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body) {
    return jsonError("Invalid JSON payload.");
  }

  const pincode = String(body.pincode ?? "");
  const monthlyBill = Number(body.monthlyBill);

  if (!isValidPincode(pincode)) {
    return jsonError("Please enter a valid 6-digit pincode.");
  }

  if (!Number.isFinite(monthlyBill) || monthlyBill < 500) {
    return jsonError("Please enter a monthly electricity bill of at least Rs. 500.");
  }

  return Response.json({
    ok: true,
    result: calculateSolarSavings({ pincode, monthlyBill }),
  });
}
