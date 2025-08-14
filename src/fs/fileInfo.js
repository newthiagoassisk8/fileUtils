import fs from "fs";

const readFile = (path) => {
  const conteudo = fs.readFileSync(`${process.env.HOME}/${path}`, "utf8");
  console.log(conteudo);
};

const fileMetadata = (path) => {
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
export { readFile, fileMetadata };
