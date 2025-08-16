import {
  renameSync,
  readFileSync,
  readdirSync,
  statSync,
  copyFileSync,
  unlinkSync,
} from "node:fs";

export const readFile = (path) => {
  const conteudo = readFileSync(`${process.env.HOME}/${path}`, "utf8");
  console.log(conteudo);
};

export const readFolder = (path) => {
  const conteudo = readdirSync(`${process.env.HOME}/${path}`, "utf8");
  return conteudo;
};

export const fileMetadata = (path) => {
  const stats = statSync(`${process.env.HOME}/${path}`, "utf8");

  let obj = {
    caminho: `${process.env.HOME}/${path}`,
    tamanhoKB: (stats.size / 1024).toFixed(2) + " KB",
    criadoEm: stats.birthtime,
    modificadoEm: stats.mtime,
    donoUID: stats.uid,
    donoGID: stats.gid,
    permissoes: stats.mode.toString(8),
  };
  console.log(obj);
};

export async function moveFile(from, to, onErr = null) {
  try {
    await renameSync(from, to);
  } catch (err) {
    if (err.code === "EXDEV") {
      await copyFileSync(from, to);
      console.log("chegou aqui");
      await unlinkSync(from);
    }
    if (typeof onErr === "function") {
      onErr(err);
    }
    console.error("Erro ao mover o arquivo:", err);
  }
}
