export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-lg border border-mon-red/20 bg-white p-8 shadow-mon-card">
        <h1 className="text-3xl font-bold text-mon-red mb-4">ℹ️ About RehmonnyaHub</h1>
        <p className="text-lg text-slate-700 mb-6">
          Welcome to RehmonnyaHub, a community platform dedicated to connecting people from the Mon ethnic group
          and fostering cultural exchange, discussion, and collaboration.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-mon-red mb-3">Our Mission</h2>
            <p className="text-slate-600 mb-4">
              To create a vibrant online space where Mon people can share their culture, language, traditions,
              and connect with others who share similar heritage and interests.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-mon-red mb-3">What We Offer</h2>
            <ul className="text-slate-600 space-y-2">
              <li>• Community-driven discussions</li>
              <li>• Cultural content sharing</li>
              <li>• Language learning resources</li>
              <li>• News and updates</li>
              <li>• Social networking</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-mon-red/20 bg-white p-6 shadow-mon-card">
        <h2 className="text-xl font-semibold text-mon-red mb-4">Get Involved</h2>
        <p className="text-slate-600 mb-4">
          Join our growing community! Create an account to participate in discussions,
          share your thoughts, and connect with fellow community members.
        </p>
        <div className="flex gap-4">
          <a
            href="/register"
            className="rounded bg-mon-red px-4 py-2 text-white shadow-sm transition hover:bg-mon-red-dark"
          >
            Join Now
          </a>
          <a
            href="/"
            className="rounded border border-mon-red/30 bg-white px-4 py-2 text-mon-red shadow-sm transition hover:bg-mon-red/5"
          >
            Explore Communities
          </a>
        </div>
      </div>
    </div>
  );
}