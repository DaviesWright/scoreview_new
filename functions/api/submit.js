// ScoreView — Demo Request & Contact Form Handler
// Uses Resend API for transactional email (matching existing bscscoreview setup)
// Env var: RESEND_API_KEY

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { firstName, lastName, name, email, organization, role, orgSize, interest, subject, message } = data;

    // Validate required fields
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ success: false, error: 'Valid email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const fullName = firstName ? `${firstName} ${lastName || ''}`.trim() : (name || 'Unknown');
    const formType = data._formType || (firstName ? 'demo-request' : 'contact');

    // Build email content
    const emailSubject = formType === 'scoreviewhr-registration'
      ? `New ScoReviewHR Registration — ${fullName} (${organization || 'Unknown'})`
      : formType === 'demo-request'
      ? `New Demo Request — ${fullName} (${organization || 'Unknown'})`
      : `New Contact Message — ${fullName}`;

    const emailBody = formType === 'demo-request'
      ? `
New demo request from the ScoreView website:

Name: ${fullName}
Email: ${email}
Organization: ${organization || 'Not provided'}
Role: ${role || 'Not provided'}
Org Size: ${orgSize || 'Not provided'}
Interested In: ${interest || 'Not specified'}

Message:
${message || 'No message provided'}

---
This request was submitted via the ScoreView website contact form.
      `.trim()
      : `
New contact message from the ScoreView website:

Name: ${fullName}
Email: ${email}
Organization: ${organization || 'Not provided'}
Subject: ${subject || 'General Inquiry'}

Message:
${message || 'No message provided'}

---
This message was submitted via the ScoreView website contact form.
      `.trim();

    // Send via Resend if API key is configured
    if (env.RESEND_API_KEY) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'ScoreView Website <noreply@bscscoreview.com>',
          to: ['hello@bscscoreview.com'],
          reply_to: email,
          subject: emailSubject,
          text: emailBody
        })
      });

      if (!resendResponse.ok) {
        const errText = await resendResponse.text();
        console.error('Resend API error:', errText);
        // Still return success to user — we received their submission
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Your submission has been received. We will contact you within 24 hours.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Form handler error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: 'An error occurred. Please try again or email us directly.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
