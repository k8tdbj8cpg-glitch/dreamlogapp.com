import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing – Dream Log App",
  description:
    "Choose the plan that fits you — individual subscriptions, lifetime access, or institutional pricing for hospitals, nursing homes, and daycares.",
};

const individualPlans = [
  {
    name: "Monthly",
    price: "$9.99",
    period: "/month",
    description: "Full access to all dream logging and AI features.",
    features: [
      "Unlimited dream entries",
      "AI-assisted dream logging",
      "Speech-to-text dictation",
      "Dream pattern analysis",
      "Relaxation routines",
      "Secure, encrypted storage",
    ],
    highlight: false,
    paymentMethods: ["Stripe", "Apple Pay", "Bitcoin", "Ethereum"],
    href: "/register",
    cta: "Get started",
  },
  {
    name: "Standard Lifetime",
    price: "$30",
    period: " one-time",
    description: "Everything in Monthly, forever — no recurring charges.",
    features: [
      "All Monthly features",
      "Lifetime updates",
      "Priority support",
      "Export your dream data",
    ],
    highlight: true,
    paymentMethods: ["Stripe", "Apple Pay", "Bitcoin", "Ethereum"],
    href: "/register",
    cta: "Buy lifetime access",
  },
  {
    name: "Premium Lifetime",
    price: "$50",
    period: " one-time",
    description:
      "Lifetime access with premium extras — advanced analytics, voice assistant integration, and more.",
    features: [
      "All Standard Lifetime features",
      "Advanced dream analytics & charts",
      "Siri / Alexa / Google Assistant integration",
      "Smart relaxation routines (Philips Hue)",
      "Early access to new features",
    ],
    highlight: false,
    paymentMethods: ["Stripe", "Apple Pay", "Bitcoin", "Ethereum"],
    href: "/register",
    cta: "Buy premium lifetime",
  },
];

const institutionalPlans = [
  {
    name: "Small Institution",
    users: "5–20 users",
    price: "$7",
    period: "/user/month",
    description: "For hospitals, nursing homes, and daycares with small teams.",
    features: [
      "All individual features",
      "Admin dashboard",
      "Usage reporting",
      "Onboarding support",
    ],
  },
  {
    name: "Enterprise",
    users: "20+ users",
    price: "Custom",
    period: "",
    description:
      "Tailored plans for large institutions with custom integrations and SLA.",
    features: [
      "All Small Institution features",
      "Custom integrations",
      "Dedicated account manager",
      "HIPAA-compliant options",
      "Custom SLA",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-dvh bg-background px-4 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-bold text-4xl tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="text-muted-foreground text-lg">
            Start free — upgrade when you are ready.
          </p>
        </div>

        {/* Individual Plans */}
        <h2 className="mb-6 font-semibold text-2xl">Individual Plans</h2>
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {individualPlans.map((plan) => (
            <div
              className={`relative flex flex-col rounded-2xl border p-6 shadow-sm ${
                plan.highlight
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "border-border bg-card"
              }`}
              key={plan.name}
            >
              {plan.highlight && (
                <span className="-top-3 absolute left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 font-medium text-primary-foreground text-xs">
                  Most popular
                </span>
              )}
              <div className="mb-4">
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-bold text-3xl">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">
                    {plan.period}
                  </span>
                </div>
                <p className="mt-2 text-muted-foreground text-sm">
                  {plan.description}
                </p>
              </div>
              <ul className="mb-6 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li className="flex items-center gap-2 text-sm" key={f}>
                    <span className="text-primary">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mb-4 text-muted-foreground text-xs">
                Pay with:{" "}
                <span className="font-medium text-foreground">
                  {plan.paymentMethods.join(", ")}
                </span>
              </div>
              <Link
                className={`rounded-lg px-4 py-2 text-center font-medium text-sm transition-colors ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border hover:bg-accent"
                }`}
                href={plan.href}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Institutional Plans */}
        <h2 className="mb-2 font-semibold text-2xl">Institutional Pricing</h2>
        <p className="mb-6 text-muted-foreground text-sm">
          For hospitals, nursing homes, and daycares. Volume discounts available
          — contact us for a custom quote.
        </p>
        <div className="mb-16 grid gap-6 md:grid-cols-2">
          {institutionalPlans.map((plan) => (
            <div
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
              key={plan.name}
            >
              <div className="mb-4">
                <h3 className="font-semibold text-lg">{plan.name}</h3>
                <p className="text-muted-foreground text-xs">{plan.users}</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-bold text-3xl">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground text-sm">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-muted-foreground text-sm">
                  {plan.description}
                </p>
              </div>
              <ul className="mb-4 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li className="flex items-center gap-2 text-sm" key={f}>
                    <span className="text-primary">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Inquiry Form */}
        <div className="rounded-2xl border border-border bg-card p-8">
          <h2 className="mb-2 font-semibold text-2xl">
            Request a Demo or Quote
          </h2>
          <p className="mb-6 text-muted-foreground text-sm">
            Interested in an institutional plan? Fill out the form below and our
            team will get back to you within one business day.
          </p>
          <InquiryForm />
        </div>
      </div>
    </div>
  );
}

function InquiryForm() {
  return (
    <form
      action="mailto:hello@dreamlogapp.com"
      className="grid gap-4 sm:grid-cols-2"
      method="GET"
    >
      <div className="flex flex-col gap-1">
        <label
          className="font-medium text-sm"
          htmlFor="inquiry-name"
        >
          Name
        </label>
        <input
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          id="inquiry-name"
          name="name"
          placeholder="Your name"
          required
          type="text"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          className="font-medium text-sm"
          htmlFor="inquiry-email"
        >
          Work Email
        </label>
        <input
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          id="inquiry-email"
          name="email"
          placeholder="you@institution.org"
          required
          type="email"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          className="font-medium text-sm"
          htmlFor="inquiry-org"
        >
          Organization
        </label>
        <input
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          id="inquiry-org"
          name="organization"
          placeholder="Hospital, nursing home, daycare, etc."
          required
          type="text"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label
          className="font-medium text-sm"
          htmlFor="inquiry-users"
        >
          Number of Users
        </label>
        <select
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          id="inquiry-users"
          name="users"
        >
          <option value="5-20">5–20 users</option>
          <option value="20-50">20–50 users</option>
          <option value="50-100">50–100 users</option>
          <option value="100+">100+ users</option>
        </select>
      </div>
      <div className="flex flex-col gap-1 sm:col-span-2">
        <label
          className="font-medium text-sm"
          htmlFor="inquiry-message"
        >
          Message
        </label>
        <textarea
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          id="inquiry-message"
          name="message"
          placeholder="Tell us about your needs or request a demo..."
          rows={4}
        />
      </div>
      <div className="sm:col-span-2">
        <button
          className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
          type="submit"
        >
          Send Inquiry
        </button>
      </div>
    </form>
  );
}
