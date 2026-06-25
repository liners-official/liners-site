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

  let resultArrowImagesPreloaded = false;
  const preloadResultArrowImages = () => {
    if (resultArrowImagesPreloaded) return;
    resultArrowImagesPreloaded = true;

    const sources = [
      "/assets/image/arrow_open_prev.png",
      "/assets/image/arrow_close_prev.png",
      "/assets/image/arrow_open_next.png",
      "/assets/image/arrow_close_next.png",
    ];

    sources.forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });
  };

  // Preload early so arrow state changes never flash.
  if (document.querySelector(".result__list--container")) {
    preloadResultArrowImages();
  }

  const initResultListContainerSlider = () => {
    const $ = window.jQuery;
    if (!$ || !$.fn || typeof $.fn.slick !== "function") return;

    const $container = $(".result__list--container");
    if ($container.length === 0) return;
    if ($container.hasClass("slick-initialized")) return;

    const slideCount = $container.children(".result__list").length;
    if (slideCount <= 1) return;

    preloadResultArrowImages();

    $container.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: false,
      adaptiveHeight: false,
      dots: true,
      arrows: true,
    });
  };

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

  let informationConfettiInitialized = false;
  const initInformationConfetti = () => {
    if (informationConfettiInitialized) return;
    informationConfettiInitialized = true;

    const informationSection = document.querySelector(".information");
    const confetti = window.confetti;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!informationSection || typeof confetti !== "function" || reduceMotion) {
      return;
    }

    const startConfetti = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const randomInRange = (min, max) => Math.random() * (max - min) + min;
      const particleCount = randomInRange(
        isMobile ? 180 : 260,
        isMobile ? 240 : 340,
      );
      const defaults = {
        scalar: isMobile ? 0.5 : 0.6,
        ticks: isMobile ? 220 : 260,
        gravity: 0.55,
        decay: 0.92,
      };

      confetti({
        ...defaults,
        angle: randomInRange(35, 55),
        spread: randomInRange(50, 70),
        particleCount,
        origin: { x: 0, y: 0.6 },
      });
      confetti({
        ...defaults,
        angle: randomInRange(125, 145),
        spread: randomInRange(50, 70),
        particleCount,
        origin: { x: 1, y: 0.6 },
      });
    };

    if (typeof IntersectionObserver === "undefined") {
      const onScroll = () => {
        const rect = informationSection.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const isNearCenter =
          Math.abs(sectionCenter - viewportCenter) <= window.innerHeight * 0.25;

        if (!isNearCenter) return;

        startConfetti();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };

      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          startConfetti();
          io.unobserve(entry.target);
        });
      },
      {
        rootMargin: "-45% 0px -45% 0px",
        threshold: 0,
      },
    );

    io.observe(informationSection);
  };

  // If a loading overlay exists, start it when the KV video is ready.
  const loading = document.getElementById("loading");
  const video = document.querySelector(".kv__video");

  if (!loading) {
    tryAutoPlayInlineVideo(video);
    initScrollFadeIn();
    initInformationConfetti();
    initResultListContainerSlider();
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
        initInformationConfetti();
        loading.style.display = "none";
        unlockScroll();
        tryAutoPlayInlineVideo(video);
        initResultListContainerSlider();
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
