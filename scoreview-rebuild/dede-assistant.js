// ScoreView — Dede AI Assistant
// Floating chat widget present on every page.

(function() {
  'use strict';

  var CONFIG = (typeof SCOREVIEW_CONFIG !== 'undefined' && SCOREVIEW_CONFIG.dede) ? SCOREVIEW_CONFIG.dede : {
    enabled: true,
    apiEndpoint: '/api/dede',
    systemPrompt: 'You are Dede, the ScoreView AI assistant.',
    quickPrompts: []
  };

  document.addEventListener('DOMContentLoaded', function() {
    var toggle = document.getElementById('dedeToggle');
    var panel = document.getElementById('dedePanel');
    var closeBtn = document.getElementById('dedeClose');
    var messages = document.getElementById('dedeMessages');
    var input = document.getElementById('dedeInput');
    var sendBtn = document.getElementById('dedeSend');
    var quick = document.getElementById('dedeQuick');

    if (!toggle || !panel) return;

    // Toggle panel
    toggle.addEventListener('click', function() {
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) {
        input.focus();
      }
    });

    closeBtn.addEventListener('click', function() {
      panel.classList.remove('open');
    });

    // Quick prompt buttons
    if (quick) {
      quick.addEventListener('click', function(e) {
        if (e.target.classList.contains('dede-quick-btn')) {
          var q = e.target.getAttribute('data-q');
          input.value = q;
          sendMessage();
        }
      });
    }

    // Send message
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
    });

    function sendMessage() {
      var text = input.value.trim();
      if (!text) return;

      // Add user message
      addMessage(text, 'user');
      input.value = '';

      // Show typing indicator
      var typingEl = addMessage('', 'bot');
      typingEl.classList.add('dede-typing');

      // Try API first, fall back to local responses
      fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      })
      .then(function(r) { return r.ok ? r.json() : Promise.reject('api'); })
      .then(function(data) {
        typingEl.remove();
        addMessage(data.response || data.reply || data.message || 'I apologize, I could not process that request.', 'bot');
      })
      .catch(function() {
        typingEl.remove();
        addMessage(getLocalResponse(text), 'bot');
      });
    }

    function addMessage(text, type) {
      var msg = document.createElement('div');
      msg.className = 'dede-message dede-message-' + type;
      var content = document.createElement('div');
      content.className = 'dede-message-content';
      content.textContent = text;
      msg.appendChild(content);
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
      return msg;
    }

    function getLocalResponse(text) {
      var lower = text.toLowerCase();

      if (lower.includes('what') && lower.includes('scoreview') || lower.includes('what') && lower.includes('do')) {
        return 'ScoreView is a performance intelligence and governance platform. We help organizations validate KPIs before appraisal cycles, review appraisal integrity after the cycle, and turn performance data into actionable insights. We have two modules: ScoReviewHR (pre-appraisal) and ScoReview (post-appraisal). Would you like to request a demo?';
      }
      if (lower.includes('kpi') && lower.includes('valid')) {
        return 'KPI validation in ScoReviewHR checks each KPI against a 16-point compliance checklist and SMART rubric. It scores specificity, measurability, outcome-orientation, data source availability, and time-bounds — all before the cycle begins. AI proposes scores, humans confirm. Would you like to see how it works?';
      }
      if (lower.includes('moderation')) {
        return 'The moderation panel in ScoReviewHR is a human-in-the-loop workspace where authorized reviewers can calibrate ratings, resolve discrepancies, and certify scorecards. It includes rating-distribution analysis, outlier detection, and a full audit trail. Every decision is documented.';
      }
      if (lower.includes('demo') || lower.includes('request') || lower.includes('contact')) {
        return 'You can request a demo at /request-demo.html. Just fill in your name, organization, and email, and our team will reach out within 24 hours. Would you like me to take you there?';
      }
      if (lower.includes('scoReviewhr') || lower.includes('sco review hr')) {
        return 'ScoReviewHR is our pre-appraisal module. It validates KPIs, manages competencies, runs 9-box talent reviews, and provides a moderation panel for certification. It ensures your performance measures are trustworthy before the cycle begins.';
      }
      if (lower.includes('scoReview') && !lower.includes('hr')) {
        return 'ScoReview is our post-appraisal module. It ingests appraisal PDFs, extracts structured data, runs six-dimension analysis, maps KPIs to objectives, and tracks strategic alignment. It turns completed appraisals into actionable intelligence.';
      }
      if (lower.includes('price') || lower.includes('cost') || lower.includes('plan')) {
        return 'Pricing depends on your organization size and which modules you need. Please request a demo and our team will provide a tailored quote. Visit /request-demo.html to get started.';
      }
      if (lower.includes('security') || lower.includes('privacy') || lower.includes('data')) {
        return 'ScoreView takes data governance seriously. AI proposes, evidence informs, people decide. We never manufacture missing evidence, and every AI output is advisory with a full audit trail. See our /security.html page for details.';
      }
      if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        return 'Hello! I\'m Dede, your ScoreView AI assistant. I can help you understand our platform, explore features, or guide you to request a demo. What would you like to know?';
      }

      return 'That\'s a great question. I can help you understand ScoreView\'s KPI validation, appraisal review, moderation panel, strategic alignment features, or guide you to request a demo. What interests you most?';
    }
  });
})();
