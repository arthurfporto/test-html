// tests/valida-html.test.js
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const respostasDir = path.join(__dirname, "../respostas");

describe("Correção da Atividade HTML", () => {
  let htmlContent;
  let dom;
  let document;

  it("Deve existir apenas um arquivo na pasta respostas", () => {
    // Filtra para ignorar arquivos ocultos como .gitkeep
    const files = fs
      .readdirSync(respostasDir)
      .filter((file) => !file.startsWith("."));

    expect(
      files.length,
      "A pasta respostas deve conter exatamente um arquivo.",
    ).toBe(1);
    expect(
      files[0].endsWith(".html"),
      "O arquivo deve ter a extensão .html",
    ).toBe(true);

    // Lê o conteúdo do arquivo para os próximos testes
    const filePath = path.join(respostasDir, files[0]);
    htmlContent = fs.readFileSync(filePath, "utf-8");
  });

  it("Deve ser um HTML válido e estruturado", () => {
    // Carrega o HTML no JSDOM
    dom = new JSDOM(htmlContent);
    document = dom.window.document;

    // Verifica Doctype (indício básico de HTML5 correto)
    const doctype = dom.window.document.doctype;
    expect(
      doctype,
      "O arquivo deve ter a declaração <!DOCTYPE html>",
    ).not.toBeNull();
    expect(doctype.name).toBe("html");

    // Verifica tags base
    expect(
      document.querySelector("html"),
      "Deve conter a tag <html>",
    ).not.toBeNull();
    expect(
      document.querySelector("head"),
      "Deve conter a tag <head>",
    ).not.toBeNull();
    expect(
      document.querySelector("body"),
      "Deve conter a tag <body>",
    ).not.toBeNull();
  });

  it("O body deve conter APENAS uma tag H1 e uma tag P", () => {
    if (!document) throw new Error("Documento não carregado");

    const bodyChildren = Array.from(document.body.children);

    // Filtra tags de script que o LiveServer ou extensões podem injetar, focando no conteúdo do aluno
    const contentTags = bodyChildren.filter((el) => el.tagName !== "SCRIPT");

    expect(
      contentTags.length,
      "O body deve ter exatamente 2 elementos filhos diretos.",
    ).toBe(2);

    const hasH1 = contentTags.some((el) => el.tagName === "H1");
    const hasP = contentTags.some((el) => el.tagName === "P");

    expect(hasH1, "Deve conter uma tag <H1>").toBe(true);
    expect(hasP, "Deve conter uma tag <P>").toBe(true);
  });
});
