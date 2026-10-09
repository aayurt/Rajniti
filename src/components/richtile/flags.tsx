// Inline SVG circle flags (reference renders flags as SVG, never emoji).
export type FlagCode = 'br' | 'cn' | 'de' | 'fr' | 'gb' | 'hu' | 'il' | 'us';

export const FLAG_CODES: FlagCode[] = ['br', 'cn', 'de', 'fr', 'gb', 'hu', 'il', 'us'];

const EMOJI_MAP: Record<string, FlagCode> = {
  '🇧🇷': 'br',
  '🇨🇳': 'cn',
  '🇩🇪': 'de',
  '🇫🇷': 'fr',
  '🇬🇧': 'gb',
  '🇭🇺': 'hu',
  '🇮🇱': 'il',
  '🇺🇸': 'us',
};

export function flagCodeFromEmoji(flag: string | undefined): FlagCode | undefined {
  if (!flag) return undefined;
  return EMOJI_MAP[flag];
}

function Circle({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <defs>
        <clipPath id="rich-flag-clip">
          <circle cx="12" cy="12" r="11" />
        </clipPath>
      </defs>
      <g clipPath="url(#rich-flag-clip)">{children}</g>
      <circle cx="12" cy="12" r="11" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    </svg>
  );
}

function Star({ x, y, r }: { x: number; y: number; r: number }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.42;
    return `${(x + rr * Math.cos(a)).toFixed(2)},${(y + rr * Math.sin(a)).toFixed(2)}`;
  }).join(' ');
  return <polygon points={pts} fill="#ffda44" />;
}

const ART: Record<FlagCode, React.ReactNode> = {
  cn: (
    <>
      <rect width="24" height="24" fill="#d80027" />
      <Star x={6} y={6} r={3.4} />
      <Star x={11.5} y={2.8} r={1.2} />
      <Star x={13.5} y={5.5} r={1.2} />
      <Star x={13.5} y={8.8} r={1.2} />
      <Star x={11.5} y={11} r={1.2} />
    </>
  ),
  br: (
    <>
      <rect width="24" height="24" fill="#009b3a" />
      <polygon points="12,3 21,12 12,21 3,12" fill="#fedf00" />
      <circle cx="12" cy="12" r="4" fill="#002776" />
    </>
  ),
  il: (
    <>
      <rect width="24" height="24" fill="#fff" />
      <rect y="4" width="24" height="3.4" fill="#0038b8" />
      <rect y="16.6" width="24" height="3.4" fill="#0038b8" />
      <polygon points="12,7.5 15.9,14.25 8.1,14.25" fill="none" stroke="#0038b8" strokeWidth="1.1" />
      <polygon points="12,16.5 8.1,9.75 15.9,9.75" fill="none" stroke="#0038b8" strokeWidth="1.1" />
    </>
  ),
  hu: (
    <>
      <rect width="24" height="8" fill="#cd2a37" />
      <rect y="8" width="24" height="8" fill="#fff" />
      <rect y="16" width="24" height="8" fill="#436f4d" />
    </>
  ),
  de: (
    <>
      <rect width="24" height="8" fill="#000" />
      <rect y="8" width="24" height="8" fill="#dd0000" />
      <rect y="16" width="24" height="8" fill="#ffce00" />
    </>
  ),
  fr: (
    <>
      <rect width="8" height="24" fill="#0055a4" />
      <rect x="8" width="8" height="24" fill="#fff" />
      <rect x="16" width="8" height="24" fill="#ef4135" />
    </>
  ),
  gb: (
    <>
      <rect width="24" height="24" fill="#012169" />
      <path d="M0,0 L24,24 M24,0 L0,24" stroke="#fff" strokeWidth="4.5" />
      <path d="M0,0 L24,24 M24,0 L0,24" stroke="#C8102E" strokeWidth="1.6" />
      <path d="M12,0 V24 M0,12 H24" stroke="#fff" strokeWidth="7" />
      <path d="M12,0 V24 M0,12 H24" stroke="#C8102E" strokeWidth="4" />
    </>
  ),
  us: (
    <>
      <rect width="24" height="24" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={(i * 24) / 13} width="24" height={24 / 13} fill="#b31942" />
      ))}
      <rect width="11" height={24 * (7 / 13)} fill="#0a3161" />
    </>
  ),
};

export default function Flag({ code }: { code: FlagCode }) {
  return (
    <span data-flag-wrap={code} style={{ display: 'block', width: '100%', height: '100%' }}>
      <svg viewBox="0 0 24 24" width="100%" height="100%" data-flag={code} aria-hidden="true">
        <defs>
          <clipPath id={`rich-flag-${code}`}>
            <circle cx="12" cy="12" r="11" />
          </clipPath>
        </defs>
        <g clipPath={`url(#rich-flag-${code})`}>{ART[code]}</g>
        <circle cx="12" cy="12" r="11" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      </svg>
    </span>
  );
}

// Re-export for tests that only need the svg node shape.
export { Circle };
