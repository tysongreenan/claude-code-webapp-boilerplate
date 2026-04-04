import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for using our platform.",
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center h-16 px-4">
          <Link href="/" className="font-heading text-xl font-bold">YourApp</Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-16 max-w-3xl prose dark:prose-invert">
        <h1>Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using this service, you agree to be bound by these Terms of Service. If you do not agree, do not use the service.</p>

        <h2>2. Description of Service</h2>
        <p>We provide a web application platform. Features and availability may change over time.</p>

        <h2>3. User Accounts</h2>
        <p>You are responsible for maintaining the security of your account. You must provide accurate information during registration.</p>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to misuse the service, violate any laws, or infringe on the rights of others.</p>

        <h2>5. Payment Terms</h2>
        <p>Paid plans are billed in advance. Refunds are handled per our refund policy. Prices may change with notice.</p>

        <h2>6. Data and Privacy</h2>
        <p>Your use of the service is also governed by our <Link href="/privacy">Privacy Policy</Link>.</p>

        <h2>7. Termination</h2>
        <p>We may terminate or suspend your account for violations of these terms. You may delete your account at any time from Settings.</p>

        <h2>8. Limitation of Liability</h2>
        <p>The service is provided &ldquo;as is&rdquo; without warranties. We are not liable for indirect, incidental, or consequential damages.</p>

        <h2>9. Changes to Terms</h2>
        <p>We may update these terms. Continued use after changes constitutes acceptance.</p>

        <h2>10. Contact</h2>
        <p>Questions? Visit our <Link href="/support">Support Center</Link>.</p>
      </main>
    </div>
  )
}
