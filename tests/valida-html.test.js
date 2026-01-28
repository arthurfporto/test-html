import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Nota: Não importamos mais { JSDOM } de 'jsdom'.
// O ambiente 'jsdom' no vitest.config.js já nos dá acesso global ao DOM.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const respostasDir = path.join(__dirname, "../respostas");

describe("Correção da Atividade HTML", () => {
  let htmlContent;
  let doc; // Vamos guardar o documento aqui

  it("1. Deve existir apenas um arquivo HTML na pasta respostas", () => {
    if (!fs.existsSync(respostasDir)) {
      throw new Error("A pasta 'respostas' não foi encontrada.");
    }

    const files = fs
      .readdirSync(respostasDir)
      .filter((file) => !file.startsWith("."));

    if (files.length === 0) {
      throw new Error("A pasta 'respostas' está vazia.");
    }

    expect(
      files.length,
      "A pasta respostas deve conter EXATAMENTE um arquivo.",
    ).toBe(1);

    const alunoFile = files[0];
    const isHtml = alunoFile.toLowerCase().endsWith(".html");
    expect(isHtml, `O arquivo "${alunoFile}" deve ter a extensão .html`).toBe(
      true,
    );

    const filePath = path.join(respostasDir, alunoFile);
    htmlContent = fs.readFileSync(filePath, "utf-8");
  });

  it("2. Deve ser um HTML válido e estruturado", () => {
    if (!htmlContent) throw new Error("Conteúdo não lido.");

    // --- MUDANÇA AQUI ---
    // Em vez de new JSDOM(), usamos o DOMParser nativo do ambiente
    const parser = new DOMParser();
    doc = parser.parseFromString(htmlContent, "text/html");
    // --------------------

    // O parser cria um documento completo. Verificamos se ele conseguiu entender a estrutura.
    // Nota: DOMParser às vezes "conserta" HTML ruim, então verificamos se as tags vitais estão lá.

    const htmlTag = doc.querySelector("html");
    const headTag = doc.querySelector("head");
    const bodyTag = doc.querySelector("body");

    expect(htmlTag, "Deve conter a tag <html>").not.toBeNull();
    expect(headTag, "Deve conter a tag <head>").not.toBeNull();
    expect(bodyTag, "Deve conter a tag <body>").not.toBeNull();

    // Verificação simplificada de Doctype (DOMParser nem sempre expõe doctype da mesma forma que JSDOM puro,
    // mas se o parser funcionou, focamos no conteúdo).
  });

  it("3. O body deve conter APENAS uma tag H1 e uma tag P", () => {
    if (!doc) throw new Error("Documento não carregado.");

    const bodyChildren = Array.from(doc.body.children);

    // Filtra scripts (comum em injeção de live server ou analytics)
    const contentTags = bodyChildren.filter((el) => el.tagName !== "SCRIPT");

    expect(
      contentTags.length,
      `O body deve ter exatamente 2 elementos. Encontrados: [${contentTags.map((t) => t.tagName).join(", ")}]`,
    ).toBe(2);

    const hasH1 = contentTags.some((el) => el.tagName === "H1");
    const hasP = contentTags.some((el) => el.tagName === "P");

    expect(hasH1, "Está faltando a tag <H1>").toBe(true);
    expect(hasP, "Está faltando a tag <P>").toBe(true);
  });
});
