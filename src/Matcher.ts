import isEqualWith = require('lodash.isequalwith');
import { IsEqualCustomizer } from 'lodash';

export type Matcher = <T>(input: T) => MatchingEmpty<T>;

export type OnMatch<T, R> = (_: T) => R;

/**
 * Matcher without any cases yet.
 * Not intended for users to be constructed directly.
 */
export class MatchingEmpty<T> {
  constructor(private value: T) { }

  /**
   * Creates one case. During execution value is being compared to {@param test} and if it matches {@param onMatch} is
   * called and its return value returned.
   * @param test - value to match against
   * @param onMatch - successful match handler
   * @param customizer - optional parameter used for customizing equality checking
   * @return {@link Matching} object for adding more cases and as a last call in a chain invoking
   *                          an execution - {@link exec}.
   */
  case<R>(test: T, onMatch: OnMatch<T, R>, customizer?: IsEqualCustomizer): Matching<T, R> {
    return this.createMatching<R>().case(test, onMatch, customizer);
  }

  /**
   * Creates one case.
   * More generic variant of {@link case}. Accepts a function instead of a value to compare.
   * @param test - function doing the test
   * @param onMatch - successful match handler
   * @return
   */
  caseGuarded<R>(test: (_: T) => boolean, onMatch: OnMatch<T, R>): Matching<T, R> {
    return this.createMatching<R>().caseGuarded(test, onMatch);
  }

  private createMatching<R>(): Matching<T, R> {
    return new Matching<T, R>(this.value, []);
  }
}

/**
 * Matcher without some cases.
 * Not intended for users to be constructed directly.
 */
export class Matching<T, R> {
  private test: (_: T) => boolean;
  private onMatch: OnMatch<T, R>;

  constructor(private value: T, private tests: Matching<T, R>[]) { }

  /**
   * Creates one case. During execution value is being compared to {@param test} and if it matches {@param onMatch} is
   * called and its return value returned.
   * @param test - value to match against
   * @param onMatch - successful match handler
   * @param customizer - optional parameter used for customizing equality checking
   * @return {@link Matching} object for adding more cases and as a last call in a chain invoking
   *                          an execution - {@link exec}.
   */
  case(test: T, onMatch: OnMatch<T, R>, customizer?: IsEqualCustomizer): Matching<T, R> {
    return this.caseGuarded(x => isEqualWith(x, test, customizer), onMatch);
  }

  /**
   * Creates one case.
   * More generic variant of {@link case}. Accepts a function instead of a value to compare.
   * @param test - function doing the test
   * @param onMatch - successful match handler
   * @return
   */
  caseGuarded(test: (_: T) => boolean, onMatch: OnMatch<T, R>): Matching<T, R> {
    this.test = test;
    this.onMatch = onMatch;
    return new Matching<T, R>(this.value, this.tests.concat(this));
  }

  /**
   * Creates default case.
   * @param onMatch - successful match handler (always run if every case before has failed)
   * @return
   */
  default(onMatch: OnMatch<T, R>): Matching<T, R> {
    return this.caseGuarded(() => true, onMatch);
  }

  /**
   * Evaluates - runs sequentially all cases and finds first test retuning true.
   * When successful case is found then is called its onMatch handler and its return value is returned.
   * @return return value from onMatch handler
   */
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
