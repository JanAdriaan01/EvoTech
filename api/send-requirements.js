<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Get a Quote | Select My Requirements | Net Cam SA | Gauteng</title>
  <meta name="description" content="Get a free, no-obligation quote for CCTV and network installations in Gauteng. Tell us about your property and needs.">
  <meta name="keywords" content="free quote cctv, free quote network, cctv installation quote, network installation quote, residential quote, small office quote, agricultural quote, get a quote, requirements, Midrand, Centurion, Pretoria, Johannesburg, Gauteng">
  <meta name="author" content="Net Cam SA">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://netcamsa.co.za/requirements.html">
  <meta property="og:title" content="Get a Free Quote | Select My Requirements | Net Cam SA">
  <meta property="og:description" content="Get a free, no-obligation quote for CCTV and network installations. Tell us about your property and needs.">
  <meta property="og:image" content="https://netcamsa.co.za/images/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="https://netcamsa.co.za/requirements.html">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    /* ========== ALL YOUR EXISTING STYLES GO HERE ========== */
    /* (Keep exactly the same styles you already have) */
    /* For brevity, I'm not repeating them, but you must keep them. */
    /* I assume you have all the styles from your current requirements.html */
    /* The only addition is the .spinner class */
    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.6s linear infinite;
      margin-right: 8px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <!-- Your existing HTML structure (header, footer, form, etc.) -->
  <!-- I'll include the full HTML structure with the new submit button logic -->
  <!-- Since the full HTML is long, I'm providing the key changes below. -->
  <!-- To avoid duplication, I'll give you the exact JavaScript that replaces your old submit handler. -->

  <!-- Place this script at the bottom of your body, after the existing scripts -->
  <script>
    // Override the old submit handler with the new API version
    const oldSubmitBtn = document.getElementById('submitBtn');
    if (oldSubmitBtn) {
      // Remove all existing listeners (clone and replace)
      const newSubmitBtn = oldSubmitBtn.cloneNode(true);
      oldSubmitBtn.parentNode.replaceChild(newSubmitBtn, oldSubmitBtn);
      
      newSubmitBtn.addEventListener('click', async () => {
        // Gather all form data (same as before)
        const name = document.getElementById('customerName')?.value.trim();
        const phone = document.getElementById('customerPhone')?.value.trim();
        const email = document.getElementById('customerEmail')?.value.trim();
        if (!name) { showError('Please enter your full name.'); return; }
        if (!phone) { showError('Please enter your contact number.'); return; }
        if (!selectedLocation) { showError('Please select your location.'); return; }
        if (!selectedProperty) { showError('Please select your property type.'); return; }
        if (!selectedSize) { showError('Please select your property size.'); return; }
        
        let location = selectedLocation === 'Other' ? document.getElementById('otherLocation')?.value.trim() : selectedLocation;
        if (selectedLocation === 'Other' && !location) { showError('Please specify your location.'); return; }
        
        const isTechExpert = techToggle?.checked || false;
        const categories = Object.keys(selectedCategories).filter(c => selectedCategories[c]);
        if (!isTechExpert && categories.length === 0) { showError('Please select at least one solution (Network, CCTV, or Alarm).'); return; }
        
        let submission = {
          timestamp: new Date().toISOString(),
          propertyType: selectedProperty,
          propertySize: selectedSize,
          isTechExpert: isTechExpert,
          categories: categories,
          location: location,
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
          specialNotes: document.getElementById('specialNotes')?.value || ''
        };
        
        if (isTechExpert) {
          submission.customRequirements = document.getElementById('customRequirements')?.value || '';
        } else {
          if (selectedCategories.network) {
            submission.peopleCount = document.querySelector('input[name="peopleCount"]:checked')?.value || '';
            submission.internetUse = Array.from(document.querySelectorAll('#internetUseGroup input:checked')).map(c => c.value);
            submission.wifiCoverage = Array.from(document.querySelectorAll('#wifiCoverageGroup input:checked')).map(c => c.value);
            submission.existingCabling = document.querySelector('input[name="existingCabling"]:checked')?.value || '';
            submission.wifiLevel = document.getElementById('wifiLevel')?.value || '';
          }
          if (selectedCategories.cctv) {
            submission.cameraAreas = Array.from(document.querySelectorAll('#cameraAreasGroup input:checked')).map(c => c.value);
            submission.nightVision = document.querySelector('input[name="nightVision"]:checked')?.value || '';
            submission.doorbell = document.querySelector('input[name="doorbell"]:checked')?.value || '';
            submission.cctvLevel = document.getElementById('cctvLevel')?.value || '';
          }
          if (selectedCategories.alarm) {
            submission.entryPoints = document.getElementById('entryPoints')?.value || '';
            submission.motionSensors = document.querySelector('input[name="motionSensors"]:checked')?.value || '';
            submission.mobileControl = document.querySelector('input[name="mobileControl"]:checked')?.value || '';
            submission.loadShedding = document.querySelector('input[name="loadShedding"]:checked')?.value || '';
            submission.alarmLevel = document.getElementById('alarmLevel')?.value || '';
          }
        }
        
        const btn = newSubmitBtn;
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Submitting...';
        
        try {
          const response = await fetch('/api/send-requirements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submission)
          });
          const result = await response.json();
          if (response.ok) {
            // Backup to localStorage
            let submissions = JSON.parse(localStorage.getItem('netcam_requirements_submissions') || '[]');
            submissions.push(submission);
            localStorage.setItem('netcam_requirements_submissions', JSON.stringify(submissions));
            document.getElementById('formContainer').style.display = 'none';
            document.getElementById('successContainer').style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            showError(result.error || 'Submission failed. Please try again.');
            btn.disabled = false;
            btn.innerHTML = originalText;
          }
        } catch (error) {
          console.error(error);
          showError('Network error. Please check your connection and try again.');
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      });
    }
    
    function showError(msg) {
      const errDiv = document.getElementById('errorDisplay');
      if (errDiv) {
        errDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}`;
        errDiv.style.display = 'block';
        setTimeout(() => errDiv.style.display = 'none', 5000);
      } else {
        alert(msg);
      }
    }
  </script>
</body>
</html>