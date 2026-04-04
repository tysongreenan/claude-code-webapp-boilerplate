import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect your data.",
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center h-16 px-4">
          <Link href="/" className="font-heading text-xl font-bold">YourApp</Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-16 max-w-3xl prose dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly: name, email address, and payment information. We also collect usage data through analytics.</p>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To provide and maintain the service</li>
          <li>To process payments</li>
          <li>To send transactional emails (welcome, password reset, invoices)</li>
          <li>To improve the service through analytics</li>
        </ul>

        <h2>3. Data Storage</h2>
        <p>Your data is stored securely using industry-standard encryption. We use Supabase/Convex for database storage and Stripe for payment processing.</p>

        <h2>4. Third-Party Services</h2>
        <p>We use the following third-party services that may process your data:</p>
        <ul>
          <li><strong>Clerk/NextAuth</strong> — authentication</li>
          <li><strong>Stripe</strong> — payment processing</li>
          <li><strong>PostHog</strong> — product analytics</li>
          <li><strong>Sentry</strong> — error tracking</li>
          <li><strong>Resend</strong> — transactional email</li>
        </ul>

        <h2>5. Cookies</h2>
        <p>We use essential cookies for authentication and session management. Analytics cookies are used with your consent.</p>

        <h2>6. Your Rights</h2>
        <p>You can: access your data, request corrections, delete your account (Settings &rarr; Danger Zone), and export your data.</p>

        <h2>7. Data Retention</h2>
        <p>We retain your data while your account is active. After deletion, data is permanently removed within 30 days.</p>

        <h2>8. Changes to This Policy</h2>
        <p>We may update this policy. We will notify you of significant changes via email.</p>

        <h2>9. Contact</h2>
        <p>Questions about privacy? Visit our <Link href="/support">Support Center</Link>.</p>
      </main>
    </div>
  )
}
