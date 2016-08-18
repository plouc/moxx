const fs       = require('fs')
const path     = require('path')
const xml2js   = require('xml2js')
const stream   = require('stream')
const FormData = require('form-data')


class RequestMock extends stream.Readable {
    constructor (props, options = {}) {
        super()

        Object.keys(props).forEach(propKey => {
            this[propKey] = props[propKey]
        })

        this.options = options
        this.rawBody = ''

        if (this.options.json || this.options.xml || this.options.raw) {
            if (this.options.json) {
                this.rawBody = JSON.stringify(this.options.json)
            } else if (this.options.xml) {
                const builder = new xml2js.Builder()
                this.rawBody = builder.buildObject(this.options.xml)
            } else {
                this.rawBody = this.options.raw
            }

            // using process.nextTick() allows to pass the request to a promise
            // and emit events once listener have been attached
            process.nextTick(() => {
                this.emit('data', Buffer.from(this.rawBody))
                this.emit('end')
            }, 10)
        }
    }

    getRawBody() { return this.rawBody }

    read() { return null }
}


class MultipartRequestMock extends FormData {
    constructor(props) {
        super()

        Object.keys(props).forEach(propKey => {
            this[propKey] = props[propKey]
        })

        if (props.fields) {
            Object.keys(props.fields).forEach(field => {
                this.append(field, props.fields[field])
            })
        }

        if (props.files) {
            Object.keys(props.files).forEach(field => {
                this.append(field, fs.createReadStream(path.join(__dirname, 'fixtures', 'files', props.files[field])))
            })
        }

        this.headers = Object.assign(this.headers || {}, this.getHeaders())
    }
}


module.exports.RequestMock          = RequestMock
module.exports.MultipartRequestMock = MultipartRequestMock
