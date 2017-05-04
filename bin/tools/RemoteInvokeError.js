/*
 *  远程调用错误
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RemoteInvokeError extends Error {
    constructor(error) {
        super();
        this.message = error.message || '';
        this.stack = error.stack || '';
    }
}
exports.default = RemoteInvokeError;
;
this.RemoteInvokeError = RemoteInvokeError;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRvb2xzL1JlbW90ZUludm9rZUVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHOzs7QUFFSCx1QkFBdUMsU0FBUSxLQUFLO0lBQ2hELFlBQVksS0FBeUM7UUFDakQsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7SUFDbkMsQ0FBQztDQUNKO0FBTkQsb0NBTUM7QUFBQSxDQUFDO0FBRUYsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDIiwiZmlsZSI6IlRvb2xzL1JlbW90ZUludm9rZUVycm9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogIOi/nOeoi+iwg+eUqOmUmeivr1xyXG4gKi9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbW90ZUludm9rZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IoZXJyb3I6IHsgbWVzc2FnZTogc3RyaW5nLCBzdGFjazogc3RyaW5nIH0pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IGVycm9yLm1lc3NhZ2UgfHwgJyc7XHJcbiAgICAgICAgdGhpcy5zdGFjayA9IGVycm9yLnN0YWNrIHx8ICcnO1xyXG4gICAgfVxyXG59O1xyXG5cclxudGhpcy5SZW1vdGVJbnZva2VFcnJvciA9IFJlbW90ZUludm9rZUVycm9yOyJdfQ==
