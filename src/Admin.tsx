import React, { useEffect, useRef, useState } from 'react';
import {
  GUEST_PREFIXES,
  SINHALA_GUEST_SUFFIXES,
  NO_PREFIX,
  type GuestPrefix,
  COUPLE_NAMES,
  buildGuestLink,
  buildInvitationMessage,
  formatDisplayName,
} from './invitation';

interface Generated {
  displayName: string;
  link: string;
  message: string;
}

export default function Admin() {
  const [prefix, setPrefix] = useState<GuestPrefix>('Mr.');
  const [guestName, setGuestName] = useState('');
  const [generated, setGenerated] = useState<Generated | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  // Editing the inputs invalidates the last link, so it can't be copied stale.
  const updatePrefix = (value: GuestPrefix) => {
    setPrefix(value);
    setGenerated(null);
  };
  const updateGuestName = (value: string) => {
    setGuestName(value);
    setGenerated(null);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = formatDisplayName(prefix, guestName);
    if (!displayName) return;
    const link = buildGuestLink(window.location.origin, prefix, guestName);
    setGenerated({ displayName, link, message: buildInvitationMessage(displayName, link) });
  };

  const showToast = (text: string) => {
    setToast(text);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2000);
  };

  const copy = async (text: string, successText: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successText);
    } catch (err) {
      console.error('Failed to copy', err);
      showToast('පිටපත් කිරීම අසාර්ථකයි');
    }
  };

  const previewName = formatDisplayName(prefix, guestName);

  return (
    // body has overflow: hidden (the invitation scrolls its own container), so this page does too.
    <div className="h-[100dvh] overflow-y-auto bg-[#f5ecd9] py-10 md:py-14 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#5c3a1e]">ආරාධනා සබැඳි සාදන්න</h1>
          <p className="text-base text-[#7a5c1e]">
            {COUPLE_NAMES} · Invitation Link Generator
          </p>
        </header>

        <form
          onSubmit={handleGenerate}
          className="bg-white rounded-2xl border border-[#a8832f]/30 shadow-[0_20px_50px_-25px_rgba(90,66,20,0.35)] p-6 md:p-8 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label htmlFor="prefix" className="text-sm font-bold text-[#5c3a1e]">Select Prefix</label>
              <select
                id="prefix"
                value={prefix}
                onChange={(e) => updatePrefix(e.target.value as GuestPrefix)}
                className="w-full bg-[#fbf6ec] border border-[#a8832f]/30 rounded-xl px-4 py-3 text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#a8832f]/30 focus:border-[#a8832f]"
              >
                <option value={NO_PREFIX}>{NO_PREFIX} (නම පමණයි)</option>
                <optgroup label="English (නමට පෙර)">
                  {GUEST_PREFIXES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </optgroup>
                <optgroup label="සිංහල (නමට පසු)">
                  {SINHALA_GUEST_SUFFIXES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="guestName" className="text-sm font-bold text-[#5c3a1e]">Guest Name</label>
              <input
                id="guestName"
                type="text"
                placeholder="e.g. Sanjaya"
                value={guestName}
                onChange={(e) => updateGuestName(e.target.value)}
                className="w-full bg-[#fbf6ec] border border-[#a8832f]/30 rounded-xl px-4 py-3 text-[#1a1a1a] placeholder:text-[#a8832f]/60 focus:outline-none focus:ring-2 focus:ring-[#a8832f]/30 focus:border-[#a8832f]"
                required
              />
            </div>
          </div>

          {previewName && (
            <p className="text-base text-[#333333]">
              ආරාධනාව: <span className="font-bold text-[#5c3a1e]">ආදරණීය {previewName} 🤎</span>
            </p>
          )}

          <button
            type="submit"
            disabled={!previewName}
            className="w-full bg-[#7a5c1e] hover:bg-[#5a4214] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Link
          </button>
        </form>

        <section className="bg-white rounded-2xl border border-[#a8832f]/30 shadow-[0_20px_50px_-25px_rgba(90,66,20,0.35)] p-6 md:p-8 space-y-5">
          <div className="space-y-2">
            <div className="text-sm font-bold text-[#5c3a1e]">Generated Link</div>
            {generated ? (
              <a
                href={generated.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block break-all rounded-xl bg-[#fbf6ec] border border-[#a8832f]/30 px-4 py-3 text-[#7a5c1e] font-bold hover:underline"
              >
                {generated.link}
              </a>
            ) : (
              <p className="rounded-xl bg-[#fbf6ec] border border-dashed border-[#a8832f]/40 px-4 py-3 text-[#444444]">
                Generate Link ඔබන්න.
              </p>
            )}
          </div>

          {generated && (
            <div className="space-y-2">
              <div className="text-sm font-bold text-[#5c3a1e]">පණිවිඩයේ පෙරදසුන</div>
              <pre className="whitespace-pre-wrap break-words rounded-xl bg-[#fbf6ec] border border-[#a8832f]/30 px-4 py-4 text-base leading-relaxed text-[#1a1a1a] font-[inherit]">
                {generated.message}
              </pre>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && copy(generated.link, 'Link copied!')}
              className="py-3 rounded-xl border border-[#a8832f]/50 text-[#5c3a1e] font-bold hover:bg-[#fbf6ec] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Copy Link Only
            </button>
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && copy(generated.message, 'Message copied!')}
              className="py-3 rounded-xl bg-[#a8832f] hover:bg-[#7a5c1e] text-white font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Copy Full Message
            </button>
          </div>
        </section>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-[#5c3a1e] text-[#f5ecd9] px-5 py-2.5 text-sm font-bold shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
