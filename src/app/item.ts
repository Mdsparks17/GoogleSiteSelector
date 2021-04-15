import { Type } from "@angular/core";

export class Item {
  constructor(public component: Type<any>, public latitude: any, public longitude: any) {}
}