import Link from "next/link";

const stats = [
  { label: "Creadoras analizadas", value: "2,400+" },
  { label: "Productos monitoreados", value: "18K" },
  { label: "Incremento promedio", value: "3.2x" },
];

const painPoints = [
  {
    emoji: "😓",
    title: "No sabes qué vender",
    description:
      "Encuentra los productos exactos que convierten con audiencias hispanas.",
  },
  {
    emoji: "🤝",
    title: "Poca visibilidad",
    description: "Descubre creadores gemelos y aprende de lo que ya funciona.",
  },
  {
    emoji: "📉",
    title: "Sin datos claros",
    description:
      "Convierte vistas en ventas con métricas que hablan tu idioma.",
  },
];

const features = [
  {
    title: "Radar de Creadores",
    description:
      "Encuentra perfiles latinos con audiencias similares y analiza su rendimiento diario.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 5v.01M12 19v.01M5 12h.01M19 12h.01M7.757 7.757l.007.007M16.243 16.243l.007.007M7.757 16.243l.007-.007M16.243 7.757l.007-.007M12 8a4 4 0 100 8 4 4 0 000-8z"
        />
      </svg>
    ),
  },
  {
    title: "Videos que venden",
    description:
      "Visualiza mini dashboards con thumbnails, hooks y métricas que disparan conversiones.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Productos estrella",
    description:
      "Identifica los artículos que generan ticket promedio alto y márgenes sanos.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c-2.21 0-4-1.79-4-4m8 0c0 2.21-1.79 4-4 4m0 8c2.21 0 4 1.79 4 4m-8 0c0-2.21 1.79-4 4-4m-7-4h14"
        />
      </svg>
    ),
  },
  {
    title: "Insights culturales",
    description:
      "Mensajes y creatividades que resuenan con la diáspora latina en EE. UU.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
        />
      </svg>
    ),
  },
];

