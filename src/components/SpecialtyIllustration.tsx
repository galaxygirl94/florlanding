/**
 * Specialty-specific illustrated SVG fallbacks — full-bleed 360×160.
 * No text labels. Each specialty gets a detailed, recognisable visual.
 */

const C = "#8B8FD4";          // periwinkle
const C2 = "rgba(139,143,212,0.15)";
const C3 = "rgba(139,143,212,0.08)";

export default function SpecialtyIllustration({
  specialty = "",
  className = "",
}: {
  specialty?: string;
  className?: string;
}) {
  const s = specialty.toLowerCase();

  // ICU / Critical Care — heart-rate waveform with grid lines
  if (s.includes("icu") || s.includes("critical") || s.includes("intensive") || s.includes("respiratory")) {
    return (
      <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="360" height="160" fill={C3} />
        {/* grid lines */}
        {[40, 80, 120].map((y) => (
          <line key={y} x1="0" y1={y} x2="360" y2={y} stroke={C} strokeWidth="0.5" opacity="0.12" />
        ))}
        {[60, 120, 180, 240, 300].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="160" stroke={C} strokeWidth="0.5" opacity="0.12" />
        ))}
        {/* waveform */}
        <polyline
          points="0,80 60,80 90,80 110,35 125,130 140,55 155,80 200,80 230,80 250,30 265,135 280,60 295,80 360,80"
          stroke={C} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"
        />
        <circle cx="200" cy="80" r="4" fill={C} opacity="0.5" />
        <circle cx="200" cy="80" r="10" fill="none" stroke={C} strokeWidth="1" opacity="0.2" />
      </svg>
    );
  }

  // Pediatrics — floating bubbles / circles constellation
  if (s.includes("pedi") || s.includes("child") || s.includes("infant") || s.includes("peds") || s.includes("nicu")) {
    const bubbles = [
      { cx: 180, cy: 55, r: 22 },
      { cx: 120, cy: 75, r: 14 },
      { cx: 250, cy: 70, r: 16 },
      { cx: 155, cy: 105, r: 10 },
      { cx: 220, cy: 100, r: 12 },
      { cx: 90, cy: 50, r: 8 },
      { cx: 280, cy: 45, r: 9 },
      { cx: 300, cy: 95, r: 7 },
      { cx: 70, cy: 100, r: 6 },
    ];
    return (
      <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="360" height="160" fill={C3} />
        {bubbles.map((b, i) => (
          <g key={i}>
            <circle cx={b.cx} cy={b.cy} r={b.r} fill={C} opacity={i < 3 ? 0.18 : 0.1} />
            <circle cx={b.cx} cy={b.cy} r={b.r} fill="none" stroke={C} strokeWidth="1.5" opacity={0.3 - i * 0.02} />
          </g>
        ))}
        {/* star sparkle */}
        <circle cx="180" cy="55" r="6" fill={C} opacity="0.45" />
      </svg>
    );
  }

  // Med-Surg / Telemetry — large cross with circle halo
  if (s.includes("med") || s.includes("surg") || s.includes("surgical") || s.includes("tele")) {
    return (
      <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="360" height="160" fill={C3} />
        <circle cx="180" cy="80" r="50" fill="none" stroke={C} strokeWidth="1" opacity="0.15" />
        <circle cx="180" cy="80" r="35" fill="none" stroke={C} strokeWidth="1" opacity="0.1" />
        <line x1="180" y1="45" x2="180" y2="115" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.55" />
        <line x1="145" y1="80" x2="215" y2="80" stroke={C} strokeWidth="3.5" strokeLinecap="round" opacity="0.55" />
      </svg>
    );
  }

  // ER / Emergency — lightning bolt with glow rings
  if (s.includes("er") || s.includes("emergency") || s.includes("trauma") || s.includes("ed")) {
    return (
      <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="360" height="160" fill={C3} />
        {/* glow rings */}
        <circle cx="180" cy="80" r="55" fill="none" stroke={C} strokeWidth="1" opacity="0.1" />
        <circle cx="180" cy="80" r="40" fill="none" stroke={C} strokeWidth="1.5" opacity="0.15" />
        <circle cx="180" cy="80" r="25" fill={C} opacity="0.06" />
        {/* lightning bolt */}
        <polygon
          points="200,22 168,72 188,72 162,138 210,68 186,68 215,22"
          fill={C} opacity="0.55"
        />
      </svg>
    );
  }

  // Oncology — ribbon / awareness symbol
  if (s.includes("onco") || s.includes("cancer") || s.includes("hematology")) {
    return (
      <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="360" height="160" fill={C3} />
        <path
          d="M180 30 C180 30 145 55 145 80 C145 98 160 110 180 110 C200 110 215 98 215 80 C215 55 180 30 180 30Z"
          stroke={C} strokeWidth="2" fill="none" opacity="0.5"
        />
        <path
          d="M180 30 C180 30 145 55 145 80 C145 98 160 110 180 110 C200 110 215 98 215 80 C215 55 180 30 180 30Z"
          fill={C} opacity="0.08"
        />
        <path d="M168 108 L152 140 M192 108 L208 140" stroke={C} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
        <circle cx="180" cy="75" r="8" fill={C} opacity="0.2" />
      </svg>
    );
  }

  // L&D / OB / Maternal — nested circles (mother/child)
  if (s.includes("labor") || s.includes("delivery") || s.includes("ob") || s.includes("maternal") || s.includes("l&d")) {
    return (
      <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="360" height="160" fill={C3} />
        <circle cx="180" cy="75" r="42" stroke={C} strokeWidth="2" fill={C2} opacity="0.8" />
        <circle cx="180" cy="68" r="18" fill={C} opacity="0.35" />
        <circle cx="180" cy="68" r="28" fill="none" stroke={C} strokeWidth="1" opacity="0.2" />
        <circle cx="190" cy="95" r="8" fill={C} opacity="0.2" />
      </svg>
    );
  }

  // Psych / Behavioral Health — brain-like curves with heart
  if (s.includes("psych") || s.includes("behavioral") || s.includes("mental")) {
    return (
      <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="360" height="160" fill={C3} />
        <circle cx="180" cy="72" r="38" fill="none" stroke={C} strokeWidth="1.5" opacity="0.25" />
        <circle cx="180" cy="72" r="50" fill="none" stroke={C} strokeWidth="1" opacity="0.12" />
        {/* brain halves */}
        <path d="M180 40 C160 40 150 55 150 72 C150 92 165 105 180 105" stroke={C} strokeWidth="2" fill="none" opacity="0.4" />
        <path d="M180 40 C200 40 210 55 210 72 C210 92 195 105 180 105" stroke={C} strokeWidth="2" fill="none" opacity="0.4" />
        {/* heart centre */}
        <path d="M172 68 C172 62 180 59 180 68 C180 59 188 62 188 68 C188 78 180 84 180 84 C180 84 172 78 172 68Z" fill={C} opacity="0.4" />
      </svg>
    );
  }

  // Home Health / Hospice — house outline with warmth
  if (s.includes("home") || s.includes("hospice") || s.includes("palliative")) {
    return (
      <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="360" height="160" fill={C3} />
        <path
          d="M180 30 L120 72 L128 72 L128 120 L160 120 L160 95 L200 95 L200 120 L232 120 L232 72 L240 72Z"
          stroke={C} strokeWidth="2.5" fill="none" strokeLinejoin="round" opacity="0.45"
        />
        <path
          d="M180 30 L120 72 L128 72 L128 120 L160 120 L160 95 L200 95 L200 120 L232 120 L232 72 L240 72Z"
          fill={C} opacity="0.06"
        />
        {/* window */}
        <rect x="170" y="76" width="20" height="16" rx="2" fill={C} opacity="0.2" />
      </svg>
    );
  }

  // School Nurse — graduation cap
  if (s.includes("school")) {
    return (
      <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="360" height="160" fill={C3} />
        <path d="M180 35 L110 65 L180 95 L250 65 Z" stroke={C} strokeWidth="2" fill={C} opacity="0.12" />
        <path d="M180 35 L110 65 L180 95 L250 65 Z" stroke={C} strokeWidth="2" fill="none" opacity="0.4" />
        <line x1="250" y1="65" x2="250" y2="105" stroke={C} strokeWidth="2" opacity="0.3" />
        <path d="M135 76 L135 108 Q180 128 225 108 L225 76" stroke={C} strokeWidth="1.5" fill="none" opacity="0.25" />
        <circle cx="250" cy="108" r="3" fill={C} opacity="0.3" />
      </svg>
    );
  }

  // Rehab — figure in motion
  if (s.includes("rehab")) {
    return (
      <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="360" height="160" fill={C3} />
        <circle cx="180" cy="35" r="12" stroke={C} strokeWidth="2" fill="none" opacity="0.4" />
        <path d="M155 90 Q170 55 180 72 Q190 55 205 90" stroke={C} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.45" />
        <line x1="155" y1="90" x2="145" y2="125" stroke={C} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        <line x1="205" y1="90" x2="215" y2="125" stroke={C} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        {/* motion arcs */}
        <path d="M230 50 Q240 80 230 110" stroke={C} strokeWidth="1" fill="none" opacity="0.15" />
        <path d="M245 55 Q252 80 245 105" stroke={C} strokeWidth="1" fill="none" opacity="0.1" />
      </svg>
    );
  }

  // OR / Perioperative — surgical light
  if (s.includes("or") || s.includes("periop") || s.includes("operating")) {
    return (
      <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="360" height="160" fill={C3} />
        {/* overhead light */}
        <line x1="180" y1="0" x2="180" y2="35" stroke={C} strokeWidth="2" opacity="0.3" />
        <circle cx="180" cy="50" r="22" fill="none" stroke={C} strokeWidth="1.5" opacity="0.3" />
        <circle cx="180" cy="50" r="10" fill={C} opacity="0.15" />
        {/* light rays */}
        <line x1="180" y1="72" x2="140" y2="130" stroke={C} strokeWidth="1" opacity="0.12" />
        <line x1="180" y1="72" x2="220" y2="130" stroke={C} strokeWidth="1" opacity="0.12" />
        <line x1="180" y1="72" x2="180" y2="135" stroke={C} strokeWidth="1" opacity="0.12" />
        {/* table */}
        <ellipse cx="180" cy="120" rx="45" ry="10" fill="none" stroke={C} strokeWidth="1.5" opacity="0.2" />
      </svg>
    );
  }

  // Default — stethoscope
  return (
    <svg viewBox="0 0 360 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="360" height="160" fill={C3} />
      <path
        d="M145 35 C145 35 138 65 142 82 C148 105 180 114 180 114 C180 114 212 105 218 82 C222 65 215 35 215 35"
        stroke={C} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.45"
      />
      <circle cx="180" cy="120" r="14" stroke={C} strokeWidth="2" fill="none" opacity="0.35" />
      <circle cx="180" cy="120" r="5" fill={C} opacity="0.2" />
      <line x1="145" y1="35" x2="135" y2="25" stroke={C} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      <line x1="215" y1="35" x2="225" y2="25" stroke={C} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      <circle cx="135" cy="25" r="4" fill={C} opacity="0.25" />
      <circle cx="225" cy="25" r="4" fill={C} opacity="0.25" />
    </svg>
  );
}
