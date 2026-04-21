import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;

    // Validate required fields
    if (!data.customerName || !data.customerPhone || !data.propertyType || !data.propertySize || !data.location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Send email to info@netcamsa.co.za
    const { error } = await resend.emails.send({
      from: 'Net Cam SA Website <onboarding@resend.dev>', // Replace with your verified domain later
      to: ['info@netcamsa.co.za'],
      subject: `New Quote Request from ${data.customerName}`,
      html: generateAdminEmail(data),
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    // Optional: Send confirmation to customer if email provided
    if (data.customerEmail) {
      await resend.emails.send({
        from: 'Net Cam SA <onboarding@resend.dev>',
        to: [data.customerEmail],
        subject: 'We received your request - Net Cam SA',
        html: generateCustomerEmail(data),
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function generateAdminEmail(data) {
  // Build detailed HTML email (same as previous admin email)
  return `<!DOCTYPE html>...`; // Use the same format as before
}

function generateCustomerEmail(data) {
  return `<!DOCTYPE html>...`; // Customer confirmation email
}