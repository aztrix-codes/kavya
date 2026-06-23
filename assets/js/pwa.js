// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('[PWA] Service Worker registered successfully, scope:', reg.scope);
      })
      .catch(err => {
        console.error('[PWA] Service Worker registration failed:', err);
      });
  });
}

// PWA Installation Promotion (Progressive Downloadable Web App Prompt)
let deferredPrompt;

document.addEventListener('DOMContentLoaded', () => {
  const buttonsContainer = document.querySelector('.navbar-end .buttons');
  if (buttonsContainer) {
    const installBtn = document.createElement('button');
    installBtn.className = 'button is-text pwa-install-btn';
    installBtn.id = 'pwa-install';
    installBtn.title = 'Install App';
    installBtn.style.display = 'none'; // Hidden by default until beforeinstallprompt fires
    installBtn.innerHTML = '<span class="icon"><i class="fas fa-download"></i></span>';
    
    // Insert before the theme toggle button if it exists
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      buttonsContainer.insertBefore(installBtn, themeToggle);
    } else {
      buttonsContainer.appendChild(installBtn);
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      // Show the install button in UI
      installBtn.style.display = 'inline-flex';
      console.log('[PWA] Site is installable, showing custom download button');
    });

    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`[PWA] Installation prompt outcome: ${outcome}`);
        // Clear the stashed prompt
        deferredPrompt = null;
        // Hide the install button
        installBtn.style.display = 'none';
      }
    });

    window.addEventListener('appinstalled', (event) => {
      console.log('[PWA] App was successfully installed!');
      installBtn.style.display = 'none';
    });
  }
});
