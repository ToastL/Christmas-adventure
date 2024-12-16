function getNanoTime() {
    return performance.now() + performance.timeOrigin
}

function getCurrentMillis() {
    return performance.now()
}

export {getNanoTime, getCurrentMillis}
export default {getNanoTime, getCurrentMillis}