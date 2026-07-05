import nodemailer from "nodemailer";

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export async function sendMail(to, subject, text) {
  if (!process.env.SMTP_HOST) {
    console.warn("SMTP not configured — skipping email:", subject);
    return;
  }
  const transport = getTransport();
  await transport.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text,
  });
}

export async function notifyConsultantOfNewRequest(item) {
  const url = `${process.env.SITE_URL}/dashboard/${item.id}`;
  await sendMail(
    process.env.NOTIFY_EMAIL,
    `New request from ${item.name} (${item.id})`,
    `${item.name} sent a new request.\n\nMessage: ${item.thread[0].text}\n\nReply here: ${url}`
  );
}

export async function notifyClientOfReply(item) {
  const url = `${process.env.SITE_URL}/request/${item.id}`;
  await sendMail(
    item.email,
    `New reply on your request (${item.id})`,
    `You have a new reply on your consulting request.\n\nView and respond: ${url}`
  );
}
