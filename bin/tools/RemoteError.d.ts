export default class RemoteError extends Error {
    constructor(error: {
        message: string;
        stack: string;
    });
}
