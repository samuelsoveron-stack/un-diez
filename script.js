// Configuración UN DIEZ — WhatsApp
const WHATSAPP_NUMBER = "5491132644106";

const MENSAJE_CONSULTA_GENERAL =
  "¡Hola *UN DIEZ*! 👋\nVi la página web y quería hacerles una consulta sobre sus productos.\n\n💬 *Mi consulta es:* ";

function buildWhatsAppUrl(mensaje) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#wa-header, #wa-hero, #wa-footer, #wa-float").forEach((el) => {
    el.href = buildWhatsAppUrl(MENSAJE_CONSULTA_GENERAL);
  });

  // Animaciones al hacer scroll
  if (window.AOS) {
    AOS.init({ once: true, duration: 700, easing: "ease-out-cubic" });
  }

  // Botones con mensaje literal preconfigurado (cada combo ya trae su texto exacto en data-mensaje).
  document.querySelectorAll("[data-mensaje]").forEach((el) => {
    el.href = buildWhatsAppUrl(el.getAttribute("data-mensaje"));
  });

  // QR que abre el mismo chat genérico de WhatsApp que header/hero/footer/flotante
  const qrImg = document.getElementById("qr-code");
  if (qrImg) {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&color=17-17-17&data=${encodeURIComponent(buildWhatsAppUrl(MENSAJE_CONSULTA_GENERAL))}`;
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

  initCarousels();
  initCarrito();
  initLightbox();
  actualizarHorarioBadge();
  setInterval(actualizarHorarioBadge, 60000);
});

// Badge "Abiertos" / "Cerrado" según horario real de Villa Ballester (Lun a Sáb, 9 a 20 hs)
function actualizarHorarioBadge() {
  const badges = document.querySelectorAll(".horario-badge");
  if (!badges.length) return;

  const ahora = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
  const dia = ahora.getDay(); // 0 = domingo ... 6 = sábado
  const horaDecimal = ahora.getHours() + ahora.getMinutes() / 60;
  const abierto = dia >= 1 && dia <= 6 && horaDecimal >= 9 && horaDecimal < 20;

  badges.forEach((badge) => {
    const completo = badge.classList.contains("horario-full");
    badge.textContent = abierto ? "🟢 Abiertos" : (completo ? "🌙 Cerrado (Tomando pedidos)" : "🌙 Cerrado");
    badge.classList.remove("bg-green-500/15", "text-green-400", "border-green-500/40", "bg-white/5", "text-white/50", "border-white/15");
    badge.classList.add("border", ...(abierto
      ? ["bg-green-500/15", "text-green-400", "border-green-500/40"]
      : ["bg-white/5", "text-white/50", "border-white/15"]));
  });
}

// Carruseles de combos: flechas + dots sincronizados con el scroll horizontal
function initCarousels() {
  document.querySelectorAll(".carousel").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const prevBtn = carousel.querySelector(".carousel-arrow.prev");
    const nextBtn = carousel.querySelector(".carousel-arrow.next");
    const dotsWrap = carousel.querySelector(".carousel-dots");
    if (!track) return;
    const cards = [...track.children];
    if (cards.length === 0) return;

    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      cards.forEach((card, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Ir al combo ${i + 1}`);
        dot.addEventListener("click", () => {
          card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
        });
        dotsWrap.appendChild(dot);
      });
    }

    const updateDots = () => {
      if (!dotsWrap) return;
      const dots = [...dotsWrap.children];
      const trackLeft = track.getBoundingClientRect().left;
      let closest = 0;
      let closestDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      dots.forEach((dot, i) => dot.classList.toggle("active", i === closest));
    };

    const scrollAmount = () => (cards[0] ? cards[0].getBoundingClientRect().width + 24 : 300);
    if (prevBtn) prevBtn.addEventListener("click", () => track.scrollBy({ left: -scrollAmount(), behavior: "smooth" }));
    if (nextBtn) nextBtn.addEventListener("click", () => track.scrollBy({ left: scrollAmount(), behavior: "smooth" }));

    let scrollTimeout;
    track.addEventListener("scroll", () => {
      window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(updateDots, 80);
    });

    updateDots();
  });
}

