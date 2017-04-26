/*
*  远程调用错误
*/

export default class RemoteError extends Error {
    constructor(err: any) {
        if (err == null) return undefined;
        super();
        this.message = err.message;
        this.stack = err.stack;
    }
};

this.RemoteError = RemoteError;