(() => {
  const preventImageAction = (event) => {
    if (event.target instanceof Element && event.target.closest('img')) {
      event.preventDefault();
    }
  };

  document.querySelectorAll('img').forEach((image) => {
    image.draggable = false;
  });

  document.addEventListener('contextmenu', preventImageAction);
  document.addEventListener('dragstart', preventImageAction);
})();
