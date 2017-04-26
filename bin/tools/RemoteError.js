/*
*  远程调用错误
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RemoteError extends Error {
    constructor(err) {
        if (err == null)
            return undefined;
        super();
        this.message = err.message;
        this.stack = err.stack;
    }
}
exports.default = RemoteError;
;
this.RemoteError = RemoteError;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2xzL1JlbW90ZUVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztFQUVFOzs7QUFFRixpQkFBaUMsU0FBUSxLQUFLO0lBQzFDLFlBQVksR0FBUTtRQUNoQixFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDO1lBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNsQyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztRQUMzQixJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBUEQsOEJBT0M7QUFBQSxDQUFDO0FBRUYsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUMiLCJmaWxlIjoidG9vbHMvUmVtb3RlRXJyb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4qICDov5znqIvosIPnlKjplJnor69cclxuKi9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbW90ZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IoZXJyOiBhbnkpIHtcclxuICAgICAgICBpZiAoZXJyID09IG51bGwpIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBlcnIubWVzc2FnZTtcclxuICAgICAgICB0aGlzLnN0YWNrID0gZXJyLnN0YWNrO1xyXG4gICAgfVxyXG59O1xyXG5cclxudGhpcy5SZW1vdGVFcnJvciA9IFJlbW90ZUVycm9yOyJdfQ==
