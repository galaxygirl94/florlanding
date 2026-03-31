/**
 * Specialty-specific illustrated SVG fallbacks — full-bleed 360×160.
 * No text labels. Each specialty gets a detailed, recognisable visual.
 */

export default function SpecialtyIllustration({
  specialty = "",
  className = "",
  color = "#8B8FD4",
}: {
  specialty?: string;
  className?: string;
  color?: string;
}) {
  const s = specialty.toLowerCase();
  const bg = color + "20";
  const W = 360, H = 160;

  // ICU / Critical Care — EKG waveform with grid
  if (s.includes("icu") || s.includes("critical") || s.includes("intensive") || s.includes("respiratory")) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: "100%", height: "100%", display: "block" }}>
        <rect width={W} height={H} fill={bg} />
        {[40, 80, 120].map((y) => (
          <line key={y} x1="0" y1={y} x2={W} y2={y} stroke={color} strokeWidth="0.5" opacity="0.12" />
        ))}
        {[60, 120, 180, 240, 300].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2={H} stroke={color} strokeWidth="0.5" opacity="0.12" />
        ))}
        <polyline
          points={`0,80 50,80 70,80 85,35 95,125 105,55 115,80 165,80 185,80 200,50 212,110 222,80 ${W},80`}
          stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
        />
        <circle cx="222" cy="80" r="5" fill={color} opacity="0.8" />
        <circle cx="222" cy="80" r="12" fill={color} opacity="0.15" />
      </svg>
    );
  }

  // Pediatrics — floating bubbles/circles
  if (s.includes("pedi") || s.includes("child") || s.includes("infant") || s.includes("peds") || s.includes("nicu")) {
    const circles: [number, number, number, number][] = [
      [180, 80, 38, 0.18], [80, 90, 28, 0.15], [270, 70, 22, 0.13],
      [130, 45, 16, 0.20], [240, 110, 14, 0.16], [60, 50, 12, 0.14],
      [310, 95, 18, 0.17], [100, 120, 10, 0.12],
    ];
    return (
      <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: "100%", height: "100%", display: "block" }}>
        <rect width={W} height={H} fill={bg} />
        {circles.map(([cx, cy, r, op], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={color} opacity={op} />
        ))}
        {[[180, 80], [80, 90], [270, 70]].map(([cx, cy], i) => (
          <circle key={`s${i}`} cx={cx} cy={cy} r={4} fill={color} opacity="0.7" />
        ))}
      </svg>
    );
  }

  // Med-Surg — cross with radiating rings
  if (s.includes("med") || s.includes("surg") || s.includes("surgical") || s.includes("tele")) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: "100%", height: "100%", display: "block" }}>
        <rect width={W} height={H} fill={bg} />
        {[55, 38, 22].map((r, i) => (
          <circle key={i} cx={W / 2} cy={H / 2} r={r} stroke={color} strokeWidth="1" opacity={0.12 + i * 0.06} />
        ))}
        <line x1={W / 2} y1="28" x2={W / 2} y2={H - 28} stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.75" />
        <line x1="140" y1={H / 2} x2="220" y2={H / 2} stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.75" />
      </svg>
    );
  }

  // ER / Emergency — lightning bolt with glow rings
  if (s.includes("er") || s.includes("emergency") || s.includes("trauma") || s.includes("ed")) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: "100%", height: "100%", display: "block" }}>
        <rect width={W} height={H} fill={bg} />
        {[50, 34].map((r, i) => (
          <circle key={i} cx={W / 2} cy={H / 2} r={r} fill={color} opacity={0.08 + i * 0.04} />
        ))}
        <polygon
          points={`${W / 2 + 18},18 ${W / 2 - 22},78 ${W / 2 + 6},78 ${W / 2 - 18},142 ${W / 2 + 28},68 ${W / 2 + 4},68 ${W / 2 + 26},18`}
          fill={color} opacity="0.75"
        />
      </svg>
    );
  }

  // Oncology — concentric circles with ribbon
  if (s.includes("onco") || s.includes("cancer") || s.includes("hematology")) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: "100%", height: "100%", display: "block" }}>
        <rect width={W} height={H} fill={bg} />
        {[60, 44, 28].map((r, i) => (
          <circle key={i} cx={W / 2} cy={H / 2 - 8} r={r} stroke={color} strokeWidth="1.5" opacity={0.15 + i * 0.1} fill="none" />
        ))}
        <path d={`M${W / 2} ${H / 2 - 8} m0,-28 a28,28 0 1,1 -0.01,0`} stroke={color} strokeWidth="3" fill="none" opacity="0.7" strokeLinecap="round" />
        <line x1={W / 2 - 14} y1={H / 2 + 22} x2={W / 2 - 22} y2={H / 2 + 50} stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
        <line x1={W / 2 + 14} y1={H / 2 + 22} x2={W / 2 + 22} y2={H / 2 + 50} stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    );
  }

  // L&D / OB — flowing wave with centre dot
  if (s.includes("labor") || s.includes("delivery") || s.includes("ob") || s.includes("maternal") || s.includes("l&d")) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: "100%", height: "100%", display: "block" }}>
        <rect width={W} height={H} fill={bg} />
        <path d={`M0,${H / 2} C60,${H / 2 - 40} 120,${H / 2 + 40} 180,${H / 2} S300,${H / 2 - 40} ${W},${H / 2}`}
          stroke={color} strokeWidth="2.5" fill="none" opacity="0.6" strokeLinecap="round" />
        <path d={`M0,${H / 2 + 20} C60,${H / 2 - 20} 120,${H / 2 + 60} 180,${H / 2 + 20} S300,${H / 2 - 20} ${W},${H / 2 + 20}`}
          stroke={color} strokeWidth="1.5" fill="none" opacity="0.3" strokeLinecap="round" />
        <circle cx={W / 2} cy={H / 2} r="18" fill={color} opacity="0.18" />
        <circle cx={W / 2} cy={H / 2} r="8" fill={color} opacity="0.55" />
      </svg>
    );
  }

  // Psych / Behavioral Health — brain curves with heart
  if (s.includes("psych") || s.includes("behavioral") || s.includes("mental")) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: "100%", height: "100%", display: "block" }}>
        <rect width={W} height={H} fill={bg} />
        <circle cx={W / 2} cy={H / 2} r="45" fill="none" stroke={color} strokeWidth="1" opacity="0.12" />
        <circle cx={W / 2} cy={H / 2} r="32" fill="none" stroke={color} strokeWidth="1.5" opacity="0.2" />
        <path d={`M${W / 2} ${H / 2 - 28} C${W / 2 - 22} ${H / 2 - 28} ${W / 2 - 30} ${H / 2 - 12} ${W / 2 - 30} ${H / 2} C${W / 2 - 30} ${H / 2 + 18} ${W / 2 - 16} ${H / 2 + 28} ${W / 2} ${H / 2 + 28}`} stroke={color} strokeWidth="2" fill="none" opacity="0.4" />
        <path d={`M${W / 2} ${H / 2 - 28} C${W / 2 + 22} ${H / 2 - 28} ${W / 2 + 30} ${H / 2 - 12} ${W / 2 + 30} ${H / 2} C${W / 2 + 30} ${H / 2 + 18} ${W / 2 + 16} ${H / 2 + 28} ${W / 2} ${H / 2 + 28}`} stroke={color} strokeWidth="2" fill="none" opacity="0.4" />
        <path d={`M${W / 2 - 8} ${H / 2 - 4} C${W / 2 - 8} ${H / 2 - 10} ${W / 2} ${H / 2 - 13} ${W / 2} ${H / 2 - 4} C${W / 2} ${H / 2 - 13} ${W / 2 + 8} ${H / 2 - 10} ${W / 2 + 8} ${H / 2 - 4} C${W / 2 + 8} ${H / 2 + 6} ${W / 2} ${H / 2 + 12} ${W / 2} ${H / 2 + 12} C${W / 2} ${H / 2 + 12} ${W / 2 - 8} ${H / 2 + 6} ${W / 2 - 8} ${H / 2 - 4}Z`} fill={color} opacity="0.4" />
      </svg>
    );
  }

  // Home Health / Hospice — house outline
  if (s.includes("home") || s.includes("hospice") || s.includes("palliative")) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: "100%", height: "100%", display: "block" }}>
        <rect width={W} height={H} fill={bg} />
        <path d={`M${W / 2} 25 L${W / 2 - 60} 68 L${W / 2 - 52} 68 L${W / 2 - 52} 125 L${W / 2 - 20} 125 L${W / 2 - 20} 98 L${W / 2 + 20} 98 L${W / 2 + 20} 125 L${W / 2 + 52} 125 L${W / 2 + 52} 68 L${W / 2 + 60} 68 Z`}
          stroke={color} strokeWidth="2.5" fill="none" strokeLinejoin="round" opacity="0.45" />
        <path d={`M${W / 2} 25 L${W / 2 - 60} 68 L${W / 2 - 52} 68 L${W / 2 - 52} 125 L${W / 2 - 20} 125 L${W / 2 - 20} 98 L${W / 2 + 20} 98 L${W / 2 + 20} 125 L${W / 2 + 52} 125 L${W / 2 + 52} 68 L${W / 2 + 60} 68 Z`}
          fill={color} opacity="0.06" />
        <rect x={W / 2 - 10} y="78" width="20" height="16" rx="2" fill={color} opacity="0.2" />
      </svg>
    );
  }

  // School Nurse — graduation cap
  if (s.includes("school")) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: "100%", height: "100%", display: "block" }}>
        <rect width={W} height={H} fill={bg} />
        <path d={`M${W / 2} 35 L${W / 2 - 70} 65 L${W / 2} 95 L${W / 2 + 70} 65 Z`} stroke={color} strokeWidth="2" fill={color} opacity="0.12" />
        <path d={`M${W / 2} 35 L${W / 2 - 70} 65 L${W / 2} 95 L${W / 2 + 70} 65 Z`} stroke={color} strokeWidth="2" fill="none" opacity="0.4" />
        <line x1={W / 2 + 70} y1="65" x2={W / 2 + 70} y2="105" stroke={color} strokeWidth="2" opacity="0.3" />
        <path d={`M${W / 2 - 45} 76 L${W / 2 - 45} 108 Q${W / 2} 128 ${W / 2 + 45} 108 L${W / 2 + 45} 76`} stroke={color} strokeWidth="1.5" fill="none" opacity="0.25" />
        <circle cx={W / 2 + 70} cy="108" r="3" fill={color} opacity="0.3" />
      </svg>
    );
  }

  // Rehab — figure in motion
  if (s.includes("rehab")) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: "100%", height: "100%", display: "block" }}>
        <rect width={W} height={H} fill={bg} />
        <circle cx={W / 2} cy="35" r="12" stroke={color} strokeWidth="2" fill="none" opacity="0.4" />
        <path d={`M${W / 2 - 25} 90 Q${W / 2 - 10} 55 ${W / 2} 72 Q${W / 2 + 10} 55 ${W / 2 + 25} 90`} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.45" />
        <line x1={W / 2 - 25} y1="90" x2={W / 2 - 35} y2="125" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        <line x1={W / 2 + 25} y1="90" x2={W / 2 + 35} y2="125" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        <path d={`M${W / 2 + 50} 50 Q${W / 2 + 60} 80 ${W / 2 + 50} 110`} stroke={color} strokeWidth="1" fill="none" opacity="0.15" />
        <path d={`M${W / 2 + 65} 55 Q${W / 2 + 72} 80 ${W / 2 + 65} 105`} stroke={color} strokeWidth="1" fill="none" opacity="0.1" />
      </svg>
    );
  }

  // OR / Perioperative — surgical light
  if (s.includes("or") || s.includes("periop") || s.includes("operating")) {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: "100%", height: "100%", display: "block" }}>
        <rect width={W} height={H} fill={bg} />
        <line x1={W / 2} y1="0" x2={W / 2} y2="35" stroke={color} strokeWidth="2" opacity="0.3" />
        <circle cx={W / 2} cy="50" r="22" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3" />
        <circle cx={W / 2} cy="50" r="10" fill={color} opacity="0.15" />
        <line x1={W / 2} y1="72" x2={W / 2 - 40} y2="130" stroke={color} strokeWidth="1" opacity="0.12" />
        <line x1={W / 2} y1="72" x2={W / 2 + 40} y2="130" stroke={color} strokeWidth="1" opacity="0.12" />
        <line x1={W / 2} y1="72" x2={W / 2} y2="135" stroke={color} strokeWidth="1" opacity="0.12" />
        <ellipse cx={W / 2} cy="120" rx="45" ry="10" fill="none" stroke={color} strokeWidth="1.5" opacity="0.2" />
      </svg>
    );
  }

  // Default — stethoscope abstract
  return (
    <svg viewBox={`0 0 ${W} ${H}`} fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ width: "100%", height: "100%", display: "block" }}>
      <rect width={W} height={H} fill={bg} />
      {[52, 36, 20].map((r, i) => (
        <circle key={i} cx={W / 2} cy={H / 2 + 10} r={r} stroke={color} strokeWidth="1.2" opacity={0.10 + i * 0.07} fill="none" />
      ))}
      <path
        d={`M${W / 2 - 30},${H / 2 - 30} C${W / 2 - 30},${H / 2 - 30} ${W / 2 - 36},${H / 2 + 10} ${W / 2 - 28},${H / 2 + 28} C${W / 2 - 18},${H / 2 + 48} ${W / 2 + 18},${H / 2 + 48} ${W / 2 + 28},${H / 2 + 28} C${W / 2 + 36},${H / 2 + 10} ${W / 2 + 30},${H / 2 - 30} ${W / 2 + 30},${H / 2 - 30}`}
        stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.6"
      />
      <circle cx={W / 2} cy={H / 2 + 10} r="10" stroke={color} strokeWidth="2" fill="none" opacity="0.55" />
      <line x1={W / 2 - 30} y1={H / 2 - 30} x2={W / 2 - 40} y2={H / 2 - 42} stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1={W / 2 + 30} y1={H / 2 - 30} x2={W / 2 + 40} y2={H / 2 - 42} stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
