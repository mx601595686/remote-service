/*
*  远程调用错误
*/

export default class RemoteError extends Error {
    constructor(error: { message: string, stack: string }) {
        super();
        this.message = error.message || '';
        this.stack = error.stack || '';
    }
};

this.RemoteError = RemoteError;