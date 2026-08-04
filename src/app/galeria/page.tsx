"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, X, Image as ImageIcon, Download, Film, User, Camera, MapPin, Sparkles } from "lucide-react";
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
    <main className="min-h-screen bg-background flex flex-col pb-20 pt-6 px-4">
      {/* Header Institucional */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-foreground/10">
        <Link href="/" className="p-2 -ml-2 text-foreground/60 hover:text-primary transition-colors flex items-center gap-1 font-bold text-xs">
          <ArrowLeft className="size-5" />
          <span>Início</span>
        </Link>

        <div className="text-center">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-extrabold uppercase mb-1">
            <span>{CANDIDATO_INFO.nome} • {CANDIDATO_INFO.numero}</span>
          </div>
          <h1 className="text-2xl font-serif font-extrabold text-foreground">
            Galeria da Campanha
          </h1>
          <p className="text-xs font-sans text-foreground/60 font-medium">
            {midias.length} {midias.length === 1 ? 'registro de apoiador' : 'registros de apoiadores'}
          </p>
        </div>

        <Link
          href="/enviar"
          className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center gap-1.5"
        >
          <Camera className="size-4" />
          <span className="hidden sm:inline">Enviar Foto</span>
        </Link>
      </div>

      {/* Grid estilo Flickr / Pinterest */}
      <div className="w-full max-w-6xl mx-auto">
        {isLoading ? (
          // Skeleton Loading
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-full bg-foreground/5 rounded-2xl animate-pulse"
                style={{ height: `${Math.floor(Math.random() * 150) + 200}px` }}
              />
            ))}
          </div>
        ) : midias.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-white rounded-3xl border border-foreground/5 shadow-sm max-w-md mx-auto">
            <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
              <ImageIcon className="size-8" />
            </div>
            <h2 className="text-xl font-serif font-bold text-foreground mb-2">Ainda sem fotos na galeria</h2>
            <p className="text-sm text-foreground/60 mb-6 max-w-xs leading-relaxed">
              Seja o primeiro apoiador a registrar e enviar uma foto ou vídeo da campanha do Tom Máximo!
            </p>
            <Link
              href="/enviar"
              className="bg-primary text-white py-3 px-6 rounded-xl font-bold shadow-md shadow-primary/20 transition-colors hover:bg-primary/90"
            >
              Enviar a primeira foto
            </Link>
          </div>
        ) : (
          // Masonry Grid
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            <AnimatePresence>
              {midias.map((midia) => (
                <motion.div
                  key={midia.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  layout
                  onClick={() => setSelectedMidia(midia)}
                  className="relative cursor-pointer rounded-2xl overflow-hidden group bg-slate-900 break-inside-avoid border border-foreground/10 shadow-sm hover:shadow-xl transition-all"
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
                      "{selectedMidia.mensagem}"
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
