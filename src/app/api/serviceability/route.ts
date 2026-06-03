import { getServiceLocation, isValidPincode } from "@/lib/solar-calculator";
import { jsonError } from "@/lib/validation";

export function GET(request: Request) {
  const url = new URL(request.url);
  const pincode = url.searchParams.get("pincode") ?? "";

  if (!isValidPincode(pincode)) {
    return jsonError("Please enter a valid 6-digit pincode.");
  }

  const location = getServiceLocation(pincode);

  return Response.json({
    ok: true,
    serviceable: Boolean(location),
    location: location
      ? {
          city: location.city,
          state: location.state,
        }
      : null,
  });
}
