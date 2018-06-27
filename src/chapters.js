import pMap from "p-map";
import uslug from "uslug";
import { resolve as resolvePath } from "path";
import { compileFile } from "pug";

const genChapterSync = compileFile(
  resolvePath(__dirname, "templates", "chapter.xhtml.pug"),
  { debug: false, compileDebug: false }
);

const generateChapter = (
  chapter,
  appendChapterTitles = false,
  language = "en"
) =>
  new Promise((resolve, reject) => {
    // error checking - function arguments
    if (typeof chapter !== "object") {
      return reject(new Error(`chapter is not an object: ${typeof chapter}`));
    } else if (typeof appendChapterTitles !== "boolean") {
      return reject(
        new Error(
          `appendChapterTitles is not a boolean: ${typeof appendChapterTitles}`
        )
      );
    } else if (typeof language !== "string") {
      return reject(new Error(`language is not a string: ${typeof language}`));
    } else if (language.length === 0) {
      return reject(new Error("language string cannot be empty"));
    }

    // Synchronously generate chapter HTML
    const html = genChapterSync({
      title: chapter.title,
      content: chapter.content,
      appendChapterTitles,
      language
    });

    // Resolve promise with chapter HTML
    return resolve(html);
  });

const generateChapters = data =>
  new Promise((resolve, reject) => {
    // error checking
    if (data === null || data === undefined) {
      return reject(new Error(`data should not be empty`));
    } else if (typeof data !== "object") {
      return reject(new Error(`data is not an object: ${data}`));
    } else if (typeof data.chapters !== "object") {
      return reject(
        new Error(`chapters is not an object: ${typeof data.chapters}`)
      );
    }
    pMap(data.chapters, chapter =>
      generateChapter(chapter, data.appendChapterTitles, data.language)
    )
      .then(html => {
        const maxLength = data.chapters.length.toString().length;
        data.chapters.map((chapter, index) => {
          chapter.html = html[index];
          chapter.name = `${(index + 1)
            .toString()
            .padStart(maxLength, "0")}_${uslug(chapter.title)}.xhtml`;

          return chapter;
        });
        resolve(data);
      })
      .catch(e => reject(e));
  });

export default {
  generateChapter,
  generateChapters
};
