/**
 * Cloudflare Pages Function for handling contact form submissions
 * Sends emails using Resend API (direct fetch approach for Cloudflare Workers)
 */

const allowOrigin = "*"; // tighten to your domain in prod
const corsHeaders = {
  "Access-Control-Allow-Origin": allowOrigin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const onRequest = async (ctx) => {
  const { request, env } = ctx;
  const method = request.method.toUpperCase();

  // 1) CORS preflight
  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // 2) Only allow POST
  if (method !== "POST") {
    return new Response(JSON.stringify({ 
      success: false, 
      error: `Method ${method} not allowed` 
    }), { 
      status: 405, 
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
  try {
    // Parse form data
    const formData = await request.json();
    
    // Basic validation
    if (!formData.name || !formData.email) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Name and email are required' 
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Check honeypot (anti-spam)
    if (formData.honeypot) {
      // Silently reject spam
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully' 
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Invalid email address' 
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Check if Resend API key is configured
    if (!env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email service not configured. Please try again later.' 
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Get email addresses from environment variables
    const TO_EMAIL = env.TO_EMAIL || 'hello@haileygonnermancounseling.com';
    const FROM_EMAIL = env.FROM_EMAIL || 'onboarding@resend.dev';
    const DOMAIN = env.DOMAIN || 'haileygonnermancounseling.com';

    // Prepare email content
    const subject = `New Contact Form Submission from ${formData.name}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #6B705C; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #6B705C; }
            .value { margin-top: 5px; }
            .footer { margin-top: 20px; padding: 10px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${formData.name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${formData.email}">${formData.email}</a></div>
              </div>
              ${formData.phone ? `
                <div class="field">
                  <div class="label">Phone:</div>
                  <div class="value">${formData.phone}</div>
                </div>
              ` : ''}
              ${formData.message ? `
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="value">${formData.message.replace(/\n/g, '<br>')}</div>
                </div>
              ` : ''}
              <div class="field">
                <div class="label">Submitted:</div>
                <div class="value">${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</div>
              </div>
            </div>
            <div class="footer">
              This email was sent from the contact form at ${DOMAIN}
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
New Contact Form Submission

Name: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ''}
${formData.message ? `Message: ${formData.message}` : ''}

Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}

This email was sent from the contact form at ${DOMAIN}
    `.trim();

    // Send email using Resend API (direct fetch - recommended for Cloudflare Workers)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Hailey Counseling Website <${FROM_EMAIL}>`,
        to: [TO_EMAIL],
        reply_to: `${formData.name} <${formData.email}>`,
        subject: subject,
        html: htmlContent,
        text: textContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Resend API error:', response.status, errorData);
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Failed to send message. Please try again later.' 
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const data = await response.json();
    console.log('Email sent successfully:', data);

    // Success response
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Your message has been sent successfully. We\'ll get back to you within 24 hours.' 
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'An unexpected error occurred. Please try again later.' 
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
};