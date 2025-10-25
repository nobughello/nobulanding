const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY || "re_SLhc2wqR_Co5an9AdEftBHjfGzSWrAwi9");

exports.handler = async (event, context) => {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { name, phone, city } = JSON.parse(event.body);

    // Validate required fields
    if (!name || !phone || !city) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Validate phone number (Israeli format)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10 || !cleanPhone.startsWith('05')) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Invalid phone number format' }),
      };
    }

    console.log("[Form Submit] Received submission:", { name, city });

    // Send email notification
    const result = await resend.emails.send({
      from: "NoBug Pest Control <onboarding@resend.dev>",
      to: "nobughello@gmail.com",
      subject: `🐜 New Pest Control Lead from ${city}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🐜 New Pest Control Lead</h1>
          </div>
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #059669; margin-top: 0;">Customer Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Name:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Phone:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;"><a href="tel:${phone}" style="color: #059669; text-decoration: none;">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">City:</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; color: #111827;">${city}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; color: #374151;">Submitted:</td>
                <td style="padding: 10px 0; color: #111827;">${new Date().toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" })}</td>
              </tr>
            </table>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 5px;">
              <h3 style="color: #059669; margin-top: 0;">🚀 Action Required</h3>
              <p style="margin: 0; color: #374151;">Please contact this customer within 1 hour as promised on the website.</p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p>NoBug Pest Control - Professional extermination services</p>
          </div>
        </div>
      `,
    });

    console.log("[Form Submit] Email sent successfully:", result);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ success: true }),
    };

  } catch (error) {
    console.error("Failed to send email:", error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: "Failed to send notification" }),
    };
  }
};
