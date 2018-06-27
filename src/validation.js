import Joi from "joi";

const datesSchema = {
  published: Joi.date(),
  modified: Joi.date()
};

const identifiersSchema = {
  isbn10: Joi.string(),
  isbn13: Joi.string(),
  doi: Joi.string()
};

const chapterSchema = {
  title: Joi.string(),
  content: Joi.string().required(),
  id: Joi.number()
};

const mainSchema = Joi.object({
  output: Joi.string(),
  title: Joi.string().required(),
  author: Joi.array()
    .min(1)
    .required(),
  chapters: Joi.array()
    .min(1)
    .items(Joi.object(chapterSchema))
    .required(),
  identifiers: Joi.object(identifiersSchema),
  dates: Joi.object(datesSchema),
  language: Joi.string(),
  publisher: Joi.string(),
  description: Joi.string(),
  appendChapterTitles: Joi.boolean(),
  generator: Joi.string()
})
  .unknown()
  .required();

/**
 * Validate input object
 * @param  {Object} data [description]
 * @return {Promise<Object, Error>}            [description]
 */
const validateInput = data =>
  new Promise((resolve, reject) => {
    const { error, value: validData } = Joi.validate(data, mainSchema);
    if (error) return reject(new Error("validation failed"));
    return resolve(validData);
  });

export default {
  validateInput
};
