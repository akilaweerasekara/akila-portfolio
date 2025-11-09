// Scroll animation for second image/text
const scrollSection = document.querySelector('.scroll-section');
window.addEventListener('scroll', () => {
  const rect = scrollSection.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.8) {
    scrollSection.classList.add('visible');
  }
});

// Hide header on scroll down
let lastScroll = 0;
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > lastScroll && currentScroll > 100) {
    header.style.transform = "translateY(-100%)";
  } else {
    header.style.transform = "translateY(0)";
  }
  lastScroll = currentScroll;
});
