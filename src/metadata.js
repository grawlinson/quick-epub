import { resolve as resolvePath } from "path";
import { compileFile } from "pug";

// disable debugging for compiled functions
const pugOptions = { debug: false, compileDebug: false };
// compiled synchronous functions to generate dynamic metadata
const genSync = {
  pkgOpf: compileFile(
    resolvePath(__dirname, "templates", "package.opf.pug"),
    pugOptions
  ),
  tocNcx: compileFile(
    resolvePath(__dirname, "templates", "toc.ncx.pug"),
    pugOptions
  ),
  tocXhtml: compileFile(
    resolvePath(__dirname, "templates", "toc.xhtml.pug"),
    pugOptions
  )
};

const generate = {
  tocXhtml(data) {
    return new Promise((resolve, reject) => {
      // simple error checking
      if (typeof data.title !== "string") {
        return reject(new Error("title is not a string"));
      } else if (!Array.isArray(data.chapters)) {
        return reject(new Error("chapters is not an array"));
      } else if (data.title.length === 0) {
        return reject(new Error("title has zero length"));
      } else if (data.chapters.length === 0) {
        return reject(new Error("chapters has zero length"));
      } else if (
        !data.chapters.every(
          chapter =>
            typeof chapter.title === "string" &&
            typeof chapter.name === "string"
        )
      ) {
        return reject(
          new Error("chapters are missing properties: title, fileName")
        );
      }

      // generate toc.xhtml
      const tocXHTML = genSync.tocXhtml({
        title: data.title,
        chapters: data.chapters
      });

      return resolve(tocXHTML);
    });
  },
  tocNcx(data) {
    return new Promise((resolve, reject) => {
      // simple error checking
      if (typeof data.title !== "string") {
        return reject(new Error("title is not a string"));
      } else if (typeof data.id !== "string") {
        return reject(new Error("id is not a string"));
      } else if (typeof data.language !== "string") {
        return reject(new Error("language is not a string"));
      } else if (typeof data.generator !== "string") {
        return reject(new Error("generator is not a string"));
      } else if (!Array.isArray(data.author)) {
        return reject(new Error("author is not an array"));
      } else if (!Array.isArray(data.chapters)) {
        return reject(new Error("chapters is not an array"));
      } else if (data.title.length === 0) {
        return reject(new Error("title has zero length"));
      } else if (data.id.length === 0) {
        return reject(new Error("id has zero length"));
      } else if (data.language.length === 0) {
        return reject(new Error("language has zero length"));
      } else if (data.generator.length === 0) {
        return reject(new Error("generator has zero length"));
      } else if (data.author.length === 0) {
        return reject(new Error("author has zero length"));
      } else if (data.chapters.length === 0) {
        return reject(new Error("chapters has zero length"));
      } else if (
        !data.chapters.every(
          chapter =>
            typeof chapter.title === "string" &&
            typeof chapter.name === "string"
        )
      ) {
        return reject(
          new Error("chapters are missing properties: title, fileName")
        );
      }

      // generate toc.ncx
      const tocNCX = genSync.tocNcx({
        language: data.language,
        generator: data.generator,
        id: data.id,
        title: data.title,
        author: data.author,
        chapters: data.chapters
      });

      return resolve(tocNCX);
    });
  },
  pkgOpf(data) {
    return new Promise((resolve, reject) => {
      // simple error checking
      // generate package.opf
      const packageOPF = genSync.pkgOpf({
        language: data.language,
        id: data.id,
        title: data.title,
        author: data.author,
        dates: data.dates,
        publisher: data.publisher,
        description: data.description,
        identifiers: data.identifiers,
        chapters: data.chapters
      });

      return resolve(packageOPF);
    });
  }
};

const generateMetadata = options =>
  new Promise((resolve, reject) => {
    Promise.all([
      generate.pkgOpf(options),
      generate.tocXhtml(options),
      generate.tocNcx(options)
    ])
      .then(([packageOPF, tocXHTML, tocNCX]) => {
        // generate metadata property & append relevant metadata
        options.metadata = {};
        options.metadata.packageOPF = packageOPF;
        options.metadata.tocXHTML = tocXHTML;
        options.metadata.tocNCX = tocNCX;
        resolve(options);
      })
      .catch(e => reject(e));
  });

export default {
  generate,
  generateMetadata
};
