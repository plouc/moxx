const matchers = require('./matchers')
const logger   = require('../logger')


const FILE_SPEC_KEYS = ['fieldname', 'filename', 'mimetype']

/**
 *
 * @param {MappingEntry} spec
 * @param {RequestInfo}  requestInfo
 * @returns {number}
 */
module.exports = (spec, requestInfo) => {
    if (spec.files === undefined) return 0

    let score = 0
    if (spec.files.count !== undefined) {
        if (Object.keys(requestInfo.files).length !== spec.files.count) {
            logger.silly(`expected to find ${spec.files.count} file(s), found ${Object.keys(requestInfo.files).length} -1`)
            return -1
        } else {
            logger.silly(`found exactly ${spec.files.count} file(s) +1`)
            score += 1
        }
    }

    if (spec.files.files !== undefined) {
        for (let fileIndex in spec.files.files) {
            const fileSpec     = spec.files.files[fileIndex]
            const fileMatchers = []

            FILE_SPEC_KEYS.forEach((specKey) => {
                if (fileSpec[specKey] !== undefined) {
                    fileMatchers.push(
                        /**
                         * @param {FileInfo} file
                         * @returns {number}
                         */
                        (file) => {
                            if (!matchers.fromSpec(fileSpec[specKey], file[specKey])) {
                                logger.silly(`file "${specKey}" does not match -1, found "${file[specKey]}" (expected: ${JSON.stringify(fileSpec[specKey])})`)
                                return -1
                            }

                            logger.silly(`file "${specKey}" matches +1, ${JSON.stringify(fileSpec[specKey])}`)
                            return 1
                        }
                    )
                }
            })

            if (fileSpec.checksum !== undefined) {
                fileMatchers.push(
                    /**
                     * @param {FileInfo} file
                     * @returns {number}
                     */
                    (file) => {
                        if (file.checksum !== fileSpec.checksum) {
                            logger.silly(`file checksum does not match -1, found ${file.checksum}, expected: ${fileSpec.checksum}`)
                            return -1
                        }

                        logger.silly(`file checksum matches: ${fileSpec.checksum} +1`)
                        return 1
                    }
                )
            }

            /**
             * @param {FileInfo} file
             * @returns {number}
             */
            const aggMatcher = (file) => {
                return fileMatchers.reduce((fileScore, matcher) => {
                    if (fileScore === -1) return -1

                    const matcherScore = matcher(file)
                    if (matcherScore === -1) return -1

                    return fileScore + matcherScore
                }, 0)
            }

            let filesScore = -1
            if (requestInfo.files && requestInfo.files.files) {
                requestInfo.files.files.forEach(
                    /**
                     * @param {FileInfo} file
                     */
                    (file) => {
                        const fileScore = aggMatcher(file)
                        if (fileScore > -1) {
                            if (filesScore === -1) filesScore = 0
                            filesScore += fileScore
                        }
                    }
                )
            }

            if (filesScore === -1) return -1
            score += filesScore
        }
    }

    return score
}
