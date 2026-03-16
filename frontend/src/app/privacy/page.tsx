export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-lg border border-mon-red/20 bg-white p-8 shadow-mon-card">
        <h1 className="text-3xl font-bold text-mon-red mb-4">🔒 Privacy Policy</h1>
        <p className="text-slate-600 mb-6">
          Last updated: March 16, 2026
        </p>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-mon-red mb-3">Information We Collect</h2>
            <p className="text-slate-600 mb-3">
              We collect information you provide directly to us, such as when you create an account,
              post content, or contact us for support.
            </p>
            <ul className="text-slate-600 space-y-1 ml-4">
              <li>• Email address and username</li>
              <li>• Content you post or share</li>
              <li>• Usage data and analytics</li>
              <li>• Device and browser information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mon-red mb-3">How We Use Your Information</h2>
            <p className="text-slate-600 mb-3">
              We use the information we collect to:
            </p>
            <ul className="text-slate-600 space-y-1 ml-4">
              <li>• Provide and maintain our services</li>
              <li>• Process authentication and authorization</li>
              <li>• Moderate content and prevent abuse</li>
              <li>• Improve our platform and user experience</li>
              <li>• Communicate with you about updates and features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mon-red mb-3">Data Security</h2>
            <p className="text-slate-600">
              We implement appropriate security measures to protect your personal information against
              unauthorized access, alteration, disclosure, or destruction. All passwords are hashed
              using industry-standard encryption methods.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mon-red mb-3">Third-Party Services</h2>
            <p className="text-slate-600">
              We use Supabase for authentication and data storage. Their privacy practices are
              governed by their own privacy policy. We do not share your personal information
              with third parties except as necessary to provide our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-mon-red mb-3">Contact Us</h2>
            <p className="text-slate-600">
              If you have any questions about this Privacy Policy, please contact us through
              our community forums or support channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}