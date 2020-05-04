import { SlotName, Vido, SlotPlacement } from 'src/gstc';
import { ComponentInstance, lithtml } from '@neuronet.io/vido/vido';
export declare type SlotInstances = {
    [placement in SlotPlacement]: ComponentInstance[];
};
export declare function generateSlots(name: SlotName, vido: Vido, props?: unknown): {
    destroy(): void;
    change(changedProps: unknown, options?: any): void;
    get(placement: SlotPlacement): ComponentInstance[];
    html(placement: SlotPlacement, templateProps?: unknown): lithtml.TemplateResult[];
};
//# sourceMappingURL=slots.d.ts.map