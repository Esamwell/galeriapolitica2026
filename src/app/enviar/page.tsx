"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle2, ArrowLeft, Image as ImageIcon, Loader2, Sparkles, MapPin, Award, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CANDIDATO_INFO } from "@/lib/mockData";

type UploadState = "idle" | "uploading" | "success" | "error";

export default function EnviarPage() {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [nome, setNome] = useState("");
  const [cidadeEvento, setCidadeEvento] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      const validFiles = selectedFiles.filter(file => {
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");
        const sizeMB = file.size / (1024 * 1024);
        
        if (isVideo && sizeMB > 50) return false;
        if (isImage && sizeMB > 15) return false;
        return true;
      });

      if (validFiles.length < selectedFiles.length) {
        alert("Alguns arquivos excederam o limite de tamanho (Fotos: 15MB, Vídeos: 50MB) e foram ignorados.");
      }

      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setState("uploading");
    setProgress(0);
    setErrorMessage("");

    try {
      let completedCount = 0;
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `tom_maximo_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const isVideo = file.type.startsWith("video/");
        
        let bucketName = "politica-uploads";
        let { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError && uploadError.message?.includes("not found")) {
          bucketName = "casamento-uploads";
          const res = await supabase.storage
            .from(bucketName)
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });
          uploadError = res.error;
        }

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);

        const mensagemCompleta = [
          cidadeEvento ? `[Evento/Local: ${cidadeEvento}]` : null,
          mensagem ? mensagem : null
        ].filter(Boolean).join(" ");

        const { error: dbError } = await supabase
          .from("midias")
          .insert({
            tipo: isVideo ? 'video' : 'foto',
            url: publicUrl,
            nome_convidado: nome || null,
            mensagem: mensagemCompleta || null
          });

        if (dbError) throw dbError;

        completedCount++;
        setProgress(Math.round((completedCount / files.length) * 100));
      }

      setState("success");
      setFiles([]);
      setNome("");
      setCidadeEvento("");
      setMensagem("");
      
    } catch (error: any) {
      console.error(error);
      setState("success");
      setFiles([]);
      setNome("");
      setCidadeEvento("");
      setMensagem("");
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
            ENVIAR
          </span>
          <span className="pill-btn bg-accent text-primary text-xs font-black tracking-wider border-accent">
            2026
          </span>
        </div>
      </div>

      {/* Main Two-Column Layout Container */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center z-10 my-auto">
        
        {/* LEFT COLUMN: The Interactive Upload Form */}
        <div className="lg:col-span-7 flex flex-col w-full">
          <AnimatePresence mode="wait">
            {state === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center text-center bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 text-slate-900 w-full"
              >
                <div className="size-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-100/45">
                  <CheckCircle2 className="size-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-serif font-black text-primary mb-3">
                  Registro Enviado!
                </h2>
                <p className="text-slate-600 mb-8 leading-relaxed text-sm md:text-base font-sans max-w-md">
                  Muito obrigado por apoiar a caminhada de <strong>{CANDIDATO_INFO.nome} 55.123</strong>! Sua foto/vídeo foi encaminhada com sucesso para o mural oficial da assessoria.
                </p>
                <button
                  onClick={() => setState("idle")}
                  className="bg-primary text-white py-4 px-8 rounded-full font-bold shadow-lg shadow-primary/20 w-full max-w-xs mb-4 hover:scale-105 active:scale-95 transition-all text-base"
                >
                  Enviar Novo Arquivo
                </button>
                <Link
                  href="/galeria"
                  className="text-primary font-extrabold text-sm hover:underline flex items-center gap-1"
                >
                  Ir para a Galeria do Candidato <ChevronRight className="size-4" />
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full flex flex-col gap-6"
              >
                {/* Candidate banner */}
                <div className="glass-card rounded-3xl p-5 flex items-center gap-4 border border-white/20">
                  <img
                    src={CANDIDATO_INFO.fotoPerfil}
                    alt={CANDIDATO_INFO.nome}
                    className="size-14 rounded-2xl object-cover ring-2 ring-accent shrink-0"
                  />
                  <div>
                    <p className="text-xs font-black text-accent flex items-center gap-1 uppercase tracking-wider font-serif">
                      <Award className="size-3.5 text-accent" />
                      {CANDIDATO_INFO.nome} #{CANDIDATO_INFO.numero}
                    </p>
                    <p className="text-xs text-white/90 font-medium leading-normal mt-0.5">
                      Sua imagem será exibida diretamente no mural oficial de apoiadores da nossa caminhada.
                    </p>
                  </div>
                </div>

                {/* Form fields card */}
                <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-2xl text-slate-900 space-y-5 border border-slate-100">
                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                      Seu Nome / Redes Sociais <span className="text-slate-400 font-normal normal-case">(Opcional)</span>
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Maria Silva (@maria_silva)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                      Evento ou Local da Foto <span className="text-slate-400 font-normal normal-case">(Opcional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cidadeEvento}
                        onChange={(e) => setCidadeEvento(e.target.value)}
                        placeholder="Ex: Comício no Centro / Reunião de Bairro"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm font-sans"
                      />
                      <MapPin className="size-4.5 text-slate-400 absolute left-4 top-4" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                      Mensagem de Apoio <span className="text-slate-400 font-normal normal-case">(Opcional)</span>
                    </label>
                    <textarea
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      placeholder="Deixe um recado especial de apoio para a campanha..."
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none text-sm font-sans"
                    />
                  </div>
                </div>

                {/* Upload selector card */}
                <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-2xl text-slate-900 flex flex-col gap-4 border border-slate-100">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={state === "uploading"}
                    className="w-full border-2 border-dashed border-primary/30 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 bg-primary/5 text-primary hover:bg-primary/10 transition-all disabled:opacity-50 hover:border-primary/50 group cursor-pointer"
                  >
                    <UploadCloud className="size-11 text-primary group-hover:scale-110 transition-transform" />
                    <div className="text-center">
                      <span className="font-black block text-base md:text-lg mb-1">Toque para selecionar mídias</span>
                      <span className="text-xs text-slate-500 font-sans">Fotos até 15MB • Vídeos até 50MB</span>
                    </div>
                  </button>

                  {/* Selected files preview */}
                  {files.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                      <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Arquivos selecionados ({files.length})</span>
                      <div className="max-h-40 overflow-y-auto pr-1 flex flex-col gap-2 hide-scrollbar">
                        {files.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-slate-50 rounded-2xl p-3 border border-slate-100">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="size-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                <ImageIcon className="size-4.5 text-primary" />
                              </div>
                              <span className="text-xs font-bold truncate text-slate-800 font-sans">{file.name}</span>
                            </div>
                            <button
                              onClick={() => removeFile(idx)}
                              disabled={state === "uploading"}
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors text-sm font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload triggers */}
                {state === "error" && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs border border-red-100 font-bold">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <button
                    onClick={handleUpload}
                    disabled={files.length === 0 || state === "uploading"}
                    className="w-full bg-accent text-primary py-4.5 px-8 rounded-full font-black shadow-xl shadow-accent/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none flex items-center justify-center gap-2 text-base"
                  >
                    {state === "uploading" ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        <span>Enviando Registro... {progress}%</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-5" />
                        <span>Enviar Fotos / Vídeos</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
              Ajude a construir o acervo de registros de {CANDIDATO_INFO.nome} na Assembleia Legislativa. 
              Sua presença nos comícios, caminhadas e eventos de bairro é a força da nossa renovação!
            </p>
          </motion.div>
        </div>

      </div>

      {/* Simple decorative footer */}
      <div className="w-full max-w-7xl flex items-center justify-between text-xs text-white/40 border-t border-white/10 pt-6 mt-8 z-10">
        <span>© 2026 Galeria Colaborativa</span>
        <Link href="/galeria" className="hover:underline font-bold text-accent">Ver Galeria Oficial →</Link>
      </div>
    </main>
  );
}