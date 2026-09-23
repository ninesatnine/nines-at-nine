"use client";

import Image from "next/image";
import { useState } from "react";

import { ConfirmationView } from "@/components/ConfirmationView";
import { Dock } from "@/components/Dock";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { DiamondRule, SectionRule, StepMark } from "@/components/Ornaments";
import { Reel } from "@/components/Reel";
import { type Joined, WaitlistForm } from "@/components/WaitlistForm";

const FACTS = [
  { title: "Nine dates", body: "A chance to meet someone beyond a profile." },
  { title: "Three minutes each", body: "Enough to start a conversation. Enough to get curious." },
  { title: "One Friday", body: "Make room for something different." },
];

const STEPS = [
  { title: "One Photograph", body: "Because first impressions matter here." },
  { title: "One Line", body: "Not a bio. One line that sounds like you." },
  {
    title: "Then, We Take a Look",
    body: "Every application is reviewed. The room is selected, not filled.",
  },
];

export default function Home() {
  const [joined, setJoined] = useState<Joined | null>(null);

  return (
    <>
      <Header hideNav={Boolean(joined)} />
      <main id="main">
        {joined ? (
          <ConfirmationView joined={joined} onBack={() => setJoined(null)} />
        ) : (
          <>
            <div className="wrap hero" id="top">
              <Image className="mark" src="/img/logo.png" alt="" width={186} height={240} priority />
              <h1>
                The Best-Looking
                <br />
                Room in the City.
              </h1>
              <DiamondRule />
              <p className="lede">Nine dates. One Friday. <span className="wrap-mobile">Three minutes each.</span></p>
              <a className="btn" id="heroCta" href="#waitlist">
                Join the waitlist
              </a>
              <small>An invitation starts here.</small>
            </div>

            <Reel />

            <div className="wrap">
              <SectionRule marginTop={56} />

              <section className="block" id="experience" aria-labelledby="expH">
                <div className="block-head">
                  <span className="eyebrow">The experience</span>
                  <h2 id="expH">Hot or Not? <span className="wrap-mobile">Jury Will Decide.</span></h2>
                  <p></p>
                  <p>Eighteen People. All Verified. <span className="wrap-mobile">No Swiping Required.</span></p>
                </div>
                <div className="trio">
                  {FACTS.map((fact) => (
                    <div key={fact.title}>
                      <h3>{fact.title}</h3>
                      <p>{fact.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <SectionRule />

              <section className="block" id="how-it-works" aria-labelledby="howH">
                <div className="block-head">
                  <span className="eyebrow">How it works</span>
                  <h2 id="howH">Not Everyone Gets In.</h2>
                  <p>
                    The room gets picked, not filled. Joining the waitlist gives you the chance to
                    apply when your city opens.
                  </p>
                </div>
                <ol className="steps">
                  {STEPS.map((step, i) => (
                    <li className="step" key={step.title}>
                      <StepMark number={i + 1} />
                      <h3>
                        <span className="sr-only">Step {i + 1}: </span>
                        {step.title}
                      </h3>
                      <p>{step.body}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <SectionRule />

              <section className="block" id="questions" aria-labelledby="faqH">
                <div className="block-head">
                  <span className="eyebrow">Questions</span>
                  <h2 id="faqH">Before You Ask.</h2>
                </div>
                <Faq />
              </section>

              <SectionRule />

              <section className="join" id="waitlist" aria-labelledby="joinH">
                <Image className="mark" src="/img/logo.png" alt="" width={186} height={240} />
                <h2 id="joinH">Think You Belong in the Room?</h2>
                <p className="muted" style={{ maxWidth: 440 }}>
                  There’s only one way to find out.
                </p>
                <DiamondRule />
                <WaitlistForm onJoined={setJoined} />
              </section>
            </div>
          </>
        )}
      </main>
      <Footer />
      <Dock active={!joined} />
    </>
  );
}
