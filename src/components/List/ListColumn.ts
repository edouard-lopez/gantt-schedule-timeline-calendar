import ListColumnRow from './ListColumnRow';
import ListColumnHeaderComponent from './ListColumnHeader';

export default function ListColumnComponent({ columnId }, core) {
  const { api, state, onDestroy, action, render, createComponent, html, repeat } = core;

  let column,
    columnPath = `config.list.columns.data.${columnId}`;
  onDestroy(
    state.subscribe(columnPath, val => {
      column = val;
      render();
    })
  );

  const componentName = 'list-column';
  const rowsComponentName = componentName + '-rows';
  const componentAction = api.getAction(componentName);
  const rowsAction = api.getAction(rowsComponentName);
  let className, classNameContainer, calculatedWidth, width, styleContainer;

  onDestroy(
    state.subscribe('config.classNames', value => {
      className = api.getClass(componentName, { column });
      classNameContainer = api.getClass(rowsComponentName, { column });
      render();
    })
  );

  let visibleRows = [];
  onDestroy(
    state.subscribe('_internal.list.visibleRows', val => {
      visibleRows.forEach(row => row.component.destroy());
      visibleRows = val.map(row => ({
        id: row.id,
        component: createComponent(ListColumnRow, { columnId, rowId: row.id })
      }));
      render();
    })
  );

  onDestroy(
    state.subscribeAll(
      [
        'config.list.columns.percent',
        'config.list.columns.resizer.width',
        `config.list.columns.data.${column.id}.width`,
        'config.height',
        'config.headerHeight'
      ],
      (value, path) => {
        const list = state.get('config.list');
        calculatedWidth = list.columns.data[column.id].width * list.columns.percent * 0.01;
        width = `width: ${calculatedWidth + list.columns.resizer.width}px`;
        styleContainer = `height: ${state.get('config.height')}px`;
      },
      { bulk: true }
    )
  );

  function mainAction(element) {
    if (typeof componentAction === 'function') {
      componentAction(element, { column, state: state, api: api });
    }
  }

  const ListColumnHeader = createComponent(ListColumnHeaderComponent, { columnId });
  onDestroy(ListColumnHeader.destroy);

  return props => html`
    <div class=${className} data-action=${action(mainAction)} style=${width}>
      ${ListColumnHeader.html()}
      <div class=${classNameContainer} style=${styleContainer} data-action=${action(rowsAction, { api, state })}>
        ${repeat(visibleRows, r => r.id, row => row.component.html())}
      </div>
    </div>
  `;
}