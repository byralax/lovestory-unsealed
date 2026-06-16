import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import monogram from "@/assets/monogram.png";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xrevjyyj";

export const Route = createFileRoute("/rsvp")({
  head: () => ({
    meta: [
      { title: "RSVP — Byron & Diana" },
      { name: "description", content: "Kindly respond to the wedding invitation of Byron & Diana." },
    ],
  }),
  component: RsvpPage,
});

function RsvpPage() {
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
    <main className="relative grid min-h-screen place-items-center px-4 py-12 sm:py-20">
      <div className="hairline mx-auto w-full max-w-md bg-ivory p-6 sm:p-10 shadow-vintage animate-fade-up">
        <img src={monogram} alt="" className="mx-auto h-10 w-auto opacity-80" />
        <p className="mt-6 text-center font-caps text-[0.6rem] text-gold-deep">RSVP</p>
        <h1 className="mt-2 text-center font-script text-4xl text-gold-gradient">Your Reply</h1>
        <div className="mx-auto mt-3 h-px w-16 bg-gold/50" />
        <p className="mt-4 text-center font-serif-display text-sm italic text-ink/70">
          Kindly respond by June 30th.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-5">
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
          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row">
            <Link
              to="/"
              className="flex-1 border border-gold/40 py-3 text-center font-caps text-[0.6rem] text-ink/70 hover:border-gold-deep"
            >
              Back
            </Link>
            <button
              type="submit"
              disabled={submitting || !form.name.trim()}
              className="flex-1 border border-gold-deep bg-gold-deep py-3 font-caps text-[0.6rem] text-ivory hover:bg-ink hover:border-ink disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send Reply"}
            </button>
          </div>
        </form>
      </div>
    </main>
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
