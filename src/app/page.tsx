"use client";

import Link from "next/link";
import {
  Camera,
  QrCode,
  ArrowRight,
  HeartPulse,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { CANDIDATO_INFO, MOCK_MIDIAS } from "@/lib/mockData";

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } },
};

const STAGGER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  const HERO_IMAGES = [
    "/candidato fake/1.png",
    "/candidato fake/2.png",
    "/candidato fake/3.png",
    "/candidato fake/4.png",
    "/candidato fake/5.png",
    "/candidato fake/6.png",
  ];

  const duplicatedImages = [...HERO_IMAGES, ...HERO_IMAGES, ...HERO_IMAGES];

  return (
    <main className="flex min-h-screen flex-col items-center relative overflow-hidden bg-primary text-white">
      {/* Grid Pattern Background overlay */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-80 pointer-events-none" />

      {/* ═══ NAVBAR ═══ */}
      <nav className="w-full max-w-7xl flex items-center justify-between py-6 px-4 md:px-8 z-20 relative">
        <div className="flex items-center gap-2">
          <span className="pill-btn bg-white/10 text-white text-xs md:text-sm font-black tracking-wider border-white/20">
            GALERIA
          </span>
          <span className="pill-btn bg-accent text-primary text-xs md:text-sm font-black tracking-wider border-accent">
            2026
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link href="/galeria" className="pill-btn text-white text-sm">
            Galeria
          </Link>
          <Link href="/enviar" className="pill-btn text-white text-sm">
            Enviar Foto
          </Link>
          <Link href="/qrcode" className="pill-btn text-white text-sm">
            QR Code
          </Link>
          <Link href="/admin?chave=politica2026" className="pill-btn text-white text-sm">
            Assessoria
          </Link>
        </div>

        <Link
          href="/enviar"
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent text-primary font-extrabold text-xs md:text-sm border-2 border-accent hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20"
        >
          <Camera className="size-4" />
          <span>Enviar Registro</span>
        </Link>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative w-full flex flex-col items-center justify-center text-center px-4 pt-6 pb-28 md:pt-12 md:pb-36 min-h-[85vh] z-10">
        <motion.div
          initial="hidden"
          animate="show"
          variants={STAGGER}
          className="relative z-10 flex flex-col items-center"
        >
          <motion.h2
            variants={FADE_UP}
            className="text-6xl sm:text-8xl md:text-[10rem] font-black font-serif italic text-accent tracking-tight leading-none mb-[-0.15em]"
          >
            #{CANDIDATO_INFO.numero}
          </motion.h2>

          <motion.h1
            variants={FADE_UP}
            className="text-stroke-lg text-6xl sm:text-8xl md:text-[9rem] lg:text-[11rem] font-black font-serif uppercase leading-[0.85] tracking-tighter"
          >
            GALERIA
          </motion.h1>

          <motion.h1
            variants={FADE_UP}
            className="text-stroke-lg text-6xl sm:text-8xl md:text-[9rem] lg:text-[11rem] font-black font-serif uppercase leading-[0.85] tracking-tighter mt-[-0.05em]"
          >
            POLÍTICA
          </motion.h1>
        </motion.div>

        {/* Floating Cards (candidate photos) */}
        {HERO_IMAGES.slice(0, 4).map((src, i) => {
          const positions = [
            { top: "15%", left: "6%", rotate: -10 },
            { top: "10%", right: "8%", rotate: 8 },
            { bottom: "18%", left: "4%", rotate: 6 },
            { bottom: "15%", right: "6%", rotate: -8 },
          ];
          const pos = positions[i]!;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.7, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15, type: "spring", stiffness: 80, damping: 18 }}
              className="absolute hidden lg:block z-20"
              style={{
                top: pos.top,
                left: pos.left,
                right: pos.right,
                bottom: pos.bottom,
              }}
            >
              <div
                className="glass-card rounded-2xl p-3 w-44 shadow-2xl"
                style={{ transform: `rotate(${pos.rotate}deg)` }}
              >
                <img
                  src={src}
                  alt={`Apoiador ${i + 1}`}
                  className="w-full aspect-[3/4] object-cover rounded-xl"
                />
                <div className="mt-2.5 text-left">
                  <p className="text-white text-xs font-bold truncate">
                    {MOCK_MIDIAS[i]?.nome_convidado || "Apoiador"}
                  </p>
                  <p className="text-white/60 text-[10px]">
                    {MOCK_MIDIAS[i]?.cidade_evento || "Evento"}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Rotating Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: "spring" }}
          className="absolute bottom-[20%] right-[12%] z-30 hidden md:block"
        >
          <div className="relative size-28">
            <div className="absolute inset-0 bg-accent rounded-full flex items-center justify-center animate-spin-slow">
              <svg viewBox="0 0 100 100" className="size-full">
                <path
                  id="curvePath"
                  d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text className="text-[11px] font-black uppercase fill-primary">
                  <textPath href="#curvePath">
                    • ENVIE SUA FOTO • CAMPANHA 2026 •
                  </textPath>
                </text>
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ExternalLink className="size-6 text-primary" strokeWidth={3} />
            </div>
          </div>
        </motion.div>

        {/* Animated Image Marquee */}
        <div className="absolute bottom-0 left-0 w-full h-40 md:h-52 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_80%,transparent)]">
          <motion.div
            className="flex gap-4"
            animate={{
              x: ["0%", "-50%"],
              transition: {
                ease: "linear",
                duration: 32,
                repeat: Infinity,
              },
            }}
          >
            {duplicatedImages.map((src, index) => (
              <div
                key={index}
                className="relative aspect-[3/4] h-36 sm:h-44 flex-shrink-0"
                style={{ transform: `rotate(${index % 2 === 0 ? -2 : 3}deg)` }}
              >
                <img
                  src={src}
                  alt={`Mural ${index + 1}`}
                  className="w-full h-full object-cover rounded-2xl shadow-xl ring-1 ring-white/10"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ COMPROMISSO & PROPOSTAS (WHITE BACKGROUND VISUAL BREAK) ═══ */}
      <section className="w-full py-20 px-4 z-10 relative bg-white text-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="pill-btn bg-primary text-white text-xs font-extrabold uppercase border-primary tracking-wider mb-4 inline-block">
              DIRETRIZES DE TRABALHO
            </span>
            <h3 className="text-4xl md:text-6xl font-black font-serif tracking-tight mt-2 text-slate-900">
              Compromisso & Propostas
            </h3>
            <p className="text-slate-500 max-w-xl mx-auto mt-4 text-sm sm:text-base font-sans">
              Conheça as principais bandeiras de {CANDIDATO_INFO.nome} para a Assembleia Legislativa em 2026.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: HeartPulse, title: "Saúde & Atendimento", desc: "Ampliação de exames, mutirões de cirurgia e fortalecimento das Santas Casas." },
              { icon: GraduationCap, title: "Educação e Juventude", desc: "Mais vagas em escolas técnicas e bolsas para o primeiro emprego." },
              { icon: TrendingUp, title: "Emprego & Comércio", desc: "Microcrédito e desburocratização para pequenos comerciantes." },
              { icon: ShieldCheck, title: "Fiscalização & Ética", desc: "Transparência em emendas e fiscalização de recursos públicos." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 100 }}
                whileHover={{ y: -6 }}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className="size-12 bg-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-primary/20 group-hover:scale-110 transition-transform">
                  <item.icon className="size-6" />
                </div>
                <h4 className="font-serif font-black text-xl text-slate-900 mb-3 tracking-tight">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CANDIDATO PROFILE (HIGH-CONTRAST GLASS PANEL) ═══ */}
      <section className="w-full py-20 px-4 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-[3rem] p-8 md:p-14 shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Background design elements inside card */}
            <div className="absolute top-0 right-0 size-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

            {/* Left text column */}
            <div className="lg:col-span-7 relative z-10">
              <span className="pill-btn bg-white/10 text-white text-xs font-extrabold uppercase border-white/20 tracking-wider mb-6 inline-block">
                PERFIL DO LÍDER
              </span>
              <h3 className="text-4xl md:text-7xl font-black font-serif text-white tracking-tight leading-none mb-6 uppercase">
                {CANDIDATO_INFO.nome}
                <br />
                <span className="text-accent italic">#{CANDIDATO_INFO.numero}</span>
              </h3>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed font-sans max-w-xl mb-8">
                {CANDIDATO_INFO.biografia}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/enviar"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-primary font-extrabold text-base border-2 border-accent hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20"
                >
                  <Camera className="size-5" />
                  Enviar Foto
                </Link>
                <Link
                  href="/galeria"
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 text-white font-bold text-base border border-white/20 hover:bg-white/20 transition-all"
                >
                  <ImageIcon className="size-5" />
                  Ver Galeria ({MOCK_MIDIAS.length})
                </Link>
              </div>
            </div>

            {/* Right photo column */}
            <div className="lg:col-span-5 relative z-10">
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-white/10">
                <div className="relative aspect-[4/5] bg-slate-900">
                  <img
                    src={CANDIDATO_INFO.fotoPerfil}
                    alt={`Foto oficial de ${CANDIDATO_INFO.nome}`}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block text-xs uppercase font-extrabold tracking-wider text-accent mb-1 font-serif">
                    {CANDIDATO_INFO.partido}
                  </span>
                  <h4 className="font-serif font-black text-2xl text-white drop-shadow-md italic">
                    "{CANDIDATO_INFO.slogan}"
                  </h4>
                </div>
              </div>

              {/* QR Code utility card */}
              <div className="mt-4 bg-white/5 rounded-3xl p-4 flex items-center justify-between border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <QrCode className="size-8 text-accent shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-white leading-none">QR Code de Eventos</p>
                    <p className="text-xs text-white/50 mt-1 font-sans">Ideal para panfletos e comícios</p>
                  </div>
                </div>
                <Link href="/qrcode" className="pill-btn bg-accent text-primary border-accent text-xs font-black">
                  Gerar →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ GALLERY PREVIEW (VIBRANT GRID IMAGES ON BLUE GRID) ═══ */}
      <section className="w-full py-20 px-4 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-white/15">
            <div>
              <span className="pill-btn bg-white/10 text-white text-xs font-extrabold uppercase border-white/20 tracking-wider mb-3 inline-block">
                MURAL SOCIAL
              </span>
              <h3 className="text-3xl md:text-5xl font-black font-serif tracking-tight uppercase">
                Caminhada Popular
              </h3>
            </div>
            <Link
              href="/galeria"
              className="pill-btn bg-accent text-primary border-accent text-xs font-black hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Ver todas no acervo</span>
              <ChevronRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {MOCK_MIDIAS.slice(0, 4).map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-primary border-2 border-white/10 hover:border-accent/40 shadow-xl transition-all"
              >
                <img
                  src={item.url}
                  alt={item.cidade_evento || "Registro"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent p-4 flex flex-col justify-end">
                  <p className="text-accent text-xs font-black truncate font-serif">
                    {item.cidade_evento}
                  </p>
                  <p className="text-white text-[11px] truncate font-sans font-bold mt-0.5">
                    {item.nome_convidado}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="w-full py-12 px-4 z-10 relative border-t border-white/15 bg-primary/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20">
                {CANDIDATO_INFO.nome}
              </span>
              <span className="text-xs font-black tracking-wider bg-accent text-primary px-3 py-1 rounded-full border border-accent">
                #{CANDIDATO_INFO.numero}
              </span>
            </div>
            <p className="text-xs text-white/50 font-sans">
              © 2026 Galeria Colaborativa de Apoio Eleitoral • Todos os direitos reservados.
            </p>
          </div>
          <div>
            <Link
              href="/admin?chave=politica2026"
              className="pill-btn bg-accent text-primary border-accent text-xs font-black hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Painel da Assessoria</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
