// ScoreView — Main JS (navigation, scroll effects, form handling)

document.addEventListener('DOMContentLoaded', function() {
  // Nav scroll effect
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
      var expanded = navMenu.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded);
    });
  }

  // Close mobile menu on link click
  if (navMenu) {
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('open');
        if (navToggle) navToggle.classList.remove('active');
      });
    });
  }

  // Form handling (demo request, contact)
  var forms = document.querySelectorAll('form[data-form]');
  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var formType = form.getAttribute('data-form');
      var successEl = form.querySelector('.form-success');
      var formData = new FormData(form);
      var data = {};
      formData.forEach(function(v, k) { data[k] = v; });

      // Try API submission (unified endpoint)
      data._formType = formType;

      if (formType === 'scoreviewhr-registration') {
        var generatedCard = document.getElementById('registrationGeneratedCard');
        var generatedLink = document.getElementById('generatedPortalLink');
        var generatedBtn = document.getElementById('generatedPortalButton');
        var summaryText = document.getElementById('registrationSummaryText');
        var basePortalUrl = 'https://staging.bscscoreview.com/login';
        var params = new URLSearchParams();
        if (data.email) params.set('email', data.email);
        if (data.role) params.set('role', data.role);
        if (data.organization) params.set('org', data.organization);
        var fullPortalUrl = params.toString() ? (basePortalUrl + '?' + params.toString()) : basePortalUrl;

        if (generatedLink) {
          generatedLink.href = fullPortalUrl;
          generatedLink.textContent = fullPortalUrl;
        }
        if (generatedBtn) {
          generatedBtn.href = fullPortalUrl;
        }
        if (summaryText && data.firstName) {
          summaryText.textContent = 'Welcome, ' + data.firstName + '! Your ScoReviewHR registration for ' + (data.organization || 'your organization') + ' is ready. Use your generated link below to sign in to ScoReviewHR:';
        }
        if (generatedCard) {
          generatedCard.classList.add('show');
          generatedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }

      fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function(r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function() {
        if (formType === 'scoreviewhr-registration') {
          form.reset();
          return;
        }
        if (successEl) {
          successEl.classList.add('show');
          form.reset();
          setTimeout(function() { if (successEl) successEl.classList.remove('show'); }, 5000);
        }
      })
      .catch(function() {
        if (formType === 'scoreviewhr-registration') {
          form.reset();
          return;
        }
        // Fallback: mailto
        if (successEl) {
          successEl.classList.add('show');
          successEl.textContent = 'Thank you! Your submission has been received. We will contact you within 24 hours.';
          form.reset();
          setTimeout(function() { if (successEl) successEl.classList.remove('show'); }, 5000);
        }
      });
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
});
