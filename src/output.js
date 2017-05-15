import archiver from 'archiver'
import fs from 'fs-extra'

const file = data =>
  new Promise((resolve, reject) =>
    fs
      .ensureFile(data.output)
      .then(() => {
        // create a write stream to a valid file
        const output = fs.createWriteStream(data.output)

        // create zip archive with optimal compression
        const archive = archiver('zip', { zlib: { level: 9 } })

        // event emitter listeners
        // once archive.finalize() is called, this event should be emitted
        output.on('close', () => resolve())

        // handle stream errors
        output.on('error', e => reject(e))
        archive.on('error', e => reject(e))

        // pipe archive to output stream
        archive.pipe(output)

        // append all files to the archive
        data.files.forEach(item => {
          const options = Object.assign({ name: item.name }, item.options)
          archive.append(item.content, options)
        })

        // once called, close event is emitted
        archive.finalize()
      })
      .catch(e => reject(e))
  )

export default { file }
