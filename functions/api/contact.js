export async function onRequestPost(context) {
  const { request, env } = context;

  // Parse the request body
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { name, email, subject, message } = body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return new Response(JSON.stringify({ error: 'All fields are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Format subject line
  const subjectLabels = {
    'job-opportunity': 'Job Opportunity',
    'freelance': 'Freelance Project',
    'collaboration': 'Collaboration',
    'commission': 'Commission Request',
    'purchase': 'Purchase Inquiry',
    'general': 'General Inquiry'
  };

  const subjectLine = `[${subjectLabels[subject] || 'Contact'}] New message from ${name}`;

  // Create HTML email template
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #22223b; color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin-top: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #22223b; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Name:</span> ${name}
          </div>
          <div class="field">
            <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
          </div>
          <div class="field">
            <span class="label">Subject:</span> ${subjectLabels[subject] || subject}
          </div>
          <div class="field">
            <span class="label">Message:</span>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
        <div class="footer">
          <p>This message was sent from the contact form at bryanthayes.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Plain text version
  const textContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subjectLabels[subject] || subject}

Message:
${message}

---
This message was sent from the contact form at bryanthayes.com
  `.trim();

  // Check if we're in development mode (no Resend API key)
  if (!env.RESEND_API_KEY) {
    console.log('Contact form submission (dev mode):', { name, email, subject, message });
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Message logged (development mode)' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Send email using Resend API
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL || 'Contact Form <noreply@bryanthayes.com>',
        to: env.TO_EMAIL || 'hello@bryanthayes.com',
        reply_to: email,
        subject: subjectLine,
        html: htmlContent,
        text: textContent
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', data);
      throw new Error(data.message || 'Failed to send email');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Message sent successfully!' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to send message. Please try again later.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}