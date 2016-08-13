const fs   = require('fs')
const path = require('path')
const glob = require('glob')


const ensureDirectory = dir => new Promise((resolve, reject) => {
    fs.stat(dir, (err, stats) => {
        if (err) return reject(`path "${dir}" is not valid directory: ${err.message}`)

        if (!stats.isDirectory()) return reject(`path "${dir}" is not a directory`)

        resolve(true)
    })
})

const createDirectory = dir => new Promise((resolve, reject) => {
    fs.mkdir(dir, err => {
        if (err) return reject(`an error occurred while creating directory "${dir}": ${err.message}`)
        resolve(dir)
    })
})

const createFile = (filepath, flags = 'r') => new Promise((resolve, reject) => {
    fs.open(filepath, flags, (err, fd) => {
        if (err) return reject(`an error occurred while creating file "${filepath}": ${err.message}`)
        resolve(fd)
    })
})

const globber = pattern => new Promise((resolve, reject) => {
    glob(pattern, (err, files) => {
        if (err) return reject(err)

        resolve(files)
    })
})

const readFile = path => new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) return reject(err)

        resolve(data)
    });
})

module.exports.ensureLayout = root => {
    const filesDir    = path.join(root, 'files')
    const mappingsDir = path.join(root, 'mappings')

    return ensureDirectory(root)
        .then(() => Promise.all([
            ensureDirectory(filesDir).catch(() => createDirectory(filesDir)),
            ensureDirectory(mappingsDir).catch(() => createDirectory(mappingsDir)),
        ]))
        .then(mappingFiles => ({
            root,
            filesDir,
            mappingsDir,
            mappingFiles,
        }))
}

module.exports.globber         = globber
module.exports.readFile        = readFile
module.exports.createFile      = createFile
module.exports.createDirectory = createDirectory