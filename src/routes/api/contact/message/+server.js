import { json } from "@sveltejs/kit";
import { BREVO_API_KEY } from '$env/static/private'

const logo = "https://lethabomaepa.netlify.app/coder.png"; // Logo URL

const emailTemplate = (message, name) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Notification</title>
      <style>
        *{
        font-size: 16px;
        }
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              width: 100vw;
          }
          .container {
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              padding: 30px;
              max-width: 600px;
          }
          .logo {
              width: 150px;
              margin-bottom: 20px;
          }
          h2 {
              color: #333;
              margin-bottom: 15px;
          }
          p {
              line-height: 1.6;
              color: #555;
              font-size: 16px;
          }
          .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #777;
          }
        .message{
          padding: 20px;
          background-color: #f2f2f2;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
      </style>
  </head>
  <body>
      <div class="container">
          <img src="${logo}" alt="Lethabo Maepa-Logo" class="logo" />
          <h2>Dear ${name},</h2>
          <p>${message}</p>
          <br/><br/>
          <br/>

          
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Lethabo Maepa. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;


export const POST = async ({request}) => {
    let { data } = await request.json();
    // Use the Brevo API
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { email: 'lethabomaepa11@gmail.com', name: 'Lethabo Maepa' },
          to: [{ email: data.email }],
          subject: data.subject,
          htmlContent: emailTemplate(data.message, data.name),
        }),
      });
  
      if (response.ok) {
        return json({success: true})
        // Optionally return success message for the student email
      } else {
        const errorData = await response.json();
        return json({error: errorData, success: false})
        // Optionally handle error for the student email
      }
    } catch (error) {
      // Optionally handle network error for the student email
    }
  
  };
  