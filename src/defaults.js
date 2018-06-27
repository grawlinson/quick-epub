import { resolve as resolvePath } from "path";
import uuid from "uuid/v4";
import { name, version } from "../package.json";

const generatorString = `${name} v${version}`;

/**
 * Creates a Date string in ISO-8601 format
 * epubcheck complains if Date strings are not formatted this specific way
 * @return {String} Date string in ISO-8601 format
 */
const newDate = () => `${new Date().toISOString().split(".")[0]}Z`;

/**
 * Assign default values to data object
 * @param  {Object} data [description]
 * @return {Promise<Object, Error>}      [description]
 */
const assignDefaults = data =>
  new Promise((resolve, reject) => {
    if (typeof data !== "object") {
      return reject(new Error("data is not an object"));
    } else if (typeof data.title !== "string") {
      return reject(new Error("title is not a string"));
    } else if (!Array.isArray(data.author)) {
      return reject(new Error("author is not an array"));
    } else if (!Array.isArray(data.chapters)) {
      return reject(new Error("chapters is not an array"));
    }

    // create new data object
    const newData = {};

    // assign base properties
    newData.id = uuid();
    newData.title = data.title;
    newData.author = data.author;
    newData.chapters = data.chapters;

    // generate defaults if not found
    // dates
    if (typeof data.dates === "undefined") {
      newData.dates = {
        published: newDate(),
        modified: newDate()
      };
    } else {
      newData.dates = {}; // initalise object
      if (typeof data.dates.published === "undefined") {
        newData.dates.published = newDate();
      } else {
        newData.dates.published = data.dates.published;
      }
      if (typeof data.dates.modified === "undefined") {
        newData.dates.modified = newDate();
      } else {
        newData.dates.modified = data.dates.modified;
      }
    }
    // output
    if (typeof data.output === "undefined") {
      newData.output = resolvePath("./", `${newData.id}.epub`);
    } else {
      newData.output = data.output;
    }
    // language
    if (typeof data.language === "undefined") {
      newData.language = "en";
    } else {
      newData.language = data.language;
    }
    // appendChapterTitles
    if (typeof data.appendChapterTitles === "undefined") {
      newData.appendChapterTitles = false;
    } else {
      newData.appendChapterTitles = data.appendChapterTitles;
    }
    // generator
    if (typeof data.generator === "undefined") {
      newData.generator = generatorString;
    } else {
      newData.generator = data.generator;
    }
    // add optional properties if present
    // identifiers
    if (typeof data.identifiers === "object") {
      newData.identifiers = data.identifiers;
    }
    // publisher
    if (typeof data.publisher === "string") {
      newData.publisher = data.publisher;
    }
    // description
    if (typeof data.description === "string") {
      newData.description = data.description;
    }

    return resolve(newData);
  });

export default { assignDefaults };
