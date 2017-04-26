/*
 *  远程调用错误
 */

export default class RemoteInvokeError extends Error {
    constructor(err: { message: string, stack: string }) {
        super();
        this.message = err.message;
        this.stack = err.stack;
    }
};

this.RemoteInvokeError = RemoteInvokeError;