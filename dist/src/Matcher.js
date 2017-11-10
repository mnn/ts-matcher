"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isEqualWith = require("lodash.isequalwith");
var Utils = (function () {
    function Utils() {
    }
    Utils.any = function (xs, pred) {
        return xs.map(pred).filter(function (x) { return x; }).length > 0;
    };
    return Utils;
}());
/**
 * Matcher without any cases yet.
 * Not intended for users to be constructed directly.
 */
var MatchingEmpty = (function () {
    function MatchingEmpty(value) {
        this.value = value;
    }
    /**
     * {@see Matching#case}.
     */
    MatchingEmpty.prototype.case = function (test, onMatch, customizer) {
        return this.createMatching().case(test, onMatch, customizer);
    };
    /**
     * {@see Matching#caseMulti}.
     */
    MatchingEmpty.prototype.caseMulti = function (tests, onMatch, customizer) {
        return this.createMatching().caseMulti(tests, onMatch, customizer);
    };
    /**
     * {@see Matching#caseGuarded}.
     */
    MatchingEmpty.prototype.caseGuarded = function (test, onMatch) {
        return this.createMatching().caseGuarded(test, onMatch);
    };
    MatchingEmpty.prototype.createMatching = function () {
        return new Matching(this.value, []);
    };
    return MatchingEmpty;
}());
exports.MatchingEmpty = MatchingEmpty;
/**
 * Matcher without some cases.
 * Not intended for users to be constructed directly.
 */
var Matching = (function () {
    function Matching(value, tests) {
        this.value = value;
        this.tests = tests;
    }
    /**
     * Creates one case. During execution value is being compared to {@param test} and if it matches {@param onMatch} is
     * called and its return value returned.
     * @param test - value to match against
     * @param onMatch - successful match handler
     * @param customizer - optional parameter used for customizing equality checking
     * @return {@link Matching} object for adding more cases and as a last call in a chain invoking
     *                          an execution - {@link exec}.
     */
    Matching.prototype.case = function (test, onMatch, customizer) {
        return this.caseGuarded(function (x) { return isEqualWith(x, test, customizer); }, onMatch);
    };
    /**
     * Creates multiple cases. During execution value is being compared to items in {@param tests} and if
     * any of it matches, {@param onMatch} is called and its return value returned.
     * @param tests - value to match against
     * @param onMatch - successful match handler
     * @param customizer - optional parameter used for customizing equality checking
     * @return {@link Matching} object for adding more cases and as a last call in a chain invoking
     *                          an execution - {@link exec}.
     */
    Matching.prototype.caseMulti = function (tests, onMatch, customizer) {
        return this.caseGuarded(function (x) { return Utils.any(tests, function (y) { return isEqualWith(x, y, customizer); }); }, onMatch);
    };
    /**
     * Creates one case.
     * More generic variant of {@link case}. Accepts a function instead of a value to compare.
     * @param test - function doing the test
     * @param onMatch - successful match handler
     * @return
     */
    Matching.prototype.caseGuarded = function (test, onMatch) {
        this.test = test;
        this.onMatch = onMatch;
        return new Matching(this.value, this.tests.concat(this));
    };
    /**
     * Creates default case.
     * @param onMatch - successful match handler (always run if every case before has failed)
     * @return
     */
    Matching.prototype.default = function (onMatch) {
        return this.caseGuarded(function () { return true; }, onMatch);
    };
    /**
     * Evaluates - runs sequentially all cases and finds first test retuning true.
     * When successful case is found then is called its onMatch handler and its return value is returned.
     * @return return value from onMatch handler
     */
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