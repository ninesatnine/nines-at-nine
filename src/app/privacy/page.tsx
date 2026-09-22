import type { Metadata } from "next";
import Link from "next/link";

import {
  Callout,
  Clause,
  DocEnd,
  DocHead,
  DocTable,
  KV,
  List,
  Mail,
  Sub,
  Toc,
} from "@/components/Doc";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Privacy Policy — Nines at Nine",
  description:
    "What personal data we collect, why we use it, how long we keep it, and the rights you hold over it.",
};

const CONTENTS: [string, string][] = [
  ["privacy-1", "Who is responsible"],
  ["privacy-2", "What this covers"],
  ["privacy-3", "What we collect"],
  ["privacy-4", "Your face"],
  ["privacy-5", "Why we use it"],
  ["privacy-6", "Consent and withdrawal"],
  ["privacy-7", "Who sees your data"],
  ["privacy-8", "Transfers outside India"],
  ["privacy-9", "How long we keep it"],
  ["privacy-10", "How we decide, and what we never show"],
  ["privacy-11", "Your rights"],
  ["privacy-12", "Security"],
  ["privacy-13", "If something goes wrong"],
  ["privacy-14", "Cookies"],
  ["privacy-15", "No one under 18"],
  ["privacy-16", "Changes"],
  ["privacy-17", "Complaints"],
  ["privacy-18", "If you are outside India"],
];

const WAITLIST_DATA: string[][] = [
  ["Email address", "Required", "To reach you about the room in your city and when applications open."],
  ["Name", "Optional", "So we can address you properly."],
  ["Phone number", "Optional", "Used only if you are selected, and only to reach you quickly."],
  ["City", "Inferred from your selection", "To tell you about the right room."],
];

const GROUNDS: string[][] = [
  ["To hold your place on the waitlist and tell you when applications open", "Consent"],
  [
    "To send you news about future rooms",
    "Consent, separately given and withdrawable in one tap",
  ],
  ["To assess your application and decide on admission", "Consent"],
  ["To verify that you are a real, live adult who matches your photographs", "Consent"],
  [
    "To run an Event, allocate rounds, and release mutually agreed contact details",
    "Consent, and section 7(a) — data you voluntarily gave us for this purpose and have not asked us to stop using",
  ],
  [
    "To investigate reports, moderate conduct and keep people safe",
    "Consent, given when you join. Where a report becomes a legal matter, compliance with law",
  ],
  [
    "To fix faults, keep the Service secure, and detect unauthorised access",
    "Consent, and where a law requires us to keep records, compliance with law",
  ],
  [
    "To send you service messages about a booking or your account",
    "Section 7(a) — these are not marketing and cannot be switched off while you hold an account",
  ],
  ["To take payment, issue invoices and meet tax obligations", "Compliance with law"],
  [
    "To establish, exercise or defend a legal claim, or to answer a lawful order",
    "Compliance with law",
  ],
];

const RECIPIENTS: string[][] = [
  [
    "Our staff",
    "Only what their role requires, on a need-to-know basis, under confidentiality obligations.",
  ],
  [
    "The Panel",
    "Photographs and the short written line, without your surname, contact details, or any other identifying information. Panel members are bound by confidentiality and are barred from contacting Applicants.",
  ],
  [
    "Other attendees at your Event",
    "Your first name, your photographs, and what you say on camera. Your contact details are released only where interest was mutual and only to that person.",
  ],
  ["Hosting and infrastructure providers", "Data at rest and in transit, as processors under contract."],
  ["Video infrastructure provider", "Live audio and video in transit. Not stored."],
  [
    "Payment provider",
    "Payment details you enter directly with them. We receive only a token and a status.",
  ],
  ["Email and messaging providers", "Your name, email and phone, to deliver our messages."],
  ["Analytics provider", "Aggregated and pseudonymised usage data."],
  ["Professional advisers", "Only where necessary for legal, accounting or audit purposes."],
  [
    "Law enforcement, courts, regulators",
    "What we are lawfully required to disclose. We check that the request is valid and, unless prohibited, we tell you.",
  ],
  [
    "An acquirer",
    "If our business is sold or merged, under the same protections as this policy, with notice to you.",
  ],
];

