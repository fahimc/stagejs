import { CanvasDiv } from "./canvas-div";
import { CanvasElement } from "./canvas-element";

export interface StageEvents {
  mouseover: string[];
}
export interface StageInterface {
  update: () => void;
  events: StageEvents;
  children: CanvasElement[];
  body: CanvasDiv;
}
