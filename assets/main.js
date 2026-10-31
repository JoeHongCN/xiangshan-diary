(() => {
  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 滚动入场 */
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -4% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* 阅读进度 + 回到顶部 */
  const bar = document.querySelector(".progress i");
  const toTop = document.querySelector(".to-top");
  let ticking = false;

  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const y = window.scrollY || doc.scrollTop || 0;

    if (bar) {
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    }
    if (toTop) {
      toTop.classList.toggle("show", y > 600);
    }
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();

  /* 点击图片查看大图 */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCap = document.getElementById("lightbox-cap");
  const lightboxClose = document.querySelector(".lightbox-close");

  if (lightbox && lightboxImg) {
    const open = (img) => {
      const fig = img.closest("figure");
      const cap = fig ? fig.querySelector("figcaption") : null;
      const text = cap ? cap.textContent.trim() : "";

      lightboxImg.src = img.getAttribute("src");
      lightboxImg.alt = img.alt || "";
      lightboxCap.textContent = text;
      lightboxCap.hidden = !text;
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      if (lightboxClose) lightboxClose.focus();
    };

    const close = () => {
      lightbox.hidden = true;
      document.body.classList.remove("lightbox-open");
      lightboxImg.removeAttribute("src");
    };

    document.querySelectorAll(".article figure img").forEach((img) => {
      img.addEventListener("click", () => open(img));
    });

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target === lightboxClose) close();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightbox.hidden) close();
    });
  }
})();
