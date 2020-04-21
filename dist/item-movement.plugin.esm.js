/**
 * TimelinePointer plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
const ITEM = 'chart-timeline-items-row-item';

/**
 * ItemMovement plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
function prepareOptions(options) {
    return Object.assign({ enabled: true, className: '', bodyClass: 'gstc-item-movement', bodyClassMoving: 'gstc-items-moving' }, options);
}
const pluginPath = 'config.plugin.ItemMovement';
function generateEmptyPluginData(options) {
    const result = Object.assign({ debug: false, moving: [], initialItems: [], pointerState: 'up', pointerMoved: false, state: '', position: { x: 0, y: 0 }, movement: {
            px: { horizontal: 0, vertical: 0 },
            time: 0,
        }, lastMovement: { x: 0, y: 0, time: 0 }, onStart() {
            return true;
        },
        onMove() {
            return true;
        },
        onEnd() {
            return true;
        },
        onRowChange() {
            return true;
        }, snapToTime: {
            start({ startTime, time }) {
                return startTime.startOf(time.period);
            },
            end({ endTime, time }) {
                return endTime.endOf(time.period);
            },
        } }, options);
    if (options.snapToTime) {
        result.snapToTime = Object.assign(Object.assign({}, result.snapToTime), options.snapToTime);
    }
    return result;
}
class ItemMovement {
    constructor(vido) {
        this.onDestroy = [];
        this.cumulations = {};
        this.relativeVerticalPosition = {};
        this.vido = vido;
        this.api = vido.api;
        this.state = vido.state;
        this.merge = this.state.get('config.merge');
        this.destroy = this.destroy.bind(this);
        this.onDestroy.push(this.state.subscribe(pluginPath, (data) => {
            this.data = data;
            if (!data.enabled) {
                document.body.classList.remove(this.data.bodyClass);
            }
            else {
                document.body.classList.add(this.data.bodyClass);
            }
        }));
        if (!this.data.className)
            this.data.className = this.api.getClass('chart-timeline-items-row-item--moving');
        this.onSelectionChange = this.onSelectionChange.bind(this);
        this.onDestroy.push(this.state.subscribe('config.plugin.Selection', this.onSelectionChange));
    }
    destroy() {
        this.onDestroy.forEach((unsub) => unsub());
    }
    updateData() {
        this.state.update(pluginPath, this.data);
    }
    clearCumulationsForItems() {
        this.cumulations = {};
    }
    setStartCumulationForItem(item, cumulation) {
        if (!this.cumulations[item.id]) {
            this.cumulations[item.id] = { start: 0, end: 0 };
        }
        this.cumulations[item.id].start = cumulation;
    }
    getStartCumulationForItem(item) {
        var _a;
        return ((_a = this.cumulations[item.id]) === null || _a === void 0 ? void 0 : _a.start) || 0;
    }
    getItemMovingTimes(item, time) {
        const horizontal = this.data.movement.px.horizontal;
        const positionLeft = this.api.time.getViewOffsetPxFromDates(item.$data.time.startDate, false, time);
        const x = positionLeft + horizontal + this.getStartCumulationForItem(item);
        const leftGlobal = this.api.time.getTimeFromViewOffsetPx(x, time);
        const startTime = this.data.snapToTime.start({
            startTime: this.api.time.date(leftGlobal),
            item,
            time,
            movement: this.data.movement,
            vido: this.vido,
        });
        const snapStartPxDiff = this.api.time.getDatesDiffPx(startTime, this.api.time.date(leftGlobal), time, true);
        this.setStartCumulationForItem(item, snapStartPxDiff);
        const startEndTimeDiff = item.$data.time.endDate.diff(item.$data.time.startDate, 'millisecond');
        // diff could be too much if we are in the middle of european summer time (daylight-saving time)
        const rightGlobal = startTime.add(startEndTimeDiff, 'millisecond').valueOf();
        const rightGlobalDate = this.api.time.date(rightGlobal);
        /* // summer time / daylight saving time bug
        const leftFmt = rightGlobalDate.format('YYYY-MM-DD HH:mm:ss');
        const rightFmt = rightGlobalDate.endOf(time.period).format('YYYY-MM-DD HH:mm:ss');
        if (leftFmt !== rightFmt) {
          console.log('no match', leftFmt, rightFmt);
        }*/
        const endTime = this.data.snapToTime.end({
            endTime: rightGlobalDate,
            item,
            time,
            movement: this.data.movement,
            vido: this.vido,
        });
        return { startTime, endTime };
    }
    findRowAtViewPosition(y, currentRow) {
        const visibleRows = this.state.get('$data.list.visibleRows');
        for (const row of visibleRows) {
            const rowBottom = row.$data.position.viewTop + row.$data.outerHeight;
            if (row.$data.position.viewTop <= y && rowBottom >= y)
                return row;
        }
        return currentRow;
    }
    getItemViewTop(item) {
        const rows = this.state.get('config.list.rows');
        const row = rows[item.rowId];
        return row.$data.position.viewTop + item.$data.position.actualTop;
    }
    saveItemsRelativeVerticalPosition() {
        for (const item of this.data.moving) {
            const relativePosition = this.data.position.y - this.getItemViewTop(item);
            this.setItemRelativeVerticalPosition(item, relativePosition);
        }
    }
    setItemRelativeVerticalPosition(item, relativePosition) {
        this.relativeVerticalPosition[item.id] = relativePosition;
    }
    getItemRelativeVerticalPosition(item) {
        return this.relativeVerticalPosition[item.id];
    }
    moveItemVertically(item, multi) {
        const rows = this.state.get('config.list.rows');
        const currentRow = rows[item.rowId];
        const relativePosition = this.getItemRelativeVerticalPosition(item);
        const itemShouldBeAt = this.data.position.y + relativePosition;
        const newRow = this.findRowAtViewPosition(itemShouldBeAt, currentRow);
        if (newRow.id !== item.rowId) {
            if (this.data.onRowChange(item, newRow)) {
                multi = multi.update(`config.chart.items.${item.id}.rowId`, newRow.id);
            }
        }
        return multi;
    }
    moveItems() {
        const time = this.state.get('$data.chart.time');
        let multi = this.state.multi();
        const moving = this.data.moving.map((item) => this.merge({}, item));
        if (this.data.debug)
            console.log('moveItems', moving);
        for (let item of moving) {
            const newItemTimes = this.getItemMovingTimes(item, time);
            multi = this.moveItemVertically(item, multi);
            if (newItemTimes.startTime.valueOf() !== item.time.start || newItemTimes.endTime.valueOf() !== item.time.end) {
                multi = multi
                    .update(`config.chart.items.${item.id}.time`, (itemTime) => {
                    itemTime.start = newItemTimes.startTime.valueOf();
                    itemTime.end = newItemTimes.endTime.valueOf();
                    return itemTime;
                })
                    .update(`config.chart.items.${item.id}.$data.time`, (dataTime) => {
                    dataTime.startDate = newItemTimes.startTime;
                    dataTime.endDate = newItemTimes.endTime;
                    return dataTime;
                });
            }
        }
        multi.done();
    }
    clearSelection() {
        this.data.moving = [];
        this.data.initialItems = [];
        this.data.movement.px.horizontal = 0;
        this.data.movement.px.vertical = 0;
        this.data.movement.time = 0;
        this.data.pointerState = 'up';
        this.data.pointerMoved = false;
    }
    onStart() {
        this.clearCumulationsForItems();
        document.body.classList.add(this.data.bodyClassMoving);
        this.data.position = Object.assign({}, this.selection.currentPosition);
        this.data.lastMovement.time = this.data.moving[0].time.start;
        this.saveItemsRelativeVerticalPosition();
    }
    onEnd() {
        document.body.classList.remove(this.data.bodyClassMoving);
    }
    restoreInitialItems() {
        let multi = this.state.multi();
        if (this.data.debug)
            console.log('restoreInitialItems', [...this.data.initialItems]);
        for (const item of this.data.initialItems) {
            multi = multi.update(`config.chart.items.${item.id}`, item);
        }
        multi.done();
        this.clearSelection();
        this.updateData();
    }
    canMove(state, onArg) {
        if (this.data.debug)
            console.log('canMove', state, onArg);
        switch (state) {
            case 'start':
                if (this.data.debug)
                    console.log('canMove start', state, onArg, this.data.onStart);
                return this.data.onStart(onArg);
            case 'move':
                if (this.data.debug)
                    console.log('canMove move', state, onArg, this.data.onMove);
                return this.data.onMove(onArg);
            case 'end':
                if (this.data.debug)
                    console.log('canMove end', state, onArg, this.data.onEnd);
                return this.data.onEnd(onArg);
        }
        return true;
    }
    onSelectionChange(data) {
        if (!this.data.enabled)
            return;
        this.selection = data;
        if (this.selection.targetType !== ITEM) {
            return this.clearSelection();
        }
        if (this.selection.events.move) {
            this.selection.events.move.preventDefault();
            this.selection.events.move.stopPropagation();
        }
        if (this.selection.events.down) {
            this.selection.events.down.preventDefault();
            this.selection.events.down.stopPropagation();
        }
        if (this.data.pointerState === 'up' && this.selection.pointerState === 'down') {
            this.data.state = 'start';
        }
        else if ((this.data.pointerState === 'down' || this.data.pointerState === 'move') &&
            this.selection.pointerState === 'up') {
            this.data.state = 'end';
        }
        else if (this.data.pointerState === 'move' && this.selection.pointerState === 'move') {
            this.data.state = 'move';
        }
        else if (this.data.pointerState === 'up' &&
            (this.selection.pointerState === 'move' || this.selection.pointerState === 'up')) {
            // do nothing because movement was rejected
            return;
        }
        this.data.pointerState = this.selection.pointerState;
        this.data.moving = [...this.selection.selected[ITEM]];
        if (this.data.state === 'start') {
            this.data.initialItems = this.data.moving.map((item) => this.merge({}, item));
        }
        if (this.data.debug)
            console.log('state', this.data.pointerState);
        switch (this.data.state) {
            case 'start':
                this.onStart();
                break;
            case 'end':
                this.onEnd();
                break;
        }
        this.data.lastMovement.x = this.data.movement.px.horizontal;
        this.data.lastMovement.y = this.data.movement.px.vertical;
        this.data.movement.px.horizontal = this.selection.currentPosition.x - this.data.position.x;
        this.data.movement.px.vertical = this.selection.currentPosition.y - this.data.position.y;
        this.data.movement.time = this.data.moving[0].time.start - this.data.lastMovement.time;
        this.data.position.x = this.selection.currentPosition.x;
        this.data.position.y = this.selection.currentPosition.y;
        this.data.lastMovement.time = this.data.moving[0].time.start;
        if (this.data.state === 'move' &&
            this.data.lastMovement.x === this.data.movement.px.horizontal &&
            this.data.lastMovement.y === this.data.movement.px.vertical) {
            // prevent movement if there is no movement... (performance optimisation)
            return this.updateData();
        }
        const onArg = {
            items: this.data.moving.map((item) => this.merge({}, item)),
            vido: this.vido,
            movement: Object.assign(Object.assign({}, this.data.movement), { px: Object.assign({}, this.data.movement.px) }),
            time: this.state.get('$data.chart.time'),
        };
        if (this.data.state === 'end') {
            // at the end emit full movement
            onArg.movement = {
                time: this.data.moving[0].time.start - this.data.initialItems[0].time.start,
                px: {
                    horizontal: this.data.moving[0].$data.position.left - this.data.initialItems[0].$data.position.left,
                    vertical: this.data.moving[0].$data.position.viewTop - this.data.initialItems[0].$data.position.viewTop,
                },
            };
        }
        if (this.canMove(this.data.state, onArg)) {
            this.moveItems();
        }
        else {
            this.data.pointerState = 'up';
            if (this.data.state === 'end') {
                this.restoreInitialItems();
            }
        }
        this.updateData();
    }
}
function Plugin(options = {}) {
    return function initialize(vidoInstance) {
        vidoInstance.state.update(pluginPath, generateEmptyPluginData(prepareOptions(options)));
        const itemMovement = new ItemMovement(vidoInstance);
        return itemMovement.destroy;
    };
}

export { Plugin };
//# sourceMappingURL=item-movement.plugin.esm.js.map
