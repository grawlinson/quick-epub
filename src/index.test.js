import { expect } from 'chai'
import { createFile } from './index'

describe('index', () => {
  describe('createFile', () => {
    it('should fail horribly', (done) => {
      createFile()
        .then(() => { throw new Error('test should have failed') })
        .catch((error) => {
          expect(error).to.be.an('error')
          done()
        })
    })
  })
})
