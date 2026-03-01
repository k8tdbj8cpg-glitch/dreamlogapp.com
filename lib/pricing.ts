export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  highlight?: string;
  badge?: string;
  features: string[];
  category: "individual" | "institution";
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "individual_monthly",
    name: "Monthly",
    description: "Unlock the full power of DreamLog every month",
    price: 11.99,
    currency: "USD",
    interval: "/month",
    highlight: "Less than 50 cents/day",
    features: [
      "Unlimited dream journaling",
      "AI-powered dream analysis",
      "Pattern & theme detection",
      "Dream archive & search",
      "Export & share dreams",
      "Priority support",
    ],
    category: "individual",
  },
  {
    id: "individual_annual",
    name: "Annual",
    description: "The smartest way to invest in your dream insights",
    price: 30,
    currency: "USD",
    interval: "/year",
    highlight: "Just $2.50/month — save 79%",
    badge: "Most Popular",
    features: [
      "Unlimited dream journaling",
      "AI-powered dream analysis",
      "Pattern & theme detection",
      "Dream archive & search",
      "Export & share dreams",
      "Priority support",
    ],
    category: "individual",
  },
  {
    id: "individual_biennial",
    name: "2-Year Plan",
    description: "Lock in the lowest rate for two full years",
    price: 50,
    currency: "USD",
    interval: "/2 years",
    highlight: "Only $2.08/month — best value",
    badge: "Best Value",
    features: [
      "Unlimited dream journaling",
      "AI-powered dream analysis",
      "Pattern & theme detection",
      "Dream archive & search",
      "Export & share dreams",
      "Priority support",
      "Early access to new features",
    ],
    category: "individual",
  },
  {
    id: "institution_small",
    name: "Small Institution",
    description: "Ideal for daycares, wellness centers, and small clinics",
    price: 299,
    currency: "USD",
    interval: "/month",
    highlight: "Starting at $299/month (range: $200–$500 based on users)",
    features: [
      "Up to 50 user accounts",
      "Group dream analytics dashboard",
      "Admin controls & oversight",
      "Bulk user management",
      "Custom branding options",
      "Dedicated support",
    ],
    category: "institution",
  },
  {
    id: "institution_enterprise",
    name: "Enterprise",
    description:
      "Built for hospitals, research facilities, and large organizations",
    price: 1500,
    currency: "USD",
    interval: "/month",
    highlight: "Starting at $1,500/month (range: $1,000–$3,000 based on scale)",
    badge: "Contact Us",
    features: [
      "Unlimited user accounts",
      "Advanced analytics & reporting",
      "HIPAA-compliant data handling",
      "API access & integrations",
      "Custom onboarding & training",
      "SLA-backed support",
      "Dedicated account manager",
    ],
    category: "institution",
  },
];
