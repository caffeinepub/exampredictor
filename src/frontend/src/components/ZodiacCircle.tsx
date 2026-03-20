import { ZODIAC_SIGNS } from "../data/zodiac";

interface ZodiacCircleProps {
  onSignClick: (index: number) => void;
}

export function ZodiacCircle({ onSignClick }: ZodiacCircleProps) {
  const radius = 130;
  const centerX = 160;
  const centerY = 160;

  return (
    <div className="flex justify-center items-center py-10 relative">
      {/* Outer glow rings */}
      <div
        className="absolute rounded-full animate-pulse-glow"
        style={{
          width: 340,
          height: 340,
          background:
            "radial-gradient(circle, oklch(0.55 0.28 290 / 5%) 0%, oklch(0.82 0.18 85 / 10%) 50%, transparent 70%)",
          boxShadow:
            "0 0 40px oklch(0.82 0.18 85 / 30%), 0 0 80px oklch(0.55 0.28 290 / 20%), inset 0 0 40px oklch(0.82 0.18 85 / 10%)",
          borderRadius: "50%",
        }}
      />
      {/* Rotating ring */}
      <div
        className="animate-rotate-zodiac"
        style={{
          width: centerX * 2,
          height: centerY * 2,
          position: "relative",
        }}
      >
        {/* Circle border */}
        <div
          style={{
            position: "absolute",
            top: centerY - radius - 2,
            left: centerX - radius - 2,
            width: (radius + 2) * 2,
            height: (radius + 2) * 2,
            borderRadius: "50%",
            border: "2px solid oklch(0.82 0.18 85 / 40%)",
            boxShadow: "0 0 10px oklch(0.82 0.18 85 / 30%)",
          }}
        />
        {ZODIAC_SIGNS.map((sign, i) => {
          const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle) - 24;
          const y = centerY + radius * Math.sin(angle) - 24;
          return (
            <button
              key={sign.english}
              type="button"
              data-ocid={`zodiac.item.${i + 1}`}
              onClick={() => onSignClick(i)}
              className="animate-counter-rotate"
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
                cursor: "pointer",
                background: "oklch(0.14 0.03 270 / 90%)",
                border: "1px solid oklch(0.82 0.18 85 / 50%)",
                borderRadius: "50%",
                boxShadow:
                  "0 0 10px oklch(0.82 0.18 85 / 30%), 0 0 20px oklch(0.55 0.28 290 / 20%)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 20px oklch(0.82 0.18 85 / 70%), 0 0 40px oklch(0.55 0.28 290 / 50%)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 10px oklch(0.82 0.18 85 / 30%), 0 0 20px oklch(0.55 0.28 290 / 20%)";
              }}
            >
              {sign.symbol}
            </button>
          );
        })}
        {/* Center book decoration */}
        <div
          style={{
            position: "absolute",
            top: centerY - 30,
            left: centerX - 30,
            width: 60,
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.2rem",
            background:
              "radial-gradient(circle, oklch(0.82 0.18 85 / 20%), oklch(0.55 0.28 290 / 10%))",
            borderRadius: "50%",
            boxShadow:
              "0 0 20px oklch(0.82 0.18 85 / 40%), 0 0 40px oklch(0.55 0.28 290 / 20%)",
          }}
          className="animate-counter-rotate"
        >
          📚
        </div>
      </div>
    </div>
  );
}
