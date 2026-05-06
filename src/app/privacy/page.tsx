// app/privacy/page.tsx — Standalone Privacy Policy page
// Privacy Act 2020-aligned per §E.2 of the Risk Control Framework.
// Linked from DisclaimerModal checkboxes and site footer.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — NZ Employment & Tax Law",
  description:
    "Privacy Policy for the NZ Employment & Tax Law AI information service, aligned with the Privacy Act 2020.",
};

export default function PrivacyPage() {
  return (
    <main className="policy-page">
      <div className="policy-card">
        <div className="policy-header">
          <h1>Privacy Policy</h1>
          <p className="policy-meta">Version 1.0 · Last updated 4 May 2026</p>
        </div>

        <p className="policy-intro">
          We are committed to handling your personal information in accordance with the{" "}
          <strong>Privacy Act 2020</strong> and the 13 Information Privacy Principles ("IPPs").
          This policy explains what we collect, why, how we use and protect it, and your rights.
        </p>

        <Section title="1. Who we are">
          <p>
            The operator of this service is contactable at the address listed on this site. We are
            the agency for the purposes of the Privacy Act 2020.
          </p>
        </Section>

        <Section title="2. What we collect">
          <p>
            <strong>a. Conversation content:</strong> The questions you ask and the answers we
            return. Conversations may contain sensitive personal information about you or third
            parties (e.g. health, sexual orientation, religious belief, immigration status, family
            relationships, financial situation, criminal history, family violence). We treat this
            information with the heightened care the Privacy Act 2020 requires for sensitive
            information.
          </p>
          <p>
            <strong>b. Technical metadata:</strong> IP address (stored only as a salted monthly
            hash — never in raw form), user-agent string, timestamps, and interaction events
            (modal acceptances, clicks).
          </p>
          <p>
            <strong>c. Safety audit metadata:</strong> The intent class (LOOKUP / ADVICE /
            HIGH_STAKES), domain tier (H1 / H2 / H3 / M / L), and routing outcome assigned to
            each query. These are stored to enable safety review and service improvement. They do
            not include the text of your question.
          </p>
        </Section>

        <Section title="3. Why we collect it (IPP1)">
          <p>We collect the above only for the following purposes:</p>
          <ul>
            <li>To provide answers to your questions.</li>
            <li>To verify and audit the safety of our outputs.</li>
            <li>
              To investigate and respond to any incident, complaint, or suspected misuse.
            </li>
            <li>
              To improve the service through aggregated, de-identified analysis.
            </li>
            <li>To comply with our legal obligations.</li>
          </ul>
          <p>
            We do <strong>not</strong> use your conversation content to train external AI models.
            Data is not sold or shared with advertisers.
          </p>
        </Section>

        <Section title="4. How we collect it (IPP2–IPP4)">
          <p>
            Information is collected directly from you when you interact with the service. We do
            not collect personal information by covert means. Where we use any third-party
            processor (e.g. for hosting or model inference), the processor is bound to the same
            standards by contract.
          </p>
        </Section>

        <Section title="5. Storage and security (IPP5)">
          <p>
            Personal information is stored on infrastructure with industry-standard encryption in
            transit and at rest, role-based access controls, and audit logging. Where data is
            transferred outside New Zealand (for example to a model-inference provider), we ensure
            the receiving entity is subject to comparable privacy protections, as required under
            IPP12.
          </p>
        </Section>

        <Section title="6. Retention (IPP9)">
          <ul>
            <li>
              <strong>Consent events</strong> (disclaimer acknowledgements): retained for 7 years
              to evidence your acceptance of the Disclaimer and this Policy, as recommended under
              the Limitation Act 2010.
            </li>
            <li>
              <strong>Per-answer safety audit rows</strong> (intent class, domain tier, routing
              outcome): retained for 2 years rolling.
            </li>
            <li>
              <strong>Aggregated, de-identified metrics:</strong> retained indefinitely.
            </li>
          </ul>
          <p>You can request earlier deletion at any time (see §9).</p>
        </Section>

        <Section title="7. Use and disclosure (IPP10–IPP11)">
          <p>
            We use your personal information only for the purposes set out in §3. We do not
            disclose it to any third party except:
          </p>
          <ul>
            <li>to a sub-processor strictly necessary to operate the service;</li>
            <li>where required by a lawful order (court order, statutory notice, etc.);</li>
            <li>where you have authorised us to do so.</li>
          </ul>
        </Section>

        <Section title="8. Sensitive information & special categories">
          <p>
            Because users routinely disclose sensitive personal information when asking legal
            questions, we apply additional safeguards:
          </p>
          <ul>
            <li>
              The classifier and routing pipeline operate on the minimum content necessary.
            </li>
            <li>
              Free-text logs of sensitive queries are access-restricted and reviewable only by
              named individuals on a documented need-to-know basis.
            </li>
            <li>Sensitive content is redacted from analytics dashboards.</li>
          </ul>
        </Section>

        <Section title="9. Your rights (IPP6–IPP7)">
          <p>You have the right to:</p>
          <ul>
            <li>request access to the personal information we hold about you;</li>
            <li>request correction of any information you believe is wrong;</li>
            <li>request deletion of your conversation history;</li>
            <li>withdraw consent and stop using the service.</li>
          </ul>
          <p>
            To exercise these rights, please use the contact details on this site. We will respond
            within 20 working days as required by the Privacy Act 2020.
          </p>
        </Section>

        <Section title="10. Complaints">
          <p>
            If you are concerned about how we have handled your personal information, please
            contact us first. You also have the right to complain to the{" "}
            <a
              href="https://privacy.org.nz"
              target="_blank"
              rel="noopener noreferrer"
            >
              Office of the Privacy Commissioner
            </a>{" "}
            (privacy.org.nz · 0800 803 909).
          </p>
        </Section>

        <Section title="11. Notifiable privacy breaches">
          <p>
            If we become aware of a privacy breach that we believe is likely to cause serious
            harm, we will notify both the affected individuals and the Office of the Privacy
            Commissioner as soon as practicable, in accordance with Part 6 of the Privacy Act
            2020.
          </p>
        </Section>

        <Section title="12. Cookies &amp; similar technologies">
          <p>
            We use only cookies that are strictly necessary to operate the service (session
            identification). We do not use advertising cookies or third-party tracking pixels.
          </p>
        </Section>

        <Section title="13. Children">
          <p>
            The service is not intended for use by children under 16. If you believe a child has
            provided us with personal information, please contact us and we will delete it.
          </p>
        </Section>

        <Section title="14. Changes to this Policy">
          <p>
            We may update this Policy at any time. The version and date are shown above. Material
            changes will trigger an in-app re-acknowledgement the next time you use the service.
          </p>
        </Section>

        <div className="policy-footer-links">
          <a href="/disclaimer">Disclaimer</a>
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
