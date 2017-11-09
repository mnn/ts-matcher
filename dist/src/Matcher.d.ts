/// <reference types="lodash" />
import { IsEqualCustomizer } from 'lodash';
export declare type Matcher = <T>(input: T) => MatchingEmpty<T>;
export declare type OnMatch<T, R> = (_: T) => R;
export declare class MatchingEmpty<T> {
    private value;
    constructor(value: T);
    case<R>(test: T, onMatch: OnMatch<T, R>): Matching<T, R>;
    caseGuarded<R>(test: (_: T) => boolean, onMatch: OnMatch<T, R>): Matching<T, R>;
    private createMatching<R>();
}
export declare class Matching<T, R> {
    private value;
    private tests;
    private test;
    private onMatch;
    constructor(value: T, tests: Matching<T, R>[]);
    case(test: T, onMatch: OnMatch<T, R>, customizer?: IsEqualCustomizer): Matching<T, R>;
    caseGuarded(test: (_: T) => boolean, onMatch: OnMatch<T, R>): Matching<T, R>;
    default(onMatch: () => R): Matching<T, R>;
    exec(): R;
}
declare const f: Matcher;
export default f;
