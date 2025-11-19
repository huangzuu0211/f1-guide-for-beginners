// Thanh tiến độ khi scroll
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  const update = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const ratio = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    bar.style.width = ratio * 100 + "%";
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

// Khởi tạo khi load xong DOM
document.addEventListener("DOMContentLoaded", () => {
  initScrollProgress();
  initBackToTop();
});
