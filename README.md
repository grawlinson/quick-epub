# quick-epub

Quickly generate valid EPUB 3.0.1 documents.

This library is based on cyrilis' [epub-gen][url-epubgen], and is more of a
proof-of-concept than an actual library. It was used to learn about the
EPUB specification.

## Will not

*   Validate your passed HTML files. Or anything you pass to it, actually.
*   Download images that have links in said HTML files.

## Will definitely

*   Break. There's almost no error handling.

## Installation

```javascript
npm install quick-epub --save
```

## Usage

```javascript
var epub = require('quick-epub');
```

### epub.createFile(data)

Creates a file with a given ```data``` object.

```javascript
epub.createFile(data).then(function(){
  console.log('book done.');
}).catch(function(error){
  console.error(error);
});
```

### Data Object

The properties of the data object *should* be:

*   `output` Filepath/name of file. Default: Some tempDir folder just above the `node_modules` dir.
*   `title` Title of the book
*   `author` Name of author. Can be either string or array.
*   `contents` Array of chapter objects.
*   `publisher` Whoever published this fantastic EPUB book. (Optional)
*   `description` Self-explanatory. (Optional)
*   `appendChapterTitles` Append the chapter title at the beginning of each chapter. Default: `false` (Optional)
*   `dates` (Optional) Do you know when this was published/modified? Good. Chuck it in. [ISO-8601][url-iso8601] format!
    *   `published`
    *   `modified`
*   `lang` Language. Default: `en` (Optional)
*   `identifiers`
    *   [`isbn10`][url-isbn]
    *   `isbn13`
    *   [`doi`][url-doi]


`content` is an array filled with `chapter` objects with the following structure:

```javascript
{
  id: Number,
  title: String,
  data: String
}
```

#### Example

```javascript
var data = {
  lang: 'en',
  title: 'White Fang',
  author: ['Jack London', 'Weedon Smith'],
  publisher: 'Project Gutenberg',
  description: 'The story of a man and a wolf.',
  contents: [
    {
      title: 'CHAPTER I - THE TRAIL OF THE MEAT',
      data: 'Dark spruce forest frowned on either side the frozen waterway.',
      id: 1
    },
    {
      title: 'CHAPTER II - THE SHE-WOLF',
      data: 'Breakfast eaten and the slim camp-outfit lashed to the sled, the men turned their backs on the cheery fire and launched out into the darkness.',
      id: 2
    },
    {
      title: 'CHAPTER III - THE HUNGER CRY',
      data: 'The day began auspiciously.',
      id: 3
    }
  ],
  identifiers: {
    isbn10: 'this is definitely not a valid ISBN-10 number',
    isbn13: 'nor is this a valid ISBN-13 number',
    doi: 'yep. not valid either.'
  },
  dates: {
    published: new Date().toISOString().split('.')[0]+ 'Z',
    modified: new Date().toISOString().split('.')[0]+ 'Z'
  },
  appendChapterTitles: true,
  output: 'Jack London - White Fang.epub'
};
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