const testimonials = [
  {
    name: "María González",
    focus: "Moda & Belleza",
    quote:
      "Duplicamos las ventas al replicar los ángulos que funcionan para otras makeup artists latinas.",
  },
  {
    name: "Carlos Rodríguez",
    focus: "Tech & Gadgets",
    quote:
      "Ahora sé qué productos empujar antes de que revienten en TikTok Shop Latinoamérica.",
  },
  {
    name: "Ana Martínez",
    focus: "Cocina Creativa",
    quote:
      "Los dashboards diarios me muestran qué recetas y utensilios emocionan a nuestras familias.",
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface-light">
      <div
        className="pointer-events-none absolute inset-0 bg-hero-gradient opacity-60"
        aria-hidden
      />

      {/* Navigation */}
      <nav className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-brand-purple shadow-sm">
            Academia
          </span>
          <span className="hidden text-sm text-slate-500 sm:block">
            Inteligencia cultural para TikTok Shop
          </span>
        </div>
        <Link
          href="/api/auth/tiktok"
          className="text-sm font-semibold text-brand-purple transition hover:text-brand-pink"
        >
          Iniciar sesión
        </Link>
      </nav>

      <main className="relative z-10 space-y-32 pb-24">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-lilac/60 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-purple">
              Beta privada • Creadores hispanos primero
            </span>
            <div className="space-y-5">
              <h1 className="text-4xl font-bold leading-tight text-brand-midnight sm:text-5xl lg:text-6xl">
                Convierte contenido latino en ventas reales dentro de{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-purple">
                  TikTok Shop
                </span>
              </h1>
              <p className="text-lg text-slate-600 sm:text-xl">
                Academia te da visibilidad sobre qué creadores, videos y
                productos están rompiéndola con audiencias hispanas en EE. UU. y
                LATAM.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/api/auth/tiktok"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-pink via-brand-purple to-brand-midnight px-8 py-4 text-base font-semibold text-white shadow-brand transition hover:scale-[1.01]"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
                Conectar con TikTok
              </Link>
              <button className="rounded-full border border-brand-lilac/70 px-8 py-4 text-base font-semibold text-brand-purple transition hover:bg-white">
                Ver demo guiada
              </button>
            </div>
            <div className="grid gap-6 rounded-2xl border border-white/70 bg-white/80 p-6 shadow-brand sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-brand-midnight">
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-pink/50 to-brand-purple/60 blur-3xl"
              aria-hidden
            />
            <div className="relative space-y-5 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Top productos hoy</p>
                  <p className="text-2xl font-semibold text-brand-midnight">
                    $57,420
                  </p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  +18% vs ayer
                </span>
              </div>
              <div className="space-y-4">
                {["María Makeup", "Sónica Tech", "Abuela Gourmet"].map(
                  (creator, index) => (
                    <div
                      key={creator}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
                    >
                      <div>
                        <p className="font-semibold text-brand-midnight">
                          {creator}
                        </p>
                        <p className="text-xs text-slate-500">
                          Video #{index + 1} • +{(index + 2) * 5}% CTR
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-brand-purple">
                        ${(index + 2) * 4}k
                      </span>
                    </div>
                  )
                )}
              </div>
              <div className="rounded-2xl bg-surface-light/60 p-5">
                <p className="text-sm font-semibold text-brand-purple">
                  Insight cultural destacado
                </p>
                <p className="text-sm text-slate-600">
                  Los tutoriales bilingües con referencias a fiestas decembrinas
                  aumentaron el AOV en 27% esta semana.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-white/80 bg-white/90 p-10 shadow-lg">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-purple">
                Problemas reales
              </p>
              <h2 className="mt-3 text-3xl font-bold text-brand-midnight">
                ¿Te suena familiar?
              </h2>
              <p className="text-slate-600">
                Lo hemos vivido y lo solucionamos con datos hechos para nuestra
                cultura.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {painPoints.map((pain) => (
                <div
                  key={pain.title}
                  className="rounded-2xl border border-slate-100 bg-white/80 p-6"
                >
                  <div className="text-4xl">{pain.emoji}</div>
                  <h3 className="mt-4 text-xl font-semibold text-brand-midnight">
                    {pain.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-600">
                    {pain.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-purple">
              La suite de inteligencia latina
            </p>
            <h2 className="mt-3 text-3xl font-bold text-brand-midnight">
              Todo lo que necesitas para ganar en TikTok Shop
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-midnight">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl bg-brand-midnight px-8 py-12 text-white">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-pink">
                Historias reales
              </p>
              <h2 className="mt-4 text-3xl font-bold">
                Creadores hispanos que ya están escalando
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="rounded-2xl border border-white/20 bg-white/5 p-6"
                >
                  <p className="text-sm text-brand-lilac">
                    {testimonial.focus}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-slate-100">
                    “{testimonial.quote}”
                  </p>
                  <p className="mt-5 text-sm font-semibold text-white">
                    {testimonial.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-6">
          <div className="rounded-3xl bg-gradient-to-r from-brand-pink via-brand-purple to-brand-midnight px-10 py-12 text-center text-white shadow-brand">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
              Listo para comenzar
            </p>
            <h2 className="mt-4 text-3xl font-bold">
              Abre la puerta a la comunidad hispana que ya compra en TikTok Shop
            </h2>
            <p className="mt-3 text-base text-white/80">
              Accede a la beta cerrada y recibe insights hechos para creadores
              latinos.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/api/auth/tiktok"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-brand-purple transition hover:opacity-95"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
                Entrar con TikTok
              </Link>
              <button className="rounded-full border border-white/60 px-8 py-4 text-sm font-semibold text-white/90 backdrop-blur-sm">
                Agenda una llamada
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 mt-16 border-t border-white/60 py-10 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Academia · Creado con orgullo para la
        comunidad hispana 💜
      </footer>
    </div>
  );
}
