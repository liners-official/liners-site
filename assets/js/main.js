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
