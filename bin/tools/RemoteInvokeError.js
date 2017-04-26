/*
*  远程调用错误
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RemoteInvokeError extends Error {
    constructor(err) {
        if (err == null)
            return undefined;
        super();
        this.message = err.message;
        this.stack = err.stack;
    }
}
exports.default = RemoteInvokeError;
;
this.RemoteInvokeError = RemoteInvokeError;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2xzL1JlbW90ZUludm9rZUVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztFQUVFOzs7QUFFRix1QkFBdUMsU0FBUSxLQUFLO0lBQ2hELFlBQVksR0FBUTtRQUNoQixFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNsQyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztRQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBUEQsb0NBT0M7QUFBQSxDQUFDO0FBRUYsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDIiwiZmlsZSI6InRvb2xzL1JlbW90ZUludm9rZUVycm9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuKiAg6L+c56iL6LCD55So6ZSZ6K+vXHJcbiovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW1vdGVJbnZva2VFcnJvciBleHRlbmRzIEVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKGVycjogYW55KSB7XHJcbiAgICAgICAgaWYgKGVyciA9PSBudWxsKSByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gZXJyLm1lc3NhZ2U7XHJcbiAgICAgICAgdGhpcy5zdGFjayA9IGVyci5zdGFjaztcclxuICAgIH1cclxufTtcclxuXHJcbnRoaXMuUmVtb3RlSW52b2tlRXJyb3IgPSBSZW1vdGVJbnZva2VFcnJvcjsiXX0=
