
// EmailJS utility for sending donation notifications
const EMAILJS_SERVICE_ID = "service_bphhy9s";
const EMAILJS_TEMPLATE_ID = "template_oyf64ob";
const EMAILJS_USER_ID = "M_gCnW1q88HjXCX-l";

interface EmailParams {
  email: string;
  name: string;
  message: string;
}

/**
 * Sends email notification using EmailJS
 */
export const sendDonationEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    // Initialize EmailJS if it hasn't been initialized yet
    if ((window as any).emailjs && !(window as any).emailjsInitialized) {
      (window as any).emailjs.init(EMAILJS_USER_ID);
      (window as any).emailjsInitialized = true;
    }

    console.log('Sending email with params:', {
      email: params.email,
      name: params.name,
      messageLength: params.message.length
    });

    const response = await (window as any).emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      params
    );

    console.log('Email sent successfully:', response.status, response.text);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};
