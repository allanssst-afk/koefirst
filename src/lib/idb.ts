/** IndexedDB mínimo: guarda o arquivo do banco SQLite (bytes) no próprio aparelho. */

const NOME = "koefirst";
const STORE = "arquivos";
const CHAVE = "banco";

function abrir(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(NOME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function lerBancoSalvo(): Promise<Uint8Array | null> {
  const idb = await abrir();
  return new Promise((resolve, reject) => {
    const req = idb.transaction(STORE).objectStore(STORE).get(CHAVE);
    req.onsuccess = () => resolve((req.result as Uint8Array | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function gravarBanco(bytes: Uint8Array): Promise<void> {
  const idb = await abrir();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(bytes, CHAVE);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
