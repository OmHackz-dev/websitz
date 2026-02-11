// Shared site JS
(function(){
  const yearEl = document.getElementById('year');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }
  
  // Mobile menu toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const siteNav = document.querySelector('.site-nav');
  
  if(mobileToggle && siteNav){
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      siteNav.classList.toggle('active');
      document.body.style.overflow = siteNav.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on nav links
    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        siteNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if(!mobileToggle.contains(e.target) && !siteNav.contains(e.target)){
        mobileToggle.classList.remove('active');
        siteNav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
})();