// Carrito: cantidades por combo + mensaje dinámico de WhatsApp
function initCarrito() {
  const items = [...document.querySelectorAll(".combo-qty")].map((el) => ({
    el,
    nombre: el.dataset.nombre,
    precio: Number(el.dataset.precio),
    cant: 0,
    valor: el.querySelector(".qty-valor"),
  }));
  if (!items.length) return;

  const fmt = (n) => "$" + n.toLocaleString("es-AR");
  const sendBtn = document.getElementById("cart-send");

  function render() {
    const lineas = items.filter((i) => i.cant > 0);
    const total = lineas.reduce((t, i) => t + i.cant * i.precio, 0);
    const unidades = lineas.reduce((t, i) => t + i.cant, 0);
    items.forEach((i) => (i.valor.textContent = i.cant));
    document.getElementById("cart-count").textContent = unidades;
    document.getElementById("cart-count-label").textContent = unidades === 1 ? "ítem" : "ítems";
    document.getElementById("cart-total").textContent = fmt(total);
    document.body.classList.toggle("cart-open", unidades > 0);

    const detalle = lineas.map((i) => `• ${i.cant}x ${i.nombre} (${fmt(i.cant * i.precio)})`).join("\n");
    const mensaje =
      "¡Hola *UN DIEZ*! Quería hacer el siguiente pedido:\n\n" +
      "🛒 *Detalle del pedido:*\n" + detalle + "\n\n" +
      `💰 *Total de productos:* ${fmt(total)}\n` +
      "🍞 *Variedad de pan:* (Sésamo / Parmesano)\n" +
      "🛵 Consulta por costo de envío a domicilio en mi zona.\n" +
      "💳 *Medio de pago:* (Efectivo / Mercado Pago / Transferencia)";
    sendBtn.href = buildWhatsAppUrl(mensaje);
  }

  items.forEach((i) => {
    i.el.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-accion]");
      if (!btn) return;
      i.cant = Math.max(0, Math.min(99, i.cant + (btn.dataset.accion === "mas" ? 1 : -1)));
      render();
    });
  });
  document.getElementById("cart-clear").addEventListener("click", () => {
    items.forEach((i) => (i.cant = 0));
    render();
  });
  render();
}

// Lightbox de la galería de clientes (clic/tap en una foto para ampliarla)
function initLightbox() {
  const slides = [...document.querySelectorAll(".galeria-slide img")];
  const box = document.getElementById("lightbox");
  if (!slides.length || !box) return;
  const img = document.getElementById("lb-img");
  let actual = 0;

  const mostrar = (i) => {
    actual = (i + slides.length) % slides.length;
    img.src = slides[actual].src;
    img.alt = slides[actual].alt;
  };
  const abrir = (i) => {
    mostrar(i);
    box.classList.remove("hidden");
    box.classList.add("flex");
    document.body.style.overflow = "hidden";
  };
  const cerrar = () => {
    box.classList.add("hidden");
    box.classList.remove("flex");
    document.body.style.overflow = "";
  };

  slides.forEach((el, i) => el.parentElement.addEventListener("click", () => abrir(i)));
  document.getElementById("lb-close").addEventListener("click", cerrar);
  document.getElementById("lb-prev").addEventListener("click", () => mostrar(actual - 1));
  document.getElementById("lb-next").addEventListener("click", () => mostrar(actual + 1));
  box.addEventListener("click", (e) => { if (e.target === box) cerrar(); });
  document.addEventListener("keydown", (e) => {
    if (box.classList.contains("hidden")) return;
    if (e.key === "Escape") cerrar();
    if (e.key === "ArrowLeft") mostrar(actual - 1);
    if (e.key === "ArrowRight") mostrar(actual + 1);
  });
}
