import type { Metadata } from "next";
import Link from "next/link";

import { DocHead } from "@/components/Doc";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { DiamondRule } from "@/components/Ornaments";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "House Rules — Nines at Nine",
  description: "Every good room has rules. Ours are short, and we keep them.",
};

const BIG_RULES = [
  { n: "I", title: "Be the person in your photographs.", sub: "Recent, unfiltered, only you." },
  { n: "II", title: "Turn up.", sub: "A missing seat breaks a room of twenty." },
  { n: "III", title: "Cameras on.", sub: "Face lit, nobody else in frame." },
  { n: "IV", title: "Keep the room.", sub: "What happens in it stays in it." },
];

const STAGES = [
  {
    when: "Before",
    label: "The door",
    heading: "At the door",
    sub: "When you apply.",
    rules: [
      [
        "Your face, this year.",
        "Three photographs of you, recent and unfiltered. The room will see you on camera anyway.",
      ],
      [
        "Your own name. Eighteen and over.",
        "One application, one person. No second accounts, and no exceptions on age.",
      ],
      [
        "Back only people you’d introduce in person.",
        "When you back a friend, you answer for them. Choose as if you were bringing them to dinner.",
      ],
    ],
  },
  {
    when: "Inside",
    label: "The lobby",
    heading: "Once you’re in",
    sub: "The lobby is where members wait for Friday, and where they vote on who’s in the room.",
    rules: [
      [
        "Discretion.",
        "Who you see in the lobby stays in the lobby. Don’t name them, describe them, or confirm they’re here.",
      ],
      [
        "One question.",
        "When you vote, you answer only this: who would you rather meet? Not who’s better. Just that.",
      ],
      ["Never your own.", "You never vote on someone you backed, or someone who backed you."],
      [
        "Photographs stay on the screen.",
        "No screenshots, no saving, no showing a friend. A leaked photograph is treated like a leaked phone number.",
      ],
      [
        "Never reach out to anyone you’ve voted on.",
        "Not before Friday, not after, not on another app.",
      ],
    ],
  },
  {
    when: "21:00",
    label: "Friday",
    heading: "On the night",
    sub: "Nine rounds. Three minutes each.",
    rules: [
      ["Doors at nine.", "Be in the room by 8:55. The first round starts on time, with or without you."],
      ["Dress as if it were a bar.", "You’re on camera, and so are they."],
      [
        "Nothing else on screen.",
        "No second tab, no phone in hand. The three minutes belong to the person in front of you.",
      ],
      [
        "Nothing is recorded.",
        "Not by us, and not by you. No screen recording, no screenshots, no photographs of the screen.",
      ],
      [
        "Nothing you wouldn’t do at a bar.",
        "No nudity, nothing sexual, no asking for money, nothing for sale.",
      ],
      ["Leave whenever you like.", "One tap ends any round. You never owe anyone a reason."],
    ],
  },
  {
    when: "After",
    label: "Ten o’clock",
    heading: "After the room",
    sub: "When the last round ends.",
    rules: [
      [
        "Only a yes from both of you.",
        "Contact details pass only when you both choose each other. Never otherwise, and never by asking in a round.",
      ],
      [
        "A no stays unspoken.",
        "If someone didn’t choose you, you’ll never be told. Don’t go looking for them elsewhere.",
      ],
      [
        "The first drink is in public.",
        "Somewhere busy. Tell a friend where you’ll be. Get yourself home.",
      ],
    ],
  },
];

const IMMEDIATE = [
  "Recording anyone",
  "Harassment or threats",
  "Anything sexual on camera",
  "Being under eighteen",
  "A face that isn’t yours",
];

export default function HouseRulesPage() {
  return (
    <>
      <Header />
      <main id="main">
        <article className="wrap doc" aria-labelledby="house-rules-title">
          <DocHead
            id="house-rules-title"
            eyebrow="Members and those who hope to be"
            title="House Rules."
            showMeta={false}
            sub={
              <>
                Every good room has rules.{" "}
                <span style={{ color: "var(--gold-soft)" }}>Ours are short, and we keep them.</span>
              </>
            }
          />

          <p className="hr-cap">The four everyone remembers.</p>
          <ol className="big-rules">
            {BIG_RULES.map((rule) => (
              <li key={rule.n}>
                <span className="rule-n">{rule.n}</span>
                <span className="rule-t">{rule.title}</span>
                <span className="rule-s">{rule.sub}</span>
              </li>
            ))}
          </ol>

          {STAGES.map((stage) => (
            <section className="hr-stage" key={stage.heading}>
              <div className="hr-when">
                <span className="hr-t">{stage.when}</span>
                <span className="hr-l">{stage.label}</span>
              </div>
              <div>
                <h2 className="hr-h">{stage.heading}</h2>
                <p className="hr-sub">{stage.sub}</p>
                <ul className="hr-rules">
                  {stage.rules.map(([title, body]) => (
                    <li key={title}>
                      <strong>{title}</strong>
                      <span>{body}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}

          <section className="hr-broken" aria-labelledby="hrBroken">
            <span className="eyebrow">When a rule is broken</span>
            <h2 className="hr-h" id="hrBroken">
              We don’t give warnings twice.
            </h2>
            <div className="ladder">
              <div className="rung">
                <span className="rung-n">
                  One<small>report</small>
                </span>
                <p>Your night ends.</p>
              </div>
              <div className="rung">
                <span className="rung-n">
                  Two<small>reports</small>
                </span>
                <p>Your membership ends.</p>
              </div>
              <div className="rung">
                <span className="rung-n">At once</span>
                <div>
                  <p>Some things end it immediately.</p>
                  <ul>
                    {IMMEDIATE.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <p className="hr-after">
              Every report is read by a person. You won’t be told who made it. A report made in bad
              faith counts against the person who made it. Removal is not refunded.
            </p>
          </section>

          <section className="hr-close">
            <p className="hr-line">The door decides who comes in. These decide who stays.</p>
            <DiamondRule />
            <p>
              This is the short version. The binding one is in our{" "}
              <Link href="/terms">Terms of Use</Link>.
            </p>
            <p>
              Something wrong on a Friday? Write to{" "}
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>. A person reads it, and replies
              within a day.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
