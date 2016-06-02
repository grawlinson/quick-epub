# quick-epub

Quickly generate valid EPUB 3.0.1 documents.

This library is based on cyrilis' [epub-gen][url-epubgen], and is more of a
proof-of-concept than an actual library. It was used to learn about the
EPUB specification.

## Will not

* Validate your passed HTML files. Or anything you pass to it, actually.
* Download images that have links in said HTML files.

## Will definitely

* Break. There's almost no error handling.

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

The variables of the data object *should* be:

*  `output` Filepath/name of file. Default: Some tempDir folder just above the `node_modules` dir.
* `title` Title of the book
* `author` Name of author. Can be either string or array.
* `contents` Array of chapter objects.
* `publisher` Whoever published this fantastic EPUB book. (Optional)
* `description` Self-explanatory. (Optional)
* `appendChapterTitles` Append the chapter title at the beginning of each chapter. Default: `false` (Optional)
* `dates` (Optional) Do you know when this was published/modified? Good. Chuck it in. [ISO-8601][url-iso8601] format!
    *  `published`
    *  `modified`
*  `lang` Language. Default: `en` (Optional)
*  `identifiers`
    *  [`isbn10`][url-isbn]
    *  `isbn13`
    *  [`doi`][url-doi]


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
 lang: 'engrish',
 title: 'Sample Title',
 author: ['Author One', 'Author Two'],
 publisher: 'Sample Publisher',
 description: 'Something to describe, I guess.',
 contents: [
  {title: 'First Title', data: 'Initial Data', id: 1},
  {title: 'II. 2.', data: 'Second Data', id: 2},
  {title: '3 a.k.a THREE', data: 'Third Lot of Data.', id: 3}
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
 output: 'yolo.epub'
};
```

## License

The MIT License (MIT)

Copyright (c) 2015 George Rawlinson <mailto:george@rawlinson.net.nz>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[url-epubgen]:https://github.com/cyrilis/epub-gen
[url-iso8601]:http://www.iso.org/iso/home/standards/iso8601.htm
[url-doi]:https://www.doi.org/
[url-isbn]:http://www.isbn.org/faqs_general_questions#isbn_faq1
