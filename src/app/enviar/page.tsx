"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle2, ArrowLeft, Image as ImageIcon, Loader2, Sparkles, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
      
      // Validação de tamanho no front-end
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
        const fileName = `campanha_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const isVideo = file.type.startsWith("video/");
        
        // Tentamos o bucket "politica-uploads" e fazemos fallback para "casamento-uploads" se necessário
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

        // Recupera URL pública
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);

        // Combina cidade/evento na mensagem se fornecido
        const mensagemCompleta = [
          cidadeEvento ? `[Evento/Local: ${cidadeEvento}]` : null,
          mensagem ? mensagem : null
        ].filter(Boolean).join(" ");

        // Insere na tabela 'midias'
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
      setState("error");
      setErrorMessage(error.message || "Ocorreu um erro ao enviar suas mídias. Tente novamente.");
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center pb-20 pt-6 px-4">
      {/* Header */}
      <div className="w-full max-w-md flex items-center mb-8 relative">
        <Link href="/" className="p-2 -ml-2 text-foreground/60 hover:text-primary absolute left-0 transition-colors">
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-xl font-serif font-bold text-primary w-full text-center">
          Enviar Registros da Campanha
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {state === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center mt-12 max-w-sm bg-white p-8 rounded-3xl shadow-xl border border-foreground/5"
          >
            <div className="size-20 bg-secondary/15 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="size-10 text-secondary" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-primary mb-3">Foto Recebida!</h2>
            <p className="text-foreground/75 mb-8 leading-relaxed text-sm font-sans">
              Muito obrigado por fortalecer nossa caminhada! Seu registro já foi enviado para a equipe de mídias da campanha.
            </p>
            <button
              onClick={() => setState("idle")}
              className="bg-primary text-white py-3.5 px-6 rounded-xl font-semibold shadow-md shadow-primary/20 w-full mb-3 transition-colors hover:bg-primary/90"
            >
              Enviar Mais Fotos/Vídeos
            </button>
            <Link
              href="/galeria"
              className="text-primary font-semibold text-sm p-3 block hover:underline"
            >
              Ver Galeria de Mídias
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-md flex flex-col gap-5"
          >
            {/* Form de identificação e mensagem */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-foreground/5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">
                  Seu Nome ou Perfil <span className="text-foreground/40 font-normal">(Opcional)</span>
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Maria Silva (@maria_silva)"
                  className="w-full bg-background/50 border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">
                  Cidade / Evento <span className="text-foreground/40 font-normal">(Opcional)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cidadeEvento}
                    onChange={(e) => setCidadeEvento(e.target.value)}
                    placeholder="Ex: Comício no Centro / Carreata Bairro Sul"
                    className="w-full bg-background/50 border border-foreground/10 rounded-xl pl-10 pr-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
                  />
                  <MapPin className="size-4 text-foreground/40 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">
                  Mensagem de Apoio <span className="text-foreground/40 font-normal">(Opcional)</span>
                </label>
                <textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Deixe um recado de apoio para o candidato ou equipe..."
                  rows={2}
                  className="w-full bg-background/50 border border-foreground/10 rounded-xl px-4 py-3 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none text-sm"
                />
              </div>
            </div>

            {/* Input de Arquivos */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-foreground/5 flex flex-col gap-4">
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
                className="w-full border-2 border-dashed border-primary/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 bg-primary/5 text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
              >
                <UploadCloud className="size-9" />
                <div className="text-center">
                  <span className="font-bold block text-base mb-0.5">Toque para escolher fotos e vídeos</span>
                  <span className="text-xs text-foreground/60">Fotos (até 15MB) • Vídeos (até 50MB)</span>
                </div>
              </button>

              {/* Lista de Preview */}
              {files.length > 0 && (
                <div className="flex flex-col gap-2 mt-1">
                  <span className="text-sm font-semibold text-foreground/80">Arquivos selecionados ({files.length})</span>
                  <div className="max-h-48 overflow-y-auto pr-1 flex flex-col gap-2 hide-scrollbar">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-background rounded-xl p-2.5 border border-foreground/5">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                            <ImageIcon className="size-4 text-primary" />
                          </div>
                          <span className="text-xs font-medium truncate text-foreground/90">{file.name}</span>
                        </div>
                        <button
                          onClick={() => removeFile(idx)}
                          disabled={state === "uploading"}
                          className="p-1.5 text-foreground/40 hover:text-red-500 transition-colors text-sm font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ações e Feedback */}
            {state === "error" && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 font-medium">
                {errorMessage}
              </div>
            )}

            <div>
              <button
                onClick={handleUpload}
                disabled={files.length === 0 || state === "uploading"}
                className="w-full bg-primary text-white py-4 px-6 rounded-2xl font-bold shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 text-base"
              >
                {state === "uploading" ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Enviando para a Campanha... {progress}%
                  </>
                ) : (
                  <>
                    <Sparkles className="size-5" />
                    Enviar Fotos/Vídeos
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}