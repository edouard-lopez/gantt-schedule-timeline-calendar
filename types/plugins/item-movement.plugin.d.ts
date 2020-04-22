import { Item, DataChartTime, Vido, Row } from '../gstc';
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
export interface OnStartArg {
    item: Item;
    selectedItems: Item[];
    vido: Vido;
    state: DeepState;
    time: DataChartTime;
}
export interface OnMoveArg extends OnStartArg {
    movement: Movement;
}
export interface OnEndArg extends OnStartArg {
    totalMovement: Movement;
}
export interface OnRowArg extends OnStartArg {
    row: Row;
}
export declare type OnArg = OnStartArg | OnMoveArg | OnEndArg | OnRowArg;
export interface SnapToTime {
    start?: (snapStartArgs: SnapStartArg) => Dayjs;
    end?: (snapEndArgs: SnapEndArg) => Dayjs;
}
export interface Options {
    enabled?: boolean;
    className?: string;
    bodyClass?: string;
    bodyClassMoving?: string;
    onStart?: (onArg: OnStartArg) => void;
    onMove?: (onArg: OnMoveArg) => boolean;
    onEnd?: (onArg: OnEndArg) => boolean;
    onRowChange?: (onArg: OnRowArg) => boolean;
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