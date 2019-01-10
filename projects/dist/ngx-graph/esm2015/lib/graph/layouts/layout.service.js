/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { DagreLayout } from './dagre';
import { DagreClusterLayout } from './dagreCluster';
import { DagreNodesOnlyLayout } from './dagreNodesOnly';
/** @type {?} */
const layouts = {
    dagre: DagreLayout,
    dagreCluster: DagreClusterLayout,
    dagreNodesOnly: DagreNodesOnlyLayout,
};
export class LayoutService {
    /**
     * @param {?} name
     * @return {?}
     */
    getLayout(name) {
        if (layouts[name]) {
            return new layouts[name]();
        }
        else {
            throw new Error(`Unknown layout type '${name}'`);
        }
    }
}
LayoutService.decorators = [
    { type: Injectable },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoLyIsInNvdXJjZXMiOlsibGliL2dyYXBoL2xheW91dHMvbGF5b3V0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUN0QyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQzs7TUFFbEQsT0FBTyxHQUFHO0lBQ2QsS0FBSyxFQUFFLFdBQVc7SUFDbEIsWUFBWSxFQUFFLGtCQUFrQjtJQUNoQyxjQUFjLEVBQUUsb0JBQW9CO0NBQ3JDO0FBR0QsTUFBTSxPQUFPLGFBQWE7Ozs7O0lBQ3hCLFNBQVMsQ0FBQyxJQUFZO1FBQ3BCLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2pCLE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztTQUM1QjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsSUFBSSxHQUFHLENBQUMsQ0FBQztTQUNsRDtJQUNILENBQUM7OztZQVJGLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4uLy4uL21vZGVscy9sYXlvdXQubW9kZWwnO1xyXG5pbXBvcnQgeyBEYWdyZUxheW91dCB9IGZyb20gJy4vZGFncmUnO1xyXG5pbXBvcnQgeyBEYWdyZUNsdXN0ZXJMYXlvdXQgfSBmcm9tICcuL2RhZ3JlQ2x1c3Rlcic7XHJcbmltcG9ydCB7IERhZ3JlTm9kZXNPbmx5TGF5b3V0IH0gZnJvbSAnLi9kYWdyZU5vZGVzT25seSc7XHJcblxyXG5jb25zdCBsYXlvdXRzID0ge1xyXG4gIGRhZ3JlOiBEYWdyZUxheW91dCxcclxuICBkYWdyZUNsdXN0ZXI6IERhZ3JlQ2x1c3RlckxheW91dCxcclxuICBkYWdyZU5vZGVzT25seTogRGFncmVOb2Rlc09ubHlMYXlvdXQsXHJcbn07XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBMYXlvdXRTZXJ2aWNlIHtcclxuICBnZXRMYXlvdXQobmFtZTogc3RyaW5nKTogTGF5b3V0IHtcclxuICAgIGlmIChsYXlvdXRzW25hbWVdKSB7XHJcbiAgICAgIHJldHVybiBuZXcgbGF5b3V0c1tuYW1lXSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGxheW91dCB0eXBlICcke25hbWV9J2ApO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=