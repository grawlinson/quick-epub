import { expect } from "chai";
import { generateChapter, generateChapters } from "./chapters";

describe("chapters", () => {
  const minimalObj = {
    title: "Fake Title",
    chapters: [
      { title: "Chapter 1", content: "Content #1" },
      { title: "Chapter 2", content: "Content #2" }
    ]
  };

  describe("generateChapter", () => {
    it("should generate a chapter", done => {
      generateChapter(minimalObj.chapters[0])
        .then(result => {
          expect(result).to.be.a("string");
          expect(result).to.match(/^<!DOCTYPE html>/);
          expect(result).to.match(/<\/html>$/);
          expect(result).to.match(/Chapter 1/);
          expect(result).to.match(/Content #1/);
          done();
        })
        .catch(done);
    });

    it("should fail if invalid parameters passed", done => {
      generateChapter()
        .then(() => {
          throw new Error("test should have failed");
        })
        .catch(error => {
          expect(error).to.be.an("error");
          return generateChapter({}, "notABoolean");
        })
        .then(() => {
          throw new Error("test should have failed");
        })
        .catch(error => {
          expect(error).to.be.an("error");
          expect(error).to.have.property("message");
          expect(error.message).to.equal(
            "appendChapterTitles is not a boolean: string"
          );
          return generateChapter({}, true, null);
        })
        .then(() => {
          throw new Error("test should have failed");
        })
        .catch(error => {
          expect(error).to.be.an("error");
          expect(error).to.have.property("message");
          expect(error.message).to.equal("language is not a string: object");
          return generateChapter({}, true, "");
        })
        .then(() => {
          throw new Error("test should have failed");
        })
        .catch(error => {
          expect(error).to.be.an("error");
          expect(error).to.have.property("message");
          expect(error.message).to.equal("language string cannot be empty");
          done();
        });
    });
  });

  describe("generateChapters", () => {
    it("should generate multiple chapters", done => {
      const isArrayOfChapters = array =>
        array.every(
          item =>
            typeof item.title === "string" &&
            typeof item.content === "string" &&
            typeof item.html === "string" &&
            typeof item.name === "string"
        );

      generateChapters(minimalObj)
        .then(result => {
          expect(result.chapters).to.satisfy(isArrayOfChapters);
          done();
        })
        .catch(done);
    });

    it("should fail if invalid object passed", done => {
      generateChapters(null)
        .then(() => {
          throw new Error("test should have failed");
        })
        .catch(error => {
          expect(error).to.be.an("error");
          return generateChapters(undefined);
        })
        .then(() => {
          throw new Error("test should have failed");
        })
        .catch(error => {
          expect(error).to.be.an("error");
          return generateChapters();
        })
        .then(() => {
          throw new Error("test should have failed");
        })
        .catch(error => {
          expect(error).to.be.an("error");
          return generateChapters("random string");
        })
        .then(() => {
          throw new Error("test should have failed");
        })
        .catch(error => {
          expect(error).to.be.an("error");
          return generateChapters(5);
        })
        .then(() => {
          throw new Error("test should have failed");
        })
        .catch(error => {
          expect(error).to.be.an("error");
          return generateChapters({ silly: true });
        })
        .then(() => {
          throw new Error("test should have failed");
        })
        .catch(error => {
          expect(error).to.be.an("error");
          done();
        });
    });
  });
});
