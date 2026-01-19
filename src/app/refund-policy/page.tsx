export default function RefundPolicyPage() {
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
              Refund Policy
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
                This Refund Policy governs all purchases made on Colio, owned and
                operated by <strong>Colio Tech Private Limited</strong>
                (“Colio”, “we”, “our”, or “us”). By making a payment on the
                platform, you agree to the terms outlined below.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. Non-Refundable Token Purchases
              </h2>
              <p>
                All payments made for purchasing tokens on the Colio platform
                are <strong>non-refundable</strong>. Once tokens are successfully
                credited to your account, the transaction is considered final
                and cannot be reversed, transferred, or refunded under any
                circumstances.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                3. Failed or Incomplete Payments
              </h2>
              <p>
                In the event of a payment failure, technical error, or any
                mishappening during the transaction where the amount is debited
                from your bank account but tokens are not credited to your
                Colio account, the amount will be eligible for a refund.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                4. Refund Processing Timeline
              </h2>
              <p>
                Any eligible refund arising due to failed or incomplete payment
                transactions will be processed automatically and credited back
                to the original source of payment (bank account, card, or UPI)
                within <strong>3–4 business days</strong>, subject to banking and
                payment gateway processing timelines.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                5. Refund Method
              </h2>
              <p>
                Refunds, where applicable, will only be initiated to the same
                bank account or payment method from which the original payment
                was made. Requests for alternate refund methods will not be
                entertained.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">
                6. Contact & Support
              </h2>
              <p>
                If you experience any issues related to payments or refunds,
                you may reach out to our support team with relevant transaction
                details for assistance.
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
