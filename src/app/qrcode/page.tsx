"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import { ArrowLeft, Printer, QrCode, Award } from "lucide-react";
import { CANDIDATO_INFO } from "@/lib/mockData";

export default function QRCodePage() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.origin);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 left-6 print:hidden">
        <Link href="/" className="p-2 text-foreground/60 hover:text-primary transition-colors inline-block">
          <ArrowLeft className="size-6" />
        </Link>
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col items-center max-w-md w-full text-center border border-foreground/10 print:shadow-none print:border-4 print:border-black print:rounded-none">
        
        {/* Badge Oficial */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider mb-4 print:border print:border-black print:text-black">
          <QrCode className="size-4" />
          <span>Material Oficial de Campanha • 2026</span>
        </div>

        {/* Foto & Identificação do Candidato no QR Code de Impressão */}
        <div className="flex items-center gap-3 mb-4 text-left border-b border-foreground/10 pb-4 w-full justify-center">
          <img
            src={CANDIDATO_INFO.fotoPerfil}
            alt={CANDIDATO_INFO.nome}
            className="size-14 rounded-full object-cover object-top ring-2 ring-primary shrink-0 print:ring-black"
          />
          <div>
            <h1 className="font-serif text-2xl font-black text-foreground leading-tight print:text-black">
              {CANDIDATO_INFO.nome}
            </h1>
            <div className="flex items-center gap-1 text-primary font-bold text-xs print:text-black">
              <Award className="size-3.5 text-gold print:text-black" />
              <span>{CANDIDATO_INFO.cargo} • {CANDIDATO_INFO.numero}</span>
            </div>
          </div>
        </div>

        <p className="text-foreground/80 font-sans text-sm mb-6 print:text-black leading-relaxed font-medium">
          Aponte a câmera do seu celular para enviar suas fotos e vídeos dos comícios, carreatas e reuniões!
        </p>

        {/* Quadro do QR Code */}
        <div className="bg-white p-4 rounded-2xl shadow-inner border border-foreground/15 mb-6 print:border-2 print:border-black">
          {url ? (
            <QRCodeSVG
              value={url}
              size={240}
              level="H"
              fgColor="#1E40AF"
              bgColor="#ffffff"
            />
          ) : (
            <div className="w-[240px] h-[240px] bg-foreground/5 animate-pulse rounded-lg" />
          )}
        </div>

        <p className="text-xs text-foreground/60 font-mono mb-6 print:text-black print:text-sm font-bold">
          {url || "https://galeriapolitica2026.com"}
        </p>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 bg-primary text-white py-4 px-8 rounded-2xl font-extrabold shadow-lg hover:bg-primary/90 transition-all print:hidden w-full text-sm"
        >
          <Printer className="size-4" />
          Imprimir QR Code para Banners e Panfletos
        </button>
      </div>
      
      {/* Estilos para Impressão limpa */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:text-black { color: black !important; }
        }
      `}} />
    </main>
  );
}
