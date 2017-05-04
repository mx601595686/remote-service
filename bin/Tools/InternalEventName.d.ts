declare const enum InternalEventName {
    remoteReady = 0,
    executeServiceCode = 1,
    close = 2,
    runningStateChange = 3,
    remoteServiceError = 4,
    remoteStdout = 5,
    remoteStderr = 6,
    updateResourceUsage = 7,
}
export default InternalEventName;
