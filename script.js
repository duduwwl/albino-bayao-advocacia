(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  menuButton?.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });

  mobileNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('is-open');
      menuButton?.setAttribute('aria-expanded', 'false');
      menuButton?.setAttribute('aria-label', 'Abrir menu');
    });
  });

  const form = document.querySelector('#contact-form');
  const status = document.querySelector('.form-status');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const message = `Olá, meu nome é ${data.get('nome')}. Meu e-mail é ${data.get('email')}. ${data.get('mensagem')}`;
    status.textContent = 'Abrindo uma conversa no WhatsApp…';
    window.open(`https://wa.me/553595664780?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    form.reset();
  });
})();

