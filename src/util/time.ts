function getNanoTime() {
    return performance.now() + performance.timeOrigin
}

function getCurrentMillis() {
    return new Date().getMilliseconds()
}

export {getNanoTime, getCurrentMillis}
export default {getNanoTime, getCurrentMillis}