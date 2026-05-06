// app/disclaimer/page.tsx — Standalone Disclaimer page
// Full text per §E.1 of the Personal Life Legal Bot Risk Control Framework.
// Linked from DisclaimerModal checkboxes and site footer.
// Version and updated_date explanation (G1 fix) are included in §3.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer — NZ Employment & Tax Law",
  description: "Disclaimer for the NZ Employment & Tax Law AI information service.",
};

export default function DisclaimerPage() {
  return (
    <main className="policy-page">
      <div className="policy-card">
        <div className="policy-header">
          <h1>Disclaimer</h1>
          <p className="policy-meta">Version 1.0 · Last updated 4 May 2026</p>
        </div>

        <Section title="1. Nature of the service">
          <p>
            This website provides <strong>general information</strong> about New Zealand law and
            related public guidance. It uses an artificial intelligence (AI) model to retrieve and
            summarise material from public sources.
          </p>
          <p>
            The service is <strong>not a law firm</strong>. Its operators are not your lawyer. No
            solicitor-client relationship, no duty of care of the kind owed by a licensed legal
            practitioner, and no professional indemnity arrangement arises between you and the
            service or its operators by your use of it.
          </p>
          <p>The service does not provide:</p>
          <ul>
            <li>legal advice within the meaning of the Lawyers and Conveyancers Act 2006;</li>
            <li>
              immigration advice within the meaning of the Immigration Advisers Licensing Act 2007;
            </li>
            <li>
              regulated financial advice within the meaning of the Financial Markets Conduct Act
              2013;
            </li>
            <li>medical, mental-health, or psychological advice;</li>
            <li>advice on criminal-defence strategy.</li>
          </ul>
        </Section>

        <Section title="2. General information only">
          <p>
            Answers are general information only. They are not tailored to your particular
            circumstances. The law changes frequently, court and tribunal decisions vary, and the
            application of any rule depends on facts that the service does not know.
          </p>
          <p>
            <strong>
              You must not rely on any answer as a basis for action without first seeking advice
              from a qualified person.
            </strong>
          </p>
        </Section>

        <Section title="3. Accuracy and currency">
          <p>
            Source material is retrieved from public databases including legislation.govt.nz,
            judicial decisions, and government agency guidance.
          </p>
          <div className="policy-callout">
            <strong>About source dates:</strong> The date shown alongside a source citation is the
            date on which our system last retrieved and verified that source — <em>not</em>{" "}
            necessarily the date the underlying law was enacted or last amended. Laws and
            regulations can change between our retrieval cycles. Always verify the current version
            of any law at{" "}
            <a href="https://legislation.govt.nz" target="_blank" rel="noopener noreferrer">
              legislation.govt.nz
            </a>{" "}
            or with a qualified professional before acting on any information.
          </div>
          <p>
            Despite our retrieval and verification processes, answers may contain errors,
            omissions, mischaracterisations, or out-of-date statements of the law. AI models are
            known to produce confidently stated content that is incorrect.
          </p>
        </Section>

        <Section title="4. Where to get advice">
          <p>Free or low-cost help is available from:</p>
          <ul>
            <li>
              <a href="https://communitylaw.org.nz" target="_blank" rel="noopener noreferrer">
                Community Law
              </a>{" "}
              — free legal advice across most personal-life areas
            </li>
            <li>
              <a href="https://www.cab.org.nz" target="_blank" rel="noopener noreferrer">
                Citizens Advice Bureau
              </a>{" "}
              — 0800 367 222 — free general guidance
            </li>
            <li>MBIE Employment Service — 0800 20 90 20</li>
            <li>IRD (tax) — 0800 775 247</li>
          </ul>
          <p>
            For matters that may be regulated (immigration, financial advice, medical,
            criminal-defence strategy) you must consult a licensed practitioner in that area.
          </p>
        </Section>

        <Section title="5. Limitation of liability">
          <p>
            To the maximum extent permitted by law, the operators of this service exclude all
            liability for loss or damage of any kind (including indirect, consequential, or
            economic loss) arising from your use of, or reliance on, the service or its outputs.
          </p>
          <p>
            This clause does not exclude or limit any rights or remedies you have under the
            Consumer Guarantees Act 1993 or the Fair Trading Act 1986 that cannot be lawfully
            excluded.
          </p>
        </Section>

        <Section title="6. No professional relationship">
          <p>
            Submitting questions to the service does not create a lawyer-client or any other
            professional relationship. Information you submit is not covered by legal professional
            privilege. Do not include information that you would not be comfortable sharing under
            the Privacy Policy.
          </p>
        </Section>

        <Section title="7. Jurisdiction">
          <p>
            This service addresses the law of New Zealand. It does not address the law of any
            other jurisdiction.
          </p>
        </Section>

        <Section title="8. Changes to this Disclaimer">
          <p>
            We may update this Disclaimer at any time. The version and date are shown above. When
            the version increments, returning users will be asked to re-acknowledge the updated
            text before continuing.
          </p>
        </Section>

        <Section title="9. Acknowledgement">
          <p>
            By using the service you confirm that you have read, understood, and accepted this
            Disclaimer.
          </p>
        </Section>

        <div className="policy-footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
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
