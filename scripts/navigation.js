const mobileMenuBtn = document.querySelector("#topbar button");
const mobileMenu = document.querySelector(".mobile-menu");
const closeButton = document.querySelector(".close-button");
const mobileOverlay = document.querySelector(".mobile-menu-overlay");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu-content a");
const allLinks = document.querySelectorAll('.navbar a, .mobile-menu-content a, #topbar a');
const sections = document.querySelectorAll('.content > div');

// Add title mapping
const titleMap = {
  'home': 'Nathan Garcia',
  'newyyc': 'Nathan Garcia - NewYYC',
  'lyric': 'Nathan Garcia - Lyrical Data',
  'cail': 'Nathan Garcia - CAIL',
  'osu': 'Nathan Garcia - osu!',
  'oshi': 'Nathan Garcia - Oshi Oasis',
  'bolder': 'Nathan Garcia - Bolder Climbing',
  'design': 'Nathan Garcia - Freelance Design',
  'about': 'Nathan Garcia - About'
};

// Load last active section on page load
document.addEventListener('DOMContentLoaded', () => {
  const lastSection = localStorage.getItem('lastSection') || 'home';
  const section = document.getElementById(lastSection);
  if (section) {
    sections.forEach(s => s.classList.remove('active'));
    section.classList.add('active');
    document.title = titleMap[lastSection] || 'Nathan Garcia';
    window.location.hash = lastSection;
  }
});

function toggleMenu() {
  mobileMenu.classList.toggle("active");
  document.body.style.overflow = mobileMenu.classList.contains("active")
    ? "hidden"
    : "";
}

mobileMenuBtn.addEventListener("click", toggleMenu);
closeButton.addEventListener("click", toggleMenu);
mobileOverlay.addEventListener("click", toggleMenu);

allLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    const target = link.getAttribute("data-content");
    
    if (target) {
      e.preventDefault();
      sections.forEach(section => {
        section.classList.remove("active");
      });
      
      document.getElementById(target).classList.add("active");
      
      // Update page title
      document.title = titleMap[target] || 'Nathan Garcia';
      
      // Save current section
      localStorage.setItem('lastSection', target);
      window.location.hash = target;
      
      // Reset scroll position of content
      document.querySelector('.content').scrollTop = 0;
      
      if (link.closest('.mobile-menu-content')) {
        toggleMenu();
      }
    }
  });
}); 