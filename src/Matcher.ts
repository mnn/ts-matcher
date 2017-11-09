import isEqualWith = require('lodash.isequalwith');
import { IsEqualCustomizer } from 'lodash';

export type Matcher = <T>(input: T) => MatchingEmpty<T>;

export type OnMatch<T, R> = (_: T) => R;

export class MatchingEmpty<T> {
  constructor(private value: T) { }

  case<R>(test: T, onMatch: OnMatch<T, R>): Matching<T, R> {
    return this.createMatching<R>().case(test, onMatch);
  }

  caseGuarded<R>(test: (_: T) => boolean, onMatch: OnMatch<T, R>): Matching<T, R> {
    return this.createMatching<R>().caseGuarded(test, onMatch);
  }

  private createMatching<R>(): Matching<T, R> {
    return new Matching<T, R>(this.value, []);
  }
}

export class Matching<T, R> {
  private test: (_: T) => boolean;
  private onMatch: OnMatch<T, R>;

  constructor(private value: T, private tests: Matching<T, R>[]) { }

  case(test: T, onMatch: OnMatch<T, R>, customizer?: IsEqualCustomizer): Matching<T, R> {
    return this.caseGuarded(x => isEqualWith(x, test, customizer), onMatch);
  }

  caseGuarded(test: (_: T) => boolean, onMatch: OnMatch<T, R>): Matching<T, R> {
    this.test = test;
    this.onMatch = onMatch;
    return new Matching<T, R>(this.value, this.tests.concat(this));
  }

  default(onMatch: () => R): Matching<T, R> {
    return this.caseGuarded(() => true, onMatch);
  }

  exec(): R {
    const process = (remaining: Matching<T, R>[]): R => {
      if (remaining.length <= 0) { throw new Error(`Unmatched value ${this.value}.`); }
      const cur = remaining[0];
      return cur.test(this.value) ? cur.onMatch(this.value) : process(remaining.slice(1));
    };
    return process(this.tests);
  }
}

const f = <Matcher>function <T>(input: T): MatchingEmpty<T> {
  return new MatchingEmpty<T>(input);
};

export default f;
