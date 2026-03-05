interface FlorLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export default function FlorLogo({ size = "md", showTagline = false }: FlorLogoProps) {
  const sizes = {
    sm: { icon: "w-7 h-7", text: "text-lg", tagline: "text-[9px]" },
    md: { icon: "w-8 h-8", text: "text-xl", tagline: "text-[10px]" },
    lg: { icon: "w-12 h-12", text: "text-3xl", tagline: "text-xs" },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      {/* Flor icon — a stylized flower/lamp inspired by Florence Nightingale */}
      <div className={`${s.icon} relative`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Outer petals */}
          <circle cx="20" cy="12" r="7" fill="#8B8FD4" opacity="0.9" />
          <circle cx="12" cy="20" r="7" fill="#8B8FD4" opacity="0.7" />
          <circle cx="28" cy="20" r="7" fill="#8B8FD4" opacity="0.7" />
          <circle cx="20" cy="28" r="7" fill="#8B8FD4" opacity="0.5" />
          {/* Center */}
          <circle cx="20" cy="20" r="5" fill="#E8A0BF" />
          <circle cx="20" cy="20" r="2.5" fill="white" opacity="0.8" />
        </svg>
      </div>
      <div>
        <span className={`${s.text} font-extrabold tracking-tight text-text`}>
          fl<span className="text-periwinkle">o</span>r
        </span>
        {showTagline && (
          <p className={`${s.tagline} text-text-muted font-medium -mt-0.5 tracking-wide`}>
            Built by nurses, for nurses
          </p>
        )}
      </div>
    </div>
  );
}
