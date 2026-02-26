/**
 * Minimal i18n utility for Dream Log App.
 * Supports English (en) and Spanish (es) out of the box.
 * Add new locales by extending the `translations` map.
 */

export type Locale = "en" | "es" | "fr" | "de" | "ja" | "zh";

export type TranslationKey =
  | "greeting"
  | "greeting_sub"
  | "dashboard_title"
  | "streak_current"
  | "streak_best"
  | "total_logs"
  | "lucid_dreams"
  | "sleep_metrics"
  | "avg_sleep_duration"
  | "avg_quality"
  | "synced_records"
  | "achievements"
  | "no_badges"
  | "log_first_dream"
  | "reality_check_title"
  | "reality_check_body";

type Translations = Record<TranslationKey, string>;

const translations: Record<Locale, Translations> = {
  en: {
    greeting: "Hello there!",
    greeting_sub: "How can I help you today?",
    dashboard_title: "Dream Dashboard",
    streak_current: "Current Streak",
    streak_best: "Best Streak",
    total_logs: "Total Logs",
    lucid_dreams: "Lucid Dreams",
    sleep_metrics: "Sleep Metrics",
    avg_sleep_duration: "Avg Sleep Duration",
    avg_quality: "Avg Quality Score",
    synced_records: "Synced Records",
    achievements: "Achievements",
    no_badges: "No badges yet",
    log_first_dream: "Log your first dream to earn one!",
    reality_check_title: "Reality Check Reminder",
    reality_check_body:
      "Ask yourself: Am I dreaming? Look at your hands and try to push a finger through your palm.",
  },
  es: {
    greeting: "¡Hola!",
    greeting_sub: "¿Cómo puedo ayudarte hoy?",
    dashboard_title: "Panel de Sueños",
    streak_current: "Racha Actual",
    streak_best: "Mejor Racha",
    total_logs: "Total de Registros",
    lucid_dreams: "Sueños Lúcidos",
    sleep_metrics: "Métricas de Sueño",
    avg_sleep_duration: "Duración Media",
    avg_quality: "Calidad Media",
    synced_records: "Registros Sincronizados",
    achievements: "Logros",
    no_badges: "Aún no hay insignias",
    log_first_dream: "¡Registra tu primer sueño para ganar una!",
    reality_check_title: "Recordatorio de Verificación de Realidad",
    reality_check_body:
      "Pregúntate: ¿Estoy soñando? Mira tus manos e intenta pasar un dedo por tu palma.",
  },
  fr: {
    greeting: "Bonjour !",
    greeting_sub: "Comment puis-je vous aider aujourd'hui ?",
    dashboard_title: "Tableau de Bord des Rêves",
    streak_current: "Série Actuelle",
    streak_best: "Meilleure Série",
    total_logs: "Total des Journaux",
    lucid_dreams: "Rêves Lucides",
    sleep_metrics: "Métriques de Sommeil",
    avg_sleep_duration: "Durée Moyenne",
    avg_quality: "Qualité Moyenne",
    synced_records: "Enregistrements Synchronisés",
    achievements: "Réalisations",
    no_badges: "Pas encore de badges",
    log_first_dream: "Enregistrez votre premier rêve pour en gagner un !",
    reality_check_title: "Rappel de Vérification de Réalité",
    reality_check_body:
      "Demandez-vous : Est-ce que je rêve ? Regardez vos mains et essayez de passer un doigt dans votre paume.",
  },
  de: {
    greeting: "Hallo!",
    greeting_sub: "Wie kann ich Ihnen heute helfen?",
    dashboard_title: "Traum-Dashboard",
    streak_current: "Aktuelle Serie",
    streak_best: "Beste Serie",
    total_logs: "Gesamteinträge",
    lucid_dreams: "Luzide Träume",
    sleep_metrics: "Schlaf-Metriken",
    avg_sleep_duration: "Durchschnittliche Schlafdauer",
    avg_quality: "Durchschnittliche Qualität",
    synced_records: "Synchronisierte Einträge",
    achievements: "Errungenschaften",
    no_badges: "Noch keine Abzeichen",
    log_first_dream: "Erfasse deinen ersten Traum, um eines zu verdienen!",
    reality_check_title: "Realitätsprüfungs-Erinnerung",
    reality_check_body:
      "Frag dich: Träume ich gerade? Schau auf deine Hände und versuche, einen Finger durch deine Handfläche zu drücken.",
  },
  ja: {
    greeting: "こんにちは！",
    greeting_sub: "今日はどのようにお手伝いできますか？",
    dashboard_title: "夢のダッシュボード",
    streak_current: "現在の連続記録",
    streak_best: "最高連続記録",
    total_logs: "合計ログ数",
    lucid_dreams: "明晰夢",
    sleep_metrics: "睡眠指標",
    avg_sleep_duration: "平均睡眠時間",
    avg_quality: "平均品質スコア",
    synced_records: "同期済みレコード",
    achievements: "実績",
    no_badges: "まだバッジがありません",
    log_first_dream: "最初の夢を記録してバッジを獲得しましょう！",
    reality_check_title: "現実確認のリマインダー",
    reality_check_body:
      "自分に問いかけてください：今夢を見ていますか？手を見て、指を手のひらに押し込もうとしてみてください。",
  },
  zh: {
    greeting: "你好！",
    greeting_sub: "今天有什么可以帮助您的吗？",
    dashboard_title: "梦境仪表板",
    streak_current: "当前连续记录",
    streak_best: "最佳连续记录",
    total_logs: "总日志数",
    lucid_dreams: "清醒梦",
    sleep_metrics: "睡眠指标",
    avg_sleep_duration: "平均睡眠时长",
    avg_quality: "平均质量分数",
    synced_records: "已同步记录",
    achievements: "成就",
    no_badges: "暂无徽章",
    log_first_dream: "记录您的第一个梦境以获得徽章！",
    reality_check_title: "现实检验提醒",
    reality_check_body:
      "问问自己：我在做梦吗？看看你的手，尝试把手指穿过手掌。",
  },
};

/**
 * Translate a key for the given locale.
 * Falls back to English if the locale or key is not found.
 */
export function t(key: TranslationKey, locale: Locale = "en"): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}

/**
 * Detect the best locale from an Accept-Language header value or browser locale string.
 * Returns one of the supported locales, defaulting to "en".
 */
export function detectLocale(acceptLanguage?: string | null): Locale {
  if (!acceptLanguage) return "en";

  const supported: Locale[] = ["en", "es", "fr", "de", "ja", "zh"];
  const candidates = acceptLanguage
    .split(",")
    .map((s) => s.split(";")[0].trim().toLowerCase().slice(0, 2));

  for (const candidate of candidates) {
    if (supported.includes(candidate as Locale)) {
      return candidate as Locale;
    }
  }

  return "en";
}
