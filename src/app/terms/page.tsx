// app/terms/page.tsx — Standalone Terms of Use page
// Per §E.3 of the Risk Control Framework (delta additions to standard boilerplate).
// Linked from site footer.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — NZ Employment & Tax Law",
  description: "Terms of Use for the NZ Employment & Tax Law AI information service.",
};

export default function TermsPage() {
  return (
    <main className="policy-page">
      <div className="policy-card">
        <div className="policy-header">
          <h1>Terms of Use</h1>
          <p className="policy-meta">Version 1.0 · Last updated 4 May 2026</p>
        </div>

        <p className="policy-intro">
          By using this service you agree to the following terms. If you do not agree, please do
          not use the service.
        </p>

        <Section title="1. Permitted use">
          <p>
            This service may be used for <strong>personal information-seeking only</strong>. The
            following are prohibited:
          </p>
          <ul>
            <li>Commercial scraping or automated bulk querying.</li>
            <li>Redistribution of outputs as a paid advice product.</li>
            <li>Adversarial probing for misuse.</li>
            <li>
              Using outputs to advise third parties (including paying clients). This may itself
              raise issues under the Lawyers and Conveyancers Act 2006 or the Immigration
              Advisers Licensing Act 2007 for the user.
            </li>
          </ul>
        </Section>

        <Section title="2. No advice">
          <p>
            Responses are <strong>general information only</strong> — not legal, financial,
            immigration, medical, or other professional advice. You must not rely on responses
            without first seeking advice from a qualified professional.
          </p>
        </Section>

        <Section title="3. About source dates">
          <div className="policy-callout">
            The date shown alongside a source citation is the date our system last retrieved that
            source — <em>not</em> the date the underlying law was enacted or last amended. Laws
            change frequently. Always verify the current version of any law at{" "}
            <a href="https://legislation.govt.nz" target="_blank" rel="noopener noreferrer">
              legislation.govt.nz
            </a>{" "}
            or with a qualified professional before acting on any information.
          </div>
        </Section>

        <Section title="4. Limitation of liability">
          <p>
            To the maximum extent permitted by law, the operators exclude all liability for loss
            or damage of any kind arising from use of or reliance on this service. Nothing in
            these terms excludes rights under the Consumer Guarantees Act 1993 or Fair Trading
            Act 1986 that cannot lawfully be excluded.
          </p>
        </Section>

        <Section title="5. Indemnity">
          <p>
            You agree to indemnify the operators against any loss arising from your breach of
            these terms, to the extent permitted by the Consumer Guarantees Act 1993.
          </p>
        </Section>

        <Section title="6. Reservation of rights">
          <p>
            The operators reserve the right to restrict or terminate access in cases of suspected
            misuse, adversarial probing, or harassment of others through generated content.
          </p>
        </Section>

        <Section title="7. Governing law and venue">
          <p>
            These terms are governed by the law of New Zealand. Any dispute arising from or
            related to these terms will be determined by New Zealand courts.
          </p>
        </Section>

        <Section title="8. Changes">
          <p>
            We may update these terms at any time. The version and date are shown above. Continued
            use after an update constitutes acceptance of the revised terms.
          </p>
        </Section>

        <div className="policy-footer-links">
          <a href="/disclaimer">Disclaimer</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/">← Back to chat</a>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="policy-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
