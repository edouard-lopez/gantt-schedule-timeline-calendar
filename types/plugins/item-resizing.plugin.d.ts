import { Vido, htmlResult, Item, DataChartTime } from '../gstc';
import DeepState from 'deep-state-observer';
import { Point } from './timeline-pointer.plugin';
import { Dayjs } from 'dayjs';
export interface Handle {
    width?: number;
    horizontalMargin?: number;
    verticalMargin?: number;
    outside?: boolean;
    onlyWhenSelected?: boolean;
}
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
export interface Movement {
    px: number;
    time: number;
}
export interface OnStartArg {
    item: Item;
    selectedItems: Item[];
    state: DeepState;
    vido: Vido;
    time: DataChartTime;
}
export interface OnResizeArg extends OnStartArg {
    totalMovement: Movement;
    movement: Movement;
}
export interface OnEndArg extends OnStartArg {
    totalMovement: Movement;
}
export interface SnapToTime {
    start?: (snapStartArgs: SnapStartArg) => Dayjs;
    end?: (snapEndArgs: SnapEndArg) => Dayjs;
}
export interface Options {
    enabled?: boolean;
    debug?: boolean;
    handle?: Handle;
    content?: htmlResult;
    bodyClass?: string;
    bodyClassLeft?: string;
    bodyClassRight?: string;
    onStart?: (onArg: OnStartArg) => void;
    onResize?: (onArg: OnResizeArg) => boolean;
    onEnd?: (onArg: OnEndArg) => boolean;
    snapToTime?: SnapToTime;
}
export declare type State = 'start' | 'resize' | 'end' | '';
export interface PluginData extends Options {
    leftIsMoving: boolean;
    rightIsMoving: boolean;
    initialItems: Item[];
    initialPosition: Point;
    currentPosition: Point;
    state: State;
    movement: Movement;
}
export declare function Plugin(options?: Options): (vidoInstance: Vido) => () => void;
//# sourceMappingURL=item-resizing.plugin.d.ts.map