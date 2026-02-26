import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy & Data Controls – Dream Log App",
  description:
    "Your dream data is yours. Learn how Dream Log encrypts, stores, and lets you delete your data on demand.",
};

const dataControls = [
  {
    icon: "🔒",
    title: "End-to-End Encryption",
    description:
      "All dream entries are encrypted at rest using AES-256 and in transit using TLS 1.3. Even our team cannot read your dreams.",
  },
  {
    icon: "🙈",
    title: "Private by Default",
    description:
      "New chats and dream entries are set to private visibility by default. You control what (if anything) is shared.",
  },
  {
    icon: "🗑️",
    title: "Delete Your Data On Demand",
    description:
      "You can permanently delete all your dream data at any time from your account settings. Deletion is irreversible and takes effect immediately.",
  },
  {
    icon: "📦",
    title: "Export Your Data",
    description:
      "Download a full export of your dream journal in JSON or plain text format at any time — no lock-in.",
  },
  {
    icon: "🚫",
    title: "No Data Selling",
    description:
      "We never sell, rent, or share your personal dream data with advertisers or third parties.",
  },
  {
    icon: "🤖",
    title: "AI Privacy",
    description:
      "Conversations with the Dream Log AI are not used to train third-party models. Your prompts stay in your account.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-background px-4 py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-bold text-4xl tracking-tight">
            🔐 Privacy & Data Controls
          </h1>
          <p className="text-muted-foreground text-lg">
            Your dreams are deeply personal. Here is exactly how Dream Log
            protects and respects your data.
          </p>
        </div>

        {/* Data Controls Grid */}
        <div className="mb-12 grid gap-5 sm:grid-cols-2">
          {dataControls.map((item) => (
            <div
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
              key={item.title}
            >
              <div className="mb-2 text-2xl">{item.icon}</div>
              <h3 className="mb-1 font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Delete Account Section */}
        <div className="mb-10 rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="mb-2 font-semibold text-lg text-destructive">
            🗑️ Delete All My Data
          </h2>
          <p className="mb-4 text-muted-foreground text-sm">
            You can permanently delete your account and all associated dream
            data at any time. This action is immediate and irreversible — we
            cannot recover data once it is deleted.
          </p>
          <p className="mb-4 text-muted-foreground text-sm">
            To delete your data: go to{" "}
            <strong>Settings → Account → Delete Account</strong>, or contact us
            at{" "}
            <a
              className="text-primary underline"
              href="mailto:privacy@dreamlogapp.com"
            >
              privacy@dreamlogapp.com
            </a>{" "}
            and we will process your request within 30 days (as required by
            GDPR, CCPA, and applicable law).
          </p>
          <p className="text-muted-foreground text-xs">
            We recommend{" "}
            <Link className="text-primary underline" href="/">
              exporting your data
            </Link>{" "}
            before deleting your account.
          </p>
        </div>

        {/* Technical Details */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold text-lg">
            Technical Security Details
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
              <dt className="w-40 font-medium text-muted-foreground shrink-0">
                Encryption at rest
              </dt>
              <dd>AES-256 (database-level encryption via Postgres)</dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
              <dt className="w-40 font-medium text-muted-foreground shrink-0">
                Encryption in transit
              </dt>
              <dd>TLS 1.3</dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
              <dt className="w-40 font-medium text-muted-foreground shrink-0">
                Authentication
              </dt>
              <dd>
                Passwords hashed with bcrypt (cost factor 10+); sessions via
                NextAuth
              </dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
              <dt className="w-40 font-medium text-muted-foreground shrink-0">
                Data location
              </dt>
              <dd>
                Hosted on Vercel (US region by default); Postgres via Vercel
                Postgres
              </dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
              <dt className="w-40 font-medium text-muted-foreground shrink-0">
                Voice data
              </dt>
              <dd>
                Speech-to-text processed entirely in your browser via the Web
                Speech API — audio never leaves your device
              </dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
              <dt className="w-40 font-medium text-muted-foreground shrink-0">
                Retention
              </dt>
              <dd>
                Data retained until account deletion; inactive accounts purged
                after 24 months of inactivity (with notice)
              </dd>
            </div>
          </dl>
        </div>

        <p className="mt-8 text-center text-muted-foreground text-xs">
          Questions? Email us at{" "}
          <a
            className="text-primary underline"
            href="mailto:privacy@dreamlogapp.com"
          >
            privacy@dreamlogapp.com
          </a>
        </p>
      </div>
    </div>
  );
}
