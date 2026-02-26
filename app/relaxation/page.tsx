import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Relaxation & Sleep Routines – Dream Log App",
  description:
    "Ambient sounds, calming music, lighting suggestions, and smart bedtime routines to help you unwind and sleep better.",
};

const ambientSounds = [
  {
    name: "Waterfall",
    emoji: "💧",
    description: "Gentle cascading waterfall sounds for deep relaxation.",
    url: "https://www.youtube.com/results?search_query=waterfall+ambient+sounds",
  },
  {
    name: "Rain on Leaves",
    emoji: "🌿",
    description: "Soft rain falling on forest leaves.",
    url: "https://www.youtube.com/results?search_query=rain+on+leaves+sleep",
  },
  {
    name: "Ocean Waves",
    emoji: "🌊",
    description: "Slow, rhythmic waves lapping at the shore.",
    url: "https://www.youtube.com/results?search_query=ocean+waves+sleep+sounds",
  },
  {
    name: "White Noise",
    emoji: "🔇",
    description: "Consistent white noise to mask distractions.",
    url: "https://www.youtube.com/results?search_query=white+noise+sleep",
  },
  {
    name: "Thunderstorm",
    emoji: "⛈️",
    description: "Distant thunder with steady rainfall.",
    url: "https://www.youtube.com/results?search_query=thunderstorm+sleep+sounds",
  },
  {
    name: "Campfire",
    emoji: "🔥",
    description: "Crackling fire for a cozy, grounding atmosphere.",
    url: "https://www.youtube.com/results?search_query=campfire+sounds+sleep",
  },
];

const lightingModes = [
  {
    mode: "Bedtime Wind-Down",
    emoji: "🌙",
    temperature: "2200 K (warm amber)",
    brightness: "10–20%",
    description:
      "Signal to your body that sleep is near. Dim, warm amber light mimics sunset and stimulates melatonin production.",
    hueScene: "Relax",
  },
  {
    mode: "Deep Relaxation",
    emoji: "🕯️",
    temperature: "2700 K (warm white)",
    brightness: "5–15%",
    description:
      "Very dim candlelight-style glow for meditation or guided breathing exercises.",
    hueScene: "Dimmed",
  },
  {
    mode: "Morning Wake-Up",
    emoji: "🌅",
    temperature: "4000–5000 K (cool white)",
    brightness: "60–100%",
    description:
      "Bright, cool light simulates sunrise and helps reset your circadian rhythm.",
    hueScene: "Energize",
  },
  {
    mode: "Dream Journaling",
    emoji: "📓",
    temperature: "3000 K (soft white)",
    brightness: "30–40%",
    description:
      "Comfortable reading light—bright enough to write, soft enough not to fully wake you.",
    hueScene: "Read",
  },
];

const routines = [
  {
    name: "60-Minute Wind-Down",
    emoji: "⏱️",
    steps: [
      "T-60 min: Switch lights to Bedtime Wind-Down mode",
      "T-45 min: Play Waterfall or Rain ambient sounds",
      "T-30 min: Begin 4-7-8 breathing exercise (4s inhale, 7s hold, 8s exhale)",
      "T-15 min: Open Dream Log and jot any fragments from the day",
      "T-0 min: Lights off, sounds on low — drift to sleep",
    ],
  },
  {
    name: "Quick 15-Minute Routine",
    emoji: "⚡",
    steps: [
      "T-15 min: Dim lights to 10% warm amber",
      "T-10 min: Start Ocean Waves ambient sound",
      "T-5 min: Three slow deep breaths, then log any dream intentions",
      "T-0 min: Close eyes, let the sound carry you",
    ],
  },
  {
    name: "Morning Dream Capture",
    emoji: "🌄",
    steps: [
      "On wake: Keep eyes closed, mentally review the dream",
      "Step 1: Switch lights to Dream Journaling mode (30%)",
      "Step 2: Open Dream Log App and tap 🎙 to dictate",
      "Step 3: Let the AI prompt you with follow-up questions",
      "Step 4: Review your dream chart for patterns",
    ],
  },
];

