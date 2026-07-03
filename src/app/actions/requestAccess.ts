"use server";

import { Resend } from "resend";

export type AccessRequestState =
  | { ok: true }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function submitAccessRequest(
  _prev: AccessRequestState | null,
  formData: FormData,
): Promise<AccessRequestState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const reason = formData.get("reason")?.toString().trim() ?? "";

  if (name.length < 2) {
    return { ok: false, error: "Please enter your full name." };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (reason.length < 10) {
    return {
      ok: false,
      error: "Please describe why you need access (at least 10 characters).",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ACCESS_REQUEST_ADMIN_EMAIL;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "NestCalc <onboarding@resend.dev>";

  if (!apiKey || !adminEmail) {
    console.error(
      "Access request email is not configured (RESEND_API_KEY or ACCESS_REQUEST_ADMIN_EMAIL missing).",
    );
    return {
      ok: false,
      error: "Request service is temporarily unavailable. Please try again later.",
    };
  }

  const resend = new Resend(apiKey);
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeReason = escapeHtml(reason);

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    replyTo: email,
    subject: `NestCalc access request — ${name}`,
    text: [
      "New NestCalc access request",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Reason:",
      reason,
    ].join("\n"),
    html: `
      <h2>NestCalc access request</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
      <p><strong>Reason:</strong></p>
      <p style="white-space: pre-wrap;">${safeReason}</p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return {
      ok: false,
      error: "Failed to send request. Please try again later.",
    };
  }

  return { ok: true };
}