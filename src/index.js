import chokidar from 'chokidar'
import gcloud from 'gcloud'
import config from './config'
import readdir from './lib/readdir'

const gcs = gcloud.storage({
  projectId: config.project_id,
  keyFilename: config.key_filename
})

const bucket = gcs.bucket(config.bucket_name)

const watch = chokidar.watch(config.watch_dir, {
  ignoreInitial: true
})

watch
  .on('ready', () => {
    console.log('ready')
    readdir(config.watch_dir, {
      gitignore: true
    }, (err, files) => {
      if (err) {
        console.error(err)
      }
      console.log(files)
    })
  })
  .on('add', (path) => {
    bucket.upload(path, (err, file) => {
      if (err) {
        return console.error(err)
      }
      console.log('success!!')
    })
  })

function list_remote_file () {
  bucket.getFiles((err, files) => {
    console.log('local files >>>>>>>')
    if (err) {
      return console.error(err)
    }
    files.forEach((file) => {
      console.log(file.name)
    })
    console.log('<<<<<<< remote files')
  })
}
