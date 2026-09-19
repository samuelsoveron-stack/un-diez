// Configuración UN DIEZ — WhatsApp
const WHATSAPP_NUMBER = "5491132644106";

// Botones genéricos (header, hero, footer, flotante): el mensaje depende
// del contexto de la página (retail vs. mayorista), marcado en <body data-context>.
const MENSAJE_CONSULTA_GENERAL =
  "¡Hola *UN DIEZ*! 👋\nVi la página web y quería hacerles una consulta sobre sus productos.\n\n💬 *Mi consulta es:* ";

const MENSAJE_MAYORISTA_GENERAL =
  "¡Hola *UN DIEZ*! 🏭\nVi la propuesta para revendedores/mayoristas en la web y quisiera recibir información para mi zona.\n\n📋 *Localidad / Nombre del negocio:* ";

function buildWhatsAppUrl(mensaje) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const esMayorista = document.body.dataset.context === "mayorista";
  const mensajeGenerico = esMayorista ? MENSAJE_MAYORISTA_GENERAL : MENSAJE_CONSULTA_GENERAL;

  document.querySelectorAll("#wa-header, #wa-hero, #wa-footer, #wa-float").forEach((el) => {
    el.href = buildWhatsAppUrl(mensajeGenerico);
  });

  // Animaciones al hacer scroll
  if (window.AOS) {
    AOS.init({ once: true, duration: 700, easing: "ease-out-cubic" });
  }

  // Botones con mensaje literal preconfigurado (combos minoristas y mayoristas,
  // cada uno ya trae su texto exacto en data-mensaje).
  document.querySelectorAll("[data-mensaje]").forEach((el) => {
    el.href = buildWhatsAppUrl(el.getAttribute("data-mensaje"));
  });

  // QR que abre el mismo chat genérico de WhatsApp que header/hero/footer/flotante
  const qrImg = document.getElementById("qr-code");
  if (qrImg) {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&color=17-17-17&data=${encodeURIComponent(buildWhatsAppUrl(mensajeGenerico))}`;
    qrImg.src = qrApiUrl;
  }

  // Botón flotante: late 1s cada 5s de inactividad
  const waFloat = document.getElementById("wa-float");
  if (waFloat) {
    setInterval(() => {
      waFloat.classList.add("is-pulsing");
      setTimeout(() => waFloat.classList.remove("is-pulsing"), 1000);
    }, 5000);
  }
});
