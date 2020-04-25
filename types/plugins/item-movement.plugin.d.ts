import { Item, DataChartTime, Vido } from '../gstc';
import { Point } from './timeline-pointer.plugin';
import { Dayjs } from 'dayjs';
import DeepState from 'deep-state-observer';
export interface SnapArg {
    item: Item;
    time: DataChartTime;
    vido: Vido;
    movement: Movement;
}
export interface SnapStartArg extends SnapArg {
    startTime: Dayjs;
}
export interface SnapEndArg extends SnapArg {
    endTime: Dayjs;
}
export interface SnapToTime {
    start?: (snapStartArgs: SnapStartArg) => Dayjs;
    end?: (snapEndArgs: SnapEndArg) => Dayjs;
}
export interface BeforeAfterInitialItems {
    initial: Item[];
    before: Item[];
    after: Item[];
    targetData: Item;
}
export interface OnArg {
    items: BeforeAfterInitialItems;
    vido: Vido;
    state: DeepState;
    time: DataChartTime;
}
export interface Events {
    onStart?: (onArg: OnArg) => Item[];
    onMove?: (onArg: OnArg) => Item[];
    onEnd?: (onArg: OnArg) => Item[];
}
export interface Options {
    enabled?: boolean;
    className?: string;
    bodyClass?: string;
    bodyClassMoving?: string;
    events?: Events;
    snapToTime?: SnapToTime;
    debug?: boolean;
}
export interface MovementResult {
    horizontal: number;
    vertical: number;
}
export interface Movement {
    px: MovementResult;
    time: number;
}
export interface LastMovement {
    x: number;
    y: number;
    time: number;
}
export interface PluginData extends Options {
    moving: Item[];
    targetData: Item | null;
    initialItems: Item[];
    movement: Movement;
    lastMovement: LastMovement;
    position: Point;
    pointerState: 'up' | 'down' | 'move';
    state: State;
    pointerMoved: boolean;
}
export interface MovingTimes {
    startTime: Dayjs;
    endTime: Dayjs;
}
export declare type State = '' | 'start' | 'end' | 'move' | '';
export interface Cumulation {
    start: number;
    end: number;
}
export interface Cumulations {
    [key: string]: Cumulation;
}
export interface RelativeVerticalPosition {
    [key: string]: number;
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=item-movement.plugin.d.ts.map