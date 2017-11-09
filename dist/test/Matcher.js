"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var Matcher_1 = require("../src/Matcher");
var expect = chai.expect, assert = chai.assert;
describe('Matcher', function () {
    it('one case', function () {
        expect(Matcher_1.default(1)
            .case(1, function () { return 0; })
            .exec()).to.eq(0);
    });
    it('multiple cases', function () {
        expect(Matcher_1.default(2)
            .case(1, function () { return true; })
            .case(2, function () { return false; })
            .exec()).to.eq(false);
    });
    it('basic types', function () {
        expect(Matcher_1.default(3)
            .case(2, function () { return 99; })
            .case(3, function () { return 44; })
            .exec()).to.eq(44);
        expect(Matcher_1.default('magic')
            .case('magic', function () { return 99; })
            .case('science', function () { return 44; })
            .exec()).to.eq(99);
        expect(Matcher_1.default([1, 2])
            .case([1, 3], function () { return 99; })
            .case([], function () { return 77; })
            .case([1, 2], function () { return 44; })
            .exec()).to.eq(44);
    });
    it('input is being passed to handler', function () {
        expect(Matcher_1.default(4)
            .case(4, function (x) { return x * x * x; })
            .exec()).to.eq(64);
    });
    it('runs only the first match (short circuit)', function () {
        var ran = false;
        expect(Matcher_1.default(true)
            .case(true, function () { return 0; })
            .case(true, function () {
            ran = true;
            return 1;
        })
            .exec()).to.be.eq(0);
        expect(ran).to.be.false; // tslint:disable-line
    });
    it('uses deep equality', function () {
        expect(Matcher_1.default({ a: { b: 4 } })
            .case({ a: { b: 4 } }, function () { return 'a'; })
            .case({}, function () { return 'b'; })
            .exec()).to.eq('a');
    });
    it('crashes on no match', function () {
        assert.throws(function () {
            Matcher_1.default(2).case(0, function () { }).case(1, function () { }).exec();
        });
    });
    it('guarded case', function () {
        expect(Matcher_1.default('x').caseGuarded(function () { return true; }, function (x) { return x + x; }).exec()).to.eq('xx');
    });
    it('default works as expected', function () {
        expect(Matcher_1.default(2)
            .case(0, function () { return 0; })
            .case(1, function () { return 1; })
            .default(function () { return 9; })
            .exec()).to.eq(9);
    });
});
//# sourceMappingURL=Matcher.js.map