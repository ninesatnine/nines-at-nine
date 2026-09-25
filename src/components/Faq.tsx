const QUESTIONS = [
  {
    q: "What is Nines at Nine?",
    a: "A curated speed-dating evening. Nine dates, three minutes each, all on one Friday, with a room of people chosen to meet each other.",
  },
  {
    q: "How does the evening work?",
    a: "You meet nine people, one at a time, for three minutes each. Timing and format details are shared with invited guests ahead of the event.",
  },
  {
    q: "Why only three minutes?",
    a: "It’s enough to start a conversation and notice whether you want to know more. Short enough to keep the evening moving, long enough to get curious.",
  },
  {
    q: "Who can apply?",
    a: "Anyone 18 or older. Every room is curated, so each application is considered individually rather than accepted automatically.",
  },
  {
    q: "What does the application ask for?",
    a: "One photograph, the one you’d want a stranger to see first, and one line that sounds like you. You’ll complete it when invitations open.",
  },
  {
    q: "Does joining the waitlist guarantee a place?",
    a: "No. The waitlist means you’ll hear when applications open. Places are offered after applications have been reviewed.",
  },
  {
    q: "When and where are the events?",
    a: "Dates and cities haven’t been announced yet. Waitlist members hear first. Tell us your city when you join so we know where people are waiting.",
  },
  {
    q: "How will I hear from you?",
    a: "By email, at the address you give us, with updates about Nines at Nine, starting with when applications open.",
  },
];

export function Faq() {
  return (
    <div className="faq">
      {QUESTIONS.map(({ q, a }) => (
        <details key={q}>
          <summary>
            {q}
            <span className="pm" aria-hidden="true">
              +
            </span>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
