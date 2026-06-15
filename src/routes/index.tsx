import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import waxSeal from "@/assets/wax-seal.png";
import monogram from "@/assets/monogram.png";
import courthouse from "@/assets/courthouse.jpg";
import acousticAsset from "@/assets/acoustic.mp3.asset.json";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xrevjyyj";
const TARGET_VOLUME = 0.32;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Byron & Diana — July 3rd" },
      { name: "description", content: "An invitation to the court wedding of Byron & Diana, July 3rd, Pasadena, TX." },
      { property: "og:title", content: "Byron & Diana — July 3rd" },
      { property: "og:description", content: "Together with their families, Byron & Diana request the honour of your presence." },
    ],
  }),
  component: Invitation,
});

const WEDDING_DATE = new Date("2026-07-03T12:00:00-05:00");
const VENUE_QUERY = encodeURIComponent("Harris County Justice of the Peace Precinct 8, Place 1, 7330 Spencer Hwy, Pasadena, TX 77505");

type Phase = "envelope" | "opening" | "revealed";

function Invitation() {
  const [phase, setPhase] = useState<Phase>("envelope");
  const [muted, setMuted] = useState(true);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);

  const fadeTo = (target: number, durationMs: number) => {
    const el = musicRef.current;
    if (!el) return;
    if (fadeRef.current) window.clearInterval(fadeRef.current);
    const start = el.volume;
    const startTime = performance.now();
    fadeRef.current = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - startTime) / durationMs);
      el.volume = start + (target - start) * t;
      if (t >= 1 && fadeRef.current) {
        window.clearInterval(fadeRef.current);
        fadeRef.current = null;
      }
    }, 60);
  };

  const beginMusic = () => {
    const el = musicRef.current;
    if (!el) return;
    el.volume = 0;
    el.play()
      .then(() => {
        setMuted(false);
        // Slow, intimate creep — ~12s to reach target
        fadeTo(TARGET_VOLUME, 12000);
      })
      .catch(() => {});
  };

  const openEnvelope = () => {
    if (phase !== "envelope") return;
    beginMusic();
    setPhase("opening");
    setTimeout(() => setPhase("revealed"), 2400);
  };

  const toggleMute = () => {
    const el = musicRef.current;
    if (!el) return;
    if (el.paused) {
      beginMusic();
      return;
    }
    if (muted) {
      fadeTo(TARGET_VOLUME, 1200);
      setMuted(false);
    } else {
      fadeTo(0, 800);
      setMuted(true);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Soft acoustic background music — replace src with your licensed track */}
      <audio ref={musicRef} loop preload="auto">
        <source src={acousticAsset.url} type="audio/mpeg" />
      </audio>

      <MuteToggle muted={muted} onToggle={toggleMute} />

      {phase !== "revealed" ? (
        <EnvelopeStage phase={phase} onOpen={openEnvelope} />
      ) : (
        <InvitationContent />
      )}
    </main>
  );
}

function MuteToggle({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={muted ? "Unmute music" : "Mute music"}
      className="fixed top-5 right-5 z-50 grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-ivory/80 text-gold-deep backdrop-blur transition hover:bg-ivory"
    >
      {muted ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <path d="m22 9-6 6M16 9l6 6" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M11 5 6 9H2v6h4l5 4V5Z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" />
        </svg>
      )}
    </button>
  );
}

function EnvelopeStage({ phase, onOpen }: { phase: Phase; onOpen: () => void }) {
  return (
    <section className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="flex flex-col items-center gap-8">
        <p className="font-caps text-[0.65rem] text-gold-deep/80">An Invitation · MMXXVI</p>

        <button
          onClick={onOpen}
          aria-label="Open the invitation"
          className="group relative"
          disabled={phase !== "envelope"}
        >
          <div className={phase === "envelope" ? "animate-float-slow" : ""}>
            <Envelope phase={phase} />
          </div>
        </button>

        <p className="font-caps text-xs text-ink/70">
          {phase === "envelope" ? "Tap to Open" : "Opening…"}
        </p>
      </div>
    </section>
  );
}

