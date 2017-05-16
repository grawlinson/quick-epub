import chai, { expect } from 'chai'
import chaiFiles from 'chai-files'
import fs from 'fs-extra'
import output from './output'

describe('output', () => {
  describe('file', () => {
    // setup
    chai.use(chaiFiles)
    const file = chaiFiles.file
    const dir = chaiFiles.dir // eslint-disable-line no-unused-vars

    // temporary directory
    const tempDir = 'testing'

    // before/after hooks
    before((done) => {
      fs.ensureDir(tempDir)
        .then(() => done())
        .catch(done)
    })
    after((done) => {
      fs.remove(tempDir)
        .then(() => done())
        .catch(done)
    })

    it('should generate an output file with valid contents', (done) => {
      const fileLocation = `${tempDir}/output.file.test1.zip`
      const files = [
        { name: 'mimetype', content: 'application/epub+zip', options: { store: true } },
        { name: 'META-INF/container.xml', content: '0123456789' },
        { name: 'EPUB/package.opf', content: '0123456789' },
        { name: 'EPUB/css/style.css', content: '0123456789' },
        { name: 'EPUB/xhtml/toc.ncx', content: '0123456789' },
        { name: 'EPUB/xhtml/toc.xhtml', content: '0123456789' }
      ]
      output.file({ output: fileLocation, files })
        .then((value) => {
          expect(value).to.be.undefined // eslint-disable-line no-unused-expressions
          expect(file(fileLocation)).to.exist // eslint-disable-line no-unused-expressions
          expect(file(fileLocation)).to.not.be.empty // eslint-disable-line no-unused-expressions
          files.forEach(item => expect(file(fileLocation)).to.contain(item.name))
          done()
        }).catch(done)
    })
  })
})
