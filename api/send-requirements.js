// api/send-requirements.js
const { Resend } = require('resend');

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Sender email address (must be verified in Resend dashboard)
const SENDER_EMAIL = 'info@netcamsa.co.za';
const SENDER_NAME = 'Net Cam SA';

// INTERNAL RECIPIENT - ALWAYS send to sales@netcamsa.co.za (HARDCODED)
// The customer email is ONLY for their confirmation email
const INTERNAL_RECIPIENT = 'sales@netcamsa.co.za';

module.exports = async function handler(req, res) {
  // Handle preflight OPTIONS request (for CORS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Please use POST.' });
  }

  try {
    const data = req.body;
    
    console.log('=== New Quote Request Received ===');
    console.log('Name:', data.customerName);
    console.log('Phone:', data.customerPhone);
    console.log('Email:', data.customerEmail);
    console.log('Property Type:', data.propertyType);
    console.log('Property Size:', data.propertySize);
    console.log('Location:', data.location);
    console.log('Categories:', data.categories);
    
    // Basic validation - check required fields
    if (!data.customerName) {
      return res.status(400).json({ error: 'Missing required field: customerName' });
    }
    if (!data.customerPhone) {
      return res.status(400).json({ error: 'Missing required field: customerPhone' });
    }
    if (!data.customerEmail) {
      return res.status(400).json({ error: 'Missing required field: customerEmail' });
    }
    if (!data.propertyType) {
      return res.status(400).json({ error: 'Missing required field: propertyType' });
    }
    if (!data.propertySize) {
      return res.status(400).json({ error: 'Missing required field: propertySize' });
    }
    if (!data.location) {
      return res.status(400).json({ error: 'Missing required field: location' });
    }

    // Format property type for display
    let propertyTypeDisplay = '';
    switch(data.propertyType) {
      case 'house':
        propertyTypeDisplay = '🏠 House / Residential';
        break;
      case 'farm':
        propertyTypeDisplay = '🚜 Farm / Agricultural';
        break;
      case 'business':
        propertyTypeDisplay = '🏢 Small Business / Office';
        break;
      default:
        propertyTypeDisplay = data.propertyType;
    }

    // Format property size for display
    let propertySizeDisplay = '';
    const sizeMap = {
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      estate: 'Estate'
    };
    propertySizeDisplay = sizeMap[data.propertySize] || data.propertySize;

    // Build categories list
    const categoriesList = data.categories?.join(', ') || 'Not specified';

    // Build special notes section
    const specialNotesSection = data.specialNotes ? `
      <div class="info-box">
        <p><strong>📝 Special Notes:</strong></p>
        <p style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${data.specialNotes.replace(/\n/g, '<br>')}</p>
      </div>
    ` : '';

    // Build tech expert section
    let techExpertSection = '';
    if (data.isTechExpert) {
      techExpertSection = `
        <div class="info-box">
          <p><strong>🔧 Tech Expert Mode:</strong> Yes</p>
          <p><strong>⚙️ Custom Requirements:</strong></p>
          <p style="background: #f4f4f4; padding: 10px; border-radius: 5px;">${data.customRequirements || 'No custom requirements provided'}</p>
        </div>
      `;
    } else {
      let detailsHtml = '';
      // Network details
      if (data.categories?.includes('network')) {
        detailsHtml += `
          <p><strong>📡 Network & Wi-Fi Details:</strong></p>
          <ul>
            <li>People Count: ${data.peopleCount || 'Not specified'}</li>
            <li>Internet Use: ${data.internetUse?.join(', ') || 'Not specified'}</li>
            <li>Wi-Fi Coverage: ${data.wifiCoverage?.join(', ') || 'Not specified'}</li>
            <li>Existing Cabling: ${data.existingCabling || 'Not specified'}</li>
            <li>Wi-Fi Level: ${data.wifiLevel || 'Not specified'}</li>
          </ul>
        `;
      }
      
      // CCTV details
      if (data.categories?.includes('cctv')) {
        detailsHtml += `
          <p><strong>🎥 Security & CCTV Details:</strong></p>
          <ul>
            <li>Areas to Monitor: ${data.cameraAreas?.join(', ') || 'Not specified'}</li>
            <li>Night Vision Quality: ${data.nightVision || 'Not specified'}</li>
            <li>Video Doorbell/Intercom: ${data.doorbell || 'Not specified'}</li>
            <li>Security Level: ${data.cctvLevel || 'Not specified'}</li>
          </ul>
        `;
      }
      
      // Alarm details
      if (data.categories?.includes('alarm')) {
        detailsHtml += `
          <p><strong>🔔 Alarm & Safety Details:</strong></p>
          <ul>
            <li>Entry Points: ${data.entryPoints || 'Not specified'}</li>
            <li>Motion Sensors: ${data.motionSensors || 'Not specified'}</li>
            <li>Mobile Control: ${data.mobileControl || 'Not specified'}</li>
            <li>Load Shedding Backup: ${data.loadShedding || 'Not specified'}</li>
            <li>Alarm Level: ${data.alarmLevel || 'Not specified'}</li>
          </ul>
        `;
      }
      
      if (detailsHtml) {
        techExpertSection = `<div class="info-box">${detailsHtml}</div>`;
      }
    }

    // Email HTML content for internal team (ALWAYS sent to sales@netcamsa.co.za)
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>New Quote Request</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ff6b35; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #0066cc; border-radius: 5px; }
          .label { font-weight: bold; color: #0066cc; }
          hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
          .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🔔 NEW QUOTE REQUEST</h2>
            <p>Action Required Within 1 Hour</p>
          </div>
          <div class="content">
            <div class="info-box">
              <h3 style="color: #0066cc; margin-bottom: 15px;">👤 Customer Details</h3>
              <p><span class="label">Name:</span> ${data.customerName}</p>
              <p><span class="label">Phone:</span> ${data.customerPhone}</p>
              <p><span class="label">Email:</span> ${data.customerEmail}</p>
              <p><span class="label">Timestamp:</span> ${new Date(data.timestamp).toLocaleString()}</p>
            </div>
            
            <div class="info-box">
              <h3 style="color: #0066cc; margin-bottom: 15px;">🏠 Property Details</h3>
              <p><span class="label">Property Type:</span> ${propertyTypeDisplay}</p>
              <p><span class="label">Property Size:</span> ${propertySizeDisplay}</p>
              <p><span class="label">Location:</span> ${data.location}</p>
              <p><span class="label">Solutions Interested In:</span> ${categoriesList}</p>
            </div>
            
            ${techExpertSection}
            
            ${specialNotesSection}
            
            <hr>
            
            <div class="info-box">
              <h3 style="color: #0066cc; margin-bottom: 15px;">✅ Action Required</h3>
              <p>📞 Call customer within <strong>1 hour</strong> (7am-5pm weekdays)</p>
              <p>💬 <a href="https://wa.me/${data.customerPhone.replace(/\D/g, '')}" style="color: #25D366;">Click to WhatsApp Customer</a></p>
              <p>📧 Reply to: <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
            </div>
          </div>
          <div class="footer">
            <p>Net Cam SA — Professional CCTV & Network Installations</p>
            <p>69 State Road, President Park, Midrand</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // ============================================================
    // EMAIL 1: ALWAYS send to sales@netcamsa.co.za (HARDCODED)
    // This email goes to your sales team regardless of customer input
    // ============================================================
    const internalResult = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: [INTERNAL_RECIPIENT],  // HARDCODED: sales@netcamsa.co.za
      replyTo: data.customerEmail,
      subject: `🔔 NEW QUOTE REQUEST from ${data.customerName}`,
      html: emailHtml
    });

    console.log('✅ Email sent to sales@netcamsa.co.za:', internalResult?.id);

    // ============================================================
    // EMAIL 2: Send confirmation to the customer (their email)
    // This email goes to the person who submitted the form
    // ============================================================
    const customerResult = await resend.emails.send({
      from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
      to: [data.customerEmail],  // Customer's email from the form
      subject: 'We received your request - Net Cam SA',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Thank You - Net Cam SA</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 500px; margin: 0 auto; padding: 20px; }
            .header { background: #0066cc; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Thank You, ${data.customerName}! ✅</h2>
            </div>
            <div class="content">
              <p>We have received your requirements and will get back to you within <strong>1 hour</strong> (7am-5pm weekdays).</p>
              
              <p>You can also reach us directly:</p>
              <p>📞 <strong>075 461 3153</strong></p>
              <p>💬 <strong><a href="https://wa.me/27754613153" style="color: #25D366; text-decoration: none;">WhatsApp Us</a></strong></p>
              
              <hr>
              <p style="font-size: 12px; color: #666;">Your reference: ${data.timestamp?.substring(0, 10) || new Date().toISOString().substring(0, 10)}</p>
            </div>
            <div class="footer">
              <p>Net Cam SA — Professional CCTV & Network Installations</p>
              <p>69 State Road, President Park, Midrand</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log('✅ Confirmation sent to customer:', customerResult?.id);
    console.log('=== Quote Request Processed Successfully ===');

    return res.status(200).json({ 
      success: true, 
      message: 'Emails sent successfully',
      internalEmailId: internalResult?.id,
      customerEmailId: customerResult?.id
    });
    
  } catch (error) {
    console.error('=== ERROR SENDING EMAILS ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({ 
      error: 'Failed to send email. Please try again later.',
      details: error.message 
    });
  }
};