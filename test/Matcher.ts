import * as chai from 'chai';
import Matcher from '../src/Matcher';

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
    expect(
      Matcher<any>({a: {b: 4}})
        .case({a: {b: 4}}, () => 'a')
        .case({}, () => 'b')
        .exec()
    ).to.eq('a');
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
});
