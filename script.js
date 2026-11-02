/**
 * Sadaf Shahid Sheikh — Personal Portfolio Interactive Script
 * Handles:
 * 1. Mobile sidebar toggle & backdrop
 * 2. Active navigation highlighting via IntersectionObserver
 * 3. Live personal photograph preview in the dedicated Hero image slot
 * 4. Interactive Skills category filtering
 * 5. Project detail modal population (no fake external URLs)
 * 6. Contact form validation & direct mailto fallback
 * 7. Scroll reveal animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Footer Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Mobile Vertical Sidebar Toggle
  const sidebar = document.getElementById('verticalSidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const toggleIcon = document.getElementById('toggleIcon');
  const backdrop = document.getElementById('sidebarBackdrop');
  const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

  function openSidebar() {
    sidebar.classList.add('open');
    backdrop.classList.add('show');
    sidebarToggle.setAttribute('aria-expanded', 'true');
    toggleIcon.classList.replace('bi-list', 'bi-x-lg');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('show');
    sidebarToggle.setAttribute('aria-expanded', 'false');
    toggleIcon.classList.replace('bi-x-lg', 'bi-list');
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992) {
        closeSidebar();
      }
    });
  });

  // 3. Active Navigation Indicator on Scroll
  const sections = document.querySelectorAll('main section[id]');

  function setActiveNav(sectionId) {
    navLinks.forEach((link) => {
      const isMatch = link.getAttribute('data-section') === sectionId;
      link.classList.toggle('active', isMatch);
    });
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNav(entry.target.id);
        }
      });
    },
    {
      rootMargin: '-30% 0px -55% 0px',
      threshold: 0.05,
    }
  );

  sections.forEach((sec) => sectionObserver.observe(sec));

  // 4. Dedicated Profile Image Area — Live Photo Preview Handler
  const photoUploadInput = document.getElementById('photoUploadInput');
  const profilePreviewImg = document.getElementById('profilePreviewImg');
  const photoPlaceholderContent = document.getElementById('photoPlaceholderContent');

  if (photoUploadInput && profilePreviewImg && photoPlaceholderContent) {
    photoUploadInput.addEventListener('change', (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        profilePreviewImg.src = e.target.result;
        profilePreviewImg.classList.remove('d-none');
        photoPlaceholderContent.classList.add('d-none');
      };
      reader.readAsDataURL(file);
    });
  }

  // 5. Skills Category Filter
  const filterPills = document.querySelectorAll('.filter-pill');
  const skillItems = document.querySelectorAll('.skill-item');

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((btn) => btn.classList.remove('active'));
      pill.classList.add('active');

      const selectedCategory = pill.getAttribute('data-filter');

      skillItems.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        if (selectedCategory === 'all' || selectedCategory === itemCategory) {
          item.classList.remove('d-none');
        } else {
          item.classList.add('d-none');
        }
      });
    });
  });

  // 6. Project Details Modal (Authentic Project Summaries)
  const projectCatalog = {
    alberto: {
      title: 'ALBERTO – Luxury Watches',
      category: 'E-Commerce & Luxury Showcase',
      bannerTitle: 'ALBERTO WATCHES',
      icon: 'bi-watch',
      features: [
        'Developed a premium luxury watch website.',
        'Created responsive layouts and interactive galleries.',
        'Implemented animations and form validation.',
      ],
      technologies: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'jQuery'],
    },
    pakistan: {
      title: 'Pakistan Tour',
      category: 'Tourism & Destination Portal',
      bannerTitle: 'PAKISTAN TOUR',
      icon: 'bi-compass',
      features: [
        'Designed a responsive tourism website.',
        'Showcased famous tourist destinations.',
        'Added interactive gallery and animations.',
      ],
      technologies: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'jQuery'],
    },
    battlezone: {
      title: 'BATTLEZONE – Gaming Website',
      category: 'Gaming UI & Multi-Page Web Design',
      bannerTitle: 'BATTLEZONE GAMING',
      icon: 'bi-controller',
      features: [
        'Created a modern gaming website.',
        'Designed homepage, About Us and Contact Us pages.',
        'Developed an attractive gaming interface.',
      ],
      technologies: ['HTML', 'CSS'],
    },
  };

  const projectModalEl = document.getElementById('projectModal');
  const projectModal = projectModalEl ? new bootstrap.Modal(projectModalEl) : null;
  const viewProjectBtns = document.querySelectorAll('.btn-project-view');

  viewProjectBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-project');
      const data = projectCatalog[key];
      if (!data || !projectModal) return;

      document.getElementById('projectModalLabel').textContent = data.title;
      document.getElementById('modalCategory').textContent = data.category;
      document.getElementById('modalBannerTitle').textContent = data.bannerTitle;

      const modalIcon = document.getElementById('modalIcon');
      modalIcon.className = `bi ${data.icon}`;

      const featuresList = document.getElementById('modalFeatures');
      featuresList.innerHTML = data.features.map((item) => `<li>${item}</li>`).join('');

      const techContainer = document.getElementById('modalTech');
      techContainer.innerHTML = data.technologies
        .map((tech) => `<span class="tech-badge">${tech}</span>`)
        .join('');

      const inquireBtn = document.getElementById('modalInquireBtn');
      inquireBtn.onclick = () => {
        projectModal.hide();
        const subjectInput = document.getElementById('subject');
        if (subjectInput) {
          subjectInput.value = `Project Inquiry: ${data.title}`;
        }
      };

      projectModal.show();
    });
  });

  // 7. Contact Form Validation & Email Composition
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.classList.add('was-validated');

      if (!contactForm.checkValidity()) {
        return;
      }

      const fullName = document.getElementById('fullName').value.trim();
      const emailAddress = document.getElementById('emailAddress').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      const mailtoSubject = encodeURIComponent(`[Portfolio Contact] ${subject}`);
      const mailtoBody = encodeURIComponent(
        `Name: ${fullName}\nEmail: ${emailAddress}\n\nMessage:\n${message}`
      );

      formFeedback.classList.remove('d-none');
      formFeedback.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>
        Thank you, <strong>${fullName}</strong>! Opening your email client to send your message to <strong>aptechdazzy@gmail.com</strong>.
      `;

      window.location.href = `mailto:aptechdazzy@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      contactForm.reset();
      contactForm.classList.remove('was-validated');
    });
  }

  // 8. Smooth Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
});
