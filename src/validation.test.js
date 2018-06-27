import { expect } from "chai";
import { validateInput } from "./validation";

describe("validation", () => {
  const data = {
    language: "en",
    title: "White Fang",
    author: ["Jack London", "White Fang"],
    publisher: "Project Gutenberg",
    description: "Something to describe, I guess.",
    chapters: [
      {
        title: "CHAPTER I - THE TRAIL OF THE MEAT",
        content:
          "Dark spruce forest frowned on either side the frozen waterway."
      },
      {
        title: "CHAPTER II - THE SHE-WOLF",
        content:
          "Breakfast eaten and the slim camp-outfit lashed to the sled..."
      },
      {
        title: "CHAPTER III - THE HUNGER CRY",
        content: "The day began auspiciously."
      }
    ],
    identifiers: {
      isbn10: "this is definitely not a valid ISBN-10 number",
      isbn13: "nor is this a valid ISBN-13 number",
      doi: "yep. not valid either."
    },
    dates: {
      published: `${new Date().toISOString().split(".")[0]}Z`,
      modified: `${new Date().toISOString().split(".")[0]}Z`
    },
    appendChapterTitles: true,
    output: "Jack London - White Fang.epub"
  };

  describe("validate", () => {
    it("should pass validation if a valid object is passed", done => {
      validateInput(data)
        .then(result => {
          expect(result).to.be.an("object");
          expect(result).to.contain.all.keys([
            "language",
            "title",
            "author",
            "publisher",
            "description",
            "chapters",
            "identifiers",
            "dates",
            "appendChapterTitles",
            "output"
          ]);
          done();
        })
        .catch(done);
    });

    it("should fail validation if nothing valid is passed", () =>
      validateInput({ title: "Only Thing Passed" })
        .then(() => {
          throw new Error("test should have failed");
        })
        .catch(error => {
          expect(error).to.be.an("error");
          expect(error).to.have.property("message");
          expect(error).to.have.property("message", "validation failed");
        }));
  });
});
