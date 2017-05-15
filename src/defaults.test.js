import { expect } from 'chai'
import { assignDefaults } from './defaults'

describe('defaults', () => {
  const baseObject = {
    title: '',
    author: [],
    chapters: []
  }

  it('should assign defaults', (done) => {
    const uuidEpubRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.epub$/
    const semVerRegex = /\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?\b/ig // eslint-disable-line

    assignDefaults(baseObject)
      .then((result) => {
        expect(result).to.be.an('object')
        expect(result).to.contain.all.keys([
          'id',
          'dates',
          'output',
          'language',
          'appendChapterTitles',
          'generator'
        ])
        expect(result.output).to.match(uuidEpubRegex)
        expect(result.language).to.equal('en')
        expect(result.appendChapterTitles).to.be.false // eslint-disable-line no-unused-expressions,max-len
        expect(result.generator).to.match(/quick-epub/)
        expect(result.generator).to.match(semVerRegex)
        expect(result.dates).to.be.an('object')
        expect(result.dates).to.contain.all.keys([
          'published',
          'modified'
        ])
        done()
      })
      .catch(done)
  })

  it('should assign optional properties if present', (done) => {
    const optionalPropsObj = Object.assign({
      identifiers: {},
      publisher: '',
      description: ''
    }, baseObject)
    assignDefaults(optionalPropsObj)
      .then((result) => {
        expect(result).to.be.an('object')
        expect(result).to.contain.all.keys([
          'id',
          'dates',
          'output',
          'language',
          'appendChapterTitles',
          'generator',
          'identifiers',
          'publisher',
          'description'
        ])
        done()
      })
      .catch(done)
  })

  it('should fail if object is not passed', (done) => {
    assignDefaults()
      .then(() => new Error('should fail'))
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error).to.have.property('message')
        expect(error.message).to.equal('data is not an object')
        done()
      })
  })

  it('should fail if properties are not passed', (done) => {
    // setup
    const noTitleObj = Object.assign({}, baseObject)
    delete noTitleObj.title
    const noAuthorObj = Object.assign({}, baseObject)
    delete noAuthorObj.author
    const noChaptersObj = Object.assign({}, baseObject)
    delete noChaptersObj.chapters

    assignDefaults(noTitleObj)
    .then(() => new Error('should fail'))
    .catch((error) => {
      expect(error).to.be.an('error')
      expect(error).to.have.property('message')
      expect(error.message).to.equal('title is not a string')
      return assignDefaults(noAuthorObj)
    })
    .then(() => new Error('should fail'))
    .catch((error) => {
      expect(error).to.be.an('error')
      expect(error).to.have.property('message')
      expect(error.message).to.equal('author is not an array')
      return assignDefaults(noChaptersObj)
    })
    .then(() => new Error('should fail'))
    .catch((error) => {
      expect(error).to.be.an('error')
      expect(error).to.have.property('message')
      expect(error.message).to.equal('chapters is not an array')
      done()
    })
  })

  it('should overwrite defaults', (done) => {
    // setup
    const newDate = `${new Date(0).toISOString().split('.')[0]}Z`
    const overwriteDatesModified = Object.assign({
      dates: { modified: newDate }
    }, baseObject)
    const overwriteDatesPublished = Object.assign({
      dates: { published: newDate }
    }, baseObject)
    const overwriteOutput = Object.assign({
      output: 'overwrittenOutput.epub'
    }, baseObject)
    const overwriteLang = Object.assign({
      language: 'fi'
    }, baseObject)
    const overwriteAppendTitles = Object.assign({
      appendChapterTitles: true
    }, baseObject)
    const overwriteGenerator = Object.assign({
      generator: 'overwrittenGenerator'
    }, baseObject)

    assignDefaults(overwriteDatesModified)
    .then((result) => {
      expect(result).to.be.an('object')
      expect(result.dates.modified).to.be.a('string')
      expect(result.dates.modified).to.equal(newDate)
      expect(result.dates.published).to.not.equal(newDate)
      return assignDefaults(overwriteDatesPublished)
    })
    .then((result) => {
      expect(result).to.be.an('object')
      expect(result.dates.published).to.be.a('string')
      expect(result.dates.published).to.equal(newDate)
      expect(result.dates.modified).to.not.equal(newDate)
      return assignDefaults(overwriteOutput)
    })
    .then((result) => {
      expect(result).to.be.an('object')
      expect(result.output).to.be.a('string')
      expect(result.output).to.equal('overwrittenOutput.epub')
      return assignDefaults(overwriteLang)
    })
    .then((result) => {
      expect(result).to.be.an('object')
      expect(result.language).to.be.a('string')
      expect(result.language).to.equal('fi')
      return assignDefaults(overwriteAppendTitles)
    })
    .then((result) => {
      expect(result).to.be.an('object')
      expect(result.appendChapterTitles).to.be.a('boolean')
      expect(result.appendChapterTitles).to.be.true // eslint-disable-line no-unused-expressions
      return assignDefaults(overwriteGenerator)
    })
    .then((result) => {
      expect(result).to.be.an('object')
      expect(result.generator).to.be.a('string')
      expect(result.generator).to.equal('overwrittenGenerator')
      done()
    })
    .catch(done)
  })
})
