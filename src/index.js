import { validateInput } from './validation'
import { assignDefaults } from './defaults'
import { generateChapters } from './chapters'
import { generateMetadata } from './metadata'
import output from './output'

// metadata files that are always present in epub files
const constants = [
  {
    name: 'mimetype',
    content: 'application/epub+zip',
    options: { store: true }
  },
  {
    name: 'META-INF/container.xml',
    content: '<?xml version="1.0" encoding="utf-8" ?><container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0"><rootfiles><rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'
  },
  {
    name: 'EPUB/css/style.css',
    content: '.epub-author{color:#555}.epub-link{margin-bottom:30px}.epub-link a{color:#666;font-size:90%}.toc-author{font-size:90%;color:#555}.toc-link{color:#999;font-size:85%;display:block}hr{border:0;border-bottom:1px solid #dedede;margin:60px 10%}'
  }
]

const createFile = options => new Promise((resolve, reject) =>
validateInput(options)
  .then(assignDefaults)
  .then(generateChapters)
  .then(generateMetadata)
  .then((data) => {
    // pack constants
    const files = [].concat(constants)
    // pack metadata
    files.push(
      { name: 'EPUB/package.opf', content: data.metadata.packageOPF },
      { name: 'EPUB/xhtml/toc.ncx', content: data.metadata.tocNCX },
      { name: 'EPUB/xhtml/toc.xhtml', content: data.metadata.tocXHTML }
    )
    // pack chapters
    data.chapters.forEach((chapter) => {
      files.push({
        name: `EPUB/xhtml/${chapter.name}`,
        content: chapter.html
      })
    })
    // output file
    return output.file({
      output: data.output,
      files
    })
  })
  .then(() => resolve())
  .catch(e => reject(e))
)

export default {
  createFile
}
