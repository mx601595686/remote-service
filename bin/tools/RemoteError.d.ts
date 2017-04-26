export default class RemoteError extends Error {
    constructor(err: {
        message: string;
        stack: string;
    });
}
