// Configuración UN DIEZ — WhatsApp
const WHATSAPP_NUMBER = "5491132644106"; // Número de fábrica (usado si no hay revendedor asociado)

// Planilla de revendedores: Google Sheet publicada como CSV (Archivo > Compartir >
// Publicar en la web > CSV), con columnas id,nombre,whatsapp. El dueño del negocio
// da de alta o baja revendedores editando filas ahí, sin tocar código ni redeployar.
const REVENDEDORES_SHEET_CSV_URL = ""; // ← pegar acá el link "output=csv" de la planilla

// Botones genéricos (header, hero, footer, flotante): el mensaje depende
// del contexto de la página (retail vs. mayorista), marcado en <body data-context>.
const MENSAJE_CONSULTA_GENERAL =
  "¡Hola *UN DIEZ*! 👋\nVi la página web y quería hacerles una consulta sobre sus productos.\n\n💬 *Mi consulta es:* ";

const MENSAJE_MAYORISTA_GENERAL =
  "¡Hola *UN DIEZ*! 🏭\nVi la propuesta para revendedores/mayoristas en la web y quisiera recibir información para mi zona.\n\n📋 *Localidad / Nombre del negocio:* ";

function buildWhatsAppUrl(mensaje) {
  const numero = localStorage.getItem("undiez_ref_wa") || WHATSAPP_NUMBER;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

// Lee ?ref=id de la URL, lo valida contra la planilla de revendedores y persiste
// el WhatsApp asociado en localStorage. Si el id no existe (o no hay planilla
// configurada), no toca lo que ya estuviera guardado.
async function gestionarRevendedor() {
  const refParam = new URLSearchParams(window.location.search).get("ref");
  if (!refParam || !REVENDEDORES_SHEET_CSV_URL) return;

  try {
    const url = new URL(REVENDEDORES_SHEET_CSV_URL);
    url.searchParams.set("_", Date.now()); // evita CSV cacheado al editar la planilla
    const respuesta = await fetch(url, { cache: "no-store" });
    if (!respuesta.ok) return;

    const revendedor = parseRevendedoresCsv(await respuesta.text())[refParam.trim().toLowerCase()];
    if (!revendedor) return;

    localStorage.setItem("undiez_ref_id", refParam);
    localStorage.setItem("undiez_ref_wa", revendedor.whatsapp);
    localStorage.setItem("undiez_ref_nombre", revendedor.nombre);
  } catch (error) {
    console.warn("No se pudo verificar el revendedor:", error);
  }
}

function parseRevendedoresCsv(csv) {
  const mapa = {};
  csv.trim().split("\n").slice(1).forEach((fila) => {
    const [id, nombre, whatsapp] = fila.split(",").map((valor) => valor?.trim());
    if (id && whatsapp) {
      mapa[id.toLowerCase()] = { nombre: nombre || id, whatsapp: whatsapp.replace(/\D/g, "") };
    }
  });
  return mapa;
}

function mostrarBannerRevendedor() {
  const nombre = localStorage.getItem("undiez_ref_nombre");
  const banner = document.getElementById("revendedor-banner");
  if (!nombre || !banner) return;
  document.getElementById("revendedor-banner-nombre").textContent = nombre;
  banner.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", async () => {
  await gestionarRevendedor();
  mostrarBannerRevendedor();

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

  initCarousels();
  actualizarHorarioBadge();
  setInterval(actualizarHorarioBadge, 60000);
});

// Badge "Abiertos" / "Cerrado" según horario real de Villa Ballester (Lun a Sáb, 9 a 20 hs)
function actualizarHorarioBadge() {
  const badge = document.getElementById("horario-badge");
  if (!badge) return;

  const ahora = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
  const dia = ahora.getDay(); // 0 = domingo ... 6 = sábado
  const horaDecimal = ahora.getHours() + ahora.getMinutes() / 60;
  const abierto = dia >= 1 && dia <= 6 && horaDecimal >= 9 && horaDecimal < 20;

  if (abierto) {
    badge.textContent = "🟢 Abiertos";
    badge.className = "shrink-0 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap bg-green-500/15 text-green-400 border border-green-500/40";
  } else {
    badge.textContent = "🌙 Cerrado (Tomando pedidos)";
    badge.className = "shrink-0 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap bg-white/5 text-white/50 border border-white/15";
  }
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
