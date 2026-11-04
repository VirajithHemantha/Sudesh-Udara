export const INVITATION = {
  couple: {
    first: "සුදේශ්",
    second: "උදාරා",
  },
  parents: [
    "එච්.එම්. චන්ද්‍රසිරිල්",
    "ආර්.ඩී. දයාසිංහ",
  ],
  date: {
    displayNumeric: "07 . 12 . 2026",
    displayLong: "වර්ෂ 2026 ක් වූ දෙසැම්බර් මස 07 වන දින",
    countdownTarget: "2026-12-07T10:13:00+05:30",
  },
  time: {
    event: "පෙ.ව. 9.00 සිට ප.ව. 4.00 දක්වා",
    poruwa: "පෝරුව චාරිත්‍රය පෙ.ව. 10.13ට",
  },
  venue: {
    nameSi: "රෝයල් ක්ලැසික් රිසෝට් (නත්තරම්පොත)",
    name: "Royal Classic Resort",
    city: "Nattaranpotha",
    googleMapsLink:
      "https://www.google.com/maps/search/?api=1&query=Royal+Classic+Resort+Nattaranpotha",
  },
  rsvpContacts: [] as string[],
} as const;

export const COUPLE_NAMES = `${INVITATION.couple.first} සහ ${INVITATION.couple.second}`;

/* ---------- Guest prefixes ---------- */

/** English titles, placed before the name. */
export const GUEST_PREFIXES = [
  "Mr. & Mrs.",
  "Mr.",
  "Mrs.",
  "Miss",
  "Ms.",
  "Dr. & Mrs.",
  "Dr.",
  "Prof.",
  "Rev.",
] as const;

/** No title — name only. */
export const NO_PREFIX = "None" as const;

/** Sinhala titles, placed after the name. */
export const SINHALA_GUEST_SUFFIXES = [
  "මහතා",
  "මහත්මිය",
  "මෙනවිය",
  "මහතා සහ මහත්මිය",
  "පවුලේ සැමට",
  "හිමියන්",
] as const;

export type GuestPrefix =
  | (typeof GUEST_PREFIXES)[number]
  | typeof NO_PREFIX
  | (typeof SINHALA_GUEST_SUFFIXES)[number];

// Index table for links. Order is fixed so links already sent keep working:
// only ever append to the end.
const PREFIX_TABLE: readonly GuestPrefix[] = [
  ...GUEST_PREFIXES,
  NO_PREFIX,
  ...SINHALA_GUEST_SUFFIXES,
];

const isSuffix = (p: GuestPrefix) =>
  (SINHALA_GUEST_SUFFIXES as readonly string[]).includes(p);

export function formatDisplayName(prefix: GuestPrefix, name: string): string {
  const n = name.trim().replace(/\s+/g, " ");
  if (!n) return "";
  if (prefix === NO_PREFIX) return n;
  return isSuffix(prefix) ? `${n} ${prefix}` : `${prefix} ${n}`;
}

/* ---------- Link encoding: /i/<base64url(prefixIndex + utf8 name)> ---------- */

const toBase64Url = (bytes: Uint8Array) => {
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const fromBase64Url = (code: string) => {
  const b64 = code.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

export function encodeGuest(prefix: GuestPrefix, name: string): string {
  const idx = Math.max(0, PREFIX_TABLE.indexOf(prefix));
  const nameBytes = new TextEncoder().encode(name.trim().replace(/\s+/g, " "));
  const bytes = new Uint8Array(nameBytes.length + 1);
  bytes[0] = idx;
  bytes.set(nameBytes, 1);
  return toBase64Url(bytes);
}

export function decodeGuest(code: string): string | null {
  try {
    const bytes = fromBase64Url(code);
    if (bytes.length < 2) return null;
    const prefix = PREFIX_TABLE[bytes[0]] ?? NO_PREFIX;
    const name = new TextDecoder("utf-8", { fatal: true }).decode(bytes.slice(1));
    return formatDisplayName(prefix, name) || null;
  } catch {
    return null;
  }
}

export const buildGuestLink = (origin: string, prefix: GuestPrefix, name: string) =>
  `${origin}/i/${encodeGuest(prefix, name)}`;

/** Guest name from /i/<code>, or the older ?to=<name> links. */
export function getGuestNameFromUrl(): string | null {
  const match = window.location.pathname.match(/^\/i\/([A-Za-z0-9_-]+)\/?$/);
  if (match) return decodeGuest(match[1]);
  return new URLSearchParams(window.location.search).get("to");
}

/* ---------- WhatsApp message ---------- */

export const buildInvitationMessage = (displayName: string, link: string) =>
  `✉️✨ විවාහ ආරාධනාවයි ✨✉️

ආදරණීය ${displayName} 🤎

අපගේ ආදරණීය විවාහ දිනයේ සතුටුදායක මොහොත අප සමඟ බෙදාගැනීමට අපි ඔබට ආදරයෙන් ආරාධනා කරමු 🤎🌻

අපගේ විවාහ ආරාධනා පත්‍රය 💍✨
${link}

ආදරයෙන්, 🤎🌻
${COUPLE_NAMES} 💍✨`;

/* ---------- RSVP → Google Sheet ---------- */

/**
 * Apps Script Web App URL for the RSVP sheet (see code.gs).
 * Deploy code.gs as a Web App, then paste its ".../exec" URL here.
 */
export const RSVP_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx_9kkprtqeXatoyHnuV0aTpeAzhQLmgwPoSjuFxVLhiN2EpOOUM9X_EUZg69VQCTE-Jw/exec";
