require('isomorphic-fetch')

function UploadHTMLPlugin(options) {
  this.endpoint = options.endpoint
  this.username = options.username
  this.password = options.password
}

UploadHTMLPlugin.prototype.apply = function apply(compiler) {
  compiler.plugin('emit', (compilation, callback) => {
    Object.keys(compilation.assets).forEach((filename) => {
      if (/\.html$/.test(filename)) {
        const source = compilation.assets[filename].source()
        const body = {
          app: 'webapp',
          version: filename.split('.')[0],
          html: source,
        }
        console.log(`\n\nUploading version ${body.version} to apex/serve at ${this.endpoint}\n\n`)
        const headers = new Headers()
        headers.append('Authorization', `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`)
        headers.append('Content-Type', 'application/json')
        const options = {
          body: JSON.stringify(body),
          method: 'POST',
          headers,
        }
        fetch(this.endpoint, options)
          .then((response) => {
            if (response.ok) {
              console.log(`\n\nSUCCESSFULLY uploaded version ${body.version} to ${this.endpoint}\n\n`)
            } else {
              console.log('response', response)
              throw new Error('Failed')
            }
          })
          .catch((err) => {
            console.log(`\n\nFAILED to upload version ${body.version} to ${this.endpoint}\n\n`, err)
          })
      }
    })
    callback()
  })
}

module.exports = UploadHTMLPlugin

