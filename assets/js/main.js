window.addEventListener("load", () => {
  setTimeout(() => {
    const loading = document.getElementById("loading");
    loading.classList.add("active");

    setTimeout(() => {
      loading.style.display = "none";

      const video = document.querySelector(".kv__video");
      if (video) {
        video.play().catch(() => {
          video.muted = true;
          video.play();
        });
      }

    }, 1000);

  }, 1000);
});