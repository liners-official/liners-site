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

window.addEventListener("load", () => {
  // If a loading overlay exists, fade it out first.
  const loading = document.getElementById("loading");
  const video = document.querySelector(".kv__video");

  if (!loading) {
    tryAutoPlayInlineVideo(video);
    return;
  }

  window.setTimeout(() => {
    loading.classList.add("active");

    window.setTimeout(() => {
      loading.style.display = "none";
      tryAutoPlayInlineVideo(video);
    }, 1000);
  }, 1000);
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

document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
}, false);

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
