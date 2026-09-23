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
  title: "Terms of Use — Nines at Nine",
  description: `The agreement between you and ${COMPANY.name} when you use Nines at Nine.`,
};

const CONTENTS: [string, string][] = [
  ["terms-1", "Who we are"],
  ["terms-2", "Accepting these Terms"],
  ["terms-3", "Definitions"],
  ["terms-4", "Eligibility"],
  ["terms-5", "The waitlist"],
  ["terms-6", "Application and admission"],
  ["terms-7", "Verification"],
  ["terms-8", "Your account"],
  ["terms-9", "Events and sessions"],
  ["terms-10", "Fees, tickets, refunds"],
  ["terms-11", "House rules and conduct"],
  ["terms-12", "Your content"],
  ["terms-13", "Reporting and moderation"],
  ["terms-14", "Suspension and termination"],
  ["terms-15", "Safety — read this"],
  ["terms-16", "Our intellectual property"],
  ["terms-17", "Third parties"],
  ["terms-18", "Availability and changes"],
  ["terms-19", "Disclaimers"],
  ["terms-20", "Limitation of liability"],
  ["terms-21", "Indemnity"],
  ["terms-22", "Grievance redressal"],
  ["terms-23", "Governing law and disputes"],
  ["terms-24", "Changes to these Terms"],
  ["terms-25", "General"],
  ["terms-26", "Contact"],
];

