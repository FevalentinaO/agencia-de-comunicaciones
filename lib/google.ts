import { google } from "googleapis";
import nodemailer from "nodemailer";
import type { ContactInput } from "./validation";

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !key) {
    throw new Error("Missing Google service account credentials");
  }
  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function appendToSheet(data: ContactInput) {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) throw new Error("Missing GOOGLE_SHEET_ID");

  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "A:D",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[new Date().toISOString(), data.name, data.email, data.message]],
    },
  });
}

// Gmail via Nodemailer + app password / SMTP is simpler to operate than
// full Gmail API OAuth2 (no refresh-token dance, fewer moving parts for a
// low-volume contact form). Swap for googleapis gmail.users.messages.send
// if you later need send-as-user semantics.
function getTransport() {
  const user = process.env.GMAIL_USER;
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  if (!user || !clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Gmail OAuth2 credentials");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user,
      clientId,
      clientSecret,
      refreshToken,
    },
  });
}

export async function sendNotificationEmail(data: ContactInput) {
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.GMAIL_USER;
  if (!to || !from) throw new Error("Missing CONTACT_TO_EMAIL or GMAIL_USER");

  const transport = getTransport();
  await transport.sendMail({
    from,
    to,
    replyTo: data.email,
    subject: `Nueva idea — ${data.name}`,
    text: `${data.name} <${data.email}>\n\n${data.message}`,
  });
}
