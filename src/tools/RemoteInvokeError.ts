/*
 *  远程调用错误
 */

export default class RemoteInvokeError extends Error {
    constructor(error: { message: string, stack: string }) {
        super();
        this.message = error.message || '';
        this.stack = error.stack || '';
    }
};

this.RemoteInvokeError = RemoteInvokeError;