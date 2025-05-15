import Mailgen from "mailgen";
import nodemailer from "nodemailer";

export const sendMail = async (options) => {
  var mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js/",
    },
  });

  var emailText = mailGenerator.generatePlaintext(options.mailGenContent);
  var emailHTML = mailGenerator.generate(options.mailGenContent);
  
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mail = {
    from: "mail.taskmanager@example.com",
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailHTML,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(error);
  }
};

export const emailVerificationMailGenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welocome to app! We're very excited to have you on board.",
      action: {
        instruction: "To get started with our App, please click here",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email we'd love to help.",
    },
  };
};

export const forgotPasswordMailGenContent = (username, passwordReseturl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to change your password",
      action: {
        instruction: "To change your password click the button",
        button: {
          color: "#22BC66",
          text: "Reset password",
          link: passwordReseturl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email we'd love o help.",
    },
  };
};

// sendMail({
//   email: user.email,
//   subject: "aaa",
//   mailGenContent: emailVerificationMailGenContent(username, verificationUrl),
// });
