// Configuración UN DIEZ — WhatsApp
const WHATSAPP_NUMBER = "5491132644106";
const MENSAJE_GENERICO = "Hola buen día, vi la página y quería realizar un pedido";

function buildWhatsAppUrl(mensaje) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
}

function mensajeCombo(nombreCombo) {
  return `Hola buen día, vi la página y quería consultar para pedir el ${nombreCombo}. Mi dirección para consultar el envío es: `;
}

document.addEventListener("DOMContentLoaded", () => {
  // Botones genéricos (header, hero, footer, flotante)
  const genericUrl = buildWhatsAppUrl(MENSAJE_GENERICO);
  document.querySelectorAll("#wa-header, #wa-hero, #wa-footer, #wa-float").forEach((el) => {
    el.href = genericUrl;
  });

  // Animaciones al hacer scroll
  if (window.AOS) {
    AOS.init({ once: true, duration: 700, easing: "ease-out-cubic" });
  }

  // Botones de combo, con mensaje específico
  document.querySelectorAll(".btn-combo").forEach((el) => {
    const combo = el.getAttribute("data-combo");
    el.href = buildWhatsAppUrl(mensajeCombo(combo));
  });

  // Botones de combos mayoristas, con mensaje literal preconfigurado
  document.querySelectorAll(".btn-mayorista").forEach((el) => {
    const mensaje = el.getAttribute("data-mensaje");
    el.href = buildWhatsAppUrl(mensaje);
  });

  // QR que abre el chat genérico de WhatsApp
  const qrImg = document.getElementById("qr-code");
  if (qrImg) {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&color=17-17-17&data=${encodeURIComponent(genericUrl)}`;
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
