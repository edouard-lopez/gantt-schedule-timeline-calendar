export default function getPublicComponentMethods(components: any, actionsByInstance: any, clone: any): {
    new (instance: any, vidoInstance: any, props?: {}): {
        instance: string;
        name: string;
        vidoInstance: any;
        props: any;
        destroy(): any;
        update(callback?: () => void): any;
        change(newProps: any, options: any): void;
        html(templateProps?: {}): any;
        _getComponents(): any;
        _getActions(): any;
    };
};
//# sourceMappingURL=PublicComponentMethods.d.ts.map