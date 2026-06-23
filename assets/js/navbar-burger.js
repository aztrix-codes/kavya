document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle and GitHub Button Injection and Setup
  const buttonsContainer = document.querySelector('.navbar-end .buttons');
  if (buttonsContainer) {
    // Create and append GitHub Button
    const githubBtn = document.createElement('a');
    githubBtn.className = 'button is-text';
    githubBtn.href = 'https://github.com';
    githubBtn.target = '_blank';
    githubBtn.title = 'GitHub';
    githubBtn.innerHTML = '<span class="icon"><i class="fab fa-github"></i></span>';
    buttonsContainer.appendChild(githubBtn);

    // Create and append Theme Toggle Button
    const themeBtn = document.createElement('button');
    themeBtn.className = 'button is-text';
    themeBtn.id = 'theme-toggle';
    themeBtn.title = 'Toggle Theme';
    themeBtn.innerHTML = '<span class="icon"><i class="fas fa-sun"></i></span>';
    
    buttonsContainer.appendChild(themeBtn);

    // Dynamic address bar/theme color updater
    const updateThemeMeta = (theme) => {
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', theme === 'dark' ? '#121212' : '#ffffff');
      }
    };
    
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    // Set theme color on initial page load
    updateThemeMeta(currentTheme);

    themeBtn.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      
      if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
      
      // Update theme color when toggled
      updateThemeMeta(theme);
    });
  }

  // Mobile Drawer Backdrop and Toggle
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  if ($navbarBurgers.length > 0) {
    // Create backdrop element
    const backdrop = document.createElement('div');
    backdrop.className = 'navbar-backdrop';
    document.body.appendChild(backdrop);

    $navbarBurgers.forEach( el => {
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      el.addEventListener('click', () => {
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
        backdrop.classList.toggle('is-active');
        document.body.classList.toggle('no-scroll');
      });

      // Close drawer when clicking same-page links or anchor links ONLY
      if ($target) {
        const links = $target.querySelectorAll('a');
        links.forEach(link => {
          link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            if (href) {
              const url = new URL(link.href, window.location.href);
              const isSamePage = url.pathname === window.location.pathname;
              const hasHash = url.hash !== '';
              
              if (isSamePage && hasHash) {
                el.classList.remove('is-active');
                $target.classList.remove('is-active');
                backdrop.classList.remove('is-active');
                document.body.classList.remove('no-scroll');
              }
            }
          });
        });
      }
    });

    backdrop.addEventListener('click', () => {
      $navbarBurgers.forEach( el => {
        const target = el.dataset.target;
        const $target = document.getElementById(target);
        el.classList.remove('is-active');
        $target.classList.remove('is-active');
      });
      backdrop.classList.remove('is-active');
      document.body.classList.remove('no-scroll');
    });
  }
});
