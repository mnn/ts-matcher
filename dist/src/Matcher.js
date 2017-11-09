"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isEqualWith = require("lodash.isequalwith");
var MatchingEmpty = (function () {
    function MatchingEmpty(value) {
        this.value = value;
    }
    MatchingEmpty.prototype.case = function (test, onMatch) {
        return this.createMatching().case(test, onMatch);
    };
    MatchingEmpty.prototype.caseGuarded = function (test, onMatch) {
        return this.createMatching().caseGuarded(test, onMatch);
    };
    MatchingEmpty.prototype.createMatching = function () {
        return new Matching(this.value, []);
    };
    return MatchingEmpty;
}());
exports.MatchingEmpty = MatchingEmpty;
var Matching = (function () {
    function Matching(value, tests) {
        this.value = value;
        this.tests = tests;
    }
    Matching.prototype.case = function (test, onMatch, customizer) {
        return this.caseGuarded(function (x) { return isEqualWith(x, test, customizer); }, onMatch);
    };
    Matching.prototype.caseGuarded = function (test, onMatch) {
        this.test = test;
        this.onMatch = onMatch;
        return new Matching(this.value, this.tests.concat(this));
    };
    Matching.prototype.default = function (onMatch) {
        return this.caseGuarded(function () { return true; }, onMatch);
    };
    Matching.prototype.exec = function () {
        var _this = this;
        var process = function (remaining) {
            if (remaining.length <= 0) {
                throw new Error("Unmatched value " + _this.value + ".");
            }
            var cur = remaining[0];
            return cur.test(_this.value) ? cur.onMatch(_this.value) : process(remaining.slice(1));
        };
        return process(this.tests);
    };
    return Matching;
}());
exports.Matching = Matching;
var f = function (input) {
    return new MatchingEmpty(input);
};
exports.default = f;
//# sourceMappingURL=Matcher.js.map