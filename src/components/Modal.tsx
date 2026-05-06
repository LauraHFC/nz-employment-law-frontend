"use client";
// Modal.tsx — v4 (risk-control framework §E.1, §E.2, §E.3 text)
// Full production disclaimer / privacy / terms text per the risk framework.
// NOTE: [LEGAL ENTITY NAME] and [CONTACT EMAIL] should be replaced with real
// operator details before go-live. [HOSTING PROVIDER] / [REGION] likewise.

const MODALS = {
  disclaimer: {
    title: "Disclaimer",
    version: "1.0",
    updated: "4 May 2026",
    body: `
1. Nature of the service

This website provides general information about New Zealand law and related public guidance. It uses an artificial intelligence (AI) model to retrieve and summarise material from public sources.

The service is not a law firm. Its operators are not your lawyer. No solicitor-client relationship, no duty of care of the kind owed by a licensed legal practitioner, and no professional indemnity arrangement arises between you and the service or its operators by your use of it.

The service does not provide:
  • legal advice within the meaning of the Lawyers and Conveyancers Act 2006;
  • immigration advice within the meaning of the Immigration Advisers Licensing Act 2007;
  • regulated financial advice within the meaning of the Financial Markets Conduct Act 2013;
  • medical, mental-health, or psychological advice;
  • advice on criminal-defence strategy.

2. General information only

Answers are general information only. They are not tailored to your particular circumstances. The law changes frequently, court and tribunal decisions vary, and the application of any rule depends on facts that the service does not know.

You must not rely on any answer as a basis for action without first seeking advice from a qualified person.

3. Accuracy and currency

Source material is retrieved from public databases (including legislation.govt.nz, judicial decisions, and government agency guidance).

About source dates: The date shown alongside a source citation is the date on which our system last retrieved and verified that source — not necessarily the date the underlying law was enacted or amended. Laws and regulations can change between our retrieval cycles. Always verify currency with the official source before acting on any information.

Despite our retrieval and verification processes, answers may contain errors, omissions, mischaracterisations, or out-of-date statements of the law. AI models are known to produce confidently stated content that is incorrect.

4. Where to get advice

Free or low-cost help is available from:
  • Community Law (communitylaw.org.nz) — free legal advice
  • Citizens Advice Bureau — 0800 367 222 — free general guidance
  • MBIE Employment Service — 0800 20 90 20
  • IRD (tax) — 0800 775 247

For matters that may be regulated (immigration, financial advice, medical, criminal-defence strategy) you must consult a licensed practitioner in that area.

5. Limitation of liability

To the maximum extent permitted by law, the operators of this service exclude all liability for loss or damage of any kind (including indirect, consequential, or economic loss) arising from your use of, or reliance on, the service or its outputs.

This clause does not exclude or limit any rights or remedies you have under the Consumer Guarantees Act 1993 or the Fair Trading Act 1986 that cannot be lawfully excluded.

6. No professional relationship

Submitting questions to the service does not create a lawyer-client or any other professional relationship. Information you submit is not covered by legal professional privilege. Do not include information that you would not be comfortable sharing under the Privacy Policy.

7. Jurisdiction

This service addresses the law of New Zealand. It does not address the law of any other jurisdiction.

8. Changes to this Disclaimer

We may update this Disclaimer at any time. The version and date are shown above. When the version increments, returning users will be asked to re-acknowledge the updated text before continuing.

9. Acknowledgement

By using the service you confirm that you have read, understood, and accepted this Disclaimer.
    `.trim(),
  },

  privacy: {
    title: "Privacy Policy",
    version: "1.0",
    updated: "4 May 2026",
    body: `
We are committed to handling your personal information in accordance with the Privacy Act 2020 and the 13 Information Privacy Principles ("IPPs").

1. Who we are

The operator of this service is contactable at the address listed on this site. We are the agency for the purposes of the Privacy Act 2020.

2. What we collect

  a. Conversation content: the questions you ask and the answers we return. Conversations may contain sensitive personal information (e.g. health, immigration status, family relationships, financial situation). We treat this with the heightened care the Privacy Act 2020 requires for sensitive information.

  b. Technical metadata: IP address (stored only as a salted monthly hash — never in raw form), user-agent string, timestamps, and interaction events (modal acceptances).

  c. Safety audit metadata: intent class (LOOKUP / ADVICE / HIGH_STAKES), domain tier, and routing outcome — stored to enable safety review and service improvement.

3. Why we collect it (IPP1)

  • To provide answers to your questions.
  • To verify and audit the safety of our outputs.
  • To investigate and respond to any incident, complaint, or suspected misuse.
  • To improve the service through aggregated, de-identified analysis.
  • To comply with our legal obligations.

We do not use your conversation content to train external AI models. Data is not sold or shared with advertisers.

4. Storage and security (IPP5)

Personal information is stored on infrastructure with industry-standard encryption in transit and at rest, role-based access controls, and audit logging.

5. Retention (IPP9)

  • Consent events: 7 years (evidence of disclaimer acknowledgement).
  • Per-answer safety audit rows: 2 years rolling.
  • Aggregated, de-identified metrics: indefinitely.

You can request earlier deletion at any time (see §7).

6. Sensitive information

Because users routinely disclose sensitive personal information when asking legal questions, we apply additional safeguards: the classifier and routing pipeline operate on the minimum content necessary, and sensitive content is restricted from analytics dashboards.

7. Your rights (IPP6–IPP7)

You have the right to request access to, correction of, or deletion of your personal information. To exercise these rights, please use the contact details on this site. We will respond within 20 working days as required by the Privacy Act 2020.

8. Complaints

You have the right to complain to the Office of the Privacy Commissioner (privacy.org.nz, 0800 803 909) if you are concerned about how we have handled your information.

9. Notifiable privacy breaches

If we become aware of a privacy breach likely to cause serious harm, we will notify the affected individuals and the Office of the Privacy Commissioner as soon as practicable (Part 6, Privacy Act 2020).

10. Cookies

We use only cookies strictly necessary to operate the service (session identification). We do not use advertising cookies or third-party tracking pixels.

11. Children

The service is not intended for use by children under 16.

12. Changes to this Policy

We may update this Policy at any time. The version and date are shown above. Material changes will trigger an in-app re-acknowledgement.
    `.trim(),
  },

  terms: {
    title: "Terms of Use",
    version: "1.0",
    updated: "4 May 2026",
    body: `
By using this service you agree to the following terms.

1. Permitted use

This service may be used for personal information-seeking only. The following are prohibited:
  • Commercial scraping or automated bulk querying.
  • Redistribution of outputs as a paid advice product.
  • Adversarial probing for misuse.
  • Using outputs to advise third parties (including paying clients) — this may itself raise issues under the Lawyers and Conveyancers Act 2006 or the Immigration Advisers Licensing Act 2007.

2. No advice

Responses are general information only — not legal, financial, immigration, medical, or other professional advice. You must not rely on responses without first seeking advice from a qualified professional.

3. About source dates

The date shown alongside a citation is the date our system last retrieved that source, not the date the law was enacted or last amended. Always verify the current version of any law at legislation.govt.nz or with a qualified professional.

4. Limitation of liability

To the maximum extent permitted by law, the operators exclude all liability for loss or damage arising from use of or reliance on this service. Nothing in these terms excludes rights under the Consumer Guarantees Act 1993 or Fair Trading Act 1986 that cannot lawfully be excluded.

5. Reservation of rights

The operators reserve the right to restrict or terminate access in cases of suspected misuse, adversarial probing, or harassment of others through generated content.

6. Governing law

These terms are governed by New Zealand law. Any dispute will be determined by New Zealand courts.

7. Changes

We may update these terms at any time. Continued use after an update constitutes acceptance.
    `.trim(),
  },
} as const;

export type ModalId = keyof typeof MODALS;

interface ModalProps {
  id: ModalId;
  onClose: () => void;
}

export function Modal({ id, onClose }: ModalProps) {
  const m = MODALS[id];

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h2 id="modal-title">{m.title}</h2>
        <p className="modal-meta" style={{ fontSize: ".75rem", color: "var(--text-muted)", marginBottom: "12px" }}>
          Version {m.version} · Last updated {m.updated}
        </p>
        <div className="modal-body-prose">
          {m.body.split("\n\n").map((para, i) => (
            <p key={i} style={{ marginBottom: "10px", whiteSpace: "pre-wrap", fontSize: ".875rem", lineHeight: "1.6" }}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
