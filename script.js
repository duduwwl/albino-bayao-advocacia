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

  const carousel = document.querySelector('[data-hero-carousel]');
  const slides = carousel ? [...carousel.querySelectorAll('.hero-slide')] : [];
  const carouselButtons = carousel ? [...carousel.querySelectorAll('[data-carousel-go]')] : [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeSlide = 0;
  let carouselTimer;

  const showSlide = (index) => {
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeSlide;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    carouselButtons.forEach((button, buttonIndex) => {
      button.setAttribute('aria-current', String(buttonIndex === activeSlide));
    });
  };

  const stopCarousel = () => window.clearInterval(carouselTimer);
  const startCarousel = () => {
    stopCarousel();
    if (!reduceMotion.matches && slides.length > 1) {
      carouselTimer = window.setInterval(() => showSlide(activeSlide + 1), 4800);
    }
  };

  carouselButtons.forEach((button) => {
    button.addEventListener('click', () => {
      showSlide(Number(button.dataset.carouselGo));
      startCarousel();
    });
  });

  carousel?.addEventListener('mouseenter', stopCarousel);
  carousel?.addEventListener('mouseleave', startCarousel);
  carousel?.addEventListener('focusin', stopCarousel);
  carousel?.addEventListener('focusout', startCarousel);
  reduceMotion.addEventListener?.('change', startCarousel);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopCarousel();
    else startCarousel();
  });
  startCarousel();

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

