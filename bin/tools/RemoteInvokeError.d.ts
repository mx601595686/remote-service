export default class RemoteInvokeError extends Error {
    constructor(err: {
        message: string;
        stack: string;
    });
}
