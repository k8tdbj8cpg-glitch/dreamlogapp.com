import { tool } from "ai";
import { z } from "zod";

const REALITY_CHECKS = [
  {
    name: "Hand Check",
    instruction:
      "Look at your hands carefully. In dreams, hands often appear distorted, with too many or too few fingers. Count your fingers — if you count more or fewer than five, you may be dreaming.",
  },
  {
    name: "Text Check",
    instruction:
      "Find any text nearby (a sign, a book, a phone screen) and read it. Look away, then look again. In dreams, text tends to shift and change between glances. If the text changed, you might be dreaming.",
  },
  {
    name: "Nose Pinch",
    instruction:
      "Pinch your nose closed and try to breathe through it. In waking life you cannot breathe through a pinched nose. In a dream you usually can — so if you can breathe, you are dreaming.",
  },
  {
    name: "Light Switch",
    instruction:
      "Find a light switch and flip it. In dreams, light switches often fail to change the lighting level. If the light does not change when you flip the switch, you may be dreaming.",
  },
  {
    name: "Mirror Check",
    instruction:
      "Look at yourself in a mirror. In dreams reflections are often blurry, distorted, or show someone else entirely. If your reflection looks wrong, you may be in a dream.",
  },
  {
    name: "Jumping",
    instruction:
      "Jump up and notice what happens. In waking life you land immediately. In a dream you may float, rise slowly, or jump higher than normal. If gravity feels different, you may be dreaming.",
  },
];

const DREAM_JOURNAL_RITUALS = [
  {
    name: "Morning Pages",
    instruction:
      "Immediately upon waking — before checking your phone or getting up — write down everything you remember from your dreams. Even fragments, emotions, or colors count. Aim for at least three sentences.",
  },
  {
    name: "Bedtime Intention Setting",
    instruction:
      "Before falling asleep, repeat the phrase 'I will remember my dreams tonight' to yourself ten times. Visualize yourself waking up and writing in your dream journal. This primes your subconscious.",
  },
  {
    name: "WBTB (Wake Back to Bed)",
    instruction:
      "Set an alarm for 5–6 hours after you fall asleep. Wake up, stay awake for 20–30 minutes while reading about lucid dreaming, then go back to sleep with the intention to become lucid. This technique leverages REM rebound.",
  },
  {
    name: "MILD (Mnemonic Induction of Lucid Dreams)",
    instruction:
      "As you fall asleep, recall a recent dream and identify a dream sign (something unusual). Tell yourself: 'Next time I see [dream sign], I will realise I am dreaming.' Repeat until you fall asleep.",
  },
];

/**
 * AI tool: getLucidDreamExercise
 * Returns a reality-check technique or dream-journaling ritual to help the user
 * develop lucid dreaming skills. Optionally accepts a preferred technique type.
 */
export const getLucidDreamExercise = tool({
  description:
    "Provide a lucid dream training exercise or reality-check technique to help the user develop awareness in dreams. Returns a step-by-step exercise with instructions.",
  inputSchema: z.object({
    type: z
      .enum(["reality_check", "journal_ritual", "any"])
      .default("any")
      .describe(
        "Type of exercise to return: 'reality_check' for in-dream awareness tests, 'journal_ritual' for journaling/sleep rituals, or 'any' for a random selection."
      ),
    specific: z
      .string()
      .optional()
      .describe(
        "Optional: name of a specific technique (e.g. 'Hand Check', 'WILD', 'MILD')."
      ),
  }),
  execute: async ({ type, specific }) => {
    const allExercises = [
      ...REALITY_CHECKS.map((e) => ({ ...e, category: "reality_check" as const })),
      ...DREAM_JOURNAL_RITUALS.map((e) => ({
        ...e,
        category: "journal_ritual" as const,
      })),
    ];

    // If a specific exercise is requested, try to find it
    if (specific) {
      const found = allExercises.find((e) =>
        e.name.toLowerCase().includes(specific.toLowerCase())
      );
      if (found) {
        return {
          exercise: found,
          tip: "Practice this technique consistently for at least two weeks to see results.",
        };
      }
    }

    let pool =
      type === "any"
        ? allExercises
        : allExercises.filter((e) => e.category === type);

    if (pool.length === 0) pool = allExercises;

    const exercise = pool[Math.floor(Math.random() * pool.length)];

    return {
      exercise,
      tip: "Consistency is key — perform reality checks at least 10 times per day to build the habit into your dreams.",
    };
  },
});
