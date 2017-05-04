export default class RemoteInvokeError extends Error {
    constructor(error: {
        message: string;
        stack: string;
    });
}
