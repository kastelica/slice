"use server";

import { redirect } from "next/navigation";
import { parseClaimInput, submitClaim } from "@/lib/claims";

export async function claimShare(formData: FormData) {
  const parsed = parseClaimInput({
    email: formData.get("email"),
    zip: formData.get("zip"),
    city: formData.get("city"),
    company: formData.get("company"),
  });

  if ("error" in parsed) {
    redirect(`/?claimError=${encodeURIComponent(parsed.error)}#claim`);
  }

  let result;
  try {
    result = await submitClaim(parsed);
  } catch {
    redirect(
      `/?claimError=${encodeURIComponent("Could not save that just now. Please try again.")}#claim`,
    );
  }

  redirect(`/?claimed=${result.already ? "already" : "ok"}#claim`);
}
