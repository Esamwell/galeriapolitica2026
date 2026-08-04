"use client";

import Link from "next/link";
import { Camera, Image as ImageIcon, Megaphone, QrCode, ShieldCheck, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 relative overflow-hidden">
      {/* Header Superior sutil */}
      <header className="w-full max-w-4xl flex items-center justify-between py-4 border-b border-foreground/5 z-10">
        <div className="flex items-center gap-2">
          <div className="size-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold font-serif text-lg shadow-md shadow-primary/20">
            GP
          </div>
          <div>
            <h1 className="font-serif font-bold text-base text-foreground tracking-tight leading-none">
              Galeria Política <span className="text-primary">2026</span>
            </h1>
            <p className="text-[11px] font-sans text-foreground/50">Central Colaborativa da Campanha</p>
          </div>
        </div>

        <Link
          href="/qrcode"
          className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
        >
          <QrCode className="size-4" />
          <span className="hidden sm:inline">QR Code Oficial</span>
        </Link>
      </header>

      {/* Hero Section Central */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="z-10 flex flex-col items-center text-center max-w-2xl w-full my-auto py-8"
      >
        {/* Badge de Campanha */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
          <Megaphone className="size-3.5 text-primary" />
          <span>Eleições 2026 • Compartilhe seu registro</span>
        </div>

        {/* Título Principal */}
        <h2 className="font-serif text-4xl md:text-6xl font-extrabold text-foreground mb-4 leading-tight">
          Envie suas fotos e vídeos para o <span className="text-primary underline decoration-gold/40 decoration-4">Candidato</span>
        </h2>

        {/* Subtítulo / Descrição */}
        <p className="text-base md:text-lg text-foreground/75 mb-8 font-sans leading-relaxed max-w-xl">
          Foi ao comício, carreata ou evento de rua? Faça parte da nossa cobertura oficial!
          Envie seus registros para a equipe de mídia baixar em alta qualidade.
        </p>

        {/* Botões Principais de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/enviar"
              className="flex items-center justify-center gap-2.5 w-full bg-primary text-white py-4 px-6 rounded-2xl shadow-lg shadow-primary/25 font-semibold text-lg transition-all hover:bg-primary/90 hover:shadow-xl"
            >
              <Camera className="size-5" />
              Enviar Foto/Vídeo
            </Link>
          </motion.div>

          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/galeria"
              className="flex items-center justify-center gap-2.5 w-full bg-white text-foreground border border-foreground/15 py-4 px-6 rounded-2xl shadow-sm font-semibold text-lg transition-all hover:bg-foreground/5 hover:border-primary/40"
            >
              <ImageIcon className="size-5 text-primary" />
              Ver Galeria
            </Link>
          </motion.div>
        </div>

        {/* Badges de Benefícios */}
        <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-foreground/10 w-full max-w-lg">
          <div className="flex flex-col items-center text-center">
            <div className="size-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2 text-primary border border-foreground/5">
              <Users className="size-5" />
            </div>
            <span className="text-xs font-semibold text-foreground/80">Engajamento Direto</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="size-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2 text-primary border border-foreground/5">
              <Camera className="size-5" />
            </div>
            <span className="text-xs font-semibold text-foreground/80">Fotos em Alta Resolução</span>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="size-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2 text-primary border border-foreground/5">
              <ShieldCheck className="size-5" />
            </div>
            <span className="text-xs font-semibold text-foreground/80">Envio Seguro e Rápido</span>
          </div>
        </div>
      </motion.div>

      {/* Footer com link de Admin para Assessoria */}
      <footer className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between py-4 border-t border-foreground/5 text-xs text-foreground/50 z-10 gap-2">
        <p>© 2026 Galeria Política • Plataforma para Apoiadores e Candidatos</p>
        <Link
          href="/admin?chave=politica2026"
          className="flex items-center gap-1 text-foreground/70 hover:text-primary transition-colors font-medium"
        >
          <span>Painel do Candidato / Assessoria</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </footer>
    </main>
  );
}
