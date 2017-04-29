/*
*  远程调用错误
*/
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RemoteError extends Error {
    constructor(err) {
        super();
        this.message = err.message;
        this.stack = err.stack;
    }
}
exports.default = RemoteError;
;
this.RemoteError = RemoteError;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRvb2xzL1JlbW90ZUVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztFQUVFOzs7QUFFRixpQkFBaUMsU0FBUSxLQUFLO0lBQzFDLFlBQVksR0FBdUM7UUFDL0MsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUM7UUFDM0IsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0lBQzNCLENBQUM7Q0FDSjtBQU5ELDhCQU1DO0FBQUEsQ0FBQztBQUVGLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDIiwiZmlsZSI6IlRvb2xzL1JlbW90ZUVycm9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuKiAg6L+c56iL6LCD55So6ZSZ6K+vXHJcbiovXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW1vdGVFcnJvciBleHRlbmRzIEVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKGVycjogeyBtZXNzYWdlOiBzdHJpbmcsIHN0YWNrOiBzdHJpbmcgfSkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gZXJyLm1lc3NhZ2U7XHJcbiAgICAgICAgdGhpcy5zdGFjayA9IGVyci5zdGFjaztcclxuICAgIH1cclxufTtcclxuXHJcbnRoaXMuUmVtb3RlRXJyb3IgPSBSZW1vdGVFcnJvcjsiXX0=
