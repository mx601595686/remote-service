/*
*  远程调用错误
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RemoteError extends Error {
    constructor(error) {
        super();
        this.message = error.message || '';
        this.stack = error.stack || '';
    }
}
exports.default = RemoteError;
;
this.RemoteError = RemoteError;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRvb2xzL1JlbW90ZUVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztFQUVFOzs7QUFFRixpQkFBaUMsU0FBUSxLQUFLO0lBQzFDLFlBQVksS0FBeUM7UUFDakQsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ25DLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7SUFDbkMsQ0FBQztDQUNKO0FBTkQsOEJBTUM7QUFBQSxDQUFDO0FBRUYsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUMiLCJmaWxlIjoiVG9vbHMvUmVtb3RlRXJyb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4qICDov5znqIvosIPnlKjplJnor69cclxuKi9cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbW90ZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IoZXJyb3I6IHsgbWVzc2FnZTogc3RyaW5nLCBzdGFjazogc3RyaW5nIH0pIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubWVzc2FnZSA9IGVycm9yLm1lc3NhZ2UgfHwgJyc7XHJcbiAgICAgICAgdGhpcy5zdGFjayA9IGVycm9yLnN0YWNrIHx8ICcnO1xyXG4gICAgfVxyXG59O1xyXG5cclxudGhpcy5SZW1vdGVFcnJvciA9IFJlbW90ZUVycm9yOyJdfQ==
