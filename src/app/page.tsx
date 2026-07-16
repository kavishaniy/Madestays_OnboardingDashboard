import { getOnboardingData } from "@/lib/data";
import { buildPortfolio } from "@/lib/onboarding";
import { Dashboard } from "@/components/Dashboard";

export default async function Home() {
  const data = await getOnboardingData();
  const portfolio = buildPortfolio(data);

  return (
    <main className="min-h-screen overflow-x-hidden bg-stone py-6 sm:py-10">
      <Dashboard owner={data.owner} portfolio={portfolio} />
    </main>
  );
}