const RETENTION: string[][] = [
  ["Live video and audio during an Event", "Not stored at all"],
  ["Liveness capture", "24 hours, then deleted"],
  ["Photographs of an Applicant who is not admitted", "30 days from the decision"],
  ["Photographs of a Member", "While the membership lasts, then 30 days"],
  ["Raw assessment comparisons", "45 days"],
  ["Internal rating values", "Nulled 30 days after the decision"],
  [
    "Waitlist entry, if you never apply",
    "Until you unsubscribe or ask for deletion. Otherwise erased after 24 months with no contact from you, and we write to you before that happens so you can stay if you want to",
  ],
  ["Account and attendance records", "While the account is open, then 12 months"],
  ["Reports, moderation and ban records", "3 years, so that a barred person is not readmitted"],
  ["Payment and tax records", "8 years, as required by Indian tax and company law"],
  [
    "Server and security logs",
    "12 months. Rule 6 of the DPDP Rules requires us to keep these for a year so that unauthorised access can be detected and investigated",
  ],
  ["Backups", "Expire on their ordinary cycle, within 30 days"],
];

const RIGHTS_SLA: string[][] = [
  ["Acknowledgement", "Within 72 hours"],
  ["Substantive response", "Within 30 days"],
  [
    "Complex requests",
    "Extendable once by a further 30 days. We tell you why before the first period ends",
  ],
  ["Charge", "None"],
];

