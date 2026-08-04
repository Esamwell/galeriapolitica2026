"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { DownloadCloud, ArrowLeft, Loader2, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CANDIDATO_INFO, MOCK_MIDIAS, MidiaMock } from "@/lib/mockData";

function AdminContent() {
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passError, setPassError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [totalCount, setTotalCount] = useState<number>(MOCK_MIDIAS.length);

  useEffect(() => {
    const chave = searchParams.get("chave");
    if (chave === "politica2026" || chave === "casamento2026" || chave === "tom55123") {
      setIsAuthenticated(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchCount = async () => {
        try {
          const { count, error } = await supabase
            .from("midias")
            .select("id", { count: "exact", head: true });
          if (!error && count && count > 0) {
            setTotalCount(count);
          } else {
            setTotalCount(MOCK_MIDIAS.length);
          }
        } catch {
          setTotalCount(MOCK_MIDIAS.length);
        }
      };
      fetchCount();
    }
  }, [isAuthenticated]);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passcode.trim().toLowerCase();
    if (cleanPass === "politica2026" || cleanPass === "casamento2026" || cleanPass === "tom55123") {
      setIsAuthenticated(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  const downloadAll = async () => {
    setIsDownloading(true);
    setProgress(0);
    setStatusText("Buscando acervo de mídias do candidato...");

    try {
      let midiasList: MidiaMock[] = [];
      
      const { data, error } = await supabase
        .from("midias")
        .select("*")
        .order("criado_em", { ascending: false });

      if (!error && data && data.length > 0) {
        midiasList = data as MidiaMock[];
      } else {
        midiasList = MOCK_MIDIAS;
      }

      setStatusText("Criando arquivo ZIP e gerando relatório oficial...");
      const zip = new JSZip();
      
      // Cria o PDF do relatório da campanha
      const doc = new jsPDF();
      doc.setFont("helvetica");
      doc.setFontSize(18);
      doc.text(`Campanha ${CANDIDATO_INFO.nome} - Deputado Estadual ${CANDIDATO_INFO.numero}`, 20, 20);
      doc.setFontSize(10);
      doc.text(`Relatorio de Registros de Apoiadores | Gerado em: ${new Date().toLocaleString("pt-BR")}`, 20, 28);
      doc.text(`Total de arquivos no acervo: ${midiasList.length}`, 20, 34);
      
      let cursorY = 46;
      const margin = 20;
      const pageHeight = doc.internal.pageSize.height;

      let count = 0;
      for (const midia of midiasList) {
        // Mensagens no PDF
        if (midia.mensagem && midia.mensagem.trim() !== "") {
          const nomeStr = midia.nome_convidado ? midia.nome_convidado : "Apoiador Anônimo";
          const dataStr = new Date(midia.criado_em).toLocaleDateString("pt-BR");
          const localStr = midia.cidade_evento ? ` (${midia.cidade_evento})` : "";
          const title = `Apoiador: ${nomeStr}${localStr} - ${dataStr}:`;
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          
          if (cursorY + 10 > pageHeight - margin) {
            doc.addPage();
            cursorY = 20;
          }
          
          doc.text(title, margin, cursorY);
          cursorY += 6;
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          
          const lines = doc.splitTextToSize(`"${midia.mensagem}"`, 170);
          
          if (cursorY + (lines.length * 5) > pageHeight - margin) {
            doc.addPage();
            cursorY = 20;
          }
          
          doc.text(lines, margin, cursorY);
          cursorY += (lines.length * 5) + 8;
        }

        // Baixa / anexa o arquivo de mídia
        try {
          setStatusText(`Processando mídia ${count + 1} de ${midiasList.length}...`);
          
          const response = await fetch(midia.url);
          const blob = await response.blob();
          
          const date = new Date(midia.criado_em).getTime();
          const guestName = midia.nome_convidado ? midia.nome_convidado.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'apoiador';
          const ext = midia.tipo === 'video' ? 'mp4' : 'png'; 
          
          const filename = `tom_maximo_55123_${guestName}_${date}.${ext}`;
          
          zip.file(filename, blob);
          count++;
          setProgress(Math.round((count / midiasList.length) * 100));
        } catch (err) {
          console.error("Erro ao processar mídia", midia.url, err);
        }
      }

      // Adiciona o PDF ao ZIP
      setStatusText("Anexando relatório impresso em PDF...");
      const pdfBlob = doc.output('blob');
      zip.file(`0_Relatorio_Apoiadores_${CANDIDATO_INFO.nome.replace(/\s+/g, '_')}.pdf`, pdfBlob);

      setStatusText("Finalizando compactação em alta qualidade...");
      const content = await zip.generateAsync({ type: "blob" });
      
      saveAs(content, `Acervo_Mídias_${CANDIDATO_INFO.nome.replace(/\s+/g, '_')}_55123.zip`);
      setStatusText("Download concluído com sucesso!");
      
    } catch (err) {
      console.error(err);
      setStatusText("Ocorreu um erro ao gerar o arquivo compactado.");
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
      }, 3000);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-foreground/5 max-w-sm w-full flex flex-col items-center">
          <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
            <Lock className="size-7" />
          </div>
          
          <h1 className="font-serif font-bold text-2xl text-foreground mb-1">
            Painel da Assessoria
          </h1>
          <p className="text-xs text-primary font-bold mb-4">
            {CANDIDATO_INFO.nome} • {CANDIDATO_INFO.numero}
          </p>
          <p className="text-xs text-foreground/60 mb-6 font-sans">
            Digite a chave da campanha para baixar as mídias e relatórios dos eventos.
          </p>

          <form onSubmit={handleManualLogin} className="w-full space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Chave de acesso (ex: politica2026)"
                className="w-full bg-background border border-foreground/10 rounded-xl px-4 py-3 text-center text-sm font-medium text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              {passError && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">Chave incorreta. Tente "politica2026".</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3.5 px-6 rounded-xl font-bold shadow-md hover:bg-primary/90 transition-all text-sm"
            >
              Acessar Painel
            </button>
          </form>

          <Link href="/" className="text-xs text-foreground/50 underline mt-6 block hover:text-foreground">
            Voltar para o início
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-6 left-6">
        <Link href="/" className="p-2 text-foreground/60 hover:text-primary transition-colors inline-block">
          <ArrowLeft className="size-6" />
        </Link>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col items-center max-w-lg w-full text-center border border-foreground/5 relative overflow-hidden">
        {/* Badge Institucional */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-extrabold uppercase tracking-wider mb-6">
          <ShieldCheck className="size-4" />
          <span>Assessoria • {CANDIDATO_INFO.nome} {CANDIDATO_INFO.numero}</span>
        </div>

        <div className="bg-primary/10 p-5 rounded-2xl mb-6 text-primary">
          <DownloadCloud className="size-12" />
        </div>
        
        <h1 className="font-serif font-extrabold text-3xl text-foreground mb-2">Painel do Acervo</h1>
        <p className="text-foreground/70 font-sans text-sm mb-6 leading-relaxed">
          Baixe todo o acervo de fotos e vídeos enviados pelos apoiadores em alta resolução (.ZIP), acompanhado do relatório oficial em PDF.
        </p>

        <div className="bg-background rounded-2xl p-4 w-full mb-6 border border-foreground/10 flex items-center justify-around">
          <div className="text-center">
            <span className="text-2xl font-bold font-serif text-primary block leading-none">{totalCount}</span>
            <span className="text-[11px] font-sans text-foreground/60 uppercase font-bold">Total de Mídias</span>
          </div>
          <div className="h-8 w-px bg-foreground/10" />
          <div className="flex items-center gap-2 text-secondary text-xs font-bold">
            <CheckCircle2 className="size-4" />
            <span>Pronto para Download</span>
          </div>
        </div>

        <button
          onClick={downloadAll}
          disabled={isDownloading}
          className="w-full bg-primary text-white py-4 px-6 rounded-2xl font-bold text-base shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
        >
          {isDownloading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              {progress}%
            </>
          ) : (
            <>
              <DownloadCloud className="size-5" />
              Baixar Acervo Completo (.ZIP + PDF)
            </>
          )}
        </button>

        {isDownloading && (
          <p className="mt-4 text-xs font-bold text-primary animate-pulse">
            {statusText}
          </p>
        )}
      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>}>
      <AdminContent />
    </Suspense>
  );
}
