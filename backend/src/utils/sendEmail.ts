import sendgrid from "@sendgrid/mail";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export const sendEmail = async ({ to, subject, text, html }: SendEmailInput) => {
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
    console.warn("SendGrid is not configured. Email was not sent.");
    return { skipped: true };
  }

  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

  return sendgrid.send({
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject,
    text,
    html
  });
};
