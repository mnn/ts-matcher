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
        var obj = { a: { b: 5 } };
        expect(Matcher_1.default(obj)
            .case({ a: { b: 4 } }, function () { return 'a'; })
            .case({ a: { b: 5 } }, function () { return 'b'; })
            .exec()).to.eq('b');
    });
    it('works nice with interfaces and classes', function () {
        var C = (function () {
            function C(a, b) {
                this.a = a;
                this.b = b;
            }
            return C;
        }());
        var x = new C(1, 'f');
        var y = new C(2, 'b');
        expect(Matcher_1.default(new C(2, 'b'))
            .case(x, function () { return 1; })
            .case(y, function () { return 2; })
            .exec()).to.eq(2);
    });
    it('crashes on no match', function () {
        assert.throws(function () {
            Matcher_1.default(2).case(0, function () { }).case(1, function () { }).exec();
        });
    });
    it('guarded case', function () {
        expect(Matcher_1.default('x').caseGuarded(function () { return true; }, function (x) { return x + x; }).exec()).to.eq('xx');
        expect(Matcher_1.default(-5)
            .caseGuarded(function (x) { return x < 0; }, function () { return 'less'; })
            .case(0, function () { return 'zero'; })
            .caseGuarded(function (x) { return x > 0; }, function () { return 'more'; })
            .exec()).to.eq('less');
    });
    it('default works as expected', function () {
        expect(Matcher_1.default(2)
            .case(0, function () { return 0; })
            .case(1, function () { return 1; })
            .default(function () { return 9; })
            .exec()).to.eq(9);
    });
    it('supports multiple values to compare to', function () {
        expect(Matcher_1.default(2)
            .caseMulti([0, 1], function () { return 0; })
            .caseMulti([2, 3], function () { return 1; })
            .caseMulti([4, 5], function () { return 2; })
            .exec()).to.be.eq(1);
        expect(Matcher_1.default('a')
            .caseMulti([], function () { return 0; })
            .caseMulti(['b', 'c', 'd'], function () { return 1; })
            .caseMulti(['a'], function () { return 2; })
            .exec()).to.be.eq(2);
        expect(Matcher_1.default({ a: 2 })
            .caseMulti([{ a: 0 }, { a: 1 }], function () { return 0; })
            .caseMulti([{ a: 2 }, { a: 3 }], function () { return 1; })
            .caseMulti([{ a: 4 }, { a: 5 }], function () { return 2; })
            .exec()).to.be.eq(1);
    });
    it('calc example', function () {
        var compute = function (a, b, op) {
            var result = Matcher_1.default(op)
                .case('+', function () { return a + b; })
                .case('-', function () { return a - b; })
                .case('*', function () { return a * b; })
                .case('/', function () { return a / b; })
                .exec();
            return { a: a, b: b, op: op, result: result };
        };
        var computeSwitch = function (a, b, op) {
            var result;
            switch (op) {
                case '+':
                    result = a + b;
                    break;
                case '-':
                    result = a - b;
                    break;
                case '*':
                    result = a * b;
                    break;
                case '/':
                    result = a / b;
                    break;
            }
            return { a: a, b: b, op: op, result: result };
        };
        expect(compute(1, 2, '+')).to.eql({ a: 1, b: 2, op: '+', result: 3 });
        expect(computeSwitch(1, 2, '+')).to.eql({ a: 1, b: 2, op: '+', result: 3 });
    });
});
//# sourceMappingURL=Matcher.js.map