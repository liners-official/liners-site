(() => {
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest('a[data-contact-position]');
    if (!link || typeof window.gtag !== 'function') return;

    window.gtag('event', 'contact_click', {
      contact_method: 'instagram',
      contact_position: link.dataset.contactPosition,
      page_path: window.location.pathname,
      link_url: link.href,
    });
  });
})();
