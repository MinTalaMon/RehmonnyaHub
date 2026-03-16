"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to a backend
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-lg border border-mon-red/20 bg-white p-8 shadow-mon-card">
        <h1 className="text-3xl font-bold text-mon-red mb-4">📧 Contact Us</h1>
        <p className="text-slate-600 mb-6">
          Have questions, feedback, or need support? We'd love to hear from you!
        </p>

        {submitted ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-green-800">
              Thank you for your message! We'll get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-slate-200 px-3 py-2 focus:border-mon-red focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-slate-200 px-3 py-2 focus:border-mon-red focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full rounded border border-slate-200 px-3 py-2 focus:border-mon-red focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full rounded border border-slate-200 px-3 py-2 focus:border-mon-red focus:outline-none"
                placeholder="Tell us how we can help you..."
              />
            </div>

            <button
              type="submit"
              className="rounded bg-mon-red px-6 py-2 text-white shadow-sm transition hover:bg-mon-red-dark"
            >
              Send Message
            </button>
          </form>
        )}
      </div>

      <div className="rounded-lg border border-mon-red/20 bg-white p-6 shadow-mon-card">
        <h2 className="text-xl font-semibold text-mon-red mb-4">Other Ways to Reach Us</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-slate-800 mb-2">Community Support</h3>
            <p className="text-slate-600 text-sm">
              For general questions and community discussions, visit our forums
              or create a post in the appropriate community.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-slate-800 mb-2">Report Issues</h3>
            <p className="text-slate-600 text-sm">
              Found a bug or have a technical issue? Please report it through
              our community channels so our developers can assist you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}