import rawData from "@/data/onboarding-data.json";
import type { OnboardingData } from "./types";

// The backend is deliberately trivial (per the brief) — this stands in for
// an API call. The artificial delay is what triggers app/loading.tsx.
const SIMULATED_LATENCY_MS = 900;

export async function getOnboardingData(): Promise<OnboardingData> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  return rawData as OnboardingData;
}
