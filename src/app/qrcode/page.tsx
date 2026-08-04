"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import { ArrowLeft, Printer, QrCode } from "lucide-react";

export default function QRCodePage() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    // Pega a URL atual e aponta para a home
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

      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col items-center max-w-md w-full text-center border border-foreground/5 print:shadow-none print:border-2 print:border-black">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 print:hidden">
          <QrCode className="size-3.5" />
          <span>Material Oficial da Campanha</span>
        </div>

        <h1 className="font-serif text-3xl font-extrabold text-primary mb-2 print:text-black print:text-4xl">
          Galeria Política 2026
        </h1>
        <p className="text-foreground/75 font-sans text-sm mb-6 print:text-black leading-relaxed">
          Aponte a câmera do seu celular para enviar fotos e vídeos dos nossos comícios e caminhadas!
        </p>

        <div className="bg-white p-4 rounded-2xl shadow-inner border border-foreground/10 mb-6 print:border-black">
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

        <p className="text-xs text-foreground/50 font-mono mb-6 print:text-black print:text-sm">
          {url || "https://galeriapolitica2026.com"}
        </p>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 bg-primary text-white py-3.5 px-8 rounded-xl font-bold shadow-md hover:bg-primary/90 transition-all print:hidden w-full text-sm"
        >
          <Printer className="size-4" />
          Imprimir QR Code para Banners e Panfletos
        </button>
      </div>
      
      {/* Estilos para impressão */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          .print\\:text-black { color: black !important; }
        }
      `}} />
    </main>
  );
}
