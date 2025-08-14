// utils/exportJson.js
import { writeFile, mkdir, stat } from "fs/promises";
import path from "path";


function isLikelyDirHint(p) {
  return p.endsWith("/") || p.endsWith(path.sep);
}

function sanitizeName(s) {
  return s
    .replace(/[^a-z0-9._-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
// TODO: Make it work
/**
 * Baixa JSON de um endpoint e salva em arquivo.
 * @param {string} endpoint - URL do endpoint (ex: https://rickandmortyapi.com/api/character/2)
 * @param {string} outPath  - Caminho do arquivo final OU pasta destino (ex: "./data/" ou "./data/char-2.json")
 * @param {object} options
 * @param {boolean} [options.pretty=true] - Salvar com indentação
 * @param {boolean} [options.overwrite=false] - Sobrescrever se já existir
 * @param {number}  [options.timeoutMs=15000] - Timeout da requisição
 * @param {object}  [options.headers={}] - Headers extras da requisição
 * @returns {Promise<{filePath:string, bytes:number}>}
 */
async function exportJsonFromEndpoint(
  endpoint,
  outPath,
  { pretty = true, overwrite = false, timeoutMs = 15000, headers = {} } = {}
) {
  outPath ?? process.env.PWD;
  if (!endpoint) throw new Error("endpoint é obrigatório");

  // Timeout com AbortController

  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  let res;
  try {
    res = await fetch(endpoint, { headers, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }

  if (!res.ok) {
    throw new Error(`Falha ao baixar: ${res.status} ${res.statusText}`);
  }

  // Checa se é JSON
  const ctype = res.headers.get("content-type") || "";
  if (!/application\/json|\/json\b/i.test(ctype)) {
    // ainda tentamos parsear; alguns endpoints não mandam o header correto
    // mas avisamos num warning (opcional: console.warn)
  }

  const data = await res.json();

  // Define caminho de saída
  let finalPath = outPath;

  // Se for pasta (ou hint com / no final), criamos um nome de arquivo
  let isDir = false;
  try {
    const st = await stat(outPath);
    isDir = st.isDirectory();
  } catch {
    // não existe; se terminar com "/" tratamos como dir
    isDir = isLikelyDirHint(outPath);
  }

  if (isDir) {
    const u = new URL(endpoint);
    // nome baseado em host + pathname
    const base =
      sanitizeName(`${u.host}${u.pathname}`.replace(/\/$/, "")) || "data";
    finalPath = path.join(outPath, `${base}.json`);
  }

  // Garante pasta
  await mkdir(path.dirname(finalPath), { recursive: true });

  // Protege contra overwrite indesejado
  if (!overwrite) {
    try {
      await stat(finalPath);
      throw new Error(
        `Arquivo já existe: ${finalPath} (use { overwrite: true })`
      );
    } catch {
      // não existe, ok
    }
  }

  const jsonStr = JSON.stringify(data, null, pretty ? 2 : 0) + "\n";
  await writeFile(finalPath, jsonStr, "utf8");

  return { filePath: finalPath, bytes: Buffer.byteLength(jsonStr, "utf8") };
}

export { exportJsonFromEndpoint };
