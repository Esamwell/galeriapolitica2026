"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, X, Image as ImageIcon, Download, Film, User, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { saveAs } from "file-saver";

type Midia = {
  id: string;
  tipo: "foto" | "video";
  url: string;
  nome_convidado: string | null;
  mensagem: string | null;
  criado_em: string;
};

export default function GaleriaPage() {
  const [midias, setMidias] = useState<Midia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMidia, setSelectedMidia] = useState<Midia | null>(null);

  const fetchMidias = async () => {
    try {
      const { data, error } = await supabase
        .from("midias")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) throw error;
      if (data) setMidias(data as Midia[]);
    } catch (error) {
      console.error("Erro ao buscar mídias da campanha:", error);
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
          setMidias((prev) => [payload.new as Midia, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDownloadSingle = async (midia: Midia) => {
    try {
      const response = await fetch(midia.url);
      const blob = await response.blob();
      const ext = midia.tipo === 'video' ? 'mp4' : 'jpg';
      const fileName = `campanha_${midia.nome_convidado ? midia.nome_convidado.replace(/[^a-z0-9]/gi, '_') : 'apoiador'}_${Date.now()}.${ext}`;
      saveAs(blob, fileName);
    } catch (err) {
      console.error("Erro ao baixar arquivo:", err);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col pb-20 pt-6 px-4">
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between mb-8">
        <Link href="/" className="p-2 -ml-2 text-foreground/60 hover:text-primary transition-colors">
          <ArrowLeft className="size-6" />
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-primary">Galeria da Campanha</h1>
          <p className="text-xs font-sans text-foreground/60 font-medium">
            {midias.length} {midias.length === 1 ? 'registro enviado por apoiadores' : 'registros enviados por apoiadores'}
          </p>
        </div>
        <Link
          href="/enviar"
          className="bg-primary text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md hover:bg-primary/90 transition-all flex items-center gap-1.5"
        >
          <Camera className="size-4" />
          <span className="hidden sm:inline">Enviar Foto</span>
        </Link>
      </div>

      {/* Grid */}
      <div className="w-full max-w-6xl mx-auto">
        {isLoading ? (
          // Skeleton Loading
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="w-full bg-foreground/5 rounded-2xl animate-pulse"
                style={{ height: `${Math.floor(Math.random() * 150) + 150}px` }}
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
              Seja o primeiro apoiador a registrar e enviar uma foto ou vídeo da campanha!
            </p>
            <Link
              href="/enviar"
              className="bg-primary text-white py-3 px-6 rounded-xl font-semibold shadow-md shadow-primary/20 transition-colors hover:bg-primary/90"
            >
              Enviar a primeira foto
            </Link>
          </div>
        ) : (
          // Masonry Grid Estilo Flickr
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3.5 space-y-3.5">
            <AnimatePresence>
              {midias.map((midia) => (
                <motion.div
                  key={midia.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  layout
                  onClick={() => setSelectedMidia(midia)}
                  className="relative cursor-pointer rounded-2xl overflow-hidden group bg-slate-900/5 break-inside-avoid border border-foreground/5 hover:shadow-lg transition-all"
                >
                  {midia.tipo === "video" ? (
                    <>
                      <video
                        src={midia.url}
                        className="w-full h-auto object-cover pointer-events-none"
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="bg-white/25 backdrop-blur-md p-3.5 rounded-full text-white shadow-lg">
                          <Play className="size-6 fill-white" />
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-white text-[10px] font-semibold flex items-center gap-1">
                        <Film className="size-3" /> Vídeo
                      </div>
                    </>
                  ) : (
                    <img
                      src={midia.url}
                      alt="Registro de mídia da campanha"
                      loading="lazy"
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  
                  {/* Etiqueta de nome do apoiador */}
                  {midia.nome_convidado && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
                      <p className="text-white text-xs font-semibold truncate flex items-center gap-1">
                        <User className="size-3 text-primary-light" />
                        {midia.nome_convidado}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lightbox / Modal Modal */}
      <AnimatePresence>
        {selectedMidia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center p-4 z-10">
              <button
                onClick={() => setSelectedMidia(null)}
                className="p-2.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-colors"
                title="Fechar"
              >
                <X className="size-6" />
              </button>

              <button
                onClick={() => handleDownloadSingle(selectedMidia)}
                className="flex items-center gap-2 bg-primary text-white font-semibold text-xs px-4 py-2.5 rounded-full shadow-lg hover:bg-primary/90 transition-all"
              >
                <Download className="size-4" />
                Baixar Mídia
              </button>
            </div>

            {/* Media Content */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
              {selectedMidia.tipo === "video" ? (
                <video
                  src={selectedMidia.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full rounded-xl outline-none shadow-2xl"
                />
              ) : (
                <img
                  src={selectedMidia.url}
                  alt="Mídia visualizada em alta resolução"
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                />
              )}
            </div>

            {/* Metadata Bottom */}
            {(selectedMidia.nome_convidado || selectedMidia.mensagem) && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-gradient-to-t from-black via-black/90 to-transparent p-6 pt-10 text-white"
              >
                <div className="max-w-2xl mx-auto text-center sm:text-left">
                  {selectedMidia.nome_convidado && (
                    <p className="font-serif font-bold text-lg text-primary-light mb-1 flex items-center justify-center sm:justify-start gap-2">
                      <User className="size-4 text-accent" />
                      {selectedMidia.nome_convidado}
                    </p>
                  )}
                  {selectedMidia.mensagem && (
                    <p className="text-white/85 font-sans leading-relaxed text-sm md:text-base italic">
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
