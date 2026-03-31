import Image from "next/image";

interface FlorLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  variant?: "icon-only" | "full";
}

export default function FlorLogo({ size = "md", showTagline = false, variant = "full" }: FlorLogoProps) {
  const sizes = {
    sm: { icon: 28, text: "text-lg", tagline: "text-[9px]", gap: "gap-2" },
    md: { icon: 32, text: "text-xl", tagline: "text-[10px]", gap: "gap-2.5" },
    lg: { icon: 48, text: "text-3xl", tagline: "text-xs", gap: "gap-3" },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.gap}`}>
      {/* Actual Flor logo from florfornurses.com */}
      <Image
        src="/flor-logo.jpg"
        alt="Flor"
        width={s.icon}
        height={Math.round(s.icon * 1.23)}
        className="object-contain"
        priority
      />
      {variant === "full" && (
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
      )}
    </div>
  );
}
