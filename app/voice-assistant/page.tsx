import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voice Assistant Integration – Dream Log App",
  description:
    "Use Siri, Alexa, or Google Assistant to log dreams, activate relaxation routines, or get sleep suggestions — hands-free.",
};

const assistants = [
  {
    name: "Siri",
    emoji: "🍎",
    platform: "iOS / macOS",
    commands: [
      "\"Hey Siri, open Dream Log\"",
      "\"Hey Siri, log a dream in Dream Log\"",
      "\"Hey Siri, start my bedtime routine in Dream Log\"",
      "\"Hey Siri, show my dream patterns\"",
    ],
    setup: [
      "Install Dream Log from the App Store (coming soon).",
      "Enable Siri & Search access in iOS Settings → Dream Log.",
      "Use the Shortcuts app to create custom voice shortcuts for any Dream Log action.",
    ],
    note: "Siri Shortcuts integration allows you to trigger any in-app action with a custom phrase.",
  },
  {
    name: "Alexa",
    emoji: "🔵",
    platform: "Amazon Echo / Fire TV",
    commands: [
      "\"Alexa, open Dream Log\"",
      "\"Alexa, ask Dream Log to log a dream\"",
      "\"Alexa, ask Dream Log to play waterfall sounds\"",
      "\"Alexa, ask Dream Log for a bedtime routine\"",
    ],
    setup: [
      "Enable the Dream Log Alexa Skill in the Alexa app (coming soon).",
      "Link your Dream Log account in the Alexa app under Skills → Dream Log.",
      "Say any of the commands above to get started.",
    ],
    note: "The Alexa Skill supports multi-turn conversations — you can dictate a full dream step by step.",
  },
  {
    name: "Google Assistant",
    emoji: "🟢",
    platform: "Android / Google Home / Nest",
    commands: [
      "\"Hey Google, open Dream Log\"",
      "\"Hey Google, log a dream with Dream Log\"",
      "\"Hey Google, start my wind-down routine\"",
      "\"Hey Google, ask Dream Log for sleep tips\"",
    ],
    setup: [
      "Install Dream Log from Google Play (coming soon).",
      "Open Google Assistant Settings → Apps → Dream Log and link your account.",
      "Use Google Assistant Routines to automate Dream Log actions (e.g., every night at 10 PM).",
    ],
    note: "Google Assistant Routines let you chain Dream Log with smart home actions like dimming lights automatically.",
  },
];

const useCases = [
  {
    emoji: "🌙",
    title: "Log a dream hands-free",
    description:
      "Wake up and immediately dictate your dream without reaching for your phone. Just say the wake word and start talking.",
  },
  {
    emoji: "🛌",
    title: "Activate your bedtime routine",
    description:
      "Trigger your personalized wind-down — dim the lights, start ambient sounds, and open your dream intentions journal — all with one phrase.",
  },
  {
    emoji: "😴",
    title: "Get sleep suggestions",
    description:
      "Ask your assistant for relaxation tips, breathing exercises, or calming music recommendations powered by Dream Log AI.",
  },
  {
    emoji: "📊",
    title: "Check your dream patterns",
    description:
      "Ask how many dreams you logged this week, what themes recurred, or whether your sleep quality is improving.",
  },
];

export default function VoiceAssistantPage() {
  return (
    <div className="min-h-dvh bg-background px-4 py-16">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-bold text-4xl tracking-tight">
            🎙️ Voice Assistant Integration
          </h1>
          <p className="text-muted-foreground text-lg">
            Log dreams, activate routines, and get sleep suggestions — completely
            hands-free with Siri, Alexa, and Google Assistant.
          </p>
        </div>

        {/* Use Cases */}
        <section className="mb-14">
          <h2 className="mb-6 font-semibold text-2xl">What you can do</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {useCases.map((uc) => (
              <div
                className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
                key={uc.title}
              >
                <span className="mt-0.5 text-2xl shrink-0">{uc.emoji}</span>
                <div>
                  <h3 className="font-semibold">{uc.title}</h3>
                  <p className="mt-1 text-muted-foreground text-sm">
                    {uc.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Assistant Guides */}
        <section>
          <h2 className="mb-6 font-semibold text-2xl">Setup Guides</h2>
          <div className="space-y-8">
            {assistants.map((assistant) => (
              <div
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
                key={assistant.name}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-3xl">{assistant.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{assistant.name}</h3>
                    <p className="text-muted-foreground text-xs">
                      {assistant.platform}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Commands */}
                  <div>
                    <h4 className="mb-2 font-medium text-sm">
                      Example commands
                    </h4>
                    <ul className="space-y-1.5">
                      {assistant.commands.map((cmd) => (
                        <li
                          className="rounded-lg bg-muted px-3 py-1.5 font-mono text-muted-foreground text-xs"
                          key={cmd}
                        >
                          {cmd}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Setup Steps */}
                  <div>
                    <h4 className="mb-2 font-medium text-sm">
                      How to set up
                    </h4>
                    <ol className="space-y-1.5 text-sm">
                      {assistant.setup.map((step, i) => (
                        <li
                          className="flex gap-2 text-muted-foreground"
                          key={step}
                        >
                          <span className="font-medium text-foreground shrink-0">
                            {i + 1}.
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                    <p className="mt-3 rounded-lg bg-primary/5 p-2.5 text-muted-foreground text-xs">
                      💡 {assistant.note}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coming Soon Notice */}
        <div className="mt-10 rounded-xl border border-primary/30 bg-primary/5 p-5 text-sm">
          <p className="font-semibold text-primary">
            🚧 Native app integrations coming soon
          </p>
          <p className="mt-1 text-muted-foreground">
            Voice assistant skills and shortcuts require the Dream Log native
            app. Sign up to be notified when iOS and Android apps launch.
          </p>
        </div>
      </div>
    </div>
  );
}
