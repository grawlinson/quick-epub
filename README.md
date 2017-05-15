# quick-epub

[![npm][shield-npm-version]][url-npm-version]
[![MIT License][shield-mit-license]][url-mit-license]
[![PRs Welcome][shield-prs-welcome]][url-prs-welcome]
[![Commitizen friendly][shield-commitizen-friendly]][url-commitizen-friendly]
[![JavaScript Style Guide][shield-standard-style]][url-standard-style]
[![dependencies][shield-deps]][url-deps]
[![devDependencies][shield-devdeps]][url-deps]

Quickly generate valid EPUB 3.0.1 documents.

This library is based on cyrilis' [epub-gen][url-epubgen], and is more of a
proof-of-concept than an actual library. It was used to learn about the
EPUB specification.

## Will not

*   Validate your passed HTML files
*   Process images in said HTML files

## Installation

This module is distributed via [npm][url-npm] which is bundled with [node][url-node] and should be installed as one of your project's dependencies:

```javascript
npm install quick-epub --save
```

## Usage

### epub.createFile(data)

Creates a file with a given ```data``` object.

```javascript
// import the module
const epub = require('quick-epub');

// minimal data object
const data = {
  title: 'White Fang',
  author: ['Jack London'],
  chapters: [
    {
      title: 'CHAPTER I - THE TRAIL OF THE MEAT',
      content: 'Dark spruce forest frowned on either side the frozen waterway.'
    },
    {
      title: 'CHAPTER II - THE SHE-WOLF',
      content: 'Breakfast eaten and the slim camp-outfit lashed to the sled...'
    },
    {
      title: 'CHAPTER III - THE HUNGER CRY',
      content: 'The day began auspiciously.'
    }
  ]
}

// create epub
epub.createFile(data)
  .then(() => console.log('book done.'))
  .catch(e => console.error(e))
```

### Data Object

At a minimum, the data object must have three properties:

*   `title` - Title of the book. Must be a `String`.
*   `author` - Author(s) of the book. Must be an `Array` containing `String` types.
*   `chapters` - Actual content of the book. Must be an `Array` of `Object` types with the following properties:
    *   `title` - Title of the chapter. Must be a `String`.
    *   `content` - Main content of the chapter. Must be a `String`.

#### Optional properties

The following properties are optional, it is recommended to at least set `output` to something sane.

*   `output` - Filepath/name of file. Defaults to a randomly named epub in the directory of the calling script
*   `appendChapterTitles` - If set, appends the chapter title at the beginning of each chapter. Defaults to `false`
*   `lang` - Language. Defaults to `en`
*   `publisher` - Whoever published this fantastic EPUB
*   `description` - A short blurb/summary of the book
*   `dates` - Published/modified dates. Both default to [ISO-8601][url-iso8601] `Date` types formatted as `String` types
    *   `published`
    *   `modified`
*   `identifiers` - Digital object identifiers.
    *   [`isbn10`][url-isbn]
    *   `isbn13`
    *   [`doi`][url-doi]

#### Example

```javascript
const data = {
  // compulsory
  title: 'White Fang',
  author: ['Jack London', 'Weedon Smith'],
  chapters: [
    {
      title: 'CHAPTER I - THE TRAIL OF THE MEAT',
      content: 'Dark spruce forest frowned on either side the frozen waterway.'
    },
    {
      title: 'CHAPTER II - THE SHE-WOLF',
      content: 'Breakfast eaten and the slim camp-outfit lashed to the sled...'
    },
    {
      title: 'CHAPTER III - THE HUNGER CRY',
      content: 'The day began auspiciously.'
    }
  ],
  // optional (default values created)
  output: 'Jack London - White Fang.epub',
  appendChapterTitles: true,
  lang: 'en',
  dates: {
    published: new Date().toISOString(),
    modified: new Date().toISOString()
  },
  // optional (no default values created)
  publisher: 'Project Gutenberg',
  description: 'The story of a man and a wolf.',
  identifiers: {
    isbn10: 'this is definitely not a valid ISBN-10 number',
    isbn13: 'nor is this a valid ISBN-13 number',
    doi: 'yep. not valid either.'
  }
}
```

### Acknowledgements

Thanks to:

*   [Project Gutenberg][url-prj-guten] for all the freely available material to test, especially [White Fang][url-wf]!
*   cyrilis' [epub-gen][url-epubgen] library
*   IDPF for their epub validation tool, aptly titled [epubcheck][url-epub-check]

[url-epubgen]:https://github.com/cyrilis/epub-gen
[url-iso8601]:http://www.iso.org/iso/home/standards/iso8601.htm
[url-doi]:https://www.doi.org/
[url-isbn]:http://www.isbn.org/faqs_general_questions#isbn_faq1
[url-prj-guten]:http://www.gutenberg.org/
[url-wf]:http://www.gutenberg.org/ebooks/910
[url-epub-check]:https://github.com/idpf/epubcheck
[shield-npm-version]:https://img.shields.io/npm/v/quick-epub.svg
[url-npm-version]:https://www.npmjs.com/package/quick-epub
[shield-mit-license]:https://img.shields.io/github/license/grawlinson/quick-epub.svg
[url-mit-license]:http://opensource.org/licenses/MIT
[shield-prs-welcome]:https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[url-prs-welcome]:http://makeapullrequest.com
[shield-standard-style]:https://img.shields.io/badge/code_style-standard-brightgreen.svg
[url-standard-style]:https://standardjs.com
[url-commitizen-friendly]:https://commitizen.github.io/cz-cli/
[shield-commitizen-friendly]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[shield-deps]:https://img.shields.io/bithound/dependencies/github/grawlinson/quick-epub.svg
[shield-devdeps]:https://img.shields.io/bithound/devDependencies/github/grawlinson/quick-epub.svg
[url-deps]:https://www.bithound.io/github/grawlinson/quick-epub/master/dependencies/npm
[url-npm]:https://www.npmjs.com
[url-node]:https://nodejs.org