export default function RelaxationPage() {
  return (
    <div className="min-h-dvh bg-background px-4 py-16">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 font-bold text-4xl tracking-tight">
            🛌 Relaxation & Sleep Routines
          </h1>
          <p className="text-muted-foreground text-lg">
            Ambient sounds, smart lighting, and bedtime routines to help you
            unwind, sleep deeply, and remember your dreams.
          </p>
        </div>

        {/* Ambient Sounds */}
        <section className="mb-14">
          <h2 className="mb-1 font-semibold text-2xl">Ambient Sounds</h2>
          <p className="mb-6 text-muted-foreground text-sm">
            Research shows natural soundscapes reduce cortisol and prepare the
            mind for deep sleep. Choose a sound below to find curated playlists.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {ambientSounds.map((sound) => (
              <a
                className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                href={sound.url}
                key={sound.name}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="text-3xl">{sound.emoji}</span>
                <span className="font-semibold">{sound.name}</span>
                <span className="text-muted-foreground text-sm">
                  {sound.description}
                </span>
                <span className="mt-auto text-primary text-xs">
                  Find playlists →
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Lighting Suggestions */}
        <section className="mb-14">
          <h2 className="mb-1 font-semibold text-2xl">
            Lighting Suggestions
          </h2>
          <p className="mb-4 text-muted-foreground text-sm">
            Dynamic lighting settings help regulate your circadian rhythm.
            Compatible with Philips Hue and other smart bulbs.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Mode</th>
                  <th className="pb-3 pr-4 font-medium">Temperature</th>
                  <th className="pb-3 pr-4 font-medium">Brightness</th>
                  <th className="pb-3 pr-4 font-medium hidden sm:table-cell">
                    Hue Scene
                  </th>
                  <th className="pb-3 font-medium hidden md:table-cell">
                    Purpose
                  </th>
                </tr>
              </thead>
              <tbody>
                {lightingModes.map((lm) => (
                  <tr
                    className="border-b border-border/50 align-top"
                    key={lm.mode}
                  >
                    <td className="py-3 pr-4 font-medium">
                      {lm.emoji} {lm.mode}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {lm.temperature}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {lm.brightness}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground hidden sm:table-cell">
                      {lm.hueScene}
                    </td>
                    <td className="py-3 text-muted-foreground hidden md:table-cell">
                      {lm.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-muted-foreground text-xs">
            💡 Tip: Use the Philips Hue app or the Hue API to automate these
            scenes with timers — or ask the Dream Log AI to suggest a routine
            tailored to your schedule.
          </p>
        </section>

        {/* Smart Routines */}
        <section>
          <h2 className="mb-1 font-semibold text-2xl">Smart Routines</h2>
          <p className="mb-6 text-muted-foreground text-sm">
            Combine ambient audio and lighting into a seamless bedtime
            experience. Follow a routine below or ask the Dream Log AI to create
            a custom one for you.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {routines.map((routine) => (
              <div
                className="rounded-xl border border-border bg-card p-5 shadow-sm"
                key={routine.name}
              >
                <div className="mb-3 text-2xl">{routine.emoji}</div>
                <h3 className="mb-3 font-semibold">{routine.name}</h3>
                <ol className="space-y-1.5 text-muted-foreground text-sm">
                  {routine.steps.map((step) => (
                    <li className="leading-snug" key={step}>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-5 text-sm">
            <p className="font-semibold text-primary">
              🎙 Ask the AI to build your personal routine
            </p>
            <p className="mt-1 text-muted-foreground">
              Open the Dream Log chat and say:{" "}
              <em>
                &ldquo;Create a 45-minute wind-down routine for me that starts
                at 10 PM&rdquo;
              </em>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
