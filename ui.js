// Thanh tiến độ khi cuộn
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  const update = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const ratio = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    bar.style.width = (ratio * 100).toFixed(2) + "%";
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

// Nút về đầu trang
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  const toggle = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (y > 260) {
      btn.classList.add("back-to-top--visible");
    } else {
      btn.classList.remove("back-to-top--visible");
    }
  };

  window.addEventListener("scroll", toggle, { passive: true });
  toggle();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Hiệu ứng hiện dần cho từng section
function initRevealSections() {
  const sections = document.querySelectorAll(".prose-section");
  if (!sections.length) return;

  // Nếu browser không hỗ trợ IntersectionObserver thì thôi
  if (!("IntersectionObserver" in window)) {
    sections.forEach(sec => {
      sec.classList.add("prose-section--visible");
    });
    return;
  }

  sections.forEach(sec => {
    sec.classList.add("prose-section--hidden");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("prose-section--visible");
          entry.target.classList.remove("prose-section--hidden");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  sections.forEach(sec => observer.observe(sec));
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  initScrollProgress();
  initBackToTop();
  initRevealSections();
});
