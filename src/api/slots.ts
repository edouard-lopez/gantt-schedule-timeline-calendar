import { SlotName, Vido, SlotPlacement } from '../gstc';
import { ComponentInstance, lithtml, Component } from '@neuronet.io/vido/vido';

export type SlotInstances = {
  [placement in SlotPlacement]: ComponentInstance[];
};

export function generateSlots(name: SlotName, vido: Vido, props?: unknown) {
  let slots: SlotInstances = {
    before: [],
    inside: [],
    after: [],
  };

  for (const slotPlacement in slots) {
    vido.onDestroy(
      vido.state.subscribe(`config.slots.${name}.${slotPlacement}`, (slotsComponents: Component[]) => {
        for (const instance of slots[slotPlacement]) {
          instance.destroy();
        }
        slots[slotPlacement].length = 0;
        for (const component of slotsComponents) {
          slots[slotPlacement].push(vido.createComponent(component, props));
        }
      })
    );
  }

  return {
    destroy(): void {
      for (const slotPlacement in slots) {
        for (const instance of slots[slotPlacement]) {
          instance.destroy();
        }
        slots[slotPlacement].length = 0;
      }
    },

    change(changedProps: unknown, options = undefined): void {
      for (const slotPlacement in slots) {
        const instances = slots[slotPlacement] as ComponentInstance[];
        for (const slot of instances) {
          slot.change(changedProps, options);
        }
      }
    },

    get(placement: SlotPlacement): ComponentInstance[] {
      return slots[placement];
    },

    html(placement: SlotPlacement, templateProps?: unknown): lithtml.TemplateResult[] {
      return slots[placement].map((instance) => instance.html(templateProps));
    },
  };
}
