/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, Output, HostListener, EventEmitter } from '@angular/core';
/**
 * Mousewheel directive
 * https://github.com/SodhanaLibrary/angular2-examples/blob/master/app/mouseWheelDirective/mousewheel.directive.ts
 *
 * @export
 */
export class MouseWheelDirective {
    constructor() {
        this.mouseWheelUp = new EventEmitter();
        this.mouseWheelDown = new EventEmitter();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseWheelChrome(event) {
        this.mouseWheelFunc(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseWheelFirefox(event) {
        this.mouseWheelFunc(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseWheelIE(event) {
        this.mouseWheelFunc(event);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    mouseWheelFunc(event) {
        if (window.event) {
            event = window.event;
        }
        /** @type {?} */
        const delta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
        if (delta > 0) {
            this.mouseWheelUp.emit(event);
        }
        else if (delta < 0) {
            this.mouseWheelDown.emit(event);
        }
        // for IE
        event.returnValue = false;
        // for Chrome and Firefox
        if (event.preventDefault) {
            event.preventDefault();
        }
    }
}
MouseWheelDirective.decorators = [
    { type: Directive, args: [{ selector: '[mouseWheel]' },] },
];
MouseWheelDirective.propDecorators = {
    mouseWheelUp: [{ type: Output }],
    mouseWheelDown: [{ type: Output }],
    onMouseWheelChrome: [{ type: HostListener, args: ['mousewheel', ['$event'],] }],
    onMouseWheelFirefox: [{ type: HostListener, args: ['DOMMouseScroll', ['$event'],] }],
    onMouseWheelIE: [{ type: HostListener, args: ['onmousewheel', ['$event'],] }]
};
if (false) {
    /** @type {?} */
    MouseWheelDirective.prototype.mouseWheelUp;
    /** @type {?} */
    MouseWheelDirective.prototype.mouseWheelDown;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW91c2Utd2hlZWwuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQHN3aW1sYW5lL25neC1ncmFwaC8iLCJzb3VyY2VzIjpbImxpYi9ncmFwaC9tb3VzZS13aGVlbC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7Ozs7QUFTOUUsTUFBTSxPQUFPLG1CQUFtQjtJQURoQztRQUdFLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVsQyxtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFxQ3RDLENBQUM7Ozs7O0lBbENDLGtCQUFrQixDQUFDLEtBQVU7UUFDM0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QixDQUFDOzs7OztJQUdELG1CQUFtQixDQUFDLEtBQVU7UUFDNUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM3QixDQUFDOzs7OztJQUdELGNBQWMsQ0FBQyxLQUFVO1FBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQzs7Ozs7SUFFRCxjQUFjLENBQUMsS0FBVTtRQUN2QixJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7WUFDaEIsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7U0FDdEI7O2NBRUssS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLFVBQVUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxRSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDYixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMvQjthQUFNLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNwQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNqQztRQUVELFNBQVM7UUFDVCxLQUFLLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUUxQix5QkFBeUI7UUFDekIsSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFFO1lBQ3hCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUN4QjtJQUNILENBQUM7OztZQXpDRixTQUFTLFNBQUMsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFFOzs7MkJBRXBDLE1BQU07NkJBRU4sTUFBTTtpQ0FHTixZQUFZLFNBQUMsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDO2tDQUtyQyxZQUFZLFNBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxRQUFRLENBQUM7NkJBS3pDLFlBQVksU0FBQyxjQUFjLEVBQUUsQ0FBQyxRQUFRLENBQUM7Ozs7SUFmeEMsMkNBQ2tDOztJQUNsQyw2Q0FDb0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIE91dHB1dCwgSG9zdExpc3RlbmVyLCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbi8qKlxyXG4gKiBNb3VzZXdoZWVsIGRpcmVjdGl2ZVxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vU29kaGFuYUxpYnJhcnkvYW5ndWxhcjItZXhhbXBsZXMvYmxvYi9tYXN0ZXIvYXBwL21vdXNlV2hlZWxEaXJlY3RpdmUvbW91c2V3aGVlbC5kaXJlY3RpdmUudHNcclxuICpcclxuICogQGV4cG9ydFxyXG4gKi9cclxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW21vdXNlV2hlZWxdJyB9KVxyXG5leHBvcnQgY2xhc3MgTW91c2VXaGVlbERpcmVjdGl2ZSB7XHJcbiAgQE91dHB1dCgpXHJcbiAgbW91c2VXaGVlbFVwID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKVxyXG4gIG1vdXNlV2hlZWxEb3duID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBASG9zdExpc3RlbmVyKCdtb3VzZXdoZWVsJywgWyckZXZlbnQnXSlcclxuICBvbk1vdXNlV2hlZWxDaHJvbWUoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5tb3VzZVdoZWVsRnVuYyhldmVudCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdET01Nb3VzZVNjcm9sbCcsIFsnJGV2ZW50J10pXHJcbiAgb25Nb3VzZVdoZWVsRmlyZWZveChldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLm1vdXNlV2hlZWxGdW5jKGV2ZW50KTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ29ubW91c2V3aGVlbCcsIFsnJGV2ZW50J10pXHJcbiAgb25Nb3VzZVdoZWVsSUUoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5tb3VzZVdoZWVsRnVuYyhldmVudCk7XHJcbiAgfVxyXG5cclxuICBtb3VzZVdoZWVsRnVuYyhldmVudDogYW55KTogdm9pZCB7XHJcbiAgICBpZiAod2luZG93LmV2ZW50KSB7XHJcbiAgICAgIGV2ZW50ID0gd2luZG93LmV2ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGRlbHRhID0gTWF0aC5tYXgoLTEsIE1hdGgubWluKDEsIGV2ZW50LndoZWVsRGVsdGEgfHwgLWV2ZW50LmRldGFpbCkpO1xyXG4gICAgaWYgKGRlbHRhID4gMCkge1xyXG4gICAgICB0aGlzLm1vdXNlV2hlZWxVcC5lbWl0KGV2ZW50KTtcclxuICAgIH0gZWxzZSBpZiAoZGVsdGEgPCAwKSB7XHJcbiAgICAgIHRoaXMubW91c2VXaGVlbERvd24uZW1pdChldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZm9yIElFXHJcbiAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG5cclxuICAgIC8vIGZvciBDaHJvbWUgYW5kIEZpcmVmb3hcclxuICAgIGlmIChldmVudC5wcmV2ZW50RGVmYXVsdCkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=