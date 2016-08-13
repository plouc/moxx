const http      = require('http')
const httpProxy = require('http-proxy')


let server
let proxy
let sockets = {}

const stop = () => new Promise((resolve, reject) => {
    if (server) {
        server.close(err => {
            if (err) return reject(err)

            console.log('closed server')
            resolve(true)
        })
        for (let socketId in sockets) {
            sockets[socketId].destroy()
        }
    } else {
        resolve(true)
    }
})

module.exports.start = config => stop().then(() => {
    const { port } = config

    return new Promise((resolve, reject) => {
        server = http.createServer()

        server.listen(port, err => {
            if (err) return reject(err)

            console.log(`moxx listening on port: ${port}`)
            if (config.proxy) {
                console.log(`proxying to ${config.proxy}`)
                proxy = httpProxy.createProxyServer({
                    target:       config.proxy,
                    changeOrigin: true,
                })
            }

            resolve({ server, proxy })
        })

        server.on('connection', socket => {
            const socketId = Object.keys(sockets).length;
            sockets[socketId] = socket;
            socket.on('close', () => {
                delete sockets[socketId]
            })
        });
    })
})