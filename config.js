// ScoreView — Centralized CTA Configuration
// Update these values to change CTAs across the entire site.

const SCOREVIEW_CONFIG = {
  brand: "ScoreView",
  tagline: "Performance Intelligence You Can Trust",

  // Primary CTAs
  cta: {
    primary: {
      text: "Request Demo",
      url: "/request-demo.html"
    },
    secondary: {
      text: "See How It Works",
      url: "/how-it-works.html"
    },
    maturity: {
      text: "Start the Assessment",
      url: "/request-demo.html"
    },
    register: {
      text: "Register for ScoReviewHR",
      url: "/register.html"
    },
    login: {
      text: "ScoReviewHR Login",
      url: "https://staging.bscscoreview.com/login"
    }
  },

  // Contact info
  contact: {
    email: "hello@bscscoreview.com",
    phone: "+233 30 000 0000",
    address: "Accra, Ghana"
  },

  // Social
  social: {
    linkedin: "#",
    twitter: "#"
  },

  // Dede assistant config
  dede: {
    enabled: true,
    apiEndpoint: "/api/dede",
    systemPrompt: "You are Dede, the ScoreView AI assistant. ScoreView is a performance intelligence and governance platform with two modules: ScoReviewHR (pre-appraisal KPI validation, competency management, 9-box talent reviews, moderation panel) and ScoReview (post-appraisal ingestion, six-dimension analysis, strategic alignment). Be helpful, concise, and professional. Guide users to request a demo when appropriate.",
    quickPrompts: [
      "What does ScoreView do?",
      "How does KPI validation work?",
      "What is the moderation panel?",
      "How do I request a demo?"
    ]
  }
};

// Apply CTAs to elements with data-cta attributes
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-cta]').forEach(function(el) {
    var ctaType = el.getAttribute('data-cta');
    if (SCOREVIEW_CONFIG.cta[ctaType]) {
      if (el.tagName === 'A') {
        el.href = SCOREVIEW_CONFIG.cta[ctaType].url;
      }
      if (!el.textContent.trim() || el.getAttribute('data-cta-text') === 'auto') {
        el.textContent = SCOREVIEW_CONFIG.cta[ctaType].text;
      }
    }
  });
});
