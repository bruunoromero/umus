"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Umus = void 0;
var updater_1 = require("./updater");
var createBoundUpdater = function (platform, updater, viewCreator) {
    var boundUpdate = function (msg) {
        var _a = updater.update(msg), shouldUpdate = _a[0], model = _a[1];
        if (shouldUpdate) {
            var view = viewCreator(model);
            platform.update(view(boundUpdate));
        }
    };
    return boundUpdate;
};
var UmusApp = /** @class */ (function () {
    function UmusApp(platform, view, boundUpdate) {
        this.platform = platform;
        this.view = view;
        this.boundUpdate = boundUpdate;
    }
    UmusApp.prototype.run = function (_a) {
        var el = _a.el;
        if (el) {
            this.platform.create(this.view(this.boundUpdate), el);
        }
    };
    return UmusApp;
}());
var Creator = /** @class */ (function () {
    function Creator(platform) {
        this.platform = platform;
    }
    Creator.prototype.create = function (_a) {
        var viewCreator = _a.view, init = _a.init, update = _a.update;
        var updater = new updater_1.UmusUpdater(init, update);
        var boundUpdate = createBoundUpdater(this.platform, updater, viewCreator);
        return new UmusApp(this.platform, viewCreator(init), boundUpdate);
    };
    return Creator;
}());
var Umus = /** @class */ (function () {
    function Umus() {
    }
    Umus.bind = function (ctor) {
        var platform = new ctor();
        return new Creator(platform);
    };
    return Umus;
}());
exports.Umus = Umus;
