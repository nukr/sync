import fs from 'fs'

export default function readdir (dir, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  let list = []
  fs.readdir(dir, (err, files) => {
    if (err) {
      return console.error('fs.readdir error', err)
    }
    files = files.map(file => dir + file)
    let pending = files.length
    if (pending === 0) {
      return callback(null, list)
    }
    files.forEach((file) => {
      fs.stat(file, (err, stats) => {
        if (err) {
          return callback(err)
        }
        if (stats.isDirectory()) {
          file = file + '/'
          list.push((file))
          readdir(file, options, (err, files) => {
            if (err) {
              return callback(err)
            }
            pending -= 1
            list = list.concat(files)
            if (!pending) {
              return callback(null, list)
            }
          })
        } else {
          list.push((file))
          pending -= 1
          if (!pending) {
            return callback(null, list)
          }
        }
      })
    })
  })
}

