/// <reference types="lodash" />
import { IsEqualCustomizer } from 'lodash';
export declare type Matcher = <T>(input: T) => MatchingEmpty<T>;
export declare type OnMatch<T, R> = (_: T) => R;
/**
 * Matcher without any cases yet.
 * Not intended for users to be constructed directly.
 */
export declare class MatchingEmpty<T> {
    private value;
    constructor(value: T);
    /**
     * {@see Matching#case}.
     */
    case<R>(test: T, onMatch: OnMatch<T, R>, customizer?: IsEqualCustomizer): Matching<T, R>;
    /**
     * {@see Matching#caseMulti}.
     */
    caseMulti<R>(tests: T[], onMatch: OnMatch<T, R>, customizer?: IsEqualCustomizer): Matching<T, R>;
    /**
     * {@see Matching#caseGuarded}.
     */
    caseGuarded<R>(test: (_: T) => boolean, onMatch: OnMatch<T, R>): Matching<T, R>;
    private createMatching<R>();
}
/**
 * Matcher without some cases.
 * Not intended for users to be constructed directly.
 */
export declare class Matching<T, R> {
    private value;
    private tests;
    private test;
    private onMatch;
    constructor(value: T, tests: Matching<T, R>[]);
    /**
     * Creates one case. During execution value is being compared to {@param test} and if it matches {@param onMatch} is
     * called and its return value returned.
     * @param test - value to match against
     * @param onMatch - successful match handler
     * @param customizer - optional parameter used for customizing equality checking
     * @return {@link Matching} object for adding more cases and as a last call in a chain invoking
     *                          an execution - {@link exec}.
     */
    case(test: T, onMatch: OnMatch<T, R>, customizer?: IsEqualCustomizer): Matching<T, R>;
    /**
     * Creates multiple cases. During execution value is being compared to items in {@param tests} and if
     * any of it matches, {@param onMatch} is called and its return value returned.
     * @param tests - value to match against
     * @param onMatch - successful match handler
     * @param customizer - optional parameter used for customizing equality checking
     * @return {@link Matching} object for adding more cases and as a last call in a chain invoking
     *                          an execution - {@link exec}.
     */
    caseMulti(tests: T[], onMatch: OnMatch<T, R>, customizer?: IsEqualCustomizer): Matching<T, R>;
    /**
     * Creates one case.
     * More generic variant of {@link case}. Accepts a function instead of a value to compare.
     * @param test - function doing the test
     * @param onMatch - successful match handler
     * @return
     */
    caseGuarded(test: (_: T) => boolean, onMatch: OnMatch<T, R>): Matching<T, R>;
    /**
     * Creates default case.
     * @param onMatch - successful match handler (always run if every case before has failed)
     * @return
     */
    default(onMatch: OnMatch<T, R>): Matching<T, R>;
    /**
     * Evaluates - runs sequentially all cases and finds first test retuning true.
     * When successful case is found then is called its onMatch handler and its return value is returned.
     * @return return value from onMatch handler
     */
    exec(): R;
}
declare const f: Matcher;
export default f;