const COOKIES: string[][] = [
  [
    "Strictly necessary",
    "Session, login, security, and remembering your city.",
    "No — the Service will not work without them.",
  ],
  ["Analytics", "Counting visits and understanding which parts of the page are read.", "Yes."],
  ["Preference", "Remembering choices you have made.", "Yes."],
];

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main">
        <article className="wrap doc" aria-labelledby="privacy-title">
          <DocHead
            id="privacy-title"
            eyebrow="Nines at Nine"
            title="Privacy Policy"
            sub="What personal data we collect, why we use it, how long we keep it, and the rights you hold over it."
          />

          <Callout title="WHAT IS LIVE TODAY · 21 SEPTEMBER 2026">
            <p>
              Right now, Nines at Nine is a waitlist and nothing else. The only data we hold is your
              email, and your name and phone if you chose to give them. Applications, photographs,
              verification and Events are not open yet.
            </p>
            <p>
              The rest of this policy describes those stages in full, so that you can see now what we
              will do later. When a stage opens we will update this box, tell you, and ask separately
              for any consent that stage needs. Nothing described below happens to your data until
              you are asked and agree.
            </p>
          </Callout>
          <Callout title="IN ONE PARAGRAPH">
            <p>
              We collect what we need to put you on a list, to check that you are a real adult who
              looks like your photographs, and to run an evening. We ask before we use your face. We
              never sell your data. We do not show anyone a score. We delete things on a fixed
              schedule, and we tell you exactly what that schedule is. You can see, correct, or
              delete your data at any time by writing to one address.
            </p>
          </Callout>

          <Toc items={CONTENTS} />

          <Clause n={1} id="privacy-1">
            Who is responsible
          </Clause>
          <p>
            {COMPANY.name}, CIN {COMPANY.cin}, registered office {COMPANY.address}, is the Data
            Fiduciary for your personal data under the Digital Personal Data Protection Act, 2023
            (“DPDP Act”) and the rules made under it.
          </p>
          <p>
            Our privacy contact is {COMPANY.grievanceOfficer}, reachable at <Mail />.
          </p>

          <Clause n={2} id="privacy-2">
            What this covers
          </Clause>
          <p>
            This policy covers personal data we collect through the Nines at Nine website and web
            application, through the application and verification process, through our Events, and
            through our communications with you. It applies to visitors, waitlist subscribers,
            Applicants and Members alike.
          </p>

          <Clause n={3} id="privacy-3">
            What we collect
          </Clause>
          <Sub>When you join the waitlist</Sub>
          <DocTable head={["Data", "Required?", "Why"]} rows={WAITLIST_DATA} />
          <Sub>If you apply</Sub>
          <List
            items={[
              "Photographs of yourself that you upload.",
              "A short written line or answers you write.",
              "Date of birth or age confirmation.",
              "Gender and who you would like to meet.",
              "A live camera capture for the liveness check (see clause 4).",
              "Where we consider it necessary, sight of a government identity document. We record only that a check was completed, the document type, and the last four characters of the number. We do not store the image of the document.",
            ]}
          />
          <Sub>If you attend</Sub>
          <List
            items={[
              "Booking and attendance records, the rounds you were in, and when you joined and left.",
              "Your mutual-interest selections, and the contact details released to you where interest was mutual.",
              "Reports you make, and reports made about you, including the description given.",
              "Payment records: amount, date, status, and a token from our payment provider. We never see or store your full card number, CVV, UPI PIN or bank credentials.",
            ]}
          />
          <Sub>Automatically</Sub>
          <List
            items={[
              "IP address, approximate city derived from it, device and browser type, operating system, referring page, pages viewed, and timestamps.",
              "Email delivery events such as opens and clicks, where your client permits it.",
              "Connection quality metrics during a Session, used to diagnose faults.",
            ]}
          />
          <Callout title="WHAT WE DO NOT COLLECT">
            <p>
              We do not collect your caste, religion, political opinions, health data, sexual history,
              financial account details, Aadhaar number, or biometric data other than the facial
              material described below. Please do not send us any of these, and do not put them in a
              free-text field.
            </p>
          </Callout>

          <Clause n={4} id="privacy-4">
            Your face
          </Clause>
          <p>Facial material is the most sensitive thing we handle, so it gets its own section.</p>
          <List
            items={[
              "Photographs you upload are shown to the Panel for assessment and, if you are admitted, may be shown to other attendees of your Event. They are not public, are not indexed by search engines, and are never used in marketing without your separate written consent.",
              "The liveness capture is a short video or set of frames taken at the moment of verification. It is used once, to confirm you are live and that you resemble your photographs, and is then deleted within 24 hours. We keep only the result: pass or fail, and the timestamp.",
              "We do not create, store, or share a facial template, faceprint, embedding, or any other biometric identifier that could be used to recognise you elsewhere.",
              "Live video during an Event is not recorded. It passes through our video provider’s infrastructure in real time and is not stored by us in any form.",
            ]}
          />
          <p>
            You may withdraw consent for facial processing at any time. If you do so before a verdict,
            your application ends and the material is deleted. If you do so afterwards, we delete the
            material and your membership ends, because we cannot run the Service without it.
          </p>

          <Clause n={5} id="privacy-5">
            Why we use it
          </Clause>
          <p>
            The Digital Personal Data Protection Act allows processing on two grounds only: your
            consent (section 6), or one of the legitimate uses listed in section 7. That list is
            closed. It does not include a general “legitimate interest” test, and it does not include
            performance of a contract. So almost everything we do here runs on your consent, and we
            say so rather than reaching for a ground that does not exist in Indian law.
          </p>
          <DocTable head={["Purpose", "Ground"]} rows={GROUNDS} />
          <Callout title="WHY SAFETY SITS UNDER CONSENT">
            <p>
              Moderation and safety are not on the section 7 list, so we cannot treat them as a
              standing ground of their own. They are part of what you agree to when you join, and we
              name them in the consent we ask for rather than burying them here. If you withdraw that
              consent, we cannot keep you in a room with other people, so your membership ends.
            </p>
          </Callout>
          <p>
            We do not use your personal data for any purpose that is not listed here without asking
            you first.
          </p>

          <Clause n={6} id="privacy-6">
            Consent and withdrawal
          </Clause>
          <p>
            Where we rely on consent, we ask for it separately for each purpose, in plain language,
            with a box that is empty until you tick it. We do not bundle consents, do not pre-tick,
            and do not use design that pushes you towards agreeing.
          </p>
          <p>
            Withdrawing consent is as easy as giving it. Every marketing email carries an unsubscribe
            link that works in one tap. For anything else, write to <Mail /> and we will act within
            the timelines at clause 11.
          </p>
          <p>
            What happens when you withdraw. We stop processing that personal data, we erase it, and we
            instruct every provider holding a copy to do the same — unless a law requires us to keep
            it, in which case we keep only what the law requires and only for as long as it requires.
            Withdrawal is not retrospective: it does not undo processing already carried out lawfully.
          </p>
          <p>
            Where a consent is essential to a part of the Service, withdrawing it ends that part for
            you, and we will tell you plainly which part.
          </p>
          <Sub>The notice you see when you give consent</Sub>
          <p>
            At every point where we ask for consent, we show a notice that stands on its own, without
            needing this page. It states the personal data we are asking for, item by item; the
            purpose and what it enables; how to withdraw, as easily as you gave it; how to exercise
            your other rights; and how to complain to the Data Protection Board of India.
          </p>
          <Sub>Consent Managers</Sub>
          <p>
            From 12 November 2026 the DPDP Rules allow you to give, manage and withdraw consent
            through a Consent Manager registered with the Data Protection Board. When that route is
            available to us we will support it and say so here.
          </p>
          <p>
            You may request a copy of this notice in any language listed in the Eighth Schedule to the
            Constitution of India, or in English.
          </p>

          <Clause n={7} id="privacy-7">
            Who sees your data
          </Clause>
          <p>
            We do not sell your personal data. We do not rent it, and we do not share it for anyone
            else’s advertising.
          </p>
          <DocTable head={["Who", "What they see"]} rows={RECIPIENTS} />
          <p>
            Every processor is bound by a written contract requiring them to process data only on our
            instructions, to protect it, and to delete or return it when the contract ends.
          </p>

          <Clause n={8} id="privacy-8">
            Transfers outside India
          </Clause>
          <p>
            Some of our providers operate outside India. Where personal data is transferred abroad, we
            do so only to countries not restricted by the Central Government under section 16 of the
            DPDP Act, under contractual safeguards, and subject to any sectoral restriction that
            applies to us. The current list of countries our providers operate from is available on
            request from <Mail />.
          </p>

          <Clause n={9} id="privacy-9">
            How long we keep it
          </Clause>
          <p>
            We keep personal data only as long as the purpose requires, then delete it. These periods
            are enforced by automated jobs, not by memory.
          </p>
          <DocTable head={["Data", "Kept for"]} rows={RETENTION} />
          <p>
            Where we must keep something longer to comply with law or to defend a legal claim, we keep
            only that, and only for as long as that need lasts.
          </p>

          <Clause n={10} id="privacy-10">
            How we decide, and what we never show
          </Clause>
          <p>
            Admission decisions are made by people, assisted by software that records their choices
            and orders applications for review. The software does not admit or reject anyone by
            itself, and a human makes the final decision in every case.
          </p>
          <p>
            We hold internal values that describe where an application sits relative to others. These
            values are never shown to you, to any other user, to the Panel, or to anyone outside the
            company, and they are erased on the schedule at clause 9. There is no public score,
            ranking, leaderboard or rating on this Service and there never will be.
          </p>
          <p>
            Where we use your personal data to make a decision about you, section 8(3) of the DPDP Act
            requires it to be complete, accurate and consistent. We check the material we hold against
            what you submitted before a decision is made, and you can correct anything wrong at any
            time under clause 11.
          </p>
          <p>
            If you want to know whether a decision about you was made properly, ask us at <Mail /> and
            a person will review it.
          </p>

          <Clause n={11} id="privacy-11">
            Your rights
          </Clause>
          <p>Under the DPDP Act you have the right to:</p>
          <List
            items={[
              "Know what personal data of yours we hold, how we are processing it, and who we have shared it with.",
              "Correct anything inaccurate, complete anything incomplete, and update anything out of date.",
              "Erase your personal data, unless we are required by law to keep it.",
              "Withdraw consent at any time.",
              "Nominate another person to exercise these rights for you if you die or become incapacitated.",
              "Grieve — to complain to us and have it addressed, and to escalate to the Data Protection Board of India if you are not satisfied.",
            ]}
          />
          <p>
            To exercise any right, write to <Mail /> from your registered email address, saying which
            right you are exercising. If we cannot tell who you are from that address we will ask for
            one further detail, and nothing more than we need.
          </p>
          <DocTable head={["Stage", "Our commitment"]} rows={RIGHTS_SLA} />
          <p>
            Complaints about content, conduct or the running of the Service follow a different and
            faster route — 24-hour acknowledgement and 15-day resolution — under clause 22 of the{" "}
            <Link href="/terms">Terms of Use</Link>.
          </p>
          <p>
            You also have duties under section 15 of the DPDP Act: not to impersonate anyone, not to
            suppress material information, not to register a false or frivolous grievance, and to give
            only authentic information when exercising a right to correction.
          </p>

          <Clause n={12} id="privacy-12">
            Security
          </Clause>
          <List
            items={[
              "Encryption in transit (TLS) and at rest for stored personal data.",
              "Access control on a least-privilege basis, with named accounts and no shared logins.",
              "Photographs held in private storage, served only through short-lived signed links.",
              "Audit logging of every access to application material.",
              "Automated deletion jobs enforcing clause 9, with their runs logged.",
              "Written contracts with every processor, and periodic review of them.",
              "Monitoring and periodic review of those logs, specifically to detect unauthorised access.",
              "Backups and a documented recovery routine, so that processing can continue if data is lost or compromised.",
              "Staff confidentiality undertakings and training.",
            ]}
          />
          <p>
            No system is perfectly secure. We do not promise that a breach can never happen; we
            promise reasonable safeguards and honest, prompt disclosure if one does.
          </p>

          <Clause n={13} id="privacy-13">
            If something goes wrong
          </Clause>
          <p>
            If a personal data breach occurs, Rule 7 of the DPDP Rules sets what we must do, and we
            will do it:
          </p>
          <List
            items={[
              "To you, without delay. In plain words: what happened, what data was involved, what it could mean for you, what we are doing, and what you should do.",
              "To the Data Protection Board of India, without delay — a first intimation as soon as we know.",
              "A full report to the Board within 72 hours of becoming aware, covering the events and circumstances, the remedial measures taken, and who we have told.",
            ]}
          />
          <p>
            We will not wait until we understand everything before telling you. A partial account,
            early, is more use to you than a complete one a week later.
          </p>

          <Clause n={14} id="privacy-14">
            Cookies
          </Clause>
          <p>We use a small number of cookies and similar technologies:</p>
          <DocTable head={["Type", "What for", "Can you refuse?"]} rows={COOKIES} />
          <p>
            We do not use advertising or cross-site tracking cookies. You can refuse non-essential
            cookies in our banner and change your mind at any time, and you can clear or block cookies
            in your browser.
          </p>

          <Clause n={15} id="privacy-15">
            No one under 18
          </Clause>
          <p>
            The Service is for adults only. We do not knowingly collect personal data from anyone
            under 18. We require an age confirmation, and verification is designed in part to detect
            minors. If we learn that someone under 18 has given us data, we delete it immediately and
            bar the account. If you believe a minor has used the Service, tell us at <Mail />.
          </p>

          <Clause n={16} id="privacy-16">
            Changes
          </Clause>
          <p>
            We may update this policy. The current version is always here with its effective date. For
            material changes we give notice by email or on the Service before they take effect, and
            where the law requires it we ask for fresh consent rather than assuming it.
          </p>

          <Clause n={17} id="privacy-17">
            Complaints
          </Clause>
          <p>Write first to our Grievance Officer:</p>
          <dl className="doc-kv">
            <KV term="Name" detail={COMPANY.grievanceOfficer} />
            <KV term="Email" detail={<Mail />} />
            <KV term="Address" detail={COMPANY.address} />
          </dl>
          <p>
            If you are not satisfied with our response, you may complain to the Data Protection Board
            of India in the manner prescribed under the DPDP Act and its rules.
          </p>

          <Clause n={18} id="privacy-18">
            If you are outside India
          </Clause>
          <Sub>Where we operate</Sub>
          <p>
            Nines at Nine is offered in India. We do not market it in the European Economic Area, the
            United Kingdom or Switzerland, we do not price in euros or pounds, and we do not track or
            profile anyone’s behaviour in those places. The General Data Protection Regulation and the
            UK GDPR therefore do not ordinarily apply to us. If that changes and we begin offering the
            Service to people in the EEA or the UK, we will appoint a representative under Article 27
            and name them on this page before we do.
          </p>
          <Sub>If you are there anyway</Sub>
          <p>
            Someone living in or travelling through those places may still join. We would rather hold
            ourselves to the same standard for you as for everyone else, so:
          </p>
          <List
            items={[
              "You have the rights set out at clause 11, and in addition the rights to restrict processing, to object to it, and to receive your data in a portable, machine-readable form.",
              "We answer within one month, extendable once by two further months for a complex request, with reasons given before the first month ends.",
              "Our ground is your consent, and for photographs and any facial check used to identify you, your explicit consent. You can withdraw either at any time without giving a reason.",
              "You may complain to the supervisory authority in the country where you live or work.",
            ]}
          />
          <Sub>Where your data is</Sub>
          <p>
            Your personal data is processed in India and in the countries our providers operate from.
            India has not been the subject of an adequacy decision by the European Commission. Where
            the GDPR applies to you, a transfer to us rests on your explicit consent to the transfer,
            given with knowledge of that fact, and on the contractual safeguards we hold with our
            providers. You can ask us at <Mail /> which countries are involved.
          </p>
          <Sub>What we have not built</Sub>
          <p>
            We say this plainly rather than implying otherwise. We have not appointed an Article 27
            representative, we have not appointed a Data Protection Officer under Article 37, and we
            do not maintain Article 30 records of processing, because none of these are required of a
            company that does not offer services in those markets. If we enter them, all three come
            first.
          </p>
          <p>
            This policy is written to be understood. If any part of it is not clear to you, write to{" "}
            <Mail /> and we will explain it, in whatever words help.
          </p>

          <DocEnd />
        </article>
      </main>
      <Footer />
    </>
  );
}
