import { CanvasElement } from "./canvas-element";

export class CanvasDiv extends CanvasElement {
  render(): void {
    this.ctx.beginPath();

    const elementStyle = this.style;

    this.ctx.rect(
      this.getRelativeStyle("left"),
      this.getRelativeStyle("top"),
      elementStyle.width || 0,
      elementStyle.height || 0
    );
    let styler =
      elementStyle[":hover"] && this.mouseOver
        ? elementStyle[":hover"]
        : elementStyle;
    // if element has been clicked
    if (elementStyle[":active"] && this.clicked) {
      styler = elementStyle[":active"];
    }

    if (styler.borderColor) this.ctx.strokeStyle = styler.borderColor;
    if (styler.borderWidth !== undefined)
      this.ctx.lineWidth = styler.borderWidth;
    if (styler.backgroundColor) {
      this.ctx.fillStyle = styler.backgroundColor;
    } else {
      this.ctx.fillStyle = "rgba(255, 255, 255, 0)";
    }
    this.ctx.fill();
    this.ctx.stroke();
    if (this.textContent) {
      this.createTextElement();
    }
  }
}
