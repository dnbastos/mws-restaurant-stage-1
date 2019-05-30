/**
 * Register Service Worker.
 */
window.onload = () => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log(registration))
      .catch(e => console.error(e));
  } else {
    console.log('Service Worker is not supported in this browser.');
  }
}