const REFUNDS: [string, string][] = [
  ["We cancel the Event", "Full refund of the ticket price, or a credit for a future Event at your choice."],
  ["You cancel more than 48 hours before", "Credit for a future Event. No cash refund."],
  [
    "You cancel within 48 hours, or do not turn up",
    "No refund and no credit. The seat cannot be resold at that notice.",
  ],
  [
    "You leave part-way through",
    "No refund. Exception: if you leave because of another attendee’s conduct and your report is upheld, you receive a credit for a future Event.",
  ],
  ["Your device or connection fails", "No refund. We may, at our discretion, offer a credit."],
  [
    "We remove you for breach of the house rules",
    "No refund, no credit, and you may be barred from future Events.",
  ],
  ["You are not admitted after applying", "Nothing is charged for an application. Application is free."],
];

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main">
        <article className="wrap doc" aria-labelledby="terms-title">
          <DocHead
            id="terms-title"
            eyebrow="Nines at Nine"
            title="Terms of Use"
            sub={`The agreement between you and ${COMPANY.name} when you use Nines at Nine.`}
          />

          <Callout title="SERVICES NOT YET OPEN">
            <p>
              These Terms cover the whole of Nines at Nine, including parts that are not open yet.
              Applications, verification, Events and ticketing are described here so that you can
              read them before you reach them. Nothing in these Terms obliges us to launch any of
              it, in any city, on any date. A clause about a service takes effect for you when that
              service becomes available to you.
            </p>
          </Callout>
          <Callout title="IN ONE PARAGRAPH">
            <p>
              Nines at Nine is an invitation-only speed dating service. Getting on the waitlist is
              not admission. Admission is decided by us, partly on appearance, and we do not have to
              explain a decision. We do not run background checks on anyone. You meet other adults
              at your own risk. If you break the house rules we can remove you, and a ticket is not
              refunded. Everything below says the same things in more detail, because detail is what
              protects both of us.
            </p>
          </Callout>

          <Toc items={CONTENTS} />

          <Clause n={1} id="terms-1">
            Who we are
          </Clause>
          <p>
            Nines at Nine is a product of {COMPANY.name}, a company incorporated in India under the
            Companies Act, 2013, with CIN {COMPANY.cin} and registered office at {COMPANY.address}{" "}
            (“we”, “us”, “our”, “the Company”).
          </p>
          <p>
            These Terms of Use (“Terms”) govern your use of the Nines at Nine website, web
            application, events, and every related service we offer (together, the “Service”).
          </p>

          <Clause n={2} id="terms-2">
            Accepting these Terms
          </Clause>
          <p>
            By visiting the Service, joining the waitlist, submitting an application, buying a
            ticket, or attending an event, you agree to these Terms and to our{" "}
            <Link href="/privacy">Privacy Policy</Link>, which forms part of these Terms by
            reference. If you do not agree, do not use the Service.
          </p>
          <p>
            These Terms are an electronic record under the Information Technology Act, 2000 and the
            rules made under it, and do not require a physical or digital signature.
          </p>
          <p>
            If you are using the Service on behalf of an organisation, you confirm you are authorised
            to bind it, and “you” means that organisation.
          </p>

          <Clause n={3} id="terms-3">
            Definitions
          </Clause>
          <List
            items={[
              "Applicant — a person who has submitted photographs or other material for consideration.",
              "Member — an Applicant we have admitted.",
              "Event or Session — a scheduled online speed dating evening, comprising a series of short one-to-one video rounds.",
              "Panel — the people we ask to assess Applicants, which may include Members, staff, and invited third parties.",
              "User Content — anything you upload, submit, write, say, or transmit through the Service, including photographs, text, audio and video.",
              "Waitlist — the register of people who have expressed interest in the Service and have not yet applied or been admitted.",
            ]}
          />

          <Clause n={4} id="terms-4">
            Eligibility
          </Clause>
          <p>To use the Service you must confirm, each time you use it, that all of the following are true:</p>
          <List
            items={[
              "You are at least 18 years old. There are no exceptions, and we do not permit use by a minor under the supervision of an adult.",
              "You are competent to contract under the Indian Contract Act, 1872, and are not an undischarged insolvent.",
              "You are using the Service for yourself, on your own behalf, under your own real name and identity.",
              "You have never been convicted of, and are not currently charged with, any offence involving sexual misconduct, stalking, harassment, violence against the person, or an offence under the Protection of Children from Sexual Offences Act, 2012.",
              "You are not a person whose account we have previously suspended or terminated.",
              "You are not barred from receiving services under any law applicable to you, and you are not on any sanctions list.",
              "You will comply with the laws of India and of the place from which you access the Service.",
            ]}
          />
          <p>
            We may verify any of the above at any time, by any lawful means, and may refuse or
            withdraw access if we are not satisfied. We are not obliged to verify, and our failure to
            detect a false confirmation does not make us responsible for it.
          </p>

          <Clause n={5} id="terms-5">
            The waitlist
          </Clause>
          <p>Joining the waitlist gives you nothing except a place on a list.</p>
          <p>
            It is not an application, an admission, a reservation, a seat, a ticket, an offer, or a
            promise of any kind. We may contact you, or not. We may invite you to apply, or not. We
            may close, pause, reorder, or delete the waitlist entirely, at any time, without notice
            and without liability.
          </p>
          <p>
            Order on the waitlist does not determine order of invitation. Nothing on the Service
            should be read as a queue position, a guarantee of capacity, or a commitment to launch in
            any city or on any date.
          </p>

          <Clause n={6} id="terms-6">
            Application and admission
          </Clause>
          <p>
            Admission to Nines at Nine is selective and discretionary. When you apply, you agree to
            all of the following.
          </p>
          <Sub>How we decide</Sub>
          <p>
            We assess Applicants against criteria we set and may change at any time. Those criteria
            are partly subjective and expressly include physical appearance and presentation, as
            judged from photographs and video by the Panel. Other criteria may include completeness
            and accuracy of your application, verification results, prior conduct, balance of the
            room, and anything else we reasonably consider relevant to the experience of other
            attendees.
          </p>
          <Sub>What we are not required to do</Sub>
          <List
            items={[
              "We are not required to admit you, ever, whatever your history with us, whatever you have paid, and however many times you apply.",
              "We are not required to give reasons for a decision, to disclose any score, rating, ranking, band or internal metric, or to tell you who assessed you.",
              "We are not required to offer a review, an appeal, or a re-application, though we may choose to.",
              "We are not required to admit equal numbers, to run an Event in your city, or to run any Event at all.",
            ]}
          />
          <Callout title="NON-DISCRIMINATION">
            <p>
              Selection on appearance is a feature of this Service and you accept it as a condition
              of applying. It is not, and must not be applied as, selection on caste, religion, race,
              ethnicity, place of birth, disability, or any other ground protected under the
              Constitution of India or any applicable law. If you believe a decision about you was
              made on a protected ground, raise it with the Grievance Officer at clause 22 and we
              will investigate.
            </p>
          </Callout>
          <Sub>Your application material</Sub>
          <p>
            You confirm that every photograph and statement you submit is of you, current, unedited
            except for ordinary colour and crop adjustment, and not misleading. Submitting another
            person’s likeness, an image you do not have the right to use, or an artificially
            generated or materially altered image of yourself, is a serious breach of these Terms.
          </p>

          <Clause n={7} id="terms-7">
            Verification
          </Clause>
          <p>
            We may require you to verify that you are a real person and that your photographs are of
            you. Verification may include a short live camera capture (“liveness check”), a
            comparison of that capture against your submitted photographs, a phone or email
            confirmation, and — where we consider it necessary — sight of a government-issued
            identity document.
          </p>
          <p>
            Where verification involves your face, we handle that material as described in the{" "}
            <Link href="/privacy">Privacy Policy</Link> and we retain it only for as long as that
            policy states. If you refuse verification, we may decline or withdraw your admission.
          </p>
          <p>
            Verification confirms likeness and liveness. It is not a background check, a criminal
            record check, an identity guarantee, or a statement that a person is safe or truthful.
          </p>

          <Clause n={8} id="terms-8">
            Your account
          </Clause>
          <List
            items={[
              "Keep your login details, one-time codes, and access links private. Everything done through your account is treated as done by you.",
              <>
                Tell us immediately at <Mail /> if you suspect unauthorised access.
              </>,
              "One person, one account. No sharing, transferring, selling, or resale of an account, invitation, or ticket.",
              "Keep your information accurate and current. We may act on what you have told us.",
            ]}
          />

          <Clause n={9} id="terms-9">
            Events and sessions
          </Clause>
          <p>
            An Event is an online evening of short, sequential one-to-one video rounds with other
            attendees, followed by a mutual-interest step in which each attendee privately indicates
            who they would meet again. Contact details are exchanged only where both people have
            indicated interest.
          </p>
          <Sub>What we do not promise</Sub>
          <List
            items={[
              "A specific number of attendees, a specific gender balance, or a specific set of people.",
              "That any particular person will attend, stay for the whole Event, behave well, or be interested in you.",
              "Any match, any mutual interest, any date, any relationship, or any outcome whatsoever.",
              "Uninterrupted video or audio. The Event depends on your device, your camera, your microphone and your internet connection, none of which are within our control.",
            ]}
          />
          <Sub>Changes and cancellation by us</Sub>
          <p>
            We may reschedule, shorten, restructure, substitute attendees for, or cancel an Event,
            including at short notice, for reasons including insufficient attendance, technical
            failure, safety, or any other operational reason. Where we cancel an Event entirely and
            you have paid, clause 10 applies.
          </p>
          <Sub>Recording</Sub>
          <p>
            We do not record the live video rounds. You must not record, screenshot, stream, or
            otherwise capture any part of an Event, or any other attendee, by any means. Doing so is
            a serious breach of these Terms and may also be an offence.
          </p>

          <Clause n={10} id="terms-10">
            Fees, tickets, refunds
          </Clause>
          <p>
            Prices are shown before you pay, in Indian Rupees, and are inclusive or exclusive of GST
            as stated at checkout. GSTIN: {COMPANY.gstin}. Payments are collected by third-party
            payment providers; we do not store your card or bank details.
          </p>
          <DocTable head={["Situation", "What happens"]} rows={REFUNDS.map((r) => [...r])} />
          <p>
            Refunds, where due, are made to the original payment method within 7 business days,
            subject to your bank’s timelines. We may set off any amount you owe us against a refund.
          </p>

          <Clause n={11} id="terms-11">
            House rules and conduct
          </Clause>
          <p>
            Four rules carry the evening: be the person in your photographs, turn up, cameras on, and
            treat everyone as you would in a room you were invited into. Below is what that means in
            full.
          </p>
          <p>You must not, on the Service or at an Event:</p>
          <List
            items={[
              "Impersonate anyone, misstate your age, name, marital or relationship status, or use another person’s photographs.",
              "Appear with your camera off, obscured, filtered beyond recognition, or with another person on camera in your place.",
              "Be nude, partly nude, or engage in sexual activity on camera; display sexual content, nudity, or any sexual material involving a minor.",
              "Harass, threaten, stalk, intimidate, abuse, demean, or use obscene, hateful, casteist, racist, communal, sexist, homophobic or transphobic language.",
              "Attempt to arrange or transact any sexual service for payment, or promote escorting or prostitution.",
              "Solicit money, investment, donations, or financial information; run any scheme, promotion, multi-level marketing, or advertisement; recruit for any business, cause or organisation.",
              "Ask for, collect, publish, or pass on another attendee’s contact details, address, workplace, or any personal information, other than through the mutual-interest step.",
              "Record, screenshot, stream, or reproduce any part of an Event or any attendee.",
              "Attend while intoxicated to a degree that affects your behaviour, or use illegal substances on camera.",
              "Carry, display or reference weapons; threaten violence; or reference self-harm in a way intended to disturb or coerce another attendee.",
              "Upload anything unlawful, defamatory, obscene, paedophilic, invasive of privacy, insulting on the basis of gender, racially or ethnically objectionable, relating to or encouraging money laundering or gambling, harmful to a child, infringing of any intellectual property, or otherwise prohibited under the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.",
              "Upload any virus, malicious code, or anything designed to interrupt, destroy or limit the functionality of any system.",
              "Probe, scan, scrape, crawl, reverse engineer, decompile, circumvent any access control, use any bot or automated means, or attempt to gain unauthorised access to the Service or to another account.",
              "Use the Service, or any information from it, to build or train any product, dataset, or model.",
              "Threaten the unity, integrity, defence, security or sovereignty of India, friendly relations with foreign States, or public order, or incite any cognisable offence.",
            ]}
          />
          <p>
            This list is illustrative, not exhaustive. We may act on conduct that is not listed if,
            in our reasonable judgement, it damages another person’s experience or our reputation.
          </p>
          <p>
            The house rules apply equally to anything that follows an Event: if you and another
            attendee exchange contact details, the conduct standards above continue to govern how you
            use them.
          </p>

          <Clause n={12} id="terms-12">
            Your content
          </Clause>
          <p>
            You keep ownership of your User Content. You grant us a worldwide, non-exclusive,
            royalty-free licence — sub-licensable only to service providers acting on our
            instructions — to host, store, reproduce, adapt for format, and display your User Content
            solely to operate, verify, moderate and improve the Service, and to show your material to
            the Panel for the purpose of assessing your application.
          </p>
          <p>
            We will not use your photographs in advertising, marketing, social media, or any
            public-facing material without your separate, specific, written consent, which you may
            withdraw at any time.
          </p>
          <p>
            This licence ends when you delete the content or your account, except that we may retain
            copies where we are required to by law, where retention is necessary to establish,
            exercise or defend a legal claim, or in routine backups until those backups expire on
            their ordinary cycle.
          </p>
          <p>
            You confirm that you own or have the rights to your User Content and that it does not
            infringe anyone’s rights. We may refuse, remove or take down any User Content at any time
            without notice.
          </p>
          <Sub>Our role</Sub>
          <p>
            Where you upload or transmit User Content, we act as an intermediary within the meaning
            of section 2(1)(w) of the Information Technology Act, 2000. We do not initiate, select
            the receiver of, or modify that content. We observe the due diligence required of an
            intermediary under the Information Technology (Intermediary Guidelines and Digital Media
            Ethics Code) Rules, 2021, including publication of these Terms and appointment of the
            Grievance Officer named at clause 22. We remove or disable access to content on becoming
            aware of it through a court order, a notification by an appropriate government agency, or
            our own moderation under clause 13.
          </p>

          <Clause n={13} id="terms-13">
            Reporting and moderation
          </Clause>
          <p>
            Any attendee may report another during or after an Event. We review reports and may, at
            our discretion and without being obliged to investigate exhaustively: warn, mute, remove
            from a live round, remove from an Event, suspend, or permanently bar an account.
          </p>
          <p>
            Our indicative standard is that one substantiated report ends a night and two end a
            membership, but we may act on a single report, immediately and permanently, where the
            conduct is serious. We may also act on our own observation, on information from a third
            party, or on a direction from a lawful authority.
          </p>
          <p>
            We are not obliged to disclose to you the identity of a person who reported you, the
            content of the report, or the detail of our reasoning, where doing so would compromise
            the safety, privacy or wellbeing of any person.
          </p>
          <p>Making a knowingly false or malicious report is itself a breach of these Terms.</p>

          <Clause n={14} id="terms-14">
            Suspension and termination
          </Clause>
          <p>
            You may stop using the Service at any time and may ask us to delete your account by
            writing to <Mail />.
          </p>
          <p>
            We may suspend or terminate your access, remove your content, cancel a booking, and bar
            you from future Events, with or without notice, if we reasonably believe that you have
            breached these Terms, that your conduct poses a risk to any person, that any information
            you gave us is false, that we are required to do so by law, or that continuing to serve
            you exposes us to legal or reputational risk.
          </p>
          <p>
            On termination for breach: no refund is due, any credit is forfeited, and any licence
            granted to you ends immediately. Clauses 12, 15, 19, 20, 21, 23 and 25 survive
            termination.
          </p>

          <Clause n={15} id="terms-15">
            Safety — read this
          </Clause>
          <Callout title="IMPORTANT">
            <p>
              We do not conduct criminal background checks, sex offender register checks, employment
              checks, financial checks, marital status checks, or health checks on any Applicant,
              Member, or attendee. Verification under clause 7 confirms only that a person is live
              and resembles their photographs.
            </p>
            <p>
              Selection on appearance and presentation says nothing about a person’s character,
              honesty, intentions or safety. Admission to Nines at Nine is not a recommendation,
              endorsement, or vouching for any person.
            </p>
          </Callout>
          <p>
            You are solely responsible for your own interactions with other people, online and
            offline. Take the ordinary precautions you would take with any stranger: meet in public,
            tell someone where you are going, arrange your own transport, do not send money, and do
            not share financial information, identity documents, your home address, or intimate
            images.
          </p>
          <p>
            We are not a party to, and take no responsibility for, anything that happens between you
            and another person outside an Event, including any meeting, communication, relationship,
            transaction, loss, injury, or harm of any kind.
          </p>
          <p>
            If you are in immediate danger, contact the police on 112. If you have been harmed by
            someone you met through the Service, please also tell us at <Mail /> so that we can act
            on our side, and we will cooperate with any lawful investigation.
          </p>

          <Clause n={16} id="terms-16">
            Our intellectual property
          </Clause>
          <p>
            The Service, the name Nines at Nine, our logos, copy, design, layout, code, selection
            methodology, and every element of the experience are owned by or licensed to the Company
            and are protected by Indian and international law. You get a limited, personal, revocable,
            non-transferable licence to use the Service as intended, and nothing more. You may not
            copy, adapt, frame, mirror, or create derivative works from any part of it.
          </p>

          <Clause n={17} id="terms-17">
            Third parties
          </Clause>
          <p>
            We rely on third-party providers for hosting, video infrastructure, payments,
            communications and analytics. Their services are governed by their own terms. We are not
            responsible for the acts, omissions, outages, or content of any third party, or for any
            site we link to.
          </p>

          <Clause n={18} id="terms-18">
            Availability and changes
          </Clause>
          <p>
            The Service is provided on an “as is” and “as available” basis. We may add, change,
            suspend, limit or withdraw any feature, city, price, or the whole Service, at any time. We
            may run the Service, or parts of it, as a trial or beta, in which case it may be
            incomplete and may change without notice.
          </p>

          <Clause n={19} id="terms-19">
            Disclaimers
          </Clause>
          <p>
            To the fullest extent permitted by law, we disclaim all warranties, express or implied,
            including any implied warranty of merchantability, fitness for a particular purpose,
            non-infringement, accuracy, or quiet enjoyment.
          </p>
          <p>
            We do not warrant that the Service will be uninterrupted, timely, secure, or error-free;
            that defects will be corrected; that the Service is free of harmful components; that any
            information provided by another user is true; or that use of the Service will result in
            any match, meeting, relationship, or other outcome.
          </p>

          <Clause n={20} id="terms-20">
            Limitation of liability
          </Clause>
          <p>To the fullest extent permitted by law:</p>
          <List
            items={[
              "We are not liable for any indirect, incidental, special, consequential, exemplary or punitive damages, or for loss of profit, goodwill, opportunity, data, or reputation, however caused, even if we were advised of the possibility.",
              "We are not liable for the conduct of any user, whether online or offline, or for any injury, loss, or damage arising from any meeting or interaction between users.",
              "Our total aggregate liability to you, for all claims arising out of or relating to the Service, is limited to the total amount you actually paid us in the three (3) months immediately before the event giving rise to the claim, or ₹5,000, whichever is higher.",
            ]}
          />
          <p>
            Nothing in these Terms excludes or limits liability that cannot lawfully be excluded or
            limited, including liability for death or personal injury caused by our negligence, or
            for fraud or fraudulent misrepresentation.
          </p>
          <p>
            You acknowledge that the fees we charge reflect this allocation of risk, and that without
            it we could not offer the Service at that price.
          </p>

          <Clause n={21} id="terms-21">
            Indemnity
          </Clause>
          <p>
            You will indemnify, defend and hold harmless the Company, its directors, officers,
            employees, contractors, and agents against all claims, demands, proceedings, losses,
            damages, liabilities, costs and expenses (including reasonable legal fees) arising out of
            or relating to: your use of the Service; your User Content; your breach of these Terms or
            of any law; any misrepresentation you make to us or to another user; and any dispute
            between you and another user.
          </p>

          <Clause n={22} id="terms-22">
            Grievance redressal
          </Clause>
          <p>
            In accordance with the Information Technology Act, 2000 and the Information Technology
            (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the details of our
            Grievance Officer are:
          </p>
          <dl className="doc-kv">
            <KV term="Name" detail={COMPANY.grievanceOfficer} />
            <KV term="Designation" detail={`${COMPANY.grievanceTitle}, ${COMPANY.short}`} />
            <KV term="Email" detail={<Mail />} />
            <KV term="Address" detail={COMPANY.address} />
            <KV term="Hours" detail={COMPANY.hours} />
          </dl>
          <p>
            This clause covers complaints about content, conduct and the operation of the Service.
            Requests about your personal data — access, correction, erasure, withdrawal of consent —
            run on the separate timetable in clause 11 of the{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>
          <p>
            We acknowledge every complaint within twenty-four (24) hours and resolve it within fifteen
            (15) days of receipt. Complaints about non-consensual intimate imagery or impersonation
            are acted on within twenty-four (24) hours.
          </p>
          <p>
            Please include your name, registered email, the date and nature of the issue, and any
            supporting material.
          </p>

          <Clause n={23} id="terms-23">
            Governing law and disputes
          </Clause>
          <p>These Terms are governed by the laws of India.</p>
          <p>
            Step one — talk to us. Before starting any proceeding, raise the matter with the Grievance
            Officer and give us thirty (30) days to resolve it. Most things end here.
          </p>
          <p>
            Step two — arbitration. Any dispute not resolved under step one shall be referred to and
            finally resolved by arbitration under the Arbitration and Conciliation Act, 1996, before a
            sole arbitrator appointed by agreement between the parties within thirty (30) days of a
            written request. If no agreement is reached in that period, the arbitrator shall be
            appointed by a recognised arbitral institution or by the competent court under section 11
            of that Act. Neither party may appoint the arbitrator unilaterally. The seat and venue
            shall be Kolkata, India. The language shall be English. The award shall be final and
            binding. Each party bears its own costs unless the arbitrator directs otherwise.
          </p>
          <p>
            Courts. Subject to the above, the courts at Kolkata, India shall have exclusive
            jurisdiction. Nothing prevents either party from seeking urgent interim relief from a
            court of competent jurisdiction.
          </p>
          <p>
            Consumers. Nothing in this clause limits any right you have as a consumer under the
            Consumer Protection Act, 2019. If you are a consumer you may take a dispute to a consumer
            commission instead of arbitration, and this clause does not prevent you from doing so.
          </p>
          <p>
            Where the law applicable to you permits a contractual time limit on claims, any claim must
            be brought within one (1) year of the event giving rise to it. Where it does not — as in
            India, under section 28 of the Indian Contract Act, 1872 — the statutory limitation period
            applies instead.
          </p>

          <Clause n={24} id="terms-24">
            Changes to these Terms
          </Clause>
          <p>
            We may amend these Terms. The current version is always at this page with its effective
            date. For material changes we will give notice by email or on the Service before they take
            effect. Continuing to use the Service after that date means you accept the revised Terms.
            If you do not, stop using the Service and ask us to close your account.
          </p>

          <Clause n={25} id="terms-25">
            General
          </Clause>
          <List
            items={[
              "Force majeure. We are not liable for failure or delay caused by anything beyond our reasonable control, including outage of internet or power, act of God, epidemic, strike, war, civil unrest, or governmental order.",
              "Assignment. You may not assign these Terms. We may assign them to any successor, affiliate, or acquirer of our business.",
              "Severability. If any provision is held invalid, it is modified to the minimum extent necessary, and the remainder stands.",
              "No waiver. A failure to enforce any provision is not a waiver of it.",
              "No agency. Nothing here creates a partnership, employment, agency or joint venture between us.",
              "Notices. We may contact you at your registered email; you must contact us in writing at the addresses in clause 26.",
              "Entire agreement. These Terms and the Privacy Policy are the whole agreement between us on this subject and replace anything said before.",
              "Language. The English version governs. Any translation is for convenience only.",
            ]}
          />

          <Clause n={26} id="terms-26">
            Contact
          </Clause>
          <dl className="doc-kv">
            <KV term="Company" detail={COMPANY.name} />
            <KV term="Address" detail={COMPANY.address} />
            <KV term="General" detail={<Mail />} />
            <KV term="Grievances" detail={<Mail />} />
            <KV term="Privacy" detail={<Mail />} />
          </dl>

          <DocEnd />
        </article>
      </main>
      <Footer />
    </>
  );
}
