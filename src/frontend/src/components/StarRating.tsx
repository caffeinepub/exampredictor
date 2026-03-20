import { Star } from "lucide-react";

const STAR_KEYS = ["star-1", "star-2", "star-3", "star-4", "star-5"];

interface StarRatingProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: number;
  readonly?: boolean;
}

export function StarRating({
  value,
  max = 5,
  onChange,
  size = 18,
  readonly = false,
}: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {STAR_KEYS.slice(0, max).map((key, i) => (
        <button
          key={key}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(i + 1)}
          className={
            readonly
              ? "cursor-default"
              : "cursor-pointer hover:scale-110 transition-transform"
          }
        >
          <Star
            size={size}
            fill={i < value ? "oklch(0.82 0.18 85)" : "transparent"}
            stroke={i < value ? "oklch(0.82 0.18 85)" : "oklch(0.65 0.05 265)"}
          />
        </button>
      ))}
    </div>
  );
}
