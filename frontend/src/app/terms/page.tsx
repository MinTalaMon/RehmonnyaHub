export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-lg border border-mon-red/20 bg-white p-8 shadow-mon-card">
        <h1 className="text-3xl font-bold text-mon-red mb-4">📋 Terms of Service</h1>
        <p className="text-slate-600 mb-6">
          Last updated: March 16, 2026
        </p>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-mon-red mb-3">Acceptance of Terms</h2>
            <p className="text-slate-600">
              By accessing and using RehmonnyaHub, you accept and agree to be bound by the terms
              and provision of this agreement. If you do not agree to abide by the above,
              please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mon-red mb-3">User Accounts</h2>
            <p className="text-slate-600 mb-3">
              When you create an account with us, you must provide information that is accurate,
              complete, and current at all times.
            </p>
            <ul className="text-slate-600 space-y-1 ml-4">
              <li>• You are responsible for safeguarding your account credentials</li>
              <li>• You agree not to share your account with others</li>
              <li>• You must notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mon-red mb-3">Content Guidelines</h2>
            <p className="text-slate-600 mb-3">
              Users are responsible for the content they post. The following content is prohibited:
            </p>
            <ul className="text-slate-600 space-y-1 ml-4">
              <li>• Hate speech or discriminatory content</li>
              <li>• Harassment or threats</li>
              <li>• Spam or misleading information</li>
              <li>• Copyright infringement</li>
              <li>• Illegal activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mon-red mb-3">Community Moderation</h2>
            <p className="text-slate-600">
              We reserve the right to moderate content, suspend accounts, and take appropriate
              action against users who violate these terms. Community moderators help maintain
              a positive environment for all users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mon-red mb-3">Limitation of Liability</h2>
            <p className="text-slate-600">
              RehmonnyaHub shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages resulting from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mon-red mb-3">Changes to Terms</h2>
            <p className="text-slate-600">
              We reserve the right to modify these terms at any time. Users will be notified
              of significant changes through our platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}