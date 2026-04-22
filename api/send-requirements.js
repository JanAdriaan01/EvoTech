const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    
    // Basic validation
    if (!data.customerName) {
      return res.status(400).json({ error: 'Missing required field: customerName' });
    }
    if (!data.customerPhone) {
      return res.status(400).json({ error: 'Missing required field: customerPhone' });
    }
    if (!data.customerEmail) {
      return res.status(400).json({ error: 'Missing required field: customerEmail' });
    }

    // Send email to admin
    const adminResult = await resend.emails.send({
      from: 'Net Cam SA <onboarding@resend.dev>',
      to: ['info@netcamsa.co.za'],
      subject: `New Quote Request from ${data.customerName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body>
          <h2 style="color: #0066cc;">New Quote Request</h2>
          <p><strong>Name:</strong> ${data.customerName}</p>
          <p><strong>Phone:</strong> ${data.customerPhone}</p>
          <p><strong>Email:</strong> ${data.customerEmail}</p>
          <p><strong>Property Type:</strong> ${data.propertyType || 'Not specified'}</p>
          <p><strong>Property Size:</strong> ${data.propertySize || 'Not specified'}</p>
          <p><strong>Location:</strong> ${data.location || 'Not specified'}</p>
          <p><strong>Categories:</strong> ${data.categories?.join(', ') || 'Not specified'}</p>
          ${data.specialNotes ? `<p><strong>Special Notes:</strong> ${data.specialNotes}</p>` : ''}
          <hr>
          <p><strong>Action Required:</strong> Contact customer within 1 hour.</p>
          <p><strong>WhatsApp:</strong> <a href="https://wa.me/${data.customerPhone.replace(/\D/g, '')}">Click to WhatsApp</a></p>
        </body>
        </html>
      `
    });

    // Send confirmation to customer
    await resend.emails.send({
      from: 'Net Cam SA <onboarding@resend.dev>',
      to: [data.customerEmail],
      subject: 'We received your request - Net Cam SA',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body>
          <h2 style="color: #0066cc;">Thank you, ${data.customerName}!</h2>
          <p>We have received your requirements and will get back to you within <strong>1 hour</strong> (7am-5pm weekdays).</p>
          <p>You can also reach us directly:</p>
          <p>📞 <strong>075 461 3153</strong></p>
          <p>💬 <strong><a href="https://wa.me/27754613153">WhatsApp Us</a></strong></p>
          <hr>
          <p style="color: #666; font-size: 12px;">Net Cam SA — Professional CCTV & Network Installations</p>
        </body>
        </html>
      `
    });

    return res.status(200).json({ success: true, message: 'Emails sent successfully' });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
};