import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[markerHost]',
})

export class MarkerDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}