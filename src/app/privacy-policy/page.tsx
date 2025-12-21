export default function PrivacyPolicyPage() {
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
              Privacy Policy
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
                Colio is owned and operated by <strong>Colio Tech Private Limited</strong>
                (“Colio”, “we”, “our”, or “us”). This Privacy Policy explains how we
                collect, use, store, and protect your personal information when
                you use our website, mobile application, and related services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. Information We Collect
              </h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>Personal Information:</strong> Name, email address,
                  phone number, profile details, and account credentials.
                </li>
                <li>
                  <strong>Usage Data:</strong> Device type, IP address, browser
                  information, interaction logs, and session duration.
                </li>
                <li>
                  <strong>Communication Data:</strong> Chats, calls, or other
                  interactions made through the platform for safety,
                  moderation, and service quality.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>To provide, operate, and maintain the Colio platform</li>
                <li>To personalize user experience and recommendations</li>
                <li>To ensure platform safety and prevent misuse or fraud</li>
                <li>To communicate service updates and support responses</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                4. Data Sharing & Disclosure
              </h2>
              <p>
                Colio does not sell or rent your personal information. Data may
                be shared with trusted third-party service providers or legal
                authorities only when required for compliance, security, or
                service delivery.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                5. Data Security
              </h2>
              <p>
                We implement reasonable technical and organizational measures
                to protect your personal data. However, no system can guarantee
                complete security.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                6. Data Retention
              </h2>
              <p>
                Your information is retained only for as long as necessary to
                fulfill the purposes outlined in this policy or to comply with
                legal obligations.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                7. Your Rights
              </h2>
              <ul className="list-disc pl-6 space-y-3">
                <li>Access, update, or delete your personal information</li>
                <li>Withdraw consent where applicable</li>
                <li>Request clarification on how your data is used</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                8. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes
                will be reflected on this page with an updated revision date.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                9. Contact Information
              </h2>
              <p>
                For any questions, concerns, or requests related to this Privacy
                Policy, you may contact us at:
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
