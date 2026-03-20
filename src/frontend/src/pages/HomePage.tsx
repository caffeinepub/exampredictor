import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ZodiacCircle } from "../components/ZodiacCircle";
import { ZODIAC_SIGNS } from "../data/zodiac";

export function HomePage() {
  const navigate = useNavigate();

  const handleSignClick = (index: number) => {
    navigate({
      to: "/zodiac/$signIndex",
      params: { signIndex: String(index) },
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <header className="text-center pt-10 pb-4 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-glow-gold font-cinzel"
          style={{
            color: "oklch(0.82 0.18 85)",
            fontSize: "clamp(1.8rem, 6vw, 3.2rem)",
            fontWeight: 900,
            letterSpacing: "0.1em",
          }}
        >
          EXAMPREDICTOR
        </motion.h1>
      </header>

      <section className="relative z-10">
        <ZodiacCircle onSignClick={handleSignClick} />
      </section>

      <main className="flex-1 px-4 pb-6 relative z-10 max-w-xl mx-auto w-full">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center text-lg font-semibold mb-5"
          style={{ color: "oklch(0.65 0.22 290)", letterSpacing: "0.08em" }}
        >
          SELECT YOUR SIGN
        </motion.h2>
        <div className="flex flex-col gap-3">
          {ZODIAC_SIGNS.map((sign, index) => (
            <motion.button
              key={sign.english}
              data-ocid={`zodiac.item.${index + 1}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.4 }}
              onClick={() => handleSignClick(index)}
              className="zodiac-card-hover w-full text-left"
              style={{
                background: "oklch(0.14 0.03 270)",
                border: "1px solid oklch(0.82 0.18 85 / 25%)",
                borderRadius: "1rem",
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                boxShadow:
                  "0 0 10px oklch(0.82 0.18 85 / 10%), 0 2px 8px oklch(0 0 0 / 40%)",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: "2.2rem", lineHeight: 1 }}>
                {sign.symbol}
              </span>
              <div className="flex flex-col">
                <span
                  className="font-telugu font-bold text-xl leading-tight"
                  style={{ color: "oklch(0.82 0.18 85)" }}
                >
                  {sign.telugu}
                </span>
                <span
                  className="text-sm"
                  style={{ color: "oklch(0.65 0.05 265)" }}
                >
                  {sign.english}
                </span>
              </div>
              <span
                className="ml-auto"
                style={{ color: "oklch(0.55 0.28 290)" }}
              >
                →
              </span>
            </motion.button>
          ))}
        </div>

        <div
          className="my-8 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, oklch(0.82 0.18 85 / 50%), transparent)",
          }}
        />

        <div className="text-center">
          <p
            className="text-2xl font-bold mb-1"
            style={{
              color: "oklch(0.82 0.18 85)",
              fontFamily: "Cinzel, serif",
              letterSpacing: "0.12em",
              textShadow: "0 0 10px oklch(0.82 0.18 85 / 60%)",
            }}
          >
            🇮🇳 JAI HIND
          </p>
        </div>
      </main>

      <footer className="relative z-10 py-4 px-6">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <p className="text-xs" style={{ color: "oklch(0.45 0.05 265)" }}>
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs" style={{ color: "oklch(0.45 0.05 265)" }}>
            1019-211
          </p>
        </div>
      </footer>
    </div>
  );
}
