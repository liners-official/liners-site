(() => {
  if (window.location.hostname !== 'liners.site') return;

  const measurementId = 'G-4Y4767RTFT';
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);

  const googleTag = document.createElement('script');
  googleTag.async = true;
  googleTag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(googleTag);

  const text = (value) => (value || '').replace(/\s+/g, ' ').trim().slice(0, 100);

  const trackClick = (event) => {
    if (event.type === 'auxclick' && event.button !== 1) return;
    if (!(event.target instanceof Element) || typeof window.gtag !== 'function') return;

    const control = event.target.closest('a[href], button, .question, [data-analytics-id]');
    if (!control || control.matches(':disabled, [aria-disabled="true"]') ||
        control.closest('[data-analytics-ignore]')) return;

    const area = control.closest('section, nav, header, footer');
    const position = control.dataset.contactPosition ||
      (area && (area.id || area.classList[0] || area.tagName.toLowerCase())) || 'page';
    const label = text(control.getAttribute('aria-label') || control.textContent ||
      control.querySelector('img[alt]')?.alt || control.getAttribute('title'));
    const isContact = control.hasAttribute('data-contact-position');
    const isFaq = control.matches('.question');
    const parameters = {
      page_path: window.location.pathname,
      page_title: document.title,
      element_id: text(control.dataset.analyticsId || control.id ||
        `${position}-${control.classList[0] || control.tagName.toLowerCase()}-${label}`),
      element_text: label,
      element_position: text(position),
      element_type: isContact ? 'contact' : isFaq ? 'faq' :
        control.matches('a') ? 'link' : 'button',
    };

    if (control.matches('a[href]')) {
      const url = new URL(control.href, window.location.href);
      if (!['http:', 'https:'].includes(url.protocol)) return;
      parameters.link_url = `${url.origin}${url.pathname}${url.hash}`;
      parameters.link_domain = url.hostname;
      parameters.outbound = url.origin !== window.location.origin;
    }

    if (isContact) {
      parameters.contact_method = 'instagram';
      parameters.contact_position = control.dataset.contactPosition;
    }
    if (isFaq) parameters.interaction_state = control.classList.contains('is-open') ? 'open' : 'closed';
    if (control.matches('.menu-button')) {
      parameters.interaction_state = control.getAttribute('aria-expanded') === 'true' ? 'open' : 'closed';
    }

    window.gtag('event', isContact ? 'contact_click' : isFaq ? 'faq_toggle' : 'site_click', parameters);
  };

  document.addEventListener('click', trackClick);
  document.addEventListener('auxclick', trackClick);
})();
