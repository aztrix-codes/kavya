(function () {
  'use strict';

  const navItems = [
    ['Home', 'index.html'],
    ['Research', 'research.html'],
    ['Projects', 'projects.html'],
    ['Impact', 'impact.html'],
    ['Publications', 'publications.html'],
    ['Experience', 'experience.html'],
    ['CV', 'cv.html'],
    ['Contact', 'contact.html']
  ];

  const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const headerTarget = document.querySelector('[data-site-header]');
  const footerTarget = document.querySelector('[data-site-footer]');
  const arrowIcon = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (headerTarget) {
    const navLinks = navItems.map(([label, href], index) => {
      const active = currentPage === href;
      const contactClass = label === 'Contact' ? ' nav-contact' : '';
      return `<a class="nav-link${contactClass}${active ? ' is-active' : ''}" href="${href}"${active ? ' aria-current="page"' : ''}><span class="nav-index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span class="nav-text">${label}</span></a>`;
    }).join('');

    headerTarget.innerHTML = `
      <div class="header-inner">
        <a class="wordmark" href="index.html" aria-label="Kavya Agrawal, home">Kavya Agrawal</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open menu">
          <span class="menu-lines" aria-hidden="true"><i></i><i></i></span>
        </button>
        <nav class="primary-nav" id="primary-navigation" aria-label="Primary navigation">
          <div class="nav-drawer-heading" aria-hidden="true"><span>Explore</span><p>Research, evidence &amp; impact</p></div>
          ${navLinks}
          <div class="nav-drawer-footer"><span>Environmental geoinformatics</span><a href="mailto:kavya.agrawal@terisas.ac.in">kavya.agrawal@terisas.ac.in</a></div>
        </nav>
      </div>
      <div class="menu-backdrop" aria-hidden="true"></div>`;

    const button = headerTarget.querySelector('.menu-toggle');
    const nav = headerTarget.querySelector('.primary-nav');
    const backdrop = headerTarget.querySelector('.menu-backdrop');
    let lockedScrollY = 0;
    let pageLocked = false;
    const lockPage = () => {
      if (pageLocked) return;
      lockedScrollY = window.scrollY;
      pageLocked = true;
      nav.scrollTop = 0;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${lockedScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.classList.add('menu-open');
    };
    const unlockPage = () => {
      if (!pageLocked) return;
      const restoreY = lockedScrollY;
      pageLocked = false;
      document.body.classList.remove('menu-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, restoreY);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    };
    const syncNavAccessibility = () => {
      if (window.innerWidth <= 980 && button.getAttribute('aria-expanded') !== 'true') nav.setAttribute('aria-hidden', 'true');
      else nav.removeAttribute('aria-hidden');
    };
    const closeMenu = (restoreFocus = false) => {
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Open menu');
      nav.classList.remove('is-open');
      unlockPage();
      syncNavAccessibility();
      if (restoreFocus) button.focus({ preventScroll: true });
    };

    button.addEventListener('click', () => {
      const willOpen = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(willOpen));
      button.setAttribute('aria-label', willOpen ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', willOpen);
      if (willOpen) lockPage();
      else unlockPage();
      syncNavAccessibility();
    });
    nav.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
    backdrop.addEventListener('click', () => closeMenu(true));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') closeMenu(true);
      if (event.key === 'Tab' && button.getAttribute('aria-expanded') === 'true') {
        const focusable = [button, ...nav.querySelectorAll('a[href]')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) closeMenu();
      else syncNavAccessibility();
    });
    syncNavAccessibility();
  }

  if (footerTarget) {
    footerTarget.innerHTML = `
      <div class="footer-inner">
        <a class="footer-name" href="index.html">Kavya Agrawal</a>
        <p>Environmental geoinformatics <span aria-hidden="true">·</span> New Delhi</p>
        <nav aria-label="Footer navigation">
          <a href="research.html">Research</a>
          <a href="publications.html">Publications</a>
          <a href="cv.html">CV</a>
          <a href="contact.html">Contact</a>
        </nav>
        <p class="copyright">© <span data-current-year>2026</span></p>
      </div>`;
  }

  document.querySelectorAll('[data-current-year]').forEach((target) => {
    target.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll('[data-tabs]').forEach((tabGroup) => {
    const tabs = [...tabGroup.querySelectorAll('[role="tab"]')];
    const panels = [...tabGroup.querySelectorAll('[role="tabpanel"]')];
    const activate = (tab) => {
      const panelId = tab.getAttribute('aria-controls');
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        const selected = panel.id === panelId;
        panel.hidden = !selected;
        panel.classList.remove('is-entering');
        if (selected) {
          void panel.offsetWidth;
          panel.classList.add('is-entering');
        }
      });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        tabs[nextIndex].focus();
        activate(tabs[nextIndex]);
      });
    });
  });

  document.querySelectorAll('[data-arrow-link]').forEach((link) => {
    if (!link.querySelector('svg')) link.insertAdjacentHTML('beforeend', arrowIcon);
  });

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('has-reveal');
    const revealGroups = ['.hero-grid', '.page-hero-grid', '.content-grid', '.contact-page-grid'];
    revealGroups.forEach((selector) => {
      document.querySelectorAll(selector).forEach((group) => {
        [...group.children].filter((child) => child.matches('[data-reveal]')).forEach((child, index) => {
          child.style.setProperty('--reveal-delay', `${Math.min(index * 90, 180)}ms`);
        });
      });
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          window.setTimeout(() => entry.target.classList.add('is-settled'), 1100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
  }
})();
