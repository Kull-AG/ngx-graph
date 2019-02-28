import 'core-js';
(<any>window).TouchEvent = (<any>window).TouchEvent || {};
// IE11 fix
if (typeof SVGElement.prototype.contains == "undefined") {
  SVGElement.prototype.contains = HTMLDivElement.prototype.contains;
}
if (!Element.prototype.matches) {
  Element.prototype.matches =
    (<any>Element.prototype).matchesSelector ||
    (<any>Element.prototype).mozMatchesSelector ||
    (<any>Element.prototype).msMatchesSelector ||
    (<any>Element.prototype).oMatchesSelector ||
    (<any>Element.prototype).webkitMatchesSelector ||
    function(s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    };
}

import 'zone.js/dist/zone';
// import 'ts-helpers';

// angular
import { disableDebugTools } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import '@angular/platform-browser-dynamic';
import '@angular/common';

let _decorateModuleRef = function identity<T>(value: T): T { return value; };

if(IS_PRODUCTION) {
  enableProdMode();
  _decorateModuleRef = (modRef: any) => {
    disableDebugTools();
    return modRef;
  };
}

if(IS_DEV) {
  Error.stackTraceLimit = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}
