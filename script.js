const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Hero entrance
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => document.body.classList.add("loaded"), 120);
});

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add("visible"));
}

// Hover tilt for cards and hero visual
const tiltElements = document.querySelectorAll(".hover-tilt");
tiltElements.forEach(el => {
  let rect;
  const strength = 6;

  const reset = () => {
    el.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
  };

  el.addEventListener("pointerenter", () => {
    rect = el.getBoundingClientRect();
  });

  el.addEventListener("pointermove", e => {
    if (prefersReducedMotion) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -strength;
    const rotateY = ((x - centerX) / centerX) * strength;
    el.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
  });

  el.addEventListener("pointerleave", reset);
});

// Animated software bars
const softwareRows = document.querySelectorAll(".ref-soft-row");

const animateCount = (el, target) => {
  const duration = 1000;
  const start = performance.now();

  const tick = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 2); // ease-out quad
    const value = Math.round(target * eased);
    el.textContent = `${value}%`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const activateRow = row => {
  const level = Number(row.dataset.level || 0);
  const fill = row.querySelector(".ref-soft-fill");
  const valueEl = row.querySelector(".ref-soft-value");
  if (fill) fill.style.width = `${level}%`;
  if (valueEl && !row.dataset.animated) {
    animateCount(valueEl, level);
    row.dataset.animated = "true";
  }
};

if (softwareRows.length) {
  softwareRows.forEach((row, idx) => {
    row.style.setProperty("--i", idx);
    const level = Number(row.dataset.level || 0);
    const fill = row.querySelector(".ref-soft-fill");
    const valueEl = row.querySelector(".ref-soft-value");
    if (fill) {
      fill.style.width = "0%";
    }
    if (valueEl) valueEl.textContent = "0%";
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    softwareRows.forEach(row => activateRow(row));
  } else {
    const softObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            activateRow(entry.target);
            softObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    softwareRows.forEach(row => softObserver.observe(row));
  }
}

// Fade-in animation for target sections
const fades = document.querySelectorAll(".fade-soft");

fades.forEach((section, idx) => {
  section.classList.add("fade-start");
  section.style.setProperty("--fade-delay", `${idx * 90}ms`);
});

if (fades.length) {
  const fadeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = entry.target.style.getPropertyValue("--fade-delay") || "0ms";
          entry.target.classList.add("fade-in");
          entry.target.classList.remove("fade-start");
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  fades.forEach(section => fadeObserver.observe(section));
}

// Photo gallery modal
const galleryModal = document.querySelector(".gallery-modal");
const galleryImage = document.querySelector(".gallery-image");
const photoTrigger = document.querySelector(".photo-trigger");
const galleryPrev = document.querySelector(".gallery-nav.prev");
const galleryNext = document.querySelector(".gallery-nav.next");
const galleryClose = document.querySelector(".gallery-close");
const galleryBackdrop = document.querySelector(".gallery-backdrop");

const galleryPhotos = Array.from({ length: 12 }, (_, i) => `images/photo${i + 1}.jpg`);
let currentPhoto = 0;

const showPhoto = idx => {
  currentPhoto = (idx + galleryPhotos.length) % galleryPhotos.length;
  const src = galleryPhotos[currentPhoto];
  if (galleryImage) {
    galleryImage.classList.remove("show");
    galleryImage.onload = () => galleryImage.classList.add("show");
    galleryImage.src = src;
    galleryImage.alt = `Gallery photo ${currentPhoto + 1}`;
  }
};

const openGallery = startIdx => {
  if (!galleryModal) return;
  galleryModal.classList.add("active");
  document.body.style.overflow = "hidden";
  showPhoto(startIdx || 0);
};

const closeGallery = () => {
  if (!galleryModal) return;
  galleryModal.classList.remove("active");
  document.body.style.overflow = "";
};

if (photoTrigger && galleryModal) {
  photoTrigger.addEventListener("click", e => {
    e.preventDefault();
    openGallery(Number(photoTrigger.dataset.galleryStart) || 0);
  });
}

galleryPrev?.addEventListener("click", () => showPhoto(currentPhoto - 1));
galleryNext?.addEventListener("click", () => showPhoto(currentPhoto + 1));
galleryClose?.addEventListener("click", closeGallery);
galleryBackdrop?.addEventListener("click", closeGallery);

document.addEventListener("keydown", e => {
  if (!galleryModal?.classList.contains("active")) return;
  if (e.key === "Escape") closeGallery();
  if (e.key === "ArrowLeft") showPhoto(currentPhoto - 1);
  if (e.key === "ArrowRight") showPhoto(currentPhoto + 1);
});

// Om meg fade-in
const omMeg = document.querySelector(".fade-om-meg");
if (omMeg) {
  const omObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          omMeg.classList.add("visible");
          omObserver.unobserve(omMeg);
        }
      });
    },
    { threshold: 0.2 }
  );
  omObserver.observe(omMeg);
}
