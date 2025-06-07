import * as functions from "firebase-functions/v1";
import nodemailer from "nodemailer";
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Nodemailer 설정 (Gmail SMTP 사용)
const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password
  }
});

app.post("/sendMail", (req: Request, res: Response) => {
  (async () => {
    const { name, email, message } = req.body;

    const mailOptions = {
      from: email,
      to: functions.config().gmail.email,
      subject: `[문의] ${name}님으로부터 메일이 도착했습니다.`,
      text: `보낸 사람: ${name} (${email})\n\n메시지:\n${message}`
    };

    try {
      await mailTransport.sendMail(mailOptions);
      return res.status(200).send({ success: true });
    } catch (error) {
      console.error("메일 전송 실패:", error);
      return res.status(500).send({ success: false, error });
    }
  })();
});

app.post("/sendReplyMail", (req: Request, res: Response) => {
  (async () => {
    const { email, reply } = req.body;

    const mailOptions = {
      from: functions.config().gmail.email,
      to: email,
      subject: "📬 문의하신 내용에 대한 답변입니다.",
      text: `안녕하세요,\n\n요청하신 내용에 대한 답변입니다:\n\n${reply}\n\n감사합니다.`
    };

    try {
      await mailTransport.sendMail(mailOptions);
      return res.status(200).send({ success: true });
    } catch (error) {
      console.error("답변 메일 전송 실패:", error);
      return res.status(500).send({ success: false, error });
    }
  })();
});

// Firebase Functions export
export const api = functions
  .runWith({ memory: "256MB", timeoutSeconds: 30 })
  .https.onRequest(app);
