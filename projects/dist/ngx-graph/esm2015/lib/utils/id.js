/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const cache = {};
/**
 * Generates a short id.
 *
 * @return {?}
 */
export function id() {
    /** @type {?} */
    let newId = ('0000' + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)).slice(-4);
    newId = `a${newId}`;
    // ensure not already used
    if (!cache[newId]) {
        cache[newId] = true;
        return newId;
    }
    return id();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac3dpbWxhbmUvbmd4LWdyYXBoLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL2lkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O01BQU0sS0FBSyxHQUFHLEVBQUU7Ozs7OztBQU1oQixNQUFNLFVBQVUsRUFBRTs7UUFDWixLQUFLLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV0RixLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztJQUVwQiwwQkFBMEI7SUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNqQixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRCxPQUFPLEVBQUUsRUFBRSxDQUFDO0FBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNhY2hlID0ge307XHJcblxyXG4vKipcclxuICogR2VuZXJhdGVzIGEgc2hvcnQgaWQuXHJcbiAqXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaWQoKTogc3RyaW5nIHtcclxuICBsZXQgbmV3SWQgPSAoJzAwMDAnICsgKChNYXRoLnJhbmRvbSgpICogTWF0aC5wb3coMzYsIDQpKSA8PCAwKS50b1N0cmluZygzNikpLnNsaWNlKC00KTtcclxuXHJcbiAgbmV3SWQgPSBgYSR7bmV3SWR9YDtcclxuXHJcbiAgLy8gZW5zdXJlIG5vdCBhbHJlYWR5IHVzZWRcclxuICBpZiAoIWNhY2hlW25ld0lkXSkge1xyXG4gICAgY2FjaGVbbmV3SWRdID0gdHJ1ZTtcclxuICAgIHJldHVybiBuZXdJZDtcclxuICB9XHJcblxyXG4gIHJldHVybiBpZCgpO1xyXG59XHJcbiJdfQ==