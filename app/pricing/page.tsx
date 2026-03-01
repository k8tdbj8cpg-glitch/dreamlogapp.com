import { PricingPlans } from "@/components/pricing-plans";

export const metadata = {
  title: "Pricing – DreamLog",
  description:
    "Choose a DreamLog plan. Monthly, annual, or two-year subscriptions for individuals. Custom pricing for organizations.",
};

export default function PricingPage() {
  return (
    <main className="min-h-dvh bg-background">
      <PricingPlans />
    </main>
  );
}
