import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Utilise Gmail (ou un autre SMTP)
    auth: {
      user: "votre-email@gmail.com",
      pass: "votre-mot-de-passe-app",
    },
  });

  const mailOptions = {
    from: "votre-email@gmail.com",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email envoyé avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
  }
}
