import * as chai from 'chai';
import Matcher, { MatcherConfig } from '../src/Matcher';

const {expect, assert} = chai;

describe('Matcher', () => {
  it('one case', () => {
    expect(
      Matcher(1)
        .case(1, () => 0)
        .exec()
    ).to.eq(0);
  });

  it('multiple cases', () => {
    expect(
      Matcher(2)
        .case(1, () => true)
        .case(2, () => false)
        .exec()
    ).to.eq(false);
  });

  it('basic types', () => {
    expect(
      Matcher(3)
        .case(2, () => 99)
        .case(3, () => 44)
        .exec()
    ).to.eq(44);
    expect(
      Matcher('magic')
        .case('magic', () => 99)
        .case('science', () => 44)
        .exec()
    ).to.eq(99);
    expect(
      Matcher([1, 2])
        .case([1, 3], () => 99)
        .case([], () => 77)
        .case([1, 2], () => 44)
        .exec()
    ).to.eq(44);
  });

  it('input is being passed to handler', () => {
    expect(
      Matcher(4)
        .case(4, x => x * x * x)
        .exec()
    ).to.eq(64);
  });

  it('runs only the first match (short circuit)', () => {
    let ran = false;
    expect(
      Matcher(true)
        .case(true, () => 0)
        .case(true, () => {
          ran = true;
          return 1;
        })
        .exec()
    ).to.be.eq(0);
    expect(ran).to.be.false; // tslint:disable-line
  });

  it('uses deep equality', () => {
    interface AB {a: { b: number }}

    const obj: AB = {a: {b: 5}};
    expect(
      Matcher(obj)
        .case({a: {b: 4}}, () => 'a')
        .case({a: {b: 5}}, () => 'b')
        .exec()
    ).to.eq('b');
  });

  it('works nice with interfaces and classes', () => {
    class C {constructor(public a: number, public b: string) { }}

    const x = new C(1, 'f');
    const y = new C(2, 'b');
    expect(
      Matcher(new C(2, 'b'))
        .case(x, () => 1)
        .case(y, () => 2)
        .exec()
    ).to.eq(2);
  });

  it('crashes on no match', () => {
    assert.throws(() => {
      Matcher(2).case(0, () => {}).case(1, () => {}).exec();
    });
  });

  it('guarded case', () => {
    expect(
      Matcher('x').caseGuarded(() => true, x => x + x).exec()
    ).to.eq('xx');
    expect(
      Matcher(-5)
        .caseGuarded(x => x < 0, () => 'less')
        .case(0, () => 'zero')
        .caseGuarded(x => x > 0, () => 'more')
        .exec()
    ).to.eq('less');
  });

  it('default works as expected', () => {
    expect(
      Matcher(2)
        .case(0, () => 0)
        .case(1, () => 1)
        .default(() => 9)
        .exec()
    ).to.eq(9);
  });

  it('supports multiple values to compare to', () => {
    expect(
      Matcher(2)
        .caseMulti([0, 1], () => 0)
        .caseMulti([2, 3], () => 1)
        .caseMulti([4, 5], () => 2)
        .exec()
    ).to.be.eq(1);
    expect(
      Matcher('a')
        .caseMulti([], () => 0)
        .caseMulti(['b', 'c', 'd'], () => 1)
        .caseMulti(['a'], () => 2)
        .exec()
    ).to.be.eq(2);
    expect(
      Matcher({a: 2})
        .caseMulti([{a: 0}, {a: 1}], () => 0)
        .caseMulti([{a: 2}, {a: 3}], () => 1)
        .caseMulti([{a: 4}, {a: 5}], () => 2)
        .exec()
    ).to.be.eq(1);
  });

  it('calc example', () => {
    type Operation = '+' | '-' | '*' | '/';

    interface Computation {
      a: number;
      b: number;
      op: Operation;
      result: number;
    }

    const compute = (a: number, b: number, op: Operation): Computation => {
      const result = Matcher(op)
        .case('+', () => a + b)
        .case('-', () => a - b)
        .case('*', () => a * b)
        .case('/', () => a / b)
        .exec();
      return {a, b, op, result};
    };
    const computeSwitch = (a: number, b: number, op: Operation): Computation => {
      let result;
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
      return {a, b, op, result: <number>result};
    };
    expect(compute(1, 2, '+')).to.eql({a: 1, b: 2, op: '+', result: 3});
    expect(computeSwitch(1, 2, '+')).to.eql({a: 1, b: 2, op: '+', result: 3});
  });

  describe('exec check', () => {
    before(() => {
      MatcherConfig.debug = true;
    });

    after(() => {
      MatcherConfig.debug = false;
    });

    it('proper use', () => {
      Matcher(1).case(1, () => {}).exec();
    });

    // TODO: how to test throwing from setTimeout?

    it('invalid use', () => {
      Matcher(1).case(1, () => {});
    });

    it('invalid use', done => {
      Matcher(1).case(1, () => {});
      setTimeout(() => done(), MatcherConfig.execCheckTimeout + 10);
    });

    it('setTimeout throw', _ => {
      setTimeout(() => { throw new Error(); }, 1); // this is given, cannot be modified
    });
  });
});
