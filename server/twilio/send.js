import dotenv from 'dotenv'
dotenv.config()
import twilio from 'twilio'
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export default async function sendWhatsAppMessage(to, body) {
  try {
    let messageOptions = {
      body:body,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`
    };

    const message = await client.messages.create(messageOptions);
    console.log(`Message sent successfully. SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}