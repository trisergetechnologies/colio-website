export default function TermsAndConditionsPage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at top left, #0b0b0e 0%, #111114 100%)",
      }}
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-[520px] h-[520px] bg-[radial-gradient(circle,rgba(217,70,239,0.28),transparent_70%)] blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-[560px] h-[560px] bg-[radial-gradient(circle,rgba(145,141,154,0.28),transparent_75%)] blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        {/* Header */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-violet-400 to-indigo-400">
              Terms & Conditions
            </span>
          </h1>
          <p className="mt-4 text-white/60 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Card */}
        <div className="relative rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_0_80px_rgba(217,70,239,0.12)]">
          <div className="px-8 sm:px-12 py-12 sm:py-14 space-y-12 text-white/80 leading-relaxed text-lg">

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                1. Introduction
              </h2>
              <p>
                These Terms & Conditions (“Terms”) govern your access to and use
                of the Colio platform, owned and operated by{" "}
                <strong>Colio Tech Private Limited</strong> (“Colio”, “we”, “our”,
                or “us”). By accessing or using Colio, you agree to be bound by
                these Terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. Eligibility
              </h2>
              <p>
                You must be at least 18 years of age to use the Colio platform.
                By using the service, you confirm that you meet this
                requirement.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                3. User Conduct
              </h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>You agree to use Colio in a respectful and lawful manner.</li>
                <li>You shall not harass, abuse, threaten, or harm other users.</li>
                <li>
                  You shall not engage in fraud, impersonation, or misleading
                  activities.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                4. Vulgarity, Nudity & Explicit Content (STRICT POLICY)
              </h2>
              <p>
                Colio maintains a <strong>zero-tolerance policy</strong> towards
                vulgar, obscene, sexually explicit, or nude content.
              </p>
              <ul className="list-disc pl-6 space-y-3 mt-3">
                <li>
                  Any form of nudity, sexual acts, sexually explicit behavior,
                  or vulgar language is strictly prohibited.
                </li>
                <li>
                  This includes content shared via text, audio, video, images,
                  live calls, or profile information.
                </li>
                <li>
                  <strong>
                    If a user is found violating this policy, their account
                    will be permanently terminated without prior notice.
                  </strong>
                </li>
                <li>
                  Colio reserves the right to report such activity to relevant
                  authorities if required by law.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                5. Account Suspension & Termination
              </h2>
              <p>
                Colio reserves the right to suspend or terminate your account
                at any time if you violate these Terms, misuse the platform,
                or engage in behavior that compromises user safety or platform
                integrity.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                6. Intellectual Property
              </h2>
              <p>
                All content, branding, logos, and platform features are the
                intellectual property of Colio Tech Private Limited and may
                not be copied, modified, or distributed without permission.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                7. Limitation of Liability
              </h2>
              <p>
                Colio shall not be liable for any indirect, incidental, or
                consequential damages arising from your use of the platform.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                8. Changes to Terms
              </h2>
              <p>
                We may update these Terms from time to time. Continued use of
                Colio after changes indicates acceptance of the revised Terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                9. Contact Information
              </h2>
              <p>
                If you have questions regarding these Terms & Conditions,
                please contact us at:
              </p>
              <p className="mt-2 font-medium">
                📧 thisiscolio@gmail.com
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
