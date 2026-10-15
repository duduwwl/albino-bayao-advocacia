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

  const editorialHero = document.querySelector('.hero-editorial');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (editorialHero && !reducedMotion) {
    let ticking = false;
    const updateHeroDepth = () => {
      const bounds = editorialHero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -bounds.top / Math.max(bounds.height, 1)));
      editorialHero.style.setProperty('--hero-parallax', `${progress * 18}px`);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeroDepth);
        ticking = true;
      }
    }, { passive: true });
    updateHeroDepth();
  }

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

