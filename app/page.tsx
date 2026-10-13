"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 120;
const VIDEO_END = 0.68;
const TRANSITION_START = 0.76;
const TRANSITION_END = 0.96;

// Troque pelos dados reais da sua marca antes de publicar.
const WHATSAPP_NUMBER = "5511999999999";
const INSTAGRAM_USERNAME = "sua_marca";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Vim pelo site e gostaria de saber mais.")}`;
const INSTAGRAM_LINK = `https://instagram.com/${INSTAGRAM_USERNAME}`;

const products = [
  {
    id: 1,
    name: "Essential Knit",
    category: "Malhas",
    price: "R$ 389,90",
    image:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Modern Tailoring",
    category: "Alfaiataria",
    price: "R$ 649,90",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Everyday Form",
    category: "Casual",
    price: "R$ 429,90",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "The Signature",
    category: "Nova coleção",
    price: "R$ 559,90",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85",
  },
];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const [progress, setProgress] = useState(0);
  const [framesReady, setFramesReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const frame = framesRef.current[frameIndex];

    if (!canvas || !frame?.complete || !frame.naturalWidth) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (
      canvas.width !== Math.round(width * dpr) ||
      canvas.height !== Math.round(height * dpr)
    ) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);

    const scale = Math.max(
      width / frame.naturalWidth,
      height / frame.naturalHeight
    );
    const drawWidth = frame.naturalWidth * scale;
    const drawHeight = frame.naturalHeight * scale;

    context.drawImage(
      frame,
      (width - drawWidth) / 2,
      (height - drawHeight) / 2,
      drawWidth,
      drawHeight
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let index = 0; index < TOTAL_FRAMES; index++) {
      const image = new Image();
      image.decoding = "async";

      const markLoaded = () => {
        if (cancelled) return;
        loadedCount++;

        if (index === 0) drawFrame(0);
        if (loadedCount >= TOTAL_FRAMES) setFramesReady(true);
      };

      image.onload = markLoaded;
      image.onerror = markLoaded;
      image.src = `/frames/frame-${String(index + 1).padStart(4, "0")}.jpg`;

      images.push(image);
    }

    framesRef.current = images;

    return () => {
      cancelled = true;
    };
  }, [drawFrame]);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const intro = document.getElementById("intro");

      if (!intro) {
        ticking = false;
        return;
      }

      const stageDistance = intro.offsetHeight - window.innerHeight;
      const rect = intro.getBoundingClientRect();
      const currentProgress = clamp(
        stageDistance > 0 ? -rect.top / stageDistance : 0
      );

      setProgress(currentProgress);

      const frameProgress = clamp(currentProgress / VIDEO_END);
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(frameProgress * (TOTAL_FRAMES - 1))
      );

      drawFrame(frameIndex);
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      animationFrameRef.current = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawFrame]);

  const fadeProgress = clamp(
    (progress - TRANSITION_START) / (TRANSITION_END - TRANSITION_START)
  );
  const sceneOpacity = 1 - fadeProgress;
  const sceneDarkness = clamp((progress - 0.42) / 0.34);
  const storeOpacity = fadeProgress;
  const headerProgress = clamp((fadeProgress - 0.12) / 0.5);
  const heroProgress = clamp((fadeProgress - 0.2) / 0.65);

  return (
    <main className="min-h-screen bg-[#f5f3ef] text-[#171715]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@400;500&display=swap');

        html {
          scroll-behavior: smooth;
        }

        body {
          font-family: 'DM Sans', Arial, sans-serif;
          letter-spacing: 0.01em;
          -webkit-font-smoothing: antialiased;
        }

        h1, h2, .luxury-serif {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 400;
          letter-spacing: -0.035em;
        }

        @keyframes productEnter {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes softReveal {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .product-reveal {
            animation: none !important;
          }
        }
      `}</style>

      {/* O closet e a loja ocupam o mesmo viewport durante a transição. */}
      <section id="intro" className="relative h-[350vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            aria-label="Portas de um closet se abrindo"
          />

          {!framesReady && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#171715] text-white">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.5em]">
                  Preparando experiência
                </p>
                <div className="mx-auto mt-5 h-px w-32 overflow-hidden bg-white/20">
                  <div className="h-full w-1/2 animate-pulse bg-white" />
                </div>
              </div>
            </div>
          )}

          {/* Texto de abertura */}
          <div
            className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 text-white sm:p-10 lg:p-14"
            style={{
              opacity: sceneOpacity * (1 - clamp(progress / 0.3)),
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.35em]">
                A new perspective
              </span>
              <span className="text-xs uppercase tracking-[0.2em]">
                Est. 2026
              </span>
            </div>

            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-5 text-[10px] uppercase tracking-[0.55em] sm:text-xs">
                Descubra o extraordinário
              </p>
              <h1 className="text-5xl font-normal tracking-[0.04em] sm:text-7xl lg:text-8xl">
                SUA MARCA
              </h1>
              <p className="mt-5 text-xs uppercase tracking-[0.25em] text-white/75 sm:text-sm">
                Uma experiência além do vestir
              </p>
            </div>

            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] sm:text-xs">
              <span>Nova coleção</span>
              <span className="animate-pulse">Role para entrar ↓</span>
              <span>Explore</span>
            </div>
          </div>

          {/* A cena já começa escurecida; o efeito aumenta no final. */}
          <div
            className="pointer-events-none absolute inset-0 z-30 bg-black"
            style={{ opacity: sceneDarkness }}
          />
          <div
            className="pointer-events-none absolute inset-0 z-[31] bg-gradient-to-t from-black/45 via-transparent to-black/25"
            style={{ opacity: 0.35 + clamp((progress - 0.35) / 0.25) * 0.65 }}
          />
          <div
            className="pointer-events-none absolute inset-0 z-[32] bg-black"
            style={{
              opacity: clamp((progress - 0.68) / 0.08),
            }}
          />

          {/* A loja entra por cima do vídeo, com zoom e desfoque suaves. */}
          <div
            className="absolute inset-0 z-40 flex flex-col bg-[#f5f3ef]"
            style={{
              opacity: storeOpacity,
              visibility: fadeProgress > 0.01 ? "visible" : "hidden",
              pointerEvents: fadeProgress > 0.95 ? "auto" : "none",
              transform: `scale(${1.035 - fadeProgress * 0.035})`,
              filter: `blur(${(1 - fadeProgress) * 8}px)`,
            }}
          >
            <header
              className="relative z-50 flex h-[76px] shrink-0 items-center justify-between border-b border-black/10 px-5 sm:px-10 lg:px-14"
              style={{
                opacity: headerProgress,
                transform: `translateY(${(1 - headerProgress) * -16}px)`,
              }}
            >
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em]"
                aria-expanded={menuOpen}
              >
                <span className="flex w-5 flex-col gap-[5px]">
                  <span className="h-px w-5 bg-black" />
                  <span className="h-px w-3 bg-black" />
                </span>
                <span className="hidden sm:inline">
                  {menuOpen ? "Fechar" : "Menu"}
                </span>
              </button>

              <a
                href="#loja"
                className="absolute left-1/2 -translate-x-1/2 text-xl font-medium tracking-[0.28em] sm:text-2xl"
              >
                SUA MARCA
              </a>

              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.12em] sm:gap-5">
                <a
                  href={INSTAGRAM_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden transition-opacity hover:opacity-60 sm:block"
                >
                  Instagram
                </a>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-black px-3 py-2 transition-colors hover:bg-black hover:text-white sm:px-4"
                >
                  WhatsApp
                </a>
              </div>

              {menuOpen && (
                <nav className="absolute left-0 top-full z-[60] w-full border-b border-black/10 bg-[#f5f3ef] px-8 py-8 sm:w-80 sm:border-r">
                  <div className="flex flex-col gap-6 text-sm">
                    <a href="#colecao" onClick={() => setMenuOpen(false)}>
                      Novidades
                    </a>
                    <a href="#colecao" onClick={() => setMenuOpen(false)}>
                      Roupas
                    </a>
                    <a href="#colecao" onClick={() => setMenuOpen(false)}>
                      Mais vendidos
                    </a>
                    <a href="#sobre" onClick={() => setMenuOpen(false)}>
                      Sobre nós
                    </a>
                  </div>
                </nav>
              )}
            </header>

            <div className="relative flex min-h-0 flex-1 items-center overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  transform: `scale(${1.12 - fadeProgress * 0.12})`,
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2200&q=90"
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/35" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />
              </div>

              <div
                className="relative z-10 w-full px-7 py-12 text-white sm:px-14 lg:px-24"
                style={{
                  opacity: heroProgress,
                  transform: `translateY(${(1 - heroProgress) * 36}px)`,
                }}
              >
                <p className="mb-6 text-[9px] uppercase tracking-[0.42em] sm:text-[10px]">
                  Coleção 2026 · Edição especial
                </p>
                <h2 className="max-w-3xl text-5xl font-normal leading-[1.04] tracking-normal sm:text-7xl lg:text-[88px]">
                  Vista sua
                  <br />
                  própria história.
                </h2>
                <p className="mt-6 max-w-md text-sm leading-6 text-white/85 sm:text-base">
                  Peças selecionadas, design atemporal e uma nova forma de
                  expressar quem você é.
                </p>
                <a
                  href="#colecao"
                  className="mt-10 inline-flex items-center border border-white/80 px-8 py-[17px] text-[9px] uppercase tracking-[0.28em] transition-all duration-500 hover:border-white hover:bg-white hover:text-black sm:px-10"
                >
                  Explorar coleção <span className="ml-7 text-sm">↗</span>
                </a>
              </div>

              <span
                className="absolute bottom-7 right-7 z-10 text-[9px] uppercase tracking-[0.3em] text-white/80 sm:bottom-10 sm:right-14"
                style={{ opacity: clamp((fadeProgress - 0.5) / 0.4) }}
              >
                Elegância em cada detalhe
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Continuação normal da loja */}
      <section id="loja" className="bg-[#f5f3ef]">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-10 sm:py-24 lg:px-14">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:mb-16 sm:flex-row sm:items-end">
            <div>
              <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-black/50">
                Curadoria exclusiva
              </p>
              <h2 className="text-4xl font-normal tracking-normal sm:text-6xl">
                Peças em destaque
              </h2>
            </div>
            <a
              href="#colecao"
              className="w-fit border-b border-black pb-2 text-[10px] uppercase tracking-[0.2em]"
            >
              Ver coleção completa ↗
            </a>
          </div>

          <div
            id="colecao"
            className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4"
          >
            {products.map((product) => (
              <article
                key={product.id}
                className="product-reveal group animate-[productEnter_800ms_cubic-bezier(0.22,1,0.36,1)_both]"
                style={{ animationDelay: `${product.id * 120}ms` }}
              >
                <a href="#sobre" className="relative block overflow-hidden bg-[#e9e6e0]">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <span className="absolute left-3 top-3 bg-[#f5f3ef]/95 px-3 py-2 text-[8px] uppercase tracking-[0.2em]">
                    {product.category}
                  </span>
                </a>

                <div className="flex items-start justify-between gap-3 pt-4">
                  <div>
                    <h3 className="text-[13px] tracking-[0.02em]">{product.name}</h3>
                    <p className="mt-2 text-xs text-black/55">
                      {product.category}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-xs">{product.price}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="sobre" className="bg-[#e9e6e0]">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-10 px-5 py-16 sm:px-10 sm:py-24 lg:flex-row lg:items-end lg:justify-between lg:px-14">
          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-black/50">
              Menos, mas melhor
            </p>
            <h2 className="max-w-2xl text-4xl font-normal leading-tight sm:text-6xl">
              O estilo está nos detalhes.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-black/65">
            Acreditamos em escolhas conscientes, materiais selecionados e
            peças que permanecem relevantes muito além de uma estação.
          </p>
        </div>
      </section>

      <section className="bg-[#f5f3ef] px-5 py-14 sm:px-10 lg:px-14">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 border-t border-black/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-black/50">
              Fale com a gente
            </p>
            <h2 className="mt-3 text-2xl font-light sm:text-3xl">
              Vamos encontrar seu próximo favorito.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-[#171715] px-6 py-4 text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-black/75"
            >
              Chamar no WhatsApp ↗
            </a>
            <a
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 border border-black/25 px-6 py-4 text-[10px] uppercase tracking-[0.18em] transition-colors hover:bg-black hover:text-white"
            >
              Instagram ↗
            </a>
          </div>
        </div>
      </section>

      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        aria-label="Chamar a loja no WhatsApp"
        className="fixed bottom-5 right-5 z-[70] flex items-center gap-3 rounded-full bg-[#171715] px-5 py-4 text-[10px] uppercase tracking-[0.16em] text-white shadow-lg transition-transform hover:scale-105 sm:bottom-7 sm:right-7"
      >
        <span className="h-2 w-2 rounded-full bg-[#65d889]" />
        WhatsApp
      </a>

      <footer className="bg-[#171715] px-5 py-10 text-white sm:px-10 lg:px-14">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <a href="#intro" className="text-xl tracking-[0.3em]">
            SUA MARCA
          </a>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/55">
            © 2026 — Todos os direitos reservados
          </p>
          <a href="#intro" className="text-[10px] uppercase tracking-[0.2em]">
            Voltar ao topo ↑
          </a>
        </div>
      </footer>
    </main>
  );
}