function Envelope({ phase }: { phase: Phase }) {
  const opening = phase === "opening";
  return (
    <div className="relative" style={{ perspective: "1200px" }}>
      <div
        className="relative h-[340px] w-[280px] sm:h-[400px] sm:w-[340px] shadow-vintage"
        style={{
          background: "linear-gradient(160deg, oklch(0.42 0.09 155), oklch(0.30 0.07 155))",
          borderRadius: "2px",
        }}
      >
        {/* Inner card peeking */}
        <div
          className={`absolute inset-x-4 bottom-4 top-16 rounded-sm bg-ivory ${opening ? "animate-card-rise" : ""}`}
          style={{
            backgroundImage: "radial-gradient(ellipse at center, oklch(1 0 0 / 0.6), transparent 70%)",
            zIndex: opening ? 5 : 1,
          }}
        >
          <div className="grid h-full place-items-center px-6 text-center">
            <img src={monogram} alt="" className="h-16 w-auto opacity-90" />
          </div>
        </div>

        {/* Envelope flap */}
        <div
          className={`absolute inset-x-0 top-0 origin-top ${opening ? "animate-flap-open" : ""}`}
          style={{
            height: "55%",
            background: "linear-gradient(170deg, oklch(0.38 0.085 155), oklch(0.28 0.065 155))",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            zIndex: opening ? 2 : 10,
            backfaceVisibility: "hidden",
          }}
        />

        {/* Bottom triangle texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(to top, oklch(0.30 0.07 155) 0%, transparent 45%)",
            zIndex: 3,
          }}
        />

        {/* Wax seal — sits over flap point */}
        <img
          src={waxSeal}
          alt="Champagne blush wax seal with B and D monogram"
          className={`pointer-events-none absolute left-1/2 top-[42%] z-20 h-32 w-32 sm:h-40 sm:w-40 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_8px_16px_rgba(80,40,30,0.35)] ${opening ? "animate-seal-crack" : "animate-shimmer"}`}
        />
      </div>
    </div>
  );
}

function InvitationContent() {
  return (
    <div className="animate-fade-up">
      <Hero />
      <DetailsSections />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
      <div className="hairline mx-auto w-full max-w-2xl bg-ivory/70 px-6 py-14 sm:px-12 sm:py-20 shadow-vintage backdrop-blur-sm">
        <img src={monogram} alt="B & D monogram" className="mx-auto h-20 w-auto sm:h-28" />

        <p className="mt-8 font-caps text-[0.7rem] text-ink/70">Together with their families</p>

        <h1 className="mt-4 font-script text-6xl sm:text-7xl leading-[0.9] text-gold-gradient">
          Byron <span className="font-serif-display italic text-5xl sm:text-6xl">&amp;</span> Diana
        </h1>

        <div className="mx-auto mt-8 flex items-center gap-3">
          <span className="h-px w-12 bg-gold/50" />
          <span className="font-caps text-[0.6rem] text-ink/60">Request the honour of your presence</span>
          <span className="h-px w-12 bg-gold/50" />
        </div>

        <p className="mt-4 font-serif-display text-base italic text-ink/70">
          as they exchange vows
        </p>

        <div className="mt-10 grid grid-cols-3 items-center gap-4 text-center">
          <div>
            <p className="font-caps text-[0.6rem] text-ink/60">Day</p>
            <p className="mt-2 font-serif-display text-3xl">III</p>
          </div>
          <div className="border-x border-gold/30">
            <p className="font-caps text-[0.6rem] text-ink/60">Month</p>
            <p className="mt-2 font-script text-3xl text-gold-deep">July</p>
          </div>
          <div>
            <p className="font-caps text-[0.6rem] text-ink/60">Year</p>
            <p className="mt-2 font-serif-display text-3xl">MMXXVI</p>
          </div>
        </div>

        <p className="mt-8 font-caps text-[0.65rem] text-ink/70">Twelve O'Clock · Noon</p>

        <p className="mt-2 font-serif-display text-sm text-ink/80">
          Harris County Justice of the Peace<br />
          Precinct 8, Place 1<br />
          <span className="text-xs text-ink/60">7330 Spencer Hwy · Pasadena, TX 77505</span>
        </p>
      </div>

      <Countdown />

      <a href="#details" className="mt-10 inline-flex flex-col items-center gap-2 text-ink/60 transition hover:text-gold-deep">
        <span className="font-caps text-[0.6rem]">Continue</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </a>
    </section>
  );
}

function Countdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const { days, hours, minutes } = useMemo(() => {
    const diff = Math.max(0, WEDDING_DATE.getTime() - now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return { days: d, hours: h, minutes: m };
  }, [now]);

  const Cell = ({ v, label }: { v: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="font-serif-display text-3xl sm:text-4xl text-gold-deep tabular-nums">{v}</span>
      <span className="mt-1 font-caps text-[0.55rem] text-ink/60">{label}</span>
    </div>
  );

  return (
    <div className="mt-10 flex items-center gap-6 sm:gap-10">
      <Cell v={days} label="Days" />
      <span className="h-8 w-px bg-gold/40" />
      <Cell v={hours} label="Hours" />
      <span className="h-8 w-px bg-gold/40" />
      <Cell v={minutes} label="Minutes" />
    </div>
  );
}

function DetailsSections() {
  return (
    <div id="details" className="mx-auto max-w-2xl px-6 pb-24">
      <LocationBlock />
      <TimelineBlock />
      <PaletteBlock />
      <RsvpBlock />
      <CalendarBlock />
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mt-20 mb-8 text-center">
      <p className="font-caps text-[0.6rem] text-gold-deep/80">{eyebrow}</p>
      <h2 className="mt-3 font-script text-4xl text-ink">{title}</h2>
      <div className="mx-auto mt-3 h-px w-16 bg-gold/50" />
    </div>
  );
}

function LocationBlock() {
  return (
    <section>
      <SectionTitle eyebrow="Location" title="Where" />
      <div className="hairline overflow-hidden bg-ivory/70 shadow-vintage">
        <img
          src={courthouse}
          alt="The courthouse where the ceremony will take place"
          loading="lazy"
          className="aspect-[4/3] w-full object-cover"
        />
        <div className="p-6 text-center">
          <p className="font-serif-display text-base text-ink">
            Harris County Justice of the Peace
          </p>
          <p className="text-sm text-ink/70">Precinct 8, Place 1</p>
          <p className="mt-1 text-xs text-ink/60">7330 Spencer Hwy · Pasadena, TX 77505</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${VENUE_QUERY}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block border border-gold-deep/70 px-6 py-2 font-caps text-[0.65rem] text-gold-deep transition hover:bg-gold-deep hover:text-ivory"
          >
            View on Map
          </a>
          <p className="mt-5 font-serif-display text-sm italic text-ink/70">
            Kindly meet us by the main entrance fifteen minutes before the ceremony.
          </p>
        </div>
      </div>
    </section>
  );
}

function TimelineBlock() {
  const items = [
    { time: "12:00 PM", title: "Ceremony", note: "Exchange of vows" },
    { time: "12:45 PM", title: "Portraits", note: "Family photos on the courthouse steps" },
    { time: "1:15 PM", title: "Mingle & Gather", note: "A quiet hour to greet family, share gifts, and linger together" },
  ];

  // Spiral coordinates (logarithmic rose) — petals out from the centre
  const cx = 200;
  const cy = 200;
  // Build a smooth spiral SVG path
  const spiralPath = useMemo(() => {
    const points: string[] = [];
    const turns = 2.6;
    const steps = 220;
    const a = 6;
    const b = 16;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * turns * Math.PI * 2;
      const r = a + b * t * 0.32;
      const x = cx + r * Math.cos(t);
      const y = cy + r * Math.sin(t);
      points.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return points.join(" ");
  }, []);

  // Place items along the outer half of the spiral
  const markers = items.map((_, i) => {
    const t = (0.55 + i * 0.45) * Math.PI * 2; // spread along outer turns
    const r = 6 + 16 * t * 0.32;
    return {
      x: cx + r * Math.cos(t),
      y: cy + r * Math.sin(t),
    };
  });

  return (
    <section>
      <SectionTitle eyebrow="Order of the Day" title="Schedule" />
      <div className="hairline relative bg-ivory/70 p-6 sm:p-10 shadow-vintage">
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
            <defs>
              <linearGradient id="rose-stroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(0.78 0.12 85)" />
                <stop offset="50%" stopColor="oklch(0.55 0.11 70)" />
                <stop offset="100%" stopColor="oklch(0.78 0.12 85)" />
              </linearGradient>
            </defs>
            {/* Decorative outer rose petals */}
            <g
              fill="none"
              stroke="oklch(0.72 0.12 80 / 0.25)"
              strokeWidth="1"
            >
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const x1 = cx + Math.cos(angle) * 30;
                const y1 = cy + Math.sin(angle) * 30;
                const x2 = cx + Math.cos(angle) * 175;
                const y2 = cy + Math.sin(angle) * 175;
                const cxp = cx + Math.cos(angle + 0.4) * 130;
                const cyp = cy + Math.sin(angle + 0.4) * 130;
                return (
                  <path
                    key={i}
                    d={`M ${x1} ${y1} Q ${cxp} ${cyp} ${x2} ${y2}`}
                  />
                );
              })}
            </g>
            {/* The spiral path */}
            <path
              d={spiralPath}
              fill="none"
              stroke="url(#rose-stroke)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Centre rose bud */}
            <circle cx={cx} cy={cy} r="6" fill="oklch(0.55 0.11 70)" />
            <circle cx={cx} cy={cy} r="11" fill="none" stroke="oklch(0.72 0.12 80 / 0.6)" />
            {/* Marker dots */}
            {markers.map((m, i) => (
              <g key={i}>
                <circle cx={m.x} cy={m.y} r="8" fill="oklch(0.975 0.012 85)" stroke="oklch(0.55 0.11 70)" strokeWidth="1.2" />
                <circle cx={m.x} cy={m.y} r="3" fill="oklch(0.55 0.11 70)" />
              </g>
            ))}
          </svg>

          {/* Labels positioned over markers */}
          {markers.map((m, i) => {
            const it = items[i];
            const leftPct = (m.x / 400) * 100;
            const topPct = (m.y / 400) * 100;
            // Decide which side the label sits based on angle from centre
            const dx = m.x - cx;
            const alignRight = dx < 0;
            return (
              <div
                key={i}
                className="absolute w-[44%] sm:w-[40%]"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: `translate(${alignRight ? "-104%" : "4%"}, -50%)`,
                  textAlign: alignRight ? "right" : "left",
                }}
              >
                <p className="font-caps text-[0.55rem] text-gold-deep">{it.time}</p>
                <p className="mt-0.5 font-serif-display text-base leading-tight text-ink">{it.title}</p>
                <p className="mt-0.5 text-[0.7rem] italic leading-snug text-ink/60">{it.note}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center font-serif-display text-xs italic text-ink/60">
          No formal reception — simply linger with us awhile.
        </p>
      </div>
    </section>
  );
}

