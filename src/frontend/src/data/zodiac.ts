export const ZODIAC_SIGNS = [
  { symbol: "♈", english: "Aries", telugu: "మేషం" },
  { symbol: "♉", english: "Taurus", telugu: "వృషభం" },
  { symbol: "♊", english: "Gemini", telugu: "మిథునం" },
  { symbol: "♋", english: "Cancer", telugu: "కర్కాటకం" },
  { symbol: "♌", english: "Leo", telugu: "సింహం" },
  { symbol: "♍", english: "Virgo", telugu: "కన్య" },
  { symbol: "♎", english: "Libra", telugu: "తుల" },
  { symbol: "♏", english: "Scorpio", telugu: "వృశ్చికం" },
  { symbol: "♐", english: "Sagittarius", telugu: "ధనుస్సు" },
  { symbol: "♑", english: "Capricorn", telugu: "మకరం" },
  { symbol: "♒", english: "Aquarius", telugu: "కుంభం" },
  { symbol: "♓", english: "Pisces", telugu: "మీనం" },
];

export const QUOTES = [
  "విజయం సాధించాలంటే ముందు ప్రయత్నం చేయాలి.",
  "Hard work beats talent when talent doesn't work hard.",
  "చదువు జ్ఞానానికి తాళం చెవి.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "నేడు చదివితే రేపు విజయం నీదే.",
  "Believe in yourself and all that you are.",
  "ప్రతి పరీక్ష ఒక అవకాశం — దాన్ని సద్వినియోగం చేసుకో.",
  "The secret of getting ahead is getting started.",
  "జ్ఞానమే శక్తి, చదువే బలం.",
  "Don't watch the clock; do what it does. Keep going.",
];

export const PREDICTIONS = [
  [
    "Today brings positive energy for learning.",
    "Focus on studies and avoid distractions.",
    "A helpful person will guide you forward.",
    "Trust your instincts and stay confident.",
  ],
  [
    "Your hard work will pay off today.",
    "Good day to review difficult topics.",
    "Family support strengthens your resolve.",
    "Stay calm during challenges ahead.",
  ],
  [
    "New opportunities are coming your way.",
    "Share your knowledge with others today.",
    "Patience will bring great rewards.",
    "Your dedication shines brightly today.",
  ],
  [
    "Morning study sessions will be productive.",
    "Take short breaks to refresh your mind.",
    "Positive results are just around the corner.",
    "Keep your goals clear and focused.",
  ],
  [
    "Today is ideal for tackling tough subjects.",
    "Your memory is sharp and clear today.",
    "A mentor's advice will prove valuable.",
    "End the day with gratitude and hope.",
  ],
];

export function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function getPredictionForSign(signIndex: number): string[] {
  const day = getDayOfYear();
  const idx = (signIndex + day) % PREDICTIONS.length;
  return PREDICTIONS[idx];
}

export function getDefaultQuote(signIndex: number): string {
  const day = getDayOfYear();
  const idx = (signIndex + day) % QUOTES.length;
  return QUOTES[idx];
}

export function getDefaultRatings(signIndex: number): {
  luck: number;
  happiness: number;
  love: number;
  good: number;
  overall: number;
} {
  const day = getDayOfYear();
  const seed = signIndex * 7 + day;
  return {
    luck: ((seed * 3 + 1) % 5) + 1,
    happiness: ((seed * 5 + 2) % 5) + 1,
    love: ((seed * 7 + 3) % 5) + 1,
    good: ((seed * 11 + 4) % 5) + 1,
    overall: ((seed * 13 + 5) % 5) + 1,
  };
}
