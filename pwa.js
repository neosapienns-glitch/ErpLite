let installPrompt;

function showInstallButton() {
  if (document.getElementById("pwaInstallButton")) return;
  const button = document.createElement("button");
  button.id = "pwaInstallButton";
  button.type = "button";
  button.textContent = "Install aplikasi";
  button.setAttribute("aria-label", "Install SmarterERP Lite");
  button.style.cssText = [
    "position:fixed",
    "right:16px",
    "bottom:16px",
    "z-index:10000",
    "padding:12px 18px",
    "border:0",
    "border-radius:999px",
    "background:#16856b",
    "color:#fff",
    "font:600 14px/1.2 'Segoe UI',Roboto,Arial,sans-serif",
    "box-shadow:0 4px 16px rgba(0,0,0,.22)",
    "cursor:pointer",
  ].join(";");

  button.addEventListener("click", async () => {
    if (!installPrompt) {
      window.alert("Untuk memasang aplikasi di iPhone/iPad, ketuk Bagikan lalu pilih 'Tambahkan ke Layar Utama'.");
      return;
    }

    button.disabled = true;
    try {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") button.remove();
      installPrompt = null;
    } catch (error) {
      console.error("Gagal membuka prompt instalasi PWA:", error);
      button.disabled = false;
    }
  });

  document.body.appendChild(button);
}

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  installPrompt = event;
  showInstallButton();
});

window.addEventListener("appinstalled", () => {
  installPrompt = null;
  document.getElementById("pwaInstallButton")?.remove();
});

document.addEventListener("DOMContentLoaded", () => {
  const isAppleMobile = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    || navigator.standalone === true;
  if (isAppleMobile && !isStandalone) showInstallButton();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js")
      .catch(error => console.error("Gagal mendaftarkan service worker:", error));
  }
});