function PaletteBlock() {
  const colors = [
    { name: "Baby Blue", css: "oklch(0.88 0.04 235)" },
    { name: "Champagne", css: "oklch(0.89 0.045 80)" },
    { name: "Soft Blush", css: "oklch(0.88 0.045 25)" },
    { name: "Emerald", css: "oklch(0.36 0.08 155)" },
  ];
  return (
    <section>
      <SectionTitle eyebrow="Attire" title="Dress in Our Palette" />
      <div className="hairline bg-ivory/70 p-8 text-center shadow-vintage">
        <p className="font-serif-display text-base italic text-ink/80">
          We'd love for our guests to dress in shades from our wedding palette.
        </p>
        <div className="mt-8 grid grid-cols-4 gap-4 sm:gap-6">
          {colors.map((c) => (
            <div key={c.name} className="flex flex-col items-center gap-3">
              <span
                className="h-16 w-16 rounded-full border border-gold/30 shadow-[inset_0_2px_6px_rgba(255,255,255,0.5),0_4px_12px_rgba(0,0,0,0.08)] sm:h-20 sm:w-20"
                style={{ background: c.css }}
              />
              <span className="font-caps text-[0.55rem] text-ink/70">{c.name}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 font-caps text-[0.6rem] text-ink/60">Kindly avoid white or ivory</p>
      </div>
    </section>
  );
}

function RsvpBlock() {
  const [open, setOpen] = useState(false);
  return (
    <section>
      <SectionTitle eyebrow="Répondez s'il vous plaît" title="Kindly Respond" />
      <div className="text-center">
        <p className="font-serif-display text-base text-ink/80">
          Your presence would mean the world to us.
        </p>
        <p className="mt-2 font-caps text-[0.6rem] text-gold-deep">
          Kindly respond by June 30th
        </p>
        <button
          onClick={() => setOpen(true)}
          className="mt-6 inline-block border border-gold-deep bg-gold-deep px-10 py-3 font-caps text-[0.65rem] text-ivory transition hover:bg-ink hover:border-ink"
        >
          Kindly Respond
        </button>
      </div>
      {open && <RsvpDialog onClose={() => setOpen(false)} />}
    </section>
  );
}

function RsvpDialog({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", attending: "yes", guests: 1, message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          attending: form.attending === "yes" ? "Joyfully Accepts" : "Regretfully Declines",
          guests: form.attending === "yes" ? form.guests : 0,
          message: form.message,
          _subject: `RSVP from ${form.name} — Byron & Diana`,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      navigate({ to: "/thank-you" });
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };


  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="hairline w-full max-w-md bg-ivory p-8 shadow-vintage animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {!submitted ? (
          <>
            <p className="text-center font-caps text-[0.6rem] text-gold-deep">RSVP</p>
            <h3 className="mt-2 text-center font-script text-3xl text-ink">Your Reply</h3>
            <form onSubmit={submit} className="mt-6 space-y-5">
              <Field label="Full Name">
                <input
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border-b border-gold/40 bg-transparent py-2 font-serif-display text-base text-ink outline-none focus:border-gold-deep"
                />
              </Field>
              <Field label="Will you attend?">
                <div className="flex gap-3">
                  {["yes", "no"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setForm({ ...form, attending: v })}
                      className={`flex-1 border py-2 font-caps text-[0.6rem] transition ${
                        form.attending === v
                          ? "border-gold-deep bg-gold-deep text-ivory"
                          : "border-gold/40 text-ink/70 hover:border-gold-deep"
                      }`}
                    >
                      {v === "yes" ? "Joyfully Accepts" : "Regretfully Declines"}
                    </button>
                  ))}
                </div>
              </Field>
              {form.attending === "yes" && (
                <Field label="Number of Guests">
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
                    className="w-24 border-b border-gold/40 bg-transparent py-2 font-serif-display text-base text-ink outline-none focus:border-gold-deep"
                  />
                </Field>
              )}
              <Field label="A Note for the Couple (optional)">
                <textarea
                  rows={3}
                  maxLength={500}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full resize-none border-b border-gold/40 bg-transparent py-2 font-serif-display text-base text-ink outline-none focus:border-gold-deep"
                />
              </Field>
              {error && (
                <p className="text-center font-caps text-[0.6rem] text-red-700">{error}</p>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 border border-gold/40 py-3 font-caps text-[0.6rem] text-ink/70 hover:border-gold-deep disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !form.name.trim()}
                  className="flex-1 border border-gold-deep bg-gold-deep py-3 font-caps text-[0.6rem] text-ivory hover:bg-ink hover:border-ink disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send Reply"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-6 text-center">
            <p className="font-caps text-[0.6rem] text-gold-deep">Thank You</p>
            <h3 className="mt-3 font-script text-4xl text-ink">With gratitude</h3>
            <p className="mt-4 font-serif-display italic text-ink/70">
              Your reply has been received. We can't wait to celebrate.
            </p>
            <button
              onClick={onClose}
              className="mt-8 border border-gold-deep bg-gold-deep px-10 py-2 font-caps text-[0.6rem] text-ivory"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-caps text-[0.55rem] text-ink/60">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function CalendarBlock() {
  // 12:00 PM CDT = 17:00 UTC; +1 hour
  const start = "20260703T170000Z";
  const end = "20260703T180000Z";
  const title = encodeURIComponent("Byron & Diana — Wedding Ceremony");
  const details = encodeURIComponent("Court wedding ceremony of Byron & Diana.");
  const location = VENUE_QUERY;
  const gcal = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;

  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:byron-diana-2026@wedding\nDTSTAMP:${start}\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:Byron & Diana — Wedding Ceremony\nLOCATION:Harris County Justice of the Peace Precinct 8, 7330 Spencer Hwy, Pasadena, TX 77505\nDESCRIPTION:Court wedding ceremony of Byron & Diana.\nEND:VEVENT\nEND:VCALENDAR`;
  const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;

  return (
    <section>
      <SectionTitle eyebrow="Save the Date" title="Add to Calendar" />
      <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
        <a
          href={gcal}
          target="_blank"
          rel="noreferrer"
          className="flex-1 border border-gold-deep/70 py-3 text-center font-caps text-[0.6rem] text-gold-deep transition hover:bg-gold-deep hover:text-ivory"
        >
          Google
        </a>
        <a
          href={icsHref}
          download="byron-diana.ics"
          className="flex-1 border border-gold-deep/70 py-3 text-center font-caps text-[0.6rem] text-gold-deep transition hover:bg-gold-deep hover:text-ivory"
        >
          Apple
        </a>
        <a
          href={icsHref}
          download="byron-diana.ics"
          className="flex-1 border border-gold-deep/70 py-3 text-center font-caps text-[0.6rem] text-gold-deep transition hover:bg-gold-deep hover:text-ivory"
        >
          Outlook
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gold/20 px-6 py-16 text-center">
      <img src={monogram} alt="" className="mx-auto h-10 w-auto opacity-70" />
      <p className="mt-6 font-script text-3xl text-gold-gradient">Byron &amp; Diana</p>
      <p className="mt-3 font-caps text-[0.55rem] text-ink/50">III · VII · MMXXVI</p>
      <p className="mt-8 font-serif-display text-xs italic text-ink/50">
        Your presence is the only gift we require.
      </p>
    </footer>
  );
}
