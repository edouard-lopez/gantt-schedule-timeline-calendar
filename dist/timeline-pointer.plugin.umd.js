(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.TimelinePointer = {}));
}(this, (function (exports) { 'use strict';

  /**
   * TimelinePointer plugin
   *
   * @copyright Rafal Pospiech <https://neuronet.io>
   * @author    Rafal Pospiech <neuronet.io@gmail.com>
   * @package   gantt-schedule-timeline-calendar
   * @license   AGPL-3.0 (https://github.com/neuronetio/gantt-schedule-timeline-calendar/blob/master/LICENSE)
   * @link      https://github.com/neuronetio/gantt-schedule-timeline-calendar
   */
  const CELL = 'chart-timeline-grid-row-cell';
  const ITEM = 'chart-timeline-items-row-item';
  function generateEmptyData(options) {
      const result = {
          enabled: true,
          isMoving: false,
          pointerState: 'up',
          currentTarget: null,
          realTarget: null,
          targetType: '',
          targetData: null,
          captureEvents: {
              down: false,
              up: false,
              move: false,
          },
          initialPosition: { x: 0, y: 0 },
          currentPosition: { x: 0, y: 0 },
          events: {
              down: null,
              move: null,
              up: null,
          },
      };
      if (options.captureEvents) {
          result.captureEvents = Object.assign(Object.assign({}, result.captureEvents), options.captureEvents);
      }
      return result;
  }
  const pluginPath = 'config.plugin.TimelinePointer';
  class TimelinePointer {
      constructor(options, vido) {
          this.unsub = [];
          this.classNames = {
              cell: '',
              item: '',
          };
          this.vido = vido;
          this.api = vido.api;
          this.state = vido.state;
          this.element = this.state.get(`$data.elements.chart-timeline`);
          this.pointerDown = this.pointerDown.bind(this);
          this.pointerMove = this.pointerMove.bind(this);
          this.pointerUp = this.pointerUp.bind(this);
          this.data = generateEmptyData(options);
          this.classNames.cell = this.api.getClass(CELL);
          this.classNames.item = this.api.getClass(ITEM);
          this.element.addEventListener('pointerdown', this.pointerDown, this.data.captureEvents.down);
          document.addEventListener('pointerup', this.pointerUp, this.data.captureEvents.up);
          document.addEventListener('pointermove', this.pointerMove, this.data.captureEvents.move);
          this.unsub.push(this.state.subscribe(pluginPath, (value) => (this.data = value)));
      }
      destroy() {
          if (this && this.element) {
              this.element.removeEventListener('pointerdown', this.pointerDown);
              document.removeEventListener('pointerup', this.pointerUp);
              document.removeEventListener('pointermove', this.pointerMove);
          }
      }
      updateData() {
          this.state.update(pluginPath, () => (Object.assign({}, this.data)));
      }
      getRealTarget(ev) {
          let realTarget = ev.target.closest('.' + this.classNames.item);
          if (realTarget) {
              return realTarget;
          }
          realTarget = ev.target.closest('.' + this.classNames.cell);
          if (realTarget) {
              return realTarget;
          }
          return null;
      }
      getRealPosition(ev) {
          const pos = { x: 0, y: 0 };
          if (this.element) {
              const bounding = this.element.getBoundingClientRect();
              pos.x = ev.x - bounding.x;
              pos.y = ev.y - bounding.y;
          }
          return pos;
      }
      pointerDown(ev) {
          if (!this.data.enabled)
              return;
          this.data.pointerState = 'down';
          this.data.currentTarget = ev.target;
          this.data.realTarget = this.getRealTarget(ev);
          if (this.data.realTarget) {
              if (this.data.realTarget.classList.contains(this.classNames.item)) {
                  this.data.targetType = ITEM;
                  // @ts-ignore
                  this.data.targetData = this.data.realTarget.vido.item;
              }
              else if (this.data.realTarget.classList.contains(this.classNames.cell)) {
                  this.data.targetType = CELL;
                  // @ts-ignore
                  this.data.targetData = this.data.realTarget.vido;
              }
              else {
                  this.data.targetType = '';
              }
          }
          else {
              this.data.targetType = '';
              this.data.targetData = null;
          }
          this.data.isMoving = !!this.data.realTarget;
          this.data.events.down = ev;
          this.data.events.move = ev;
          const realPosition = this.getRealPosition(ev);
          this.data.initialPosition = realPosition;
          this.data.currentPosition = realPosition;
          this.updateData();
      }
      pointerUp(ev) {
          if (!this.data.enabled)
              return;
          this.data.pointerState = 'up';
          this.data.isMoving = false;
          this.data.events.up = ev;
          this.data.currentPosition = this.getRealPosition(ev);
          this.updateData();
      }
      pointerMove(ev) {
          if (!this.data.enabled || !this.data.isMoving)
              return;
          this.data.pointerState = 'move';
          this.data.events.move = ev;
          this.data.currentPosition = this.getRealPosition(ev);
          this.updateData();
      }
  }
  function Plugin(options) {
      return function initialize(vidoInstance) {
          const defaultData = generateEmptyData(options);
          // for other plugins that are initialized before elements are saved
          vidoInstance.state.update(pluginPath, defaultData);
          let timelinePointerDestroy;
          const unsub = vidoInstance.state.subscribe('$data.elements.chart-timeline', (timelineElement) => {
              if (timelineElement) {
                  const timelinePointer = new TimelinePointer(options, vidoInstance);
                  timelinePointerDestroy = timelinePointer.destroy;
              }
          });
          return function destroy() {
              unsub();
              if (timelinePointerDestroy)
                  timelinePointerDestroy();
          };
      };
  }

  exports.CELL = CELL;
  exports.ITEM = ITEM;
  exports.Plugin = Plugin;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=timeline-pointer.plugin.umd.js.map
