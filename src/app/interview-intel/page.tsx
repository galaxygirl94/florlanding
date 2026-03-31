"use client";

import { useState } from "react";
import Link from "next/link";

/* ── accordion data ────────────────────────────────────────────── */

interface Card {
  icon: string;
  title: string;
  body: React.ReactNode;
}

interface Section {
  label: string;
  emoji: string;
  cards: Card[];
}

const SECTIONS: Section[] = [
  {
    label: "Before the Interview",
    emoji: "📋",
    cards: [
      {
        icon: "🔍",
        title: "How to research a facility",
        body: (
          <>
            <p className="mb-3">
              Before you walk into any interview, you should know more about the unit than the recruiter expects. On Flor, start with <strong>FloorCheck ratios</strong> — these are nurse-reported staffing numbers, not what HR puts on a job posting. Look at <strong>nurse reviews</strong> from people who actually work there, and check <strong>Ask the Floor Q&amp;A</strong> to see what questions others have asked about the unit.
            </p>
            <p className="mb-3">
              <span className="font-bold text-red-500">Red flags:</span> The facility won&apos;t disclose their patient ratio. There are zero reviews from current staff. The job has been reposted three or four times in six months. The listing says &ldquo;competitive pay&rdquo; without a single number.
            </p>
            <p>
              <span className="font-bold text-periwinkle">Green flags:</span> Verified ratios on Flor, an active <strong>Ethics Pledge</strong> badge, recent positive reviews, and transparent pay ranges. If you can see all of that before the interview, you&apos;re already ahead.
            </p>
          </>
        ),
      },
      {
        icon: "👔",
        title: "What to wear",
        body: (
          <>
            <p className="mb-3">
              This depends on the unit. <strong>OR / procedural areas:</strong> Scrubs are usually provided on-site — just show up in clean, professional clothes and expect to change. Don&apos;t buy a brand new pair of scrubs for an OR interview; they&apos;ll give you theirs.
            </p>
            <p className="mb-3">
              <strong>Floor nursing / outpatient / clinic:</strong> Business casual. Think nice pants or a skirt, a clean blouse or button-down, and closed-toe shoes you can actually walk in. You might get a unit tour, so skip the heels.
            </p>
            <p>
              <strong>Admin / management / leadership roles:</strong> Go professional. Blazer, dress pants or a professional dress. You&apos;re interviewing with directors and executives — match the energy.
            </p>
          </>
        ),
      },
      {
        icon: "❓",
        title: "Questions you should always ask",
        body: (
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2">
              <span className="text-periwinkle font-bold mt-0.5">1.</span>
              <span><strong>&ldquo;What&apos;s the typical patient ratio on this unit?&rdquo;</strong> — If they dodge this, that&apos;s your answer.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-periwinkle font-bold mt-0.5">2.</span>
              <span><strong>&ldquo;What&apos;s the float pool policy?&rdquo;</strong> — Will you get floated to units you&apos;ve never worked? How often?</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-periwinkle font-bold mt-0.5">3.</span>
              <span><strong>&ldquo;How long has the current manager been in this role?&rdquo;</strong> — High turnover in leadership tells you everything.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-periwinkle font-bold mt-0.5">4.</span>
              <span><strong>&ldquo;What happened to the last person in this position?&rdquo;</strong> — Promoted? Burned out? Left after three months? You need to know.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-periwinkle font-bold mt-0.5">5.</span>
              <span><strong>&ldquo;What are the exact shift differential amounts?&rdquo;</strong> — Not &ldquo;we offer differentials.&rdquo; Exact dollars.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-periwinkle font-bold mt-0.5">6.</span>
              <span><strong>&ldquo;What does tuition reimbursement actually cover?&rdquo;</strong> — Annual cap, approved programs, timeline to qualify.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-periwinkle font-bold mt-0.5">7.</span>
              <span><strong>&ldquo;How is call structured?&rdquo;</strong> — Mandatory? Voluntary? How often? What&apos;s the callback rate?</span>
            </li>
          </ul>
        ),
      },
      {
        icon: "👀",
        title: "How to read unit culture in the first 5 minutes",
        body: (
          <>
            <p className="mb-3">
              When you walk onto the floor for a tour, stop selling yourself for a minute and just <em>observe</em>. Are nurses talking to each other, or is everyone head-down and silent? Do you hear any laughter? A quiet unit isn&apos;t always a focused unit — sometimes it&apos;s an exhausted one.
            </p>
            <p className="mb-3">
              Watch how the charge nurse greets you. Do they seem genuinely happy to meet a potential colleague, or is it an interruption? That energy is what you&apos;ll get at 3 AM on a hard shift.
            </p>
            <p>
              Check the break room. Is it functional — stocked, clean, with actual seating? Or is it a supply closet with a microwave from 2006? The break room tells you exactly how much the facility values staff well-being.
            </p>
          </>
        ),
      },
      {
        icon: "✅",
        title: "License verification checklist",
        body: (
          <>
            <p className="mb-3">
              Don&apos;t let something administrative derail your interview. Before you apply anywhere, verify these yourself:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-periwinkle">&#10003;</span>
                <span>Check <strong>Nursys</strong> to confirm your license shows as active and in good standing — this is the first thing employers check.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-periwinkle">&#10003;</span>
                <span>Go directly to your <strong>state board of nursing</strong> website and verify your license number, expiration date, and any disciplinary notes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-periwinkle">&#10003;</span>
                <span>Confirm your <strong>continuing education (CE) requirements</strong> are met for your current renewal period. Some states require specific topics like opioid education or implicit bias training.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-periwinkle">&#10003;</span>
                <span>If you hold a <strong>compact (NLC) license</strong>, verify the state you&apos;re interviewing in is a compact state — don&apos;t assume.</span>
              </li>
            </ul>
          </>
        ),
      },
    ],
  },
  {
    label: "During the Interview",
    emoji: "🎤",
    cards: [
      {
        icon: "⭐",
        title: "STAR format for nursing",
        body: (
          <>
            <p className="mb-3">
              Behavioral interview questions dominate nursing interviews. The STAR method keeps your answers tight and memorable: <strong>Situation</strong> — set the scene in one sentence. <strong>Task</strong> — what was your responsibility? <strong>Action</strong> — what did <em>you</em> specifically do? <strong>Result</strong> — what happened because of your action?
            </p>
            <p className="mb-3 font-semibold text-text">Nursing-specific examples:</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-periwinkle font-bold">&#8226;</span>
                <span><strong>Code blue response:</strong> &ldquo;I was the first nurse to reach a patient in V-fib. I initiated CPR within 15 seconds, called the code, and had the crash cart ready before the team arrived. The patient was stabilized and transferred to ICU.&rdquo;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-periwinkle font-bold">&#8226;</span>
                <span><strong>Family conflict:</strong> &ldquo;A patient&apos;s daughter was upset about the care plan. I sat with her privately, listened to her concerns, clarified the physician&apos;s reasoning, and we adjusted the communication plan. She thanked me at discharge.&rdquo;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-periwinkle font-bold">&#8226;</span>
                <span><strong>Medication error catch:</strong> &ldquo;During med pass, I noticed a dose that was double the standard range. I held the medication, called pharmacy to verify, and it turned out to be a prescribing error. Patient never received the wrong dose.&rdquo;</span>
              </li>
            </ul>
          </>
        ),
      },
      {
        icon: "💬",
        title: "Common nursing interview questions",
        body: (
          <div className="space-y-5">
            <div>
              <p className="font-semibold text-text mb-1">&ldquo;Tell me about a time you disagreed with a physician.&rdquo;</p>
              <p className="text-text-light text-sm">They want to see that you advocate for your patient <em>and</em> handle conflict professionally. Don&apos;t trash the doctor. Focus on how you communicated your concern, what evidence you used, and the outcome.</p>
            </div>
            <div>
              <p className="font-semibold text-text mb-1">&ldquo;Describe your worst patient outcome.&rdquo;</p>
              <p className="text-text-light text-sm">This is about self-reflection, not a confessional. Pick a situation where you learned something that changed your practice. Show that you processed it — not that you&apos;re still carrying it.</p>
            </div>
            <div>
              <p className="font-semibold text-text mb-1">&ldquo;How do you handle a patient who refuses care?&rdquo;</p>
              <p className="text-text-light text-sm">Autonomy is a core nursing principle. Explain that you educate, document, and respect the decision. Mention involving the care team when appropriate. Never say you&apos;d force anything.</p>
            </div>
            <div>
              <p className="font-semibold text-text mb-1">&ldquo;What&apos;s your patient ratio comfort zone?&rdquo;</p>
              <p className="text-text-light text-sm">Be honest. If you&apos;re a med/surg nurse comfortable at 1:5 but not 1:7, say so. Back it up with why — patient safety, not personal preference. Use Flor&apos;s FloorCheck data to show you&apos;ve done your research on their unit.</p>
            </div>
            <div>
              <p className="font-semibold text-text mb-1">&ldquo;Why are you leaving your current position?&rdquo;</p>
              <p className="text-text-light text-sm">Keep it professional. &ldquo;I&apos;m looking for better ratios,&rdquo; &ldquo;I want to specialize,&rdquo; or &ldquo;I&apos;m relocating&rdquo; are all fine. Never badmouth your current employer — even if they deserve it.</p>
            </div>
          </div>
        ),
      },
      {
        icon: "💰",
        title: "How to negotiate pay without a recruiter",
        body: (
          <>
            <p className="mb-3">
              On Flor, you&apos;re talking directly to the hiring manager or HR — there&apos;s no recruiter middleman. That&apos;s an advantage, but it means <em>you</em> need to negotiate for yourself. Here&apos;s how:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-periwinkle font-bold">1.</span>
                <span><strong>Know your market rate first.</strong> Use Flor&apos;s <strong>Pay Intelligence</strong> tool to see what nurses in your specialty and region are actually earning — not job listing ranges, real reported pay.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-periwinkle font-bold">2.</span>
                <span><strong>Never accept the first offer.</strong> The first number is almost always the starting point, not the ceiling. A polite &ldquo;I was hoping to be closer to $X based on my experience and the market&rdquo; works.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-periwinkle font-bold">3.</span>
                <span><strong>Ask about differentials separately.</strong> Night, weekend, charge, and certification pay can add $3-8/hr each. Get the full picture before you evaluate base pay.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-periwinkle font-bold">4.</span>
                <span><strong>If they can&apos;t move on base pay, negotiate benefits.</strong> Extra PTO days, a sign-on bonus without a clawback, tuition reimbursement, or a guaranteed schedule can be worth thousands.</span>
              </li>
            </ul>
          </>
        ),
      },
      {
        icon: "🛡️",
        title: "How to ask about ratio, float pool, and call",
        body: (
          <>
            <p className="mb-3">
              These are the questions that matter most to your daily life — and the ones most nurses are afraid to ask because they don&apos;t want to seem &ldquo;difficult.&rdquo; Reframe them so they land as patient-care focused, not self-focused:
            </p>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-periwinkle font-bold">&#8226;</span>
                <span><strong>Ratio:</strong> &ldquo;I want to make sure I can give the best care possible — what does the typical patient load look like on days vs. nights?&rdquo;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-periwinkle font-bold">&#8226;</span>
                <span><strong>Float pool:</strong> &ldquo;I&apos;m happy to be flexible when the team needs it — how does floating work here, and how often does it happen?&rdquo;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-periwinkle font-bold">&#8226;</span>
                <span><strong>Call:</strong> &ldquo;I want to plan my life around work responsibly — is call mandatory, and what does the typical call schedule look like?&rdquo;</span>
              </li>
            </ul>
            <p className="mt-3 text-sm text-text-muted">
              The framing matters. &ldquo;I want to give great care&rdquo; and &ldquo;I want to be a reliable team member&rdquo; are always better than &ldquo;I don&apos;t want to work too hard.&rdquo; Same question, completely different impression.
            </p>
          </>
        ),
      },
    ],
  },
  {
    label: "After the Interview",
    emoji: "📬",
    cards: [
      {
        icon: "✉️",
        title: "How to follow up",
        body: (
          <>
            <p className="mb-3">
              Send a short email within 24 hours. Not a novel — three to four sentences max. Thank them for their time, reference something specific from the conversation (&ldquo;I enjoyed hearing about the new charting system rollout&rdquo;), and restate your interest. That&apos;s it.
            </p>
            <p>
              If you interviewed with multiple people, send individual emails — not a group CC. It takes five extra minutes and shows you were paying attention to each person.
            </p>
          </>
        ),
      },
      {
        icon: "📄",
        title: "How to evaluate a written offer",
        body: (
          <>
            <p className="mb-3">
              An offer letter is not just a base pay number. Before you sign, check every line:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-periwinkle">&#10003;</span>
                <span><strong>Base pay vs. total compensation</strong> — Is the headline number base hourly, or does it include differentials and overtime projections?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-periwinkle">&#10003;</span>
                <span><strong>Differential breakdown</strong> — Night, weekend, holiday, charge, and certification differentials should each be listed separately.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-periwinkle">&#10003;</span>
                <span><strong>Benefits start date</strong> — Some employers make you wait 30, 60, or 90 days for health insurance. That matters.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-periwinkle">&#10003;</span>
                <span><strong>PTO accrual rate</strong> — How many hours per pay period? When can you actually use it? Is there a blackout period?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-periwinkle">&#10003;</span>
                <span><strong>Sign-on bonus clawback terms</strong> — If there&apos;s a sign-on bonus, what happens if you leave at 6 months? 12 months? Read the fine print.</span>
              </li>
            </ul>
          </>
        ),
      },
      {
        icon: "🤝",
        title: "How to decline gracefully",
        body: (
          <>
            <p className="mb-3">
              Nursing is a small world, and the manager you decline today might be the one hiring for your dream unit in two years. Keep it professional: thank them sincerely, say you&apos;ve decided to go in a different direction, and leave it at that.
            </p>
            <p>
              You can be honest about <em>why</em> within reason — &ldquo;The schedule wasn&apos;t quite the right fit&rdquo; or &ldquo;I accepted a position closer to home&rdquo; are fine. &ldquo;Your unit looked chaotic and your pay is bad&rdquo; is not. Even if it&apos;s true, save that energy for your Flor review.
            </p>
          </>
        ),
      },
      {
        icon: "⚖️",
        title: "How to handle counteroffers",
        body: (
          <>
            <p className="mb-3">
              You put in your notice, and suddenly your current employer offers you more money, a better schedule, or a promotion they never mentioned before. Tempting, right? Here&apos;s the reality: <strong>data consistently shows that most nurses who accept a counteroffer leave within six months anyway.</strong>
            </p>
            <p className="mb-3">
              The reasons you wanted to leave — the ratios, the culture, the management — don&apos;t change because your base pay went up $2/hr. And now you&apos;re the person who tried to leave. That changes how leadership sees you.
            </p>
            <p>
              If the counteroffer genuinely addresses the root problem (not just money), consider it. But if your gut said &ldquo;I need to go,&rdquo; trust your gut. You started looking for a reason.
            </p>
          </>
        ),
      },
    ],
  },
];

