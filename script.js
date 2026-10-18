(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('.scroll-progress span');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const closeMobileNav = () => {
    mobileNav?.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menu');
  };

  menuButton?.addEventListener('click', () => {
    const open = mobileNav?.classList.toggle('is-open') ?? false;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (open) window.requestAnimationFrame(() => syncAllContinuousTabs?.());
  });
  mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileNav));

  const syncScrollState = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progressBar?.style.setProperty('transform', `scaleX(${ratio})`);
    header?.classList.toggle('is-scrolled', window.scrollY > 18);
  };
  let scrollTick = false;
  const requestScrollSync = () => {
    if (scrollTick) return;
    scrollTick = true;
    window.requestAnimationFrame(() => {
      scrollTick = false;
      syncScrollState();
    });
  };
  window.addEventListener('scroll', requestScrollSync, { passive: true });
  window.addEventListener('resize', requestScrollSync, { passive: true });
  syncScrollState();

  const revealTargets = [
    ...document.querySelectorAll('.intro-grid, .quote-card, .practice-head, .practice-card, .practice-detail-layout, .practice-detail-panel, .process-head, .process-layout, .team-head, .person, .faq-layout, .contact-grid, .site-footer'),
  ];
  revealTargets.forEach((element, index) => {
    element.setAttribute('data-reveal', element.classList.contains('practice-card') ? 'soft' : 'up');
    element.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
  });

  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: .08 });
    revealTargets.forEach((element) => revealObserver.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add('is-revealed'));
  }

  const navLinks = [...document.querySelectorAll('.desktop-nav a, .mobile-nav a')];
  const sections = [...document.querySelectorAll('[data-section-label]')];
  const continuousTabs = [...document.querySelectorAll('[data-continuous-tabs], .continuous-tabs-mobile')];
  const syncContinuousTabs = (container) => {
    const indicator = container?.querySelector('.continuous-tabs-indicator');
    const active = container?.querySelector('a[aria-current="page"]') || container?.querySelector('a[href="#inicio"]');
    if (!indicator || !active) return;
    const containerRect = container.getBoundingClientRect();
    const tabRect = active.getBoundingClientRect();
    container.style.setProperty('--tab-x', `${tabRect.left - containerRect.left}px`);
    container.style.setProperty('--tab-y', `${tabRect.top - containerRect.top}px`);
    container.style.setProperty('--tab-width', `${tabRect.width}px`);
    container.style.setProperty('--tab-height', `${tabRect.height}px`);
  };
  const syncAllContinuousTabs = () => continuousTabs.forEach(syncContinuousTabs);
  navLinks.forEach((link) => {
    link.addEventListener('click', () => window.setTimeout(syncAllContinuousTabs, 40));
    link.addEventListener('focus', () => {
      const container = link.closest('.continuous-tabs, .continuous-tabs-mobile');
      container?.classList.add('is-focus-preview');
      container?.style.setProperty('--tab-x', `${link.offsetLeft}px`);
      container?.style.setProperty('--tab-width', `${link.offsetWidth}px`);
    });
  });
  continuousTabs.forEach((container) => {
    container.addEventListener('mouseleave', () => {
      container.classList.remove('is-focus-preview');
      syncContinuousTabs(container);
    });
    container.addEventListener('focusout', (event) => {
      if (!container.contains(event.relatedTarget)) {
        container.classList.remove('is-focus-preview');
        syncContinuousTabs(container);
      }
    });
  });
  if ('IntersectionObserver' in window) {
    const activeObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const activeId = `#${visible.target.id}`;
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === activeId) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
      syncAllContinuousTabs();
    }, { rootMargin: '-24% 0px -58% 0px', threshold: [0, .2, .6] });
    sections.forEach((section) => activeObserver.observe(section));
  }
  navLinks.filter((link) => link.getAttribute('href') === '#escritorio').forEach((link) => link.setAttribute('aria-current', 'page'));
  syncAllContinuousTabs();
  window.addEventListener('resize', syncAllContinuousTabs, { passive: true });

  const setupTabs = ({ tabSelector, panelSelector, tabAttribute, panelAttribute, activeClass = 'is-active' }) => {
    const tabs = [...document.querySelectorAll(tabSelector)];
    const panels = [...document.querySelectorAll(panelSelector)];
    if (!tabs.length || !panels.length) return;
    const activate = (value, focus = false) => {
      tabs.forEach((tab) => {
        const active = tab.dataset[tabAttribute] === value;
        tab.classList.toggle(activeClass, active);
        tab.setAttribute('aria-selected', String(active));
        if (focus) tab.focus();
      });
      panels.forEach((panel) => {
        const active = panel.dataset[panelAttribute] === value;
        panel.classList.toggle(activeClass, active);
        panel.hidden = !active;
      });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab.dataset[tabAttribute]));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        activate(tabs[next].dataset[tabAttribute], true);
      });
    });
    const initial = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
    activate(initial.dataset[tabAttribute]);
  };

  setupTabs({ tabSelector: '[data-practice-tab]', panelSelector: '[data-practice-panel]', tabAttribute: 'practiceTab', panelAttribute: 'practicePanel' });
  setupTabs({ tabSelector: '[data-process-step]', panelSelector: '[data-process-panel]', tabAttribute: 'processStep', panelAttribute: 'processPanel' });

  const carousel = document.querySelector('[data-hero-carousel]');
  const slides = carousel ? [...carousel.querySelectorAll('.hero-slide')] : [];
  const carouselButtons = carousel ? [...carousel.querySelectorAll('[data-carousel-go]')] : [];
  let activeSlide = 0;
  let carouselTimer = 0;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let pointerMoved = false;

  const showSlide = (index) => {
    if (!slides.length) return;
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
  const carouselImages = slides.map((slide) => slide.querySelector('img')).filter(Boolean);
  const carouselReady = carouselImages.map((image) => {
    if (typeof image.decode === 'function') return image.decode().catch(() => undefined);
    if (image.complete && image.naturalWidth) return Promise.resolve();
    return new Promise((resolve) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    });
  });
  carouselButtons.forEach((button) => button.addEventListener('click', () => {
    showSlide(Number(button.dataset.carouselGo));
    startCarousel();
  }));
  carousel?.addEventListener('mouseenter', stopCarousel);
  carousel?.addEventListener('mouseleave', () => {
    carousel?.style.setProperty('--pointer-x', '0px');
    carousel?.style.setProperty('--pointer-y', '0px');
    startCarousel();
  });
  carousel?.addEventListener('focusin', stopCarousel);
  carousel?.addEventListener('focusout', (event) => {
    if (!carousel.contains(event.relatedTarget)) startCarousel();
  });
  carousel?.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showSlide(activeSlide + (event.key === 'ArrowRight' ? 1 : -1));
    startCarousel();
  });
  carousel?.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button, a')) return;
    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    pointerMoved = false;
    carousel.classList.add('is-dragging');
    carousel.setPointerCapture?.(event.pointerId);
    stopCarousel();
  });
  carousel?.addEventListener('pointermove', (event) => {
    if (!carousel.classList.contains('is-dragging')) return;
    const dx = event.clientX - pointerStartX;
    const dy = event.clientY - pointerStartY;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) pointerMoved = true;
    if (event.pointerType === 'mouse') {
      carousel.style.setProperty('--pointer-x', `${Math.max(-5, Math.min(5, dx / 22))}px`);
      carousel.style.setProperty('--pointer-y', `${Math.max(-5, Math.min(5, dy / 22))}px`);
    }
  });
  carousel?.addEventListener('pointerup', (event) => {
    if (!carousel.classList.contains('is-dragging')) return;
    const dx = event.clientX - pointerStartX;
    carousel.classList.remove('is-dragging');
    carousel.style.setProperty('--pointer-x', '0px');
    carousel.style.setProperty('--pointer-y', '0px');
    if (Math.abs(dx) > 45 && pointerMoved) showSlide(activeSlide + (dx < 0 ? 1 : -1));
    startCarousel();
  });
  carousel?.addEventListener('pointercancel', () => {
    carousel.classList.remove('is-dragging');
    startCarousel();
  });
  reduceMotion.addEventListener?.('change', startCarousel);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopCarousel();
    else startCarousel();
  });
  Promise.all(carouselReady).then(startCarousel);

  const form = document.querySelector('#contact-form');
  const status = document.querySelector('.form-status');
  const submitButton = form?.querySelector('button[type="submit"]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('has-error');
      status.textContent = 'Confira os campos antes de enviar.';
      status.className = 'form-status is-error';
      form.querySelector(':invalid')?.focus();
      return;
    }
    const data = new FormData(form);
    const message = `Olá, meu nome é ${data.get('nome')}. Meu e-mail é ${data.get('email')}. ${data.get('mensagem')}`;
    status.textContent = 'Abrindo uma conversa no WhatsApp…';
    status.className = 'form-status is-success';
    if (submitButton) submitButton.disabled = true;
    window.open(`https://wa.me/553595664780?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => {
      form.reset();
      form.classList.remove('has-error');
      if (submitButton) submitButton.disabled = false;
    }, 700);
  });
})();

