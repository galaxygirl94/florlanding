/**
 * Specialty-specific illustrated SVG fallbacks for when facility images
 * are broken or missing. Each specialty gets a distinct visual.
 */

export default function SpecialtyIllustration({
  specialty = "",
  className = "",
}: {
  specialty?: string;
  className?: string;
}) {
  const s = specialty.toLowerCase();

  // ICU / Critical Care
  if (s.includes("icu") || s.includes("critical") || s.includes("intensive") || s.includes("respiratory")) {
    return (
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="200" height="120" className="fill-periwinkle/8" />
        <polyline
          points="10,60 40,60 55,30 65,90 75,45 85,60 120,60 135,60 150,35 160,80 170,60 190,60"
          className="stroke-periwinkle" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
        />
        <circle cx="120" cy="60" r="4" className="fill-periwinkle opacity-70" />
        <text x="100" y="108" textAnchor="middle" className="fill-periwinkle opacity-70" fontSize="11" fontFamily="Georgia, serif" fontWeight="600">
          Critical Care
        </text>
      </svg>
    );
  }

  // Pediatrics
  if (s.includes("pedi") || s.includes("child") || s.includes("infant") || s.includes("peds") || s.includes("nicu")) {
    return (
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="200" height="120" className="fill-periwinkle/8" />
        {[[100, 38], [70, 55], [130, 55], [82, 80], [118, 80]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 0 ? 9 : 6} className={`fill-periwinkle ${i === 0 ? "opacity-80" : "opacity-45"}`} />
        ))}
        <text x="100" y="108" textAnchor="middle" className="fill-periwinkle opacity-70" fontSize="11" fontFamily="Georgia, serif" fontWeight="600">
          Pediatrics
        </text>
      </svg>
    );
  }

  // Med-Surg / Telemetry
  if (s.includes("med") || s.includes("surg") || s.includes("surgical") || s.includes("tele")) {
    return (
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="200" height="120" className="fill-periwinkle/8" />
        <line x1="100" y1="25" x2="100" y2="90" className="stroke-periwinkle" strokeWidth="3" strokeLinecap="round" />
        <line x1="72" y1="55" x2="128" y2="55" className="stroke-periwinkle" strokeWidth="3" strokeLinecap="round" />
        <circle cx="100" cy="55" r="20" className="stroke-periwinkle opacity-25" strokeWidth="1.5" />
        <text x="100" y="108" textAnchor="middle" className="fill-periwinkle opacity-70" fontSize="11" fontFamily="Georgia, serif" fontWeight="600">
          Med-Surg
        </text>
      </svg>
    );
  }

  // ER / Emergency
  if (s.includes("er") || s.includes("emergency") || s.includes("trauma") || s.includes("ed")) {
    return (
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="200" height="120" className="fill-periwinkle/8" />
        <polygon
          points="115,22 88,62 105,62 85,98 125,52 106,52 130,22"
          className="fill-periwinkle opacity-70"
        />
        <text x="100" y="112" textAnchor="middle" className="fill-periwinkle opacity-70" fontSize="11" fontFamily="Georgia, serif" fontWeight="600">
          Emergency
        </text>
      </svg>
    );
  }

  // Oncology
  if (s.includes("onco") || s.includes("cancer") || s.includes("hematology")) {
    return (
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="200" height="120" className="fill-periwinkle/8" />
        <path
          d="M100 28 C100 28 78 45 78 62 C78 73 88 80 100 80 C112 80 122 73 122 62 C122 45 100 28 100 28Z"
          className="stroke-periwinkle opacity-70" strokeWidth="2" fill="none"
        />
        <path d="M92 78 L82 96 M108 78 L118 96" className="stroke-periwinkle opacity-50" strokeWidth="2" strokeLinecap="round" />
        <text x="100" y="112" textAnchor="middle" className="fill-periwinkle opacity-70" fontSize="11" fontFamily="Georgia, serif" fontWeight="600">
          Oncology
        </text>
      </svg>
    );
  }

  // L&D / OB / Maternal
  if (s.includes("labor") || s.includes("delivery") || s.includes("ob") || s.includes("maternal") || s.includes("l&d")) {
    return (
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="200" height="120" className="fill-periwinkle/8" />
        <circle cx="100" cy="54" r="26" className="stroke-periwinkle fill-periwinkle/12" strokeWidth="2" />
        <circle cx="100" cy="50" r="10" className="fill-periwinkle opacity-60" />
        <text x="100" y="106" textAnchor="middle" className="fill-periwinkle opacity-70" fontSize="11" fontFamily="Georgia, serif" fontWeight="600">
          Labor & Delivery
        </text>
      </svg>
    );
  }

  // Psych / Behavioral Health
  if (s.includes("psych") || s.includes("behavioral") || s.includes("mental")) {
    return (
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="200" height="120" className="fill-periwinkle/8" />
        <circle cx="100" cy="50" r="22" className="stroke-periwinkle opacity-40" strokeWidth="2" fill="none" />
        <path d="M88 50 C88 42 100 38 100 50 C100 38 112 42 112 50 C112 62 100 70 100 70 C100 70 88 62 88 50Z" className="fill-periwinkle opacity-50" />
        <text x="100" y="106" textAnchor="middle" className="fill-periwinkle opacity-70" fontSize="11" fontFamily="Georgia, serif" fontWeight="600">
          Behavioral Health
        </text>
      </svg>
    );
  }

  // Home Health / Hospice
  if (s.includes("home") || s.includes("hospice") || s.includes("palliative")) {
    return (
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="200" height="120" className="fill-periwinkle/8" />
        <path d="M100 30 L65 58 L70 58 L70 85 L90 85 L90 68 L110 68 L110 85 L130 85 L130 58 L135 58Z" className="stroke-periwinkle opacity-60" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
        <text x="100" y="106" textAnchor="middle" className="fill-periwinkle opacity-70" fontSize="11" fontFamily="Georgia, serif" fontWeight="600">
          Home Health
        </text>
      </svg>
    );
  }

  // School Nurse
  if (s.includes("school")) {
    return (
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="200" height="120" className="fill-periwinkle/8" />
        <path d="M100 28 L60 48 L100 68 L140 48 Z" className="stroke-periwinkle opacity-60" strokeWidth="2" fill="none" />
        <line x1="140" y1="48" x2="140" y2="78" className="stroke-periwinkle opacity-40" strokeWidth="2" />
        <path d="M76 56 L76 78 Q100 92 124 78 L124 56" className="stroke-periwinkle opacity-40" strokeWidth="1.5" fill="none" />
        <text x="100" y="106" textAnchor="middle" className="fill-periwinkle opacity-70" fontSize="11" fontFamily="Georgia, serif" fontWeight="600">
          School Nurse
        </text>
      </svg>
    );
  }

  // Rehab
  if (s.includes("rehab")) {
    return (
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="200" height="120" className="fill-periwinkle/8" />
        <path d="M80 70 Q90 40 100 55 Q110 40 120 70" className="stroke-periwinkle opacity-60" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="100" cy="32" r="8" className="stroke-periwinkle opacity-50" strokeWidth="2" fill="none" />
        <line x1="80" y1="70" x2="75" y2="90" className="stroke-periwinkle opacity-40" strokeWidth="2" strokeLinecap="round" />
        <line x1="120" y1="70" x2="125" y2="90" className="stroke-periwinkle opacity-40" strokeWidth="2" strokeLinecap="round" />
        <text x="100" y="108" textAnchor="middle" className="fill-periwinkle opacity-70" fontSize="11" fontFamily="Georgia, serif" fontWeight="600">
          Rehab
        </text>
      </svg>
    );
  }

  // OR / Perioperative
  if (s.includes("or") || s.includes("periop") || s.includes("operating")) {
    return (
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect width="200" height="120" className="fill-periwinkle/8" />
        <ellipse cx="100" cy="55" rx="30" ry="12" className="stroke-periwinkle opacity-30" strokeWidth="1.5" fill="none" />
        <circle cx="100" cy="55" r="8" className="fill-periwinkle opacity-20" />
        <line x1="100" y1="35" x2="100" y2="30" className="stroke-periwinkle opacity-60" strokeWidth="2" strokeLinecap="round" />
        <circle cx="100" cy="28" r="16" className="stroke-periwinkle opacity-30" strokeWidth="1.5" fill="none" />
        <text x="100" y="108" textAnchor="middle" className="fill-periwinkle opacity-70" fontSize="11" fontFamily="Georgia, serif" fontWeight="600">
          Operating Room
        </text>
      </svg>
    );
  }

  // Default — stethoscope
  return (
    <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="200" height="120" className="fill-periwinkle/8" />
      <path
        d="M80 30 C80 30 75 50 78 62 C82 78 100 84 100 84 C100 84 118 78 122 62 C125 50 120 30 120 30"
        className="stroke-periwinkle opacity-60" strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
      <circle cx="100" cy="88" r="10" className="stroke-periwinkle opacity-50" strokeWidth="2" fill="none" />
      <line x1="80" y1="30" x2="72" y2="22" className="stroke-periwinkle opacity-60" strokeWidth="2" strokeLinecap="round" />
      <line x1="120" y1="30" x2="128" y2="22" className="stroke-periwinkle opacity-60" strokeWidth="2" strokeLinecap="round" />
      <text x="100" y="112" textAnchor="middle" className="fill-periwinkle opacity-70" fontSize="11" fontFamily="Georgia, serif" fontWeight="600">
        Nursing
      </text>
    </svg>
  );
}
