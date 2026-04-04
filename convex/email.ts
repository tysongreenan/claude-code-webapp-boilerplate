import { action } from "./_generated/server"
import { v } from "convex/values"
import { Resend } from "resend"

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error("RESEND_API_KEY not configured")
  return new Resend(key)
}

const FROM = process.env.RESEND_FROM_EMAIL || "App <onboarding@resend.dev>"

export const sendWelcome = action({
  args: { to: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    const resend = getResend()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    await resend.emails.send({
      from: FROM,
      to: args.to,
      subject: "Welcome!",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0;">
          <div style="background: #0E768C; padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #fff; margin: 0; font-size: 20px;">Welcome!</h1>
          </div>
          <div style="background: #fff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hi ${args.name},</p>
            <p style="color: #374151; font-size: 15px; line-height: 1.6;">Your account is ready.</p>
            <a href="${baseUrl}/dashboard" style="display: inline-block; background: #0E768C; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Go to Dashboard</a>
          </div>
        </div>
      `,
    })
  },
})

export const sendTeamInvite = action({
  args: {
    to: v.string(),
    inviterName: v.string(),
    teamName: v.string(),
    inviteUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const resend = getResend()

    await resend.emails.send({
      from: FROM,
      to: args.to,
      subject: `${args.inviterName} invited you to ${args.teamName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 0;">
          <div style="background: #0E768C; padding: 24px 32px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #fff; margin: 0; font-size: 20px;">Team Invitation</h1>
          </div>
          <div style="background: #fff; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; font-size: 15px; line-height: 1.6;"><strong>${args.inviterName}</strong> invited you to <strong>${args.teamName}</strong>.</p>
            <a href="${args.inviteUrl}" style="display: inline-block; background: #0E768C; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Accept Invitation</a>
            <p style="color: #9ca3af; font-size: 12px; margin: 24px 0 0;">Expires in 7 days.</p>
          </div>
        </div>
      `,
    })
  },
})
