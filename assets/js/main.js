const tryAutoPlayInlineVideo = (video) => {
  if (!video) return;

  // Autoplay on mobile usually requires muted + playsinline.
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  const attempt = () => video.play();

  attempt().catch(() => {
    const resume = () => {
      attempt().finally(() => {
        document.removeEventListener("touchstart", resume);
        document.removeEventListener("click", resume);
      });
    };
    document.addEventListener("touchstart", resume, {
      once: true,
      passive: true,
    });
    document.addEventListener("click", resume, { once: true });
  });
};

window.addEventListener("DOMContentLoaded", () => {
  let scrollLocked = false;
  let scrollLockY = 0;

  const preventTouchMove = (event) => {
    if (!scrollLocked) return;
    event.preventDefault();
  };

  const lockScroll = () => {
    if (scrollLocked) return;
    scrollLocked = true;
    scrollLockY = window.scrollY || window.pageYOffset || 0;

    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollLockY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    document.addEventListener("touchmove", preventTouchMove, {
      passive: false,
    });
  };

  const unlockScroll = () => {
    if (!scrollLocked) return;
    scrollLocked = false;

    document.documentElement.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.overflow = "";

    document.removeEventListener("touchmove", preventTouchMove);
    window.scrollTo(0, scrollLockY);
  };

  let fadeInInitialized = false;
  const initScrollFadeIn = () => {
    if (fadeInInitialized) return;
    fadeInInitialized = true;

    const fadeTargets = Array.from(
      document.querySelectorAll(".js-fadein"),
    ).filter((el) => !el.closest(".kv"));
    if (fadeTargets.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      fadeTargets.forEach((el) => el.classList.add("is-inview"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            if (target.classList.contains("is-inview")) return;
            requestAnimationFrame(() => {
              target.classList.add("is-inview");
            });
            io.unobserve(target);
          }
        });
      },
      { threshold: 0.3 },
    );

    fadeTargets.forEach((el) => io.observe(el));
  };

  // If a loading overlay exists, start it when the KV video is ready.
  const loading = document.getElementById("loading");
  const video = document.querySelector(".kv__video");

  if (!loading) {
    tryAutoPlayInlineVideo(video);
    initScrollFadeIn();
  } else {
    // Disable scrolling while the opening overlay is shown.
    lockScroll();

    let started = false;
    const startOpening = () => {
      if (started) return;
      started = true;

      loading.classList.add("active");

      window.setTimeout(() => {
        // Initialize fade-in while the overlay still covers the page,
        // so the animation becomes visible right after the overlay hides.
        initScrollFadeIn();
        loading.style.display = "none";
        unlockScroll();
        tryAutoPlayInlineVideo(video);
      }, 1000);
    };

    const startOpeningAfterVideoReady = () => {
      window.setTimeout(startOpening, 2000);
    };

    if (!video) {
      startOpening();
    } else if (video.readyState >= 2) {
      startOpeningAfterVideoReady();
    } else {
      video.addEventListener("canplay", startOpeningAfterVideoReady, {
        once: true,
      });
      video.addEventListener("error", startOpening, { once: true });
      window.setTimeout(startOpening, 5000);
    }
  }
});

document.querySelectorAll(".question").forEach((q) => {
  q.addEventListener("click", () => {
    const answer = q.nextElementSibling;

    if (q.classList.contains("is-open")) {
      // 閉じる
      answer.style.height = answer.scrollHeight + "px";

      requestAnimationFrame(() => {
        answer.style.height = "0px";
      });

      q.classList.remove("is-open");
    } else {
      // 開く前にリセット
      answer.style.height = "auto";
      const height = answer.scrollHeight;

      answer.style.height = "0px";

      requestAnimationFrame(() => {
        answer.style.height = height + "px";
      });

      q.classList.add("is-open");

      // 開いた後はautoに戻す
      answer.addEventListener(
        "transitionend",
        () => {
          if (q.classList.contains("is-open")) {
            answer.style.height = "auto";
          }
        },
        { once: true },
      );
    }
  });
});

document.addEventListener(
  "contextmenu",
  function (event) {
    event.preventDefault();
  },
  false,
);

const tama = document.querySelector(".tama");
const tamaImage = document.querySelector(".tama img");

if (tamaImage) {
  tamaImage.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if (tama) {
  const aboutSection = document.querySelector(".interview");

  if (!aboutSection) {
    tama.classList.add("is-visible");
  } else {
    const updateTamaVisibility = () => {
      const aboutRect = aboutSection.getBoundingClientRect();
      const shouldShow = aboutRect.top <= window.innerHeight;
      tama.classList.toggle("is-visible", shouldShow);
    };

    updateTamaVisibility();
    window.addEventListener("scroll", updateTamaVisibility, { passive: true });
    window.addEventListener("resize", updateTamaVisibility);
  }
}
