import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Check, Loader2, Pencil, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { StarRating } from "../components/StarRating";
import {
  ZODIAC_SIGNS,
  getDefaultQuote,
  getDefaultRatings,
  getPredictionForSign,
} from "../data/zodiac";
import { useAdminMode } from "../hooks/useAdminMode";
import {
  type RatingsData,
  useGetQuotation,
  useGetRatings,
  useSetQuotation,
  useSetRatings,
} from "../hooks/useQueries";

const RATING_LABELS: Array<{
  key: keyof RatingsData;
  label: string;
  emoji: string;
}> = [
  { key: "luck", label: "Luck", emoji: "🍀" },
  { key: "happiness", label: "Happiness", emoji: "😊" },
  { key: "love", label: "Love", emoji: "❤️" },
  { key: "good", label: "Good", emoji: "⭐" },
  { key: "overall", label: "Overall", emoji: "🌟" },
];

export function ZodiacDetailPage() {
  const { signIndex } = useParams({ from: "/zodiac/$signIndex" });
  const navigate = useNavigate();
  const idx = Number(signIndex);
  const sign = ZODIAC_SIGNS[idx];
  const { isAdmin, login, logout } = useAdminMode();

  const predictions = getPredictionForSign(idx);
  const defaultQuote = getDefaultQuote(idx);
  const defaultRatings = getDefaultRatings(idx);

  const { data: savedQuotation, isLoading: quotationLoading } =
    useGetQuotation(idx);
  const { data: savedRatings, isLoading: ratingsLoading } = useGetRatings(idx);
  const setQuotationMutation = useSetQuotation(idx);
  const setRatingsMutation = useSetRatings(idx);

  const [editingQuote, setEditingQuote] = useState(false);
  const [quoteText, setQuoteText] = useState("");
  const [editingRatings, setEditingRatings] = useState(false);
  const [draftRatings, setDraftRatings] = useState<RatingsData>(defaultRatings);

  // PIN dialog state
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pinValue, setPinValue] = useState("");
  const pinInputRef = useRef<HTMLInputElement>(null);

  // Secret tap gesture: 5 taps within 2 seconds
  const tapTimestamps = useRef<number[]>([]);

  const handleSymbolTap = () => {
    if (isAdmin) return;
    const now = Date.now();
    tapTimestamps.current.push(now);
    tapTimestamps.current = tapTimestamps.current.filter(
      (t) => now - t <= 2000,
    );
    if (tapTimestamps.current.length >= 5) {
      tapTimestamps.current = [];
      setShowPinDialog(true);
      setPinValue("");
      setTimeout(() => pinInputRef.current?.focus(), 50);
    }
  };

  if (!sign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "oklch(0.65 0.05 265)" }}>Sign not found</p>
      </div>
    );
  }

  const displayQuote =
    savedQuotation !== null && savedQuotation !== undefined
      ? savedQuotation
      : defaultQuote;
  const displayRatings = savedRatings ?? defaultRatings;

  const handleStartEditQuote = () => {
    setQuoteText(displayQuote);
    setEditingQuote(true);
  };

  const handleSaveQuote = async () => {
    try {
      await setQuotationMutation.mutateAsync(quoteText);
      toast.success("Quotation saved!");
      setEditingQuote(false);
    } catch {
      toast.error("Failed to save quotation");
    }
  };

  const handleStartEditRatings = () => {
    setDraftRatings(displayRatings);
    setEditingRatings(true);
  };

  const handleSaveRatings = async () => {
    try {
      await setRatingsMutation.mutateAsync(draftRatings);
      toast.success("Ratings saved!");
      setEditingRatings(false);
    } catch {
      toast.error("Failed to save ratings");
    }
  };

  const handlePinSubmit = () => {
    const ok = login(pinValue);
    if (ok) {
      toast.success("Admin mode on");
      setShowPinDialog(false);
      setPinValue("");
    } else {
      toast.error("Wrong PIN");
      setPinValue("");
      pinInputRef.current?.focus();
    }
  };

  const handleExitAdmin = () => {
    logout();
    setEditingQuote(false);
    setEditingRatings(false);
    toast.success("Admin mode off");
  };

  const cardStyle: React.CSSProperties = {
    background: "oklch(0.14 0.03 270)",
    border: "1px solid oklch(0.82 0.18 85 / 25%)",
    borderRadius: "1rem",
    padding: "1.25rem",
    boxShadow:
      "0 0 15px oklch(0.82 0.18 85 / 10%), 0 4px 12px oklch(0 0 0 / 50%)",
  };

  const sectionTitleStyle: React.CSSProperties = {
    color: "oklch(0.82 0.18 85)",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    marginBottom: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex-1 max-w-xl mx-auto w-full px-4 py-6 relative z-10">
        {/* Back button row */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between mb-6"
        >
          <Button
            data-ocid="zodiac.link"
            variant="ghost"
            onClick={() => navigate({ to: "/" })}
            className="gap-2 hover:opacity-80"
            style={{ color: "oklch(0.65 0.22 290)" }}
          >
            <ArrowLeft size={18} />
            Back
          </Button>

          {/* Exit Admin button — only visible when admin is logged in */}
          {isAdmin ? (
            <button
              type="button"
              data-ocid="admin.toggle"
              onClick={handleExitAdmin}
              className="text-xs px-3 py-1.5 rounded-full transition-all hover:opacity-80"
              style={{
                color: "oklch(0.82 0.18 85)",
                background: "oklch(0.82 0.18 85 / 12%)",
                border: "1px solid oklch(0.82 0.18 85 / 30%)",
              }}
            >
              Exit Admin
            </button>
          ) : null}
        </motion.div>

        {/* Sign Header — secret tap zone on the emoji */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          {/* Invisible button wrapping emoji — tap 5x within 2s to open admin PIN */}
          <button
            type="button"
            onClick={handleSymbolTap}
            className="text-7xl mb-3 bg-transparent border-0 p-0 cursor-default select-none focus:outline-none"
            style={{
              filter: "drop-shadow(0 0 20px oklch(0.82 0.18 85 / 70%))",
              display: "block",
              margin: "0 auto 0.75rem",
            }}
            tabIndex={-1}
            aria-label="zodiac symbol"
          >
            {sign.symbol}
          </button>
          <h1
            className="text-3xl font-bold font-telugu text-glow-gold"
            style={{ color: "oklch(0.82 0.18 85)" }}
          >
            {sign.telugu}
          </h1>
          <p
            className="text-base mt-1"
            style={{ color: "oklch(0.65 0.05 265)" }}
          >
            {sign.english}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-5">
          {/* Daily Prediction */}
          <motion.div
            data-ocid="prediction.card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={cardStyle}
          >
            <div style={sectionTitleStyle}>
              <span>🔮 Today's Prediction</span>
            </div>
            <ul className="flex flex-col gap-2">
              {predictions.map((line) => (
                <li
                  key={line}
                  className="flex gap-2 items-start text-sm leading-relaxed"
                  style={{ color: "oklch(0.88 0.02 265)" }}
                >
                  <span
                    style={{ color: "oklch(0.55 0.28 290)", flexShrink: 0 }}
                  >
                    ✦
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quotation */}
          <motion.div
            data-ocid="quotation.card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            style={cardStyle}
          >
            <div style={sectionTitleStyle}>
              <span>💬 Daily Quotation</span>
              {isAdmin && !editingQuote ? (
                <button
                  type="button"
                  data-ocid="quotation.edit_button"
                  onClick={handleStartEditQuote}
                  className="p-1 rounded hover:opacity-70 transition-opacity"
                  style={{ color: "oklch(0.65 0.22 290)" }}
                  title="Edit quotation"
                >
                  <Pencil size={14} />
                </button>
              ) : null}
            </div>
            {quotationLoading ? (
              <div
                data-ocid="quotation.loading_state"
                className="flex justify-center py-3"
              >
                <Loader2
                  size={20}
                  className="animate-spin"
                  style={{ color: "oklch(0.82 0.18 85)" }}
                />
              </div>
            ) : editingQuote ? (
              <div className="flex flex-col gap-3">
                <Textarea
                  data-ocid="quotation.textarea"
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  rows={3}
                  className="text-sm resize-none"
                  style={{
                    background: "oklch(0.10 0.025 265)",
                    border: "1px solid oklch(0.82 0.18 85 / 40%)",
                    color: "oklch(0.88 0.02 265)",
                    borderRadius: "0.5rem",
                  }}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    data-ocid="quotation.cancel_button"
                    onClick={() => setEditingQuote(false)}
                    className="p-1.5 rounded hover:opacity-70 transition-opacity"
                    style={{ color: "oklch(0.65 0.05 265)" }}
                  >
                    <X size={16} />
                  </button>
                  <button
                    type="button"
                    data-ocid="quotation.save_button"
                    onClick={handleSaveQuote}
                    disabled={setQuotationMutation.isPending}
                    className="p-1.5 rounded hover:opacity-70 transition-opacity disabled:opacity-50"
                    style={{ color: "oklch(0.82 0.18 85)" }}
                  >
                    {setQuotationMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <p
                className="text-sm leading-relaxed font-telugu italic"
                style={{ color: "oklch(0.88 0.02 265)" }}
              >
                "{displayQuote}"
              </p>
            )}
          </motion.div>

          {/* Ratings */}
          <motion.div
            data-ocid="ratings.card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={cardStyle}
          >
            <div style={sectionTitleStyle}>
              <span>⭐ Today's Ratings</span>
              {isAdmin && !editingRatings ? (
                <button
                  type="button"
                  data-ocid="ratings.edit_button"
                  onClick={handleStartEditRatings}
                  className="p-1 rounded hover:opacity-70 transition-opacity"
                  style={{ color: "oklch(0.65 0.22 290)" }}
                  title="Edit ratings"
                >
                  <Pencil size={14} />
                </button>
              ) : null}
            </div>
            {ratingsLoading ? (
              <div
                data-ocid="ratings.loading_state"
                className="flex justify-center py-3"
              >
                <Loader2
                  size={20}
                  className="animate-spin"
                  style={{ color: "oklch(0.82 0.18 85)" }}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {RATING_LABELS.map(({ key, label, emoji }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span
                      className="text-sm"
                      style={{ color: "oklch(0.75 0.05 265)" }}
                    >
                      {emoji} {label}
                    </span>
                    <StarRating
                      value={
                        editingRatings ? draftRatings[key] : displayRatings[key]
                      }
                      onChange={
                        editingRatings
                          ? (v) =>
                              setDraftRatings((prev) => ({ ...prev, [key]: v }))
                          : undefined
                      }
                      readonly={!editingRatings}
                    />
                  </div>
                ))}
                {editingRatings ? (
                  <div className="flex gap-2 justify-end mt-2">
                    <button
                      type="button"
                      data-ocid="ratings.cancel_button"
                      onClick={() => setEditingRatings(false)}
                      className="p-1.5 rounded hover:opacity-70 transition-opacity"
                      style={{ color: "oklch(0.65 0.05 265)" }}
                    >
                      <X size={16} />
                    </button>
                    <button
                      type="button"
                      data-ocid="ratings.save_button"
                      onClick={handleSaveRatings}
                      disabled={setRatingsMutation.isPending}
                      className="p-1.5 rounded hover:opacity-70 transition-opacity disabled:opacity-50"
                      style={{ color: "oklch(0.82 0.18 85)" }}
                    >
                      {setRatingsMutation.isPending ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Check size={16} />
                      )}
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Hidden PIN dialog — triggered by secret tap gesture */}
      <AnimatePresence>
        {showPinDialog && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: "oklch(0 0 0 / 60%)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowPinDialog(false);
                setPinValue("");
              }
            }}
          >
            <motion.div
              data-ocid="admin.dialog"
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 8 }}
              transition={{ duration: 0.2 }}
              style={{
                background: "oklch(0.13 0.04 270)",
                border: "1px solid oklch(0.82 0.18 85 / 30%)",
                borderRadius: "0.75rem",
                padding: "1.25rem",
                width: "240px",
                boxShadow:
                  "0 0 20px oklch(0.82 0.18 85 / 15%), 0 8px 24px oklch(0 0 0 / 60%)",
              }}
            >
              <p
                className="text-sm mb-3 font-semibold tracking-wide text-center"
                style={{ color: "oklch(0.82 0.18 85)" }}
              >
                🔑 Enter Admin PIN
              </p>
              <input
                ref={pinInputRef}
                data-ocid="admin.input"
                type="password"
                value={pinValue}
                onChange={(e) => setPinValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handlePinSubmit();
                  if (e.key === "Escape") {
                    setShowPinDialog(false);
                    setPinValue("");
                  }
                }}
                placeholder="PIN"
                className="w-full text-sm px-2.5 py-1.5 rounded-md outline-none mb-3"
                style={{
                  background: "oklch(0.09 0.025 265)",
                  border: "1px solid oklch(0.82 0.18 85 / 30%)",
                  color: "oklch(0.88 0.02 265)",
                }}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  data-ocid="admin.cancel_button"
                  onClick={() => {
                    setShowPinDialog(false);
                    setPinValue("");
                  }}
                  className="flex-1 py-1.5 rounded-md text-xs transition-opacity hover:opacity-70"
                  style={{
                    background: "oklch(0.20 0.03 270)",
                    color: "oklch(0.65 0.05 265)",
                    border: "1px solid oklch(0.30 0.05 265 / 40%)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  data-ocid="admin.confirm_button"
                  onClick={handlePinSubmit}
                  className="flex-1 py-1.5 rounded-md text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{
                    background: "oklch(0.82 0.18 85 / 20%)",
                    color: "oklch(0.82 0.18 85)",
                    border: "1px solid oklch(0.82 0.18 85 / 35%)",
                  }}
                >
                  Unlock
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
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
            ram1019
          </p>
        </div>
      </footer>
    </div>
  );
}
