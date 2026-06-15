import { createFileRoute, Link } from "@tanstack/react-router";
import monogram from "@/assets/monogram.png";
import waxSeal from "@/assets/wax-seal.png";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thank You — Byron & Diana" },
      { name: "description", content: "Your RSVP for Byron & Diana's wedding has been received." },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  return (
    <main className="relative grid min-h-screen place-items-center px-6 py-20">
      <div className="hairline mx-auto w-full max-w-xl bg-ivory/80 px-8 py-14 text-center shadow-vintage backdrop-blur-sm animate-fade-up">
        <img src={waxSeal} alt="" className="mx-auto h-24 w-24 drop-shadow-[0_8px_16px_rgba(80,40,30,0.25)]" />
        <p className="mt-8 font-caps text-[0.6rem] text-gold-deep">Reply Received</p>
        <h1 className="mt-3 font-script text-5xl text-gold-gradient">With Gratitude</h1>
        <div className="mx-auto mt-4 h-px w-16 bg-gold/50" />
        <p className="mt-6 font-serif-display text-base italic text-ink/75">
          Thank you for sharing in our joy. Your reply has been carried home
          and tucked beside our hearts.
        </p>
        <p className="mt-4 font-serif-display text-sm text-ink/70">
          We cannot wait to see you on the third of July.
        </p>

        <img src={monogram} alt="" className="mx-auto mt-10 h-12 w-auto opacity-80" />
        <p className="mt-3 font-caps text-[0.55rem] text-ink/50">Byron &amp; Diana · III · VII · MMXXVI</p>

        <Link
          to="/"
          className="mt-10 inline-block border border-gold-deep bg-gold-deep px-10 py-3 font-caps text-[0.6rem] text-ivory transition hover:bg-ink hover:border-ink"
        >
          Return to Invitation
        </Link>
      </div>
    </main>
  );
}
