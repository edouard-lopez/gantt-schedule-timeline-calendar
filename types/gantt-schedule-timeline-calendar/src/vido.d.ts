import * as vido from '../../vido/vido.d';
import Vido from '../../vido';
export default Vido;
export declare const vido_: {
    default<State, Api>(state: State, api: Api): vido.vido<State, Api>;
    lithtml: typeof vido.lithtml;
    Action: typeof vido.Action;
    Directive: typeof vido.lithtml.Directive;
    schedule: typeof vido.schedule;
    Detach: typeof vido.Detach;
    StyleMap: typeof vido.StyleMap;
    PointerAction: typeof vido.PointerAction;
    asyncAppend: <T>(value: AsyncIterable<T>, mapper?: (v: T, index?: number) => unknown) => (part: vido.lithtml.Part) => Promise<void>;
    asyncReplace: <T_1>(value: AsyncIterable<T_1>, mapper?: (v: T_1, index?: number) => unknown) => (part: vido.lithtml.Part) => Promise<void>;
    cache: (value: unknown) => (part: vido.lithtml.Part) => void;
    classMap: (classInfo: import("lit-html-optimised/directives/class-map").ClassInfo) => (part: vido.lithtml.Part) => void;
    guard: (value: unknown, f: () => unknown) => (part: vido.lithtml.Part) => void;
    ifDefined: (value: unknown) => (part: vido.lithtml.Part) => void;
    repeat: <T_2>(items: Iterable<T_2>, keyFnOrTemplate: import("lit-html-optimised/directives/repeat").KeyFn<T_2> | import("lit-html-optimised/directives/repeat").ItemTemplate<T_2>, template?: import("lit-html-optimised/directives/repeat").ItemTemplate<T_2>) => vido.lithtml.DirectiveFn;
    unsafeHTML: (value: unknown) => (part: vido.lithtml.Part) => void;
    until: (...args: unknown[]) => (part: vido.lithtml.Part) => void;
};
//# sourceMappingURL=vido.d.ts.map