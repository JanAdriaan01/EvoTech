// ============================================
// EVO HOME TECH - AI ASSISTANT
// Shared across all pages - Single file
// FIXED: Quick reply buttons now visible with proper colors
// ============================================

(function() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAIAssistant);
  } else {
    initAIAssistant();
  }

  function initAIAssistant() {
    // Create chatbot HTML dynamically
    const chatbotHTML = `
      <div class="chatbot-button" id="chatbotButton">
        <span>🤖</span> AI Assistant
      </div>
      <div class="chatbot-window" id="chatbotWindow">
        <div class="chatbot-header">
          <span>🤖 Evo AI Assistant</span>
          <button id="closeChatbot">✕</button>
        </div>
        <div class="chatbot-messages" id="chatbotMessages">
          <div class="message bot-message">👋 Hello! Ask me anything about our products or services.</div>
        </div>
        <div class="quick-replies-search">
          <input type="text" id="quickSearchInput" placeholder="🔍 Filter topics...">
        </div>
        <div class="quick-replies" id="quickRepliesContainer"></div>
        <div class="chatbot-input">
          <input type="text" id="chatbotInput" placeholder="Type your question...">
          <button id="sendMsgBtn">Send</button>
        </div>
      </div>
    `;
    
    // Add chatbot HTML to body
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    
    // Add styles if not already present
    if (!document.getElementById('ai-assistant-styles')) {
      const styles = document.createElement('style');
      styles.id = 'ai-assistant-styles';
      styles.textContent = `
        /* AI ASSISTANT - CORRECTED POSITIONING */
        .chatbot-button {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: linear-gradient(135deg, #0066cc, #0099ff);
          color: white;
          border: none;
          border-radius: 60px;
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          z-index: 1000;
          transition: transform 0.2s, background 0.2s;
        }
        .chatbot-button:hover {
          transform: scale(1.05);
          background: linear-gradient(135deg, #0055bb, #0088ee);
        }
        
        .chatbot-window {
          position: fixed;
          bottom: 90px;
          left: 20px;
          width: 380px;
          max-width: calc(100vw - 40px);
          background: rgba(20, 30, 45, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          z-index: 1001;
          display: none;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(255,107,53,0.3);
          max-height: 80vh;
        }
        
        .chatbot-header {
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          color: white;
          padding: 14px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
          font-size: 1rem;
        }
        .chatbot-header button {
          background: none;
          border: none;
          color: white;
          font-size: 1.3rem;
          cursor: pointer;
          padding: 0 8px;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .chatbot-header button:hover {
          opacity: 1;
        }
        
        .chatbot-messages {
          height: 350px;
          max-height: 50vh;
          overflow-y: auto;
          padding: 15px;
          background: rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        /* Custom scrollbar */
        .chatbot-messages::-webkit-scrollbar {
          width: 5px;
        }
        .chatbot-messages::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .chatbot-messages::-webkit-scrollbar-thumb {
          background: #ff8c42;
          border-radius: 10px;
        }
        
        .message {
          margin-bottom: 4px;
          padding: 10px 14px;
          border-radius: 18px;
          max-width: 85%;
          word-wrap: break-word;
          font-size: 0.85rem;
          line-height: 1.45;
        }
        .user-message {
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          color: white;
          margin-left: auto;
          text-align: right;
          border-bottom-right-radius: 4px;
        }
        .bot-message {
          background: rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
          border: 1px solid rgba(255,107,53,0.2);
          border-bottom-left-radius: 4px;
        }
        .bot-message strong {
          color: #ff8c42;
        }
        
        .chatbot-input {
          display: flex;
          padding: 12px;
          border-top: 1px solid rgba(255,255,255,0.1);
          background: rgba(0, 0, 0, 0.3);
          gap: 10px;
        }
        .chatbot-input input {
          flex: 1;
          padding: 10px 14px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 30px;
          outline: none;
          font-size: 0.85rem;
          color: white;
        }
        .chatbot-input input::placeholder {
          color: rgba(255,255,255,0.5);
        }
        .chatbot-input input:focus {
          border-color: #ff8c42;
        }
        .chatbot-input button {
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s;
        }
        .chatbot-input button:hover {
          transform: scale(1.02);
        }
        
        /* QUICK REPLIES - FIXED VISIBILITY */
        .quick-replies {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid rgba(255,255,255,0.1);
          max-height: 140px;
          overflow-y: auto;
        }
        
        /* Custom scrollbar for quick replies */
        .quick-replies::-webkit-scrollbar {
          width: 4px;
        }
        .quick-replies::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .quick-replies::-webkit-scrollbar-thumb {
          background: #ff8c42;
          border-radius: 10px;
        }
        
        .quick-reply {
          background: rgba(255,107,53,0.2);
          border: 1px solid rgba(255,107,53,0.4);
          padding: 6px 14px;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          color: #ff8c42;
        }
        .quick-reply:hover {
          background: #ff6b35;
          border-color: #ff6b35;
          color: white;
          transform: translateY(-2px);
        }
        
        .quick-replies-search {
          padding: 10px 12px 5px 12px;
          background: rgba(0, 0, 0, 0.2);
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .quick-replies-search input {
          width: 100%;
          padding: 8px 12px;
          border-radius: 30px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          font-size: 0.75rem;
          outline: none;
          color: white;
        }
        .quick-replies-search input::placeholder {
          color: rgba(255,255,255,0.5);
        }
        .quick-replies-search input:focus {
          border-color: #ff8c42;
        }
        
        /* Mobile adjustments */
        @media (max-width: 700px) {
          .chatbot-button {
            bottom: 15px;
            left: 15px;
            padding: 10px 16px;
            font-size: 0.8rem;
          }
          .chatbot-window {
            bottom: 75px;
            left: 15px;
            width: calc(100vw - 30px);
            max-width: none;
            max-height: 75vh;
          }
          .chatbot-messages {
            height: 300px;
            max-height: 45vh;
          }
          .quick-reply {
            font-size: 0.7rem;
            padding: 5px 12px;
          }
        }
        
        /* Desktop adjustments for larger screens */
        @media (min-width: 1200px) {
          .chatbot-button {
            bottom: 30px;
            left: 30px;
          }
          .chatbot-window {
            bottom: 100px;
            left: 30px;
            width: 420px;
          }
        }
      `;
      document.head.appendChild(styles);
    }
    
    // DOM elements
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotButton = document.getElementById('chatbotButton');
    const closeChatbot = document.getElementById('closeChatbot');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('sendMsgBtn');
    const quickContainer = document.getElementById('quickRepliesContainer');
    const searchInput = document.getElementById('quickSearchInput');
    
    let welcomeShown = false;
    
    // ============================================
    // COMPLETE FAQ DATABASE
    // ============================================
    const faq = {
      "specialize": "🔧 *What we specialize in:*\n\nWe specialize in three core areas:\n\n📡 *NETWORKING* – Wi-Fi mesh systems, full network upgrades, structured cabling, NAS storage, and point-to-point wireless bridges.\n\n📹 *SECURITY* – CCTV systems (4K, night vision, PTZ), video intercoms, and alarm systems with mobile control.\n\n🚜 *FARMS* – Long-range cameras (100m+ night vision), farm alarm sensors (up to 2km range), and point-to-point networking (up to 15km).\n\nOne company, one point of contact, integrated solutions.",
      
      "homes and farms": "🏠 *Do you do both homes and farms?*\n\nYes! We specialize in both:\n\n🏡 *Homes:* Wi-Fi mesh, CCTV, alarms, NAS storage, network upgrades\n\n🚜 *Farms:* Long-range cameras (100m+ night vision), farm alarm sensors (up to 2km), point-to-point wireless bridges (up to 15km), solar-powered options\n\n*Use our Quick Quote tool* – select your property type and get a custom recommendation!",
      
      "site survey": "📋 *How do I schedule a site survey?*\n\nSite surveys are quoted based on your location and requirements.\n\n*To schedule:*\n1️⃣ Contact us via WhatsApp at +27 (0)10 123 4567\n2️⃣ Provide your property address and what you need surveyed\n3️⃣ We will provide a fixed fee for the site survey\n4️⃣ Once confirmed, we visit your property\n\n*What we do during the survey:*\n• Walk through every room and outdoor area\n• Identify Wi-Fi dead zones with our signal meter\n• Identify security blind spots\n• Discuss your needs and budget\n• Provide a fixed-price installation quote\n\n*The survey fee is credited toward your installation if you proceed.*",
      
      "payment terms": "💳 *Payment Terms – 50/50 Split*\n\n• *50% deposit* required before we order materials and schedule your installation.\n• *50% on completion* – payable after you've tested the system and are completely satisfied.\n\n*Payment methods accepted:*\n• EFT / Bank Transfer\n• Credit Card (via payment link)\n• Cash (on-site, receipt provided)\n\n*No hidden fees* – the quoted price is the price you pay.",
      
      "lead time": "⏱️ *Expected Lead Time – Step by Step*\n\n*Step 1:* Upon receiving your 50% deposit, we WhatsApp you confirmation.\n*Step 2:* *2-3 days* – We order and collect all materials.\n*Step 3:* *1-3 days* – Installation scheduled based on scope (we WhatsApp you the date).\n*Step 4:* *1-5 days* – Site work completed (depends on complexity).\n*Step 5:* *Final day* – Testing, training, and final payment.\n\n*You will receive WhatsApp updates at every step.*\n\n*Estimated timelines by project type:*\n• Basic Wi-Fi install: 1 day\n• Home CCTV + Wi-Fi: 2 days\n• Full network upgrade: 3-5 days\n• Farm installation: 5-10 days\n\n*See your quotation for your specific ETA.*",
      
      "buy devices only": "🛒 *Can I buy the devices and you only do installation?*\n\nYes! We offer *installation-only* services.\n\n*What you provide:*\n• The equipment (cameras, NVR, router, switches, etc.)\n• All cables and accessories\n\n*What we provide:*\n• Professional installation\n• Cabling and mounting\n• Configuration and setup\n• Testing and optimization\n• 1-hour training session\n\n*Pricing:*\n• Small job (1-2 devices): R1,500 - R2,500\n• Medium job (3-6 devices): R3,000 - R5,000\n• Large job (7+ devices / full system): R5,000 - R8,000\n\n*Important notes:*\n• We don't provide warranty on customer-supplied hardware\n• Equipment must be new or in good working condition\n• We can advise on what to buy (free consultation)\n\n*Contact us for a quote – tell us what equipment you have!*",
      
      "existing equipment": "🔧 *Already have equipment? We can help!*\n\nYes! We offer *installation-only services* if you already have your own equipment.\n\n*What we can do:*\n• Install your existing cameras, alarms, or networking gear\n• Configure and test everything\n• Provide cabling and mounting\n• Train you on how to use it\n\n*Pricing:* Installation-only starts from R1,500 (small jobs) to R5,000+ (full system install).\n\n*Note:* We only install equipment that is in good working condition. We don't provide warranty on customer-supplied hardware.\n\n*Contact us for a quote!*",
      
      "warranty explained": "🛡️ *Warranty & Guarantee – What's Covered*\n\n━━━━━━━━━━━━━━━━━━━━━━\n📦 *PRODUCT WARRANTY (Hardware)*\n━━━━━━━━━━━━━━━━━━━━━━\n• *Duration:* 5 years on all supplied equipment\n• *What it covers:* Manufacturing defects, hardware failure, faulty components\n• *What it does NOT cover:* Physical damage, lightning strikes, power surges, water damage, theft, misuse\n\n*Process:* We replace faulty hardware within 48 hours of diagnosis.\n\n━━━━━━━━━━━━━━━━━━━━━━\n🔨 *WORKMANSHIP GUARANTEE (Labour)*\n━━━━━━━━━━━━━━━━━━━━━━\n• *Duration:* 1 year on all installation work\n• *What it covers:* Cabling issues, loose connections, mounting problems, configuration errors\n• *What it does NOT cover:* Customer changes to settings, physical damage to cables\n\n*Process:* We return to site within 72 hours to fix any workmanship issues – no charge.\n\n━━━━━━━━━━━━━━━━━━━━━━\n⚙️ *SUPPORT (Ongoing Assistance)*\n━━━━━━━━━━━━━━━━━━━━━━\n• *Free support:* 30 days after installation (phone, WhatsApp, email)\n• *After 30 days:* Support is available at R350 per call-out or R250 per remote session\n• *What support covers:* Help with using the system, forgotten passwords, app issues, general questions\n\n*Note:* Support is NOT a warranty – it's assistance using your system.\n\n━━━━━━━━━━━━━━━━━━━━━━\n🔄 *How to Claim:*\n━━━━━━━━━━━━━━━━━━━━━━\n1️⃣ WhatsApp us at +27 (0)10 123 4567\n2️⃣ Provide your invoice number\n3️⃣ Describe the issue and send a photo/video if possible\n4️⃣ We diagnose and arrange replacement or site visit",
      
      "workmanship guarantee": "🔨 *Workmanship Guarantee – What It Covers*\n\n*Duration:* 1 year from installation date\n\n*What's covered:*\n• Cabling that becomes loose or faulty\n• Wall plates that come loose\n• Mounting issues (cameras, sensors, access points)\n• Configuration errors made during installation\n• Termination issues at patch panels or jacks\n\n*What's NOT covered:*\n• Damage caused by you (painting over cables, moving equipment, physical impact)\n• Changes you make to settings\n• Acts of God (lightning, floods, fires)\n• Normal wear and tear\n\n*Process:* If you notice an issue with our workmanship, contact us. We will return to site within 72 hours and fix it at no charge.",
      
      "product warranty": "📦 *Product Warranty – What It Covers*\n\n*Duration:* 5 years on all equipment we supply\n\n*What's covered:*\n• Manufacturing defects\n• Hardware failure (not caused by external factors)\n• Faulty components (power supplies, ports, sensors)\n\n*What's NOT covered:*\n• Lightning strikes (we recommend UPS/surge protection)\n• Power surges (we recommend UPS/surge protection)\n• Physical damage (drops, impacts, water)\n• Theft or vandalism\n• Misuse or improper handling\n\n*Process:* If hardware fails, we diagnose remotely or on-site. If confirmed faulty, we replace it within 48 hours.",
      
      "support process": "⚙️ *Support Process – After Installation*\n\n*Free Support Period:* 30 days after installation\n• Phone, WhatsApp, email support\n• Help with app issues, forgotten passwords, general questions\n• Remote assistance (if possible)\n\n*After 30 Days:*\n• Remote support (TeamViewer/AnyDesk): R250 per session\n• On-site support (call-out): R350 plus travel\n• Hourly rate for complex issues: R450/hour\n\n*What support covers:*\n• Forgotten passwords\n• App installation on new phones\n• Adding new users\n• General \"how to\" questions\n• Troubleshooting user errors\n\n*What support does NOT cover:*\n• Hardware failures (covered by product warranty)\n• Installation issues (covered by workmanship guarantee)\n• Customer-damaged equipment\n\n*For warranty claims, use the warranty process – not support.*",
      
      "warranty claim": "🔄 *How to Claim Warranty or Guarantee*\n\n*Step 1:* Contact us via WhatsApp at +27 (0)10 123 4567\n\n*Step 2:* Provide your *invoice number* and describe the issue clearly.\n\n*Step 3:* Send a *photo or video* of the problem (if applicable).\n\n*Step 4:* We will diagnose:\n• Remotely (if possible)\n• On-site (if needed)\n\n*Step 5:* If confirmed as warranty or workmanship issue:\n• Hardware fault → Replacement within 48 hours\n• Workmanship issue → Site visit within 72 hours\n\n*Response times:*\n• WhatsApp/Email: Within 2 hours (business hours)\n• Phone: Immediate during business hours\n\n*Keep your invoice – it's your proof of warranty.*",
      
      "wifi vs wifi7": "📡 *Wi-Fi vs Wi-Fi 7 – The Difference*\n\n*Traditional Wi-Fi (Wi-Fi 5/6):*\n• Speed: Up to 9.6 Gbps\n• Latency: 10-30ms\n• Devices: 30-50 devices\n• Best for: Browsing, HD streaming\n\n*Wi-Fi 7 (What We Install):*\n• Speed: Up to 46 Gbps (5x faster!)\n• Latency: Less than 1ms (instant)\n• Devices: 100+ devices\n• Best for: 8K streaming, VR gaming, video calls, smart homes\n\n*Real-world difference:* No buffering, no dropped video calls, seamless roaming throughout your home.",
      
      "fast ethernet vs gigabit": "⚡ *Fast Ethernet vs Gigabit – What's the difference?*\n\n*Fast Ethernet (10/100):*\n• Speed: Up to 100 Mbps\n• Best for: Basic browsing, emails, older devices\n• Reality: Can struggle with 4K streaming, multiple users\n\n*Gigabit Ethernet (10/100/1000) – What we install:*\n• Speed: Up to 1,000 Mbps (10x faster!)\n• Best for: 4K streaming, gaming, video calls, large file transfers\n• Future-proof for years to come\n\n*We only install Gigabit equipment – anything less is obsolete.*",
      
      "latency explained": "⏱️ *What is Latency and Why Does It Matter?*\n\n*Latency* is the delay between an action and a response. Measured in milliseconds (ms).\n\n*Good vs Bad Latency:*\n• <10ms – Excellent (gaming, professional video calls)\n• 10-30ms – Good (normal browsing, streaming)\n• 30-50ms – Noticeable delay (frustrating for gaming)\n• 50ms+ – Poor (echoes on calls, laggy gaming)\n\n*Our Wi-Fi 7 systems deliver <1ms latency – instant response.*\n\n*Why it matters:* High latency = dropped video calls, laggy gaming, slow website loading.",
      
      "entry level vs pro": "💡 *Entry Level vs Pro / Tech'd Out – What's right for you?*\n\n*Entry Level (Budget-Friendly):*\n• Wi-Fi: Standard mesh (Wi-Fi 5/6)\n• Cameras: 1080p, standard night vision (20m)\n• Alarm: Basic sensors, no mobile app\n• Best for: Small homes, light use, tight budget\n• Price: R5,000 - R12,000\n\n*Mid-Range (Best Value – Most Popular):*\n• Wi-Fi: Wi-Fi 6/7 mesh, good coverage\n• Cameras: 4K, good night vision (30m), mobile app\n• Alarm: Full system with app control\n• Best for: Most homes, families, regular use\n• Price: R12,000 - R25,000\n\n*Pro / Tech'd Out (No Compromises):*\n• Wi-Fi: Wi-Fi 7 mesh, enterprise router, VLANs\n• Cameras: 4K, long-range night vision (100m), AI detection, PTZ\n• Alarm: Full system + cellular backup + remote management\n• NAS storage, whole-home cabling\n• Best for: Large homes, farms, power users, smart homes\n• Price: R25,000 - R80,000+\n\n*We help you find the right balance – no overselling, no underspecifying.*",
      
      "camera types": "📹 *CCTV Camera Types – What's best for you:*\n\n*Dome Cameras:* Best for ceilings, covered patios. Wide angle, tamper-resistant, discreet.\n\n*Bullet Cameras:* Best for long driveways, garden paths. Visible deterrent, long-range.\n\n*PTZ Cameras:* Pan, Tilt, Zoom – can follow movement. Best for large properties and farms.\n\n*Color Night Vision:* Sees in full color at 2AM. Best for dark backyards and perimeters.\n\n*AI Detection:* Filters out animals, trees, rain – only alerts for people and vehicles.\n\n*We'll recommend the right mix for your property during the quote process!*",
      
      "nvr vs dvr": "💾 *NVR vs DVR – What's the difference?*\n\n*NVR (Network Video Recorder)* – What we recommend:\n• Works with IP cameras (network cameras)\n• Higher resolution (up to 4K/8K)\n• Single cable (PoE) for power + data\n• Better image quality\n• Remote viewing from phone/PC\n\n*DVR (Digital Video Recorder)* – Older technology:\n• Works with analog cameras\n• Lower resolution (max 1080p)\n• Requires separate power cable\n• Being phased out\n\n*We only install NVR systems for new installations – better quality, future-proof.*",
      
      "storage size guide": "💾 *Storage Size Guide – How long can you record?*\n\n*1TB (7-14 days):*\n• 2-4 cameras\n• Motion recording only\n\n*2TB (14-21 days) – Most popular:*\n• 4-6 cameras\n• Continuous + motion recording\n\n*4TB (21-30 days):*\n• 6-8 cameras\n• Continuous recording\n\n*8TB (30+ days):*\n• 8+ cameras or farm\n• Continuous recording\n\n*We recommend 2TB for most homes, 4TB+ for farms.*",
      
      "alarm modes": "🔒 *Alarm Modes – Protection for every situation:*\n\n*🏡 At Home Mode:*\n• Perimeter sensors armed (doors/windows)\n• Motion sensors DISABLED\n• Move freely inside without triggering\n\n*✈️ Away Mode:*\n• EVERYTHING armed\n• Doors, windows, motion sensors, glass breaks\n• Instant mobile alert on trigger\n\n*🌙 Night Mode:*\n• Perimeter armed\n• Downstairs motion sensors armed\n• Upstairs disarmed (safe for nighttime movement)\n\n*You control everything from your phone!*",
      
      "load shedding": "⚡ *Do alarms work during load shedding?*\n\nYes! All our alarm systems have:\n• *8-12 hour battery backup* – continues working normally during power outages\n• *Cellular backup option* – sends alerts even when internet is down\n• *Low battery notification* – we'll notify you before battery runs low\n\n*We also offer UPS systems for your router and cameras* – ask us for recommendations!",
      
      "ups types": "⚡ *UPS / Backup Power Options – What you need:*\n\n*Basic UPS (R1,800):*\n• Powers: Router + 2 cameras\n• Runtime: 2-4 hours\n• Best for: Small homes, essential connectivity\n\n*Standard UPS (R3,500) – Most popular:*\n• Powers: Router + 4 cameras + alarm system\n• Runtime: 4-6 hours\n• Best for: Most homes\n\n*Extended UPS (R6,500):*\n• Powers: Full system + farm equipment\n• Runtime: 8-12 hours\n• Best for: Large homes, farms\n\n*Solar-ready System (R12,500):*\n• Complete off-grid backup\n• Runtime: Unlimited (with solar)\n• Best for: Remote farms, load shedding heavy areas\n\n*All systems automatically switch on when power fails.*",
      
      "farm cameras": "🚜 *Farm Cameras – Long-range solutions:*\n\n*Standard farm camera:*\n• 100m+ night vision (color)\n• 4K resolution – identify faces and number plates\n• PTZ option available\n\n*Solar-powered camera:*\n• No electricity needed\n• Built-in battery (works at night)\n• Perfect for remote areas\n\n*Placement recommendations:*\n• Gate / entrance\n• Kraals and livestock areas\n• Equipment sheds\n• Fuel storage\n• Perimeter fences\n\n*Use our farm quote tool for a custom solution!*",
      
      "farm networking": "🌾 *Farm Networking – Connect your whole property:*\n\n*Point-to-Point Wireless Bridges:*\n• Range: Up to 15km\n• Connects multiple buildings\n• No trenching cables\n\n*Typical setup:*\n• Farmhouse (main router)\n• Bridge to cottage (1-2km away)\n• Bridge to sheds (500m-2km)\n• Wi-Fi at stables, workshop, kraal\n\n*Benefits:*\n• Internet everywhere on your farm\n• Security cameras at all buildings\n• Remote monitoring from your phone\n\n*Includes solar power options for remote nodes.*",
      
      "eta on items": "📦 *ETA on Items Supplied*\n\n*Standard timeline:*\n• Upon 50% deposit reflecting in our account, we order all materials immediately.\n• *24 hours* – Items are ordered and confirmed\n• *2-3 days* – Stock collected / delivered to us\n\n*If specified differently on your quote:* We will communicate the exact ETA in your quotation document.\n\n*You will receive:*\n• WhatsApp confirmation when deposit is received\n• WhatsApp update when materials are ordered\n• WhatsApp update when materials arrive\n\n*We communicate every step of the way – no waiting in the dark.*",
      
      "team onsite": "👨‍🔧 *When Will the Team Arrive On Site?*\n\n*Standard timeline:*\n• *Within 48 hours* of materials being ready, our team will be on site\n• *Unless scheduled differently* – we will agree on a specific date with you\n\n*Example:*\n• Monday: Deposit reflects, materials ordered\n• Tuesday-Thursday: Materials arrive\n• Friday (within 48 hours of Thursday): Team on site\n\n*You will receive:*\n• WhatsApp confirmation of installation date\n• Morning-of reminder with technician's name and ETA\n• Real-time updates if any delays occur\n\n*We respect your time – we show up when promised.*",
      
      "not home during installation": "🏠 *What If I'm Not Home During Installation?*\n\n*Option 1 – Weekend work (recommended):*\n• We can schedule work for *Saturdays or Sundays* at *no additional cost*\n• You can personally supervise the team\n• Same quality work, same pricing\n\n*Option 2 – Key access / trusted person:*\n• If you provide access (key, gate code, or trusted person)\n• We can work while you're away\n• We send photo updates throughout the day\n• You review work remotely\n\n*Option 3 – After-hours work:*\n• Evenings available upon request\n• Subject to availability\n\n*We're flexible – tell us what works for you!*",
      
      "weekend scheduling": "📞 *How to Schedule Weekend Work*\n\n*Weekend work is available at NO additional cost.*\n\n*To schedule:*\n1️⃣ Mention during your quote that you prefer weekend installation\n2️⃣ Or WhatsApp us after deposit to request a Saturday/Sunday slot\n\n*Available weekend slots:*\n• Saturdays: 8am – 5pm\n• Sundays: 9am – 3pm (limited availability)\n\n*Why choose weekend work:*\n• You can personally supervise\n• No need to take time off work\n• See exactly what we're doing\n• Ask questions in person\n\n*Book early – weekend slots fill up quickly!*"
    };
    
    function getAnswer(query) {
      const q = query.toLowerCase().trim();
      
      if (q.includes('specialize') || q.includes('do you do') || q.includes('what services')) return faq["specialize"];
      if ((q.includes('home') && q.includes('farm')) || q.includes('both')) return faq["homes and farms"];
      if (q.includes('site survey') || q.includes('schedule a survey')) return faq["site survey"];
      if (q.includes('payment') || q.includes('deposit') || q.includes('50%')) return faq["payment terms"];
      if (q.includes('lead time') || (q.includes('how long') && q.includes('take')) || q.includes('eta')) return faq["lead time"];
      if ((q.includes('buy') && q.includes('devices')) || q.includes('install only')) return faq["buy devices only"];
      if (q.includes('existing') || (q.includes('already') && q.includes('equipment'))) return faq["existing equipment"];
      if (q.includes('warranty') && (q.includes('explain') || q.includes('what') || q.includes('cover'))) return faq["warranty explained"];
      if (q.includes('workmanship') || q.includes('labour')) return faq["workmanship guarantee"];
      if (q.includes('product warranty') || q.includes('hardware warranty')) return faq["product warranty"];
      if ((q.includes('support') && !q.includes('warranty')) || q.includes('help')) return faq["support process"];
      if (q.includes('claim') || (q.includes('how') && q.includes('warranty'))) return faq["warranty claim"];
      if ((q.includes('wifi') || q.includes('wi-fi')) && (q.includes('7') || q.includes('difference'))) return faq["wifi vs wifi7"];
      if ((q.includes('fast ethernet') || q.includes('gigabit'))) return faq["fast ethernet vs gigabit"];
      if (q.includes('latency')) return faq["latency explained"];
      if (q.includes('entry level') || q.includes('pro') || q.includes('tech out') || q.includes('budget')) return faq["entry level vs pro"];
      if (q.includes('camera type') || (q.includes('camera') && q.includes('difference'))) return faq["camera types"];
      if (q.includes('nvr') || q.includes('dvr')) return faq["nvr vs dvr"];
      if (q.includes('storage') && (q.includes('tb') || q.includes('record'))) return faq["storage size guide"];
      if (q.includes('mode') || (q.includes('arm') && q.includes('disarm'))) return faq["alarm modes"];
      if (q.includes('load shedding') || q.includes('power outage')) return faq["load shedding"];
      if ((q.includes('ups') || q.includes('backup') || q.includes('battery'))) return faq["ups types"];
      if ((q.includes('farm') && q.includes('camera')) || (q.includes('long range') && q.includes('camera'))) return faq["farm cameras"];
      if ((q.includes('farm') && q.includes('network')) || q.includes('point to point')) return faq["farm networking"];
      if (q.includes('eta') && q.includes('items')) return faq["eta on items"];
      if (q.includes('team') || (q.includes('arrive') && q.includes('site'))) return faq["team onsite"];
      if (q.includes('not home') || (q.includes('away') && q.includes('installation'))) return faq["not home during installation"];
      if (q.includes('weekend') || q.includes('saturday') || q.includes('sunday')) return faq["weekend scheduling"];
      
      return "❓ I'm not sure about that. Please type 'menu' to see all topics, or WhatsApp us directly at +27 (0)10 123 4567 for immediate help!";
    }
    
    function addMessage(text, isUser) {
      const div = document.createElement('div');
      div.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
      let formatted = text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
      formatted = formatted.replace(/━━━━━━━━━━━━━━━━━━━━━━/g, '<hr style="margin: 8px 0; border-color: rgba(255,255,255,0.1);">');
      div.innerHTML = formatted;
      chatbotMessages.appendChild(div);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    function showWelcomeMenu() {
      const welcomeMsg = `👋 *Hello! I'm Evo's AI Assistant.*

*What would you like to know? Select a topic below or type your question.*

━━━━━━━━━━━━━━━━━━━━━━
📌 *SERVICES & SPECIALTIES*
━━━━━━━━━━━━━━━━━━━━━━
🔧 What do you specialize in?
🏠 Do you do both homes and farms?
📋 How do I schedule a site survey?

━━━━━━━━━━━━━━━━━━━━━━
💰 *PRICING & PAYMENTS*
━━━━━━━━━━━━━━━━━━━━━━
💳 What are the payment terms? (50/50)
⏱️ What is the expected lead time?
🛒 Can I buy devices and you only install?
🔧 What if I already have equipment?

━━━━━━━━━━━━━━━━━━━━━━
🛡️ *WARRANTY & GUARANTEES*
━━━━━━━━━━━━━━━━━━━━━━
📦 Product warranty vs workmanship guarantee
🔨 What does workmanship cover?
⚙️ What is the support process?
🔄 How do I claim warranty?

━━━━━━━━━━━━━━━━━━━━━━
📡 *NETWORK & TECHNOLOGY*
━━━━━━━━━━━━━━━━━━━━━━
📶 What is the difference between Wi-Fi and Wi-Fi 7?
⚡ Fast Ethernet vs Gigabit – what's the difference?
⏱️ What is latency and why does it matter?
💡 Entry level vs Pro / Tech'd out – what's right for me?

━━━━━━━━━━━━━━━━━━━━━━
📹 *CCTV & SECURITY*
━━━━━━━━━━━━━━━━━━━━━━
📹 What camera types do you install?
📍 Where should cameras be placed?
💾 NVR vs DVR – what's the difference?
💽 How much storage do I need?

━━━━━━━━━━━━━━━━━━━━━━
🚨 *ALARMS & POWER*
━━━━━━━━━━━━━━━━━━━━━━
🚪 What alarm sensors are available?
🔒 What are the different alarm modes?
⚡ Do alarms work during load shedding?
🔋 What UPS / backup power options do you have?

━━━━━━━━━━━━━━━━━━━━━━
🚜 *FARM SOLUTIONS*
━━━━━━━━━━━━━━━━━━━━━━
🚜 What farm cameras do you install?
🌾 How do I connect multiple farm buildings?
☀️ Do you offer solar-powered options?

━━━━━━━━━━━━━━━━━━━━━━
📅 *SCHEDULING & LOGISTICS*
━━━━━━━━━━━━━━━━━━━━━━
📦 What is the ETA on items supplied?
👨‍🔧 When will the team arrive on site?
🏠 What if I'm not home during installation?
📞 How do I schedule weekend work?

━━━━━━━━━━━━━━━━━━━━━━
Type your question below or click a topic!`;
      
      addMessage(welcomeMsg, false);
    }
    
    const quickList = [
      "🔧 Specialties", "🏠 Homes & Farms", "📋 Site Survey", "💳 Payment Terms", "⏱️ Lead Time",
      "🛒 Install Only", "🔧 Existing Gear", "🛡️ Warranty", "🔨 Workmanship", "⚙️ Support",
      "📡 Wi-Fi 7", "⚡ Gigabit vs Fast", "⏱️ Latency", "💡 Budget vs Pro", "📹 Camera Types",
      "💾 NVR vs DVR", "⚡ Load shedding", "🔋 UPS Options", "🚜 Farm Cameras", "🌾 Farm Network",
      "📦 ETA Items", "👨‍🔧 Team Onsite", "🏠 Not Home", "📅 Weekend Work"
    ];
    
    function buildQuickReplies(filter = "") {
      if (!quickContainer) return;
      quickContainer.innerHTML = "";
      const filtered = quickList.filter(item => item.toLowerCase().includes(filter.toLowerCase()));
      if (filtered.length === 0) {
        const noResults = document.createElement("span");
        noResults.className = "quick-reply";
        noResults.textContent = "No matching topics";
        noResults.style.opacity = "0.5";
        noResults.style.cursor = "default";
        quickContainer.appendChild(noResults);
        return;
      }
      filtered.forEach(text => {
        const chip = document.createElement("span");
        chip.className = "quick-reply";
        chip.textContent = text;
        chip.onclick = () => {
          const questionText = text.replace(/[🔧🏠📋💳⏱️🛒🛡️🔨⚙️📡⚡💡📹💾🔋🚜🌾📦👨‍🔧🏠📅]/g, '').trim();
          addMessage(questionText, true);
          setTimeout(() => { addMessage(getAnswer(questionText), false); }, 200);
        };
        quickContainer.appendChild(chip);
      });
    }
    
    function sendMessage() {
      const msg = chatbotInput.value.trim();
      if (!msg) return;
      addMessage(msg, true);
      chatbotInput.value = "";
      if (msg.toLowerCase() === 'menu') {
        showWelcomeMenu();
        return;
      }
      setTimeout(() => { addMessage(getAnswer(msg), false); }, 300);
    }
    
    // Event listeners
    if (chatbotButton) {
      chatbotButton.onclick = () => {
        chatbotWindow.style.display = 'flex';
        if (!welcomeShown) {
          welcomeShown = true;
          showWelcomeMenu();
        }
      };
    }
    if (closeChatbot) closeChatbot.onclick = () => { chatbotWindow.style.display = 'none'; };
    if (sendBtn) sendBtn.onclick = sendMessage;
    if (chatbotInput) chatbotInput.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
    if (searchInput) searchInput.oninput = (e) => buildQuickReplies(e.target.value);
    
    buildQuickReplies("");
    if (chatbotWindow) chatbotWindow.style.display = 'none';
  }
})();