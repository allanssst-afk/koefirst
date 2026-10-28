"use client";

import { useRef, useState } from "react";
import { Download, HardDrive, Upload } from "lucide-react";
import { exportarBanco, importarBanco } from "@/db";

/**
 * O progresso fica salvo só neste aparelho. Daqui dá para baixar um backup (.db)
 * e carregar o backup em outro aparelho — por exemplo, levar o progresso do Mac para o celular.
 */
export function BackupCard() {
  const input = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  const baixar = () => {
    const bytes = exportarBanco();
    const blob = new Blob([new Uint8Array(bytes)], { type: "application/vnd.sqlite3" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `koefirst-${new Date().toISOString().slice(0, 10)}.db`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    setMsg("Backup baixado.");
  };

  const carregar = async (file: File | undefined) => {
    if (!file) return;
    if (!confirm("Substituir o progresso deste aparelho pelo do arquivo escolhido?")) return;
    try {
      await importarBanco(new Uint8Array(await file.arrayBuffer()));
      location.reload();
    } catch (e) {
      setMsg(String(e instanceof Error ? e.message : e));
    }
  };

  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <HardDrive size={16} /> Seu progresso
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Fica salvo neste aparelho. Baixe um backup de vez em quando, ou use-o para levar o progresso para outro
        aparelho.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={baixar} className="flex items-center gap-2 rounded-xl border border-[var(--line)] px-4 py-2 text-sm">
          <Download size={16} /> Baixar backup
        </button>
        <button
          onClick={() => input.current?.click()}
          className="flex items-center gap-2 rounded-xl border border-[var(--line)] px-4 py-2 text-sm"
        >
          <Upload size={16} /> Carregar backup
        </button>
        <input
          ref={input}
          type="file"
          accept=".db,application/vnd.sqlite3,application/x-sqlite3,application/octet-stream"
          className="hidden"
          onChange={(e) => carregar(e.target.files?.[0])}
        />
      </div>
      {msg && <p className="mt-2 text-xs text-[var(--muted)]">{msg}</p>}
    </section>
  );
}