/* ── components ─────────────────────────────────────────────── */

function AccordionCard({ card, isOpen, toggle }: { card: Card; isOpen: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="w-full text-left bg-white rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-transparent hover:border-periwinkle/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-periwinkle/40"
    >
      <div className="flex items-start gap-4">
        <span className="text-2xl flex-shrink-0 mt-0.5">{card.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-base sm:text-lg font-bold text-text leading-snug">{card.title}</h4>
            <svg
              className={`w-5 h-5 flex-shrink-0 text-periwinkle transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {isOpen && (
            <div className="mt-4 text-sm sm:text-[15px] text-text-light leading-relaxed">
              {card.body}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function AccordionSection({ section, sectionIndex }: { section: Section; sectionIndex: number }) {
  const [openSection, setOpenSection] = useState(true);
  const [openCards, setOpenCards] = useState<Set<number>>(new Set());

  const toggleCard = (i: number) => {
    setOpenCards((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div>
      <button
        onClick={() => setOpenSection(!openSection)}
        className="w-full text-left group focus:outline-none"
      >
        <div className="flex items-center gap-4 mb-6">
          <span className="text-2xl">{section.emoji}</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-text leading-tight">
            {section.label}
          </h3>
          <svg
            className={`w-6 h-6 text-periwinkle transition-transform duration-300 ml-auto ${openSection ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {openSection && (
        <div className="space-y-4 ml-0 sm:ml-10">
          {section.cards.map((card, i) => (
            <AccordionCard
              key={i}
              card={card}
              isOpen={openCards.has(i)}
              toggle={() => toggleCard(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── page ───────────────────────────────────────────────────── */

export default function InterviewIntelPage() {
  return (
    <div className="bg-[#F4F4FB] min-h-screen">
      {/* Hero */}
      <section className="bg-[#1E1E2E] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-periwinkle/8 rounded-full blur-[120px]" />
        <div className="relative max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-periwinkle text-sm font-bold uppercase tracking-wider mb-5">
              <span className="w-8 h-px bg-periwinkle" />
              &#10047; Flor Exclusive
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight">
              Interview Intel
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/75 leading-relaxed max-w-xl">
              Everything you need to walk in prepared, negotiate with confidence, and leave with the offer you actually want. Nurse-to-nurse advice — no HR fluff.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/jobs/matched"
                className="bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-8 py-4 rounded-full text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center"
              >
                Prep for this interview &rarr;
              </Link>
              <Link
                href="/pay-intelligence"
                className="bg-white/10 hover:bg-white/15 text-white font-bold px-8 py-4 rounded-full text-base border border-white/20 transition-all duration-200 text-center"
              >
                Check your market rate &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion Sections */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
        <div className="space-y-16">
          {SECTIONS.map((section, i) => (
            <AccordionSection key={i} section={section} sectionIndex={i} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-[1200px] mx-auto px-6 sm:px-10 lg:px-16 pb-20">
        <div className="bg-[#1E1E2E] rounded-2xl p-10 sm:p-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Ready to put this into practice?
          </h2>
          <p className="text-white/70 text-base sm:text-lg max-w-lg mx-auto mb-8">
            Find your next role on Flor — real pay, real ratios, real reviews. Then walk into that interview like you own it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/jobs/matched"
              className="bg-periwinkle hover:bg-periwinkle-dark text-white font-bold px-8 py-4 rounded-full text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Prep for this interview &rarr;
            </Link>
            <Link
              href="/pay-intelligence"
              className="bg-white/10 hover:bg-white/15 text-white font-bold px-8 py-4 rounded-full text-base border border-white/20 transition-all duration-200"
            >
              Check your market rate &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
