import fs from "node:fs";

export const readFile = (path) => {
  const conteudo = fs.readFileSync(`${process.env.HOME}/${path}`, "utf8");
  console.log(conteudo);
};

export const fileMetadata = (path) => {
  const stats = fs.statSync(`${process.env.HOME}/${path}`, "utf8");

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
