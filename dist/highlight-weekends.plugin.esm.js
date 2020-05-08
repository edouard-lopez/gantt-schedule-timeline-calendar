class Action {
    constructor() {
        this.isAction = true;
    }
}
Action.prototype.isAction = true;

/**
 * Weekend highlight plugin
 *
 * @copyright Rafal Pospiech <https://neuronet.io>
 * @author    Rafal Pospiech <neuronet.io@gmail.com>
 * @package   gantt-schedule-timeline-calendar
 * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
 * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
 */
function Plugin(options = {}) {
    const weekdays = options.weekdays || [6, 0];
    let className;
    let api;
    let enabled = true;
    class WeekendHighlightAction extends Action {
        constructor(element, data) {
            super();
            this.highlight(element, data.time.leftGlobal);
        }
        update(element, data) {
            this.highlight(element, data.time.leftGlobal);
        }
        highlight(element, time) {
            const hasClass = element.classList.contains(className);
            if (!enabled) {
                if (hasClass) {
                    element.classList.remove(className);
                }
                return;
            }
            const isWeekend = weekdays.includes(api.time.date(time).day());
            if (!hasClass && isWeekend) {
                element.classList.add(className);
            }
            else if (hasClass && !isWeekend) {
                element.classList.remove(className);
            }
        }
    }
    return function initialize(vidoInstance) {
        const subs = [];
        const pluginPath = 'config.plugin.HighlightWeekends';
        api = vidoInstance.api;
        className = options.className || api.getClass('chart-timeline-grid-row-cell') + '--weekend';
        subs.push(vidoInstance.state.subscribe(pluginPath, (value) => {
            if (value)
                options = value;
        }));
        subs.push(vidoInstance.state.subscribe('$data.chart.time.format.period', (period) => (enabled = period === 'day')));
        vidoInstance.state.update('config.actions.chart-timeline-grid-row-cell', (actions) => {
            actions.push(WeekendHighlightAction);
            return actions;
        });
        return function onDestroy() {
            subs.forEach((unsub) => unsub());
        };
    };
}

export { Plugin };
//# sourceMappingURL=highlight-weekends.plugin.esm.js.map
