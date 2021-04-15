"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UmusUpdater = void 0;
var UmusUpdater = /** @class */ (function () {
    function UmusUpdater(init, updateFn) {
        this.updateFn = updateFn;
        this.states = [init];
    }
    Object.defineProperty(UmusUpdater.prototype, "state", {
        get: function () {
            return this.states[this.states.length - 1];
        },
        set: function (state) {
            this.states.push(state);
        },
        enumerable: false,
        configurable: true
    });
    UmusUpdater.prototype.update = function (msg) {
        var newState = this.updateFn(this.state, msg);
        if (newState !== this.state) {
            this.state = newState;
            return [true, this.state];
        }
        return [false, this.state];
    };
    return UmusUpdater;
}());
exports.UmusUpdater = UmusUpdater;
