"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, X, Image as ImageIcon, Download, Film, User, Camera, MapPin, Award, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { CANDIDATO_INFO, MOCK_MIDIAS, MidiaMock } from "@/lib/mockData";
import { saveAs } from "file-saver";

export default function GaleriaPage() {
  const [midias, setMidias] = useState<MidiaMock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMidia, setSelectedMidia] = useState<MidiaMock | null>(null);

  const fetchMidias = async () => {
    try {
      const { data, error } = await supabase
        .from("midias")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        setMidias(data as MidiaMock[]);
      } else {
        // Fallback para os dados fakes de apresentação do Tom Máximo
        setMidias(MOCK_MIDIAS);
      }
    } catch (error) {
      console.log("Usando acervo de apresentação do candidato Tom Máximo:", error);
      setMidias(MOCK_MIDIAS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMidias();

    // Inscrição no realtime para novas fotos
    const channel = supabase
      .channel("midias-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "midias" },
        (payload) => {
          setMidias((prev) => [payload.new as MidiaMock, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDownloadSingle = async (midia: MidiaMock) => {
    try {
      const response = await fetch(midia.url);
      const blob = await response.blob();
      const ext = midia.tipo === 'video' ? 'mp4' : 'jpg';
      const fileName = `tom_maximo_55123_${midia.nome_convidado ? midia.nome_convidado.replace(/[^a-z0-9]/gi, '_') : 'apoiador'}_${Date.now()}.${ext}`;
      saveAs(blob, fileName);
    } catch (err) {
      console.error("Erro ao baixar arquivo:", err);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between pb-12 pt-6 px-4 md:px-8 relative overflow-hidden bg-primary text-white">
      {/* Grid background pattern */}
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-80 pointer-events-none" />

      {/* Navigation Header */}
      <div className="w-full max-w-7xl flex items-center justify-between z-10 mb-8 md:mb-12">
        <Link href="/" className="pill-btn flex items-center gap-1.5 text-white hover:scale-105 transition-all">
          <ArrowLeft className="size-4" />
          <span>Voltar ao Início</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="pill-btn bg-white/10 text-white text-xs font-black tracking-wider border-white/20">
            GALERIA
          </span>
          <span className="pill-btn bg-accent text-primary text-xs font-black tracking-wider border-accent">
            2026
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout Container */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center z-10 my-auto">

        {/* LEFT COLUMN: Mural de Apoiadores */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">

          {/* Candidate banner */}
          <div className="glass-card rounded-3xl p-5 flex items-center gap-4 border border-white/20">
            <img
              src={CANDIDATO_INFO.fotoPerfil}
              alt={CANDIDATO_INFO.nome}
              className="size-14 rounded-2xl object-cover ring-2 ring-accent shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-accent flex items-center gap-1 uppercase tracking-wider font-serif">
                <Award className="size-3.5 text-accent" />
                {CANDIDATO_INFO.nome} #{CANDIDATO_INFO.numero}
              </p>
              <p className="text-xs text-white/90 font-medium leading-normal mt-0.5">
                {isLoading ? "Carregando acervo de apoiadores..." : `${midias.length} ${midias.length === 1 ? "registro compartilhado" : "registros compartilhados"} de apoiadores da nossa caminhada.`}
              </p>
            </div>
            <Link
              href="/enviar"
              className="hidden sm:flex items-center gap-1.5 bg-accent text-primary px-5 py-2.5 rounded-full font-black text-xs shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              <Camera className="size-4" />
              Enviar Foto
            </Link>
          </div>

          {/* Gallery card */}
          <div className="bg-white rounded-[2.5rem] p-4 md:p-6 shadow-2xl border border-slate-100 text-slate-900">
            <div className="flex items-center justify-between mb-4 md:mb-5 px-1">
              <div>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                  Mural Oficial
                </span>
                <h2 className="font-serif font-black text-xl md:text-2xl text-slate-900 tracking-tight">
                  Acervo de Apoiadores
                </h2>
              </div>
              {!isLoading && midias.length > 0 && (
                <span className="bg-primary/10 text-primary text-xs font-black px-3 py-1.5 rounded-full shrink-0">
                  {midias.length} {midias.length === 1 ? "foto" : "fotos"}
                </span>
              )}
            </div>

            {isLoading ? (
              // Skeleton Loading
              <div className="columns-2 md:columns-3 gap-3 space-y-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-full bg-slate-100 rounded-2xl animate-pulse"
                    style={{ height: `${220 + (i % 3) * 60}px` }}
                  />
                ))}
              </div>
            ) : midias.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center py-14 text-center px-4">
                <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
                  <ImageIcon className="size-8" />
                </div>
                <h3 className="text-lg font-serif font-bold text-slate-900 mb-2">Ainda sem fotos na galeria</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-xs leading-relaxed font-sans">
                  Seja o primeiro apoiador a registrar e enviar uma foto ou vídeo da campanha do {CANDIDATO_INFO.nome}!
                </p>
                <Link
                  href="/enviar"
                  className="bg-primary text-white py-3 px-6 rounded-full font-bold shadow-lg shadow-primary/20 transition-colors hover:scale-105 active:scale-95 text-sm"
                >
                  Enviar a primeira foto
                </Link>
              </div>
            ) : (
              // Masonry Grid
              <div className="columns-2 md:columns-3 gap-3 space-y-3">
                <AnimatePresence>
                  {midias.map((midia) => (
                    <motion.div
                      key={midia.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      layout
                      onClick={() => setSelectedMidia(midia)}
                      className="relative cursor-pointer rounded-2xl overflow-hidden group bg-slate-900 break-inside-avoid border border-slate-200 shadow-sm hover:shadow-xl transition-all"
                    >
                      {midia.tipo === "video" ? (
                        <>
                          <video
                            src={midia.url}
                            className="w-full h-auto object-cover pointer-events-none"
                            preload="metadata"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <div className="bg-white/30 backdrop-blur-md p-3.5 rounded-full text-white shadow-lg">
                              <Play className="size-6 fill-white" />
                            </div>
                          </div>
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-white text-[10px] font-bold flex items-center gap-1">
                            <Film className="size-3" /> Vídeo
                          </div>
                        </>
                      ) : (
                        <img
                          src={midia.url}
                          alt="Registro de foto da campanha do Tom Máximo"
                          loading="lazy"
                          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}

                      {/* Overlay inferior com autor e evento */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-8">
                        {midia.cidade_evento && (
                          <p className="text-gold text-[11px] font-bold truncate flex items-center gap-1 mb-0.5">
                            <MapPin className="size-3 shrink-0" />
                            {midia.cidade_evento}
                          </p>
                        )}
                        {midia.nome_convidado && (
                          <p className="text-white text-xs font-semibold truncate flex items-center gap-1">
                            <User className="size-3 text-white/70 shrink-0" />
                            {midia.nome_convidado}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Large Typography Aesthetics */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left relative py-8 lg:py-0">
          <div className="absolute top-[-10%] right-[-10%] size-80 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            {/* Number hashtag badge */}
            <span className="text-6xl sm:text-7xl font-black font-serif italic text-accent leading-none mb-1 block">
              #{CANDIDATO_INFO.numero}
            </span>

            {/* Giant outlined typography */}
            <h1 className="text-stroke text-7xl sm:text-8xl font-black font-serif uppercase leading-[0.85] tracking-tighter">
              GALERIA
            </h1>
            <h1 className="text-stroke text-7xl sm:text-8xl font-black font-serif uppercase leading-[0.85] tracking-tighter mt-1">
              POLÍTICA
            </h1>

            <p className="mt-8 text-base md:text-lg text-white/80 leading-relaxed max-w-md font-sans">
              Este é o mural oficial de registros de {CANDIDATO_INFO.nome}. Cada clique conta a história da nossa caminhada rumo à Assembleia Legislativa!
            </p>

            <Link
              href="/enviar"
              className="mt-8 inline-flex items-center gap-2 bg-accent text-primary px-7 py-3.5 rounded-full font-black text-sm shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Camera className="size-5" />
              Enviar meu registro
              <ChevronRight className="size-4" />
            </Link>
          </motion.div>
        </div>

      </div>

      {/* Simple decorative footer */}
      <div className="w-full max-w-7xl flex items-center justify-between text-xs text-white/40 border-t border-white/10 pt-6 mt-10 z-10">
        <span>© 2026 Galeria Colaborativa</span>
        <Link href="/enviar" className="hover:underline font-bold text-accent">Enviar novo registro →</Link>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedMidia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between"
          >
            {/* Barra Superior do Modal */}
            <div className="flex justify-between items-center p-4 z-10">
              <button
                onClick={() => setSelectedMidia(null)}
                className="p-2.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"
                title="Fechar"
              >
                <X className="size-6" />
              </button>

              <div className="text-center text-white">
                <span className="text-xs font-bold text-gold block">
                  {CANDIDATO_INFO.nome} 55.123
                </span>
                <span className="text-[11px] text-white/70">
                  {selectedMidia.cidade_evento || "Registro da Campanha"}
                </span>
              </div>

              <button
                onClick={() => handleDownloadSingle(selectedMidia)}
                className="flex items-center gap-2 bg-primary text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-lg hover:bg-primary/90 transition-all"
              >
                <Download className="size-4" />
                Baixar Foto
              </button>
            </div>

            {/* Conteúdo Central da Imagem */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
              {selectedMidia.tipo === "video" ? (
                <video
                  src={selectedMidia.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full rounded-2xl outline-none shadow-2xl"
                />
              ) : (
                <img
                  src={selectedMidia.url}
                  alt="Mídia visualizada em alta resolução"
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                />
              )}
            </div>

            {/* Rodapé do Modal com Nome e Mensagem */}
            {(selectedMidia.nome_convidado || selectedMidia.mensagem) && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-gradient-to-t from-black via-black/90 to-transparent p-6 pt-10 text-white"
              >
                <div className="max-w-2xl mx-auto text-center sm:text-left bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  {selectedMidia.nome_convidado && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="size-7 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                        <User className="size-4" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">
                          {selectedMidia.nome_convidado}
                        </p>
                        {selectedMidia.cidade_evento && (
                          <p className="text-[11px] text-gold font-medium">
                            {selectedMidia.cidade_evento}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {selectedMidia.mensagem && (
                    <p className="text-white/90 font-sans leading-relaxed text-sm italic mt-2">
                      &ldquo;{selectedMidia.mensagem}&rdquo;
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
