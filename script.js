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
  const duration = 900;
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
  const valueEl = row.querySelector(".ref-soft-value");
  row.classList.add("active");
  if (valueEl && !row.dataset.animated) {
    animateCount(valueEl, level);
    row.dataset.animated = "true";
  }
};

if (softwareRows.length) {
  softwareRows.forEach((row, idx) => {
    const level = Number(row.dataset.level || 0);
    row.style.setProperty("--level", (level / 100).toFixed(3));
    row.style.setProperty("--i", idx);
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    softwareRows.forEach(row => {
      row.classList.add("active");
      const level = Number(row.dataset.level || 0);
      const valueEl = row.querySelector(".ref-soft-value");
      if (valueEl) valueEl.textContent = `${level}%`;
    });
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
      { threshold: 0.3 }
    );

    softwareRows.forEach(row => softObserver.observe(row));
  }
}
