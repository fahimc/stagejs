import { Stage } from "./stage";
export interface StyleBase {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  borderWidth?: number;
  borderStyle?: string;
  borderColor?: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  backgroundColor?: string;
}
export interface Style extends StyleBase {
  ":hover"?: StyleBase;
  ":active"?: StyleBase;
}

export class CanvasElement {
  public ctx: CanvasRenderingContext2D;
  private stage: Stage;
  private _textContent: string;
  private _style: Style;
  public parentNode?: CanvasElement;
  public mouseOver: boolean = false;
  public clicked: boolean = false;
  public children: any[] = [];
  public draggable: boolean = false;
  private isDragging: boolean = false;
  private startX: number = 0;
  private startY: number = 0;

  constructor(ctx: CanvasRenderingContext2D, stage: Stage) {
    this.ctx = ctx;
    this.stage = stage;
    this._textContent = "";
    this._style = {
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "#000",
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: 0,
    };
    this.parentNode = undefined;
  }

  set style(value: Partial<Style>) {
    this._style = { ...this._style, ...value };
    this.stage.update();
  }

  get style(): Style {
    return this._style;
  }

  set textContent(value: string) {
    this._textContent = value;
    this.stage.update();
  }

  get textContent(): string {
    return this._textContent;
  }

  // Method to start dragging
  startDrag(x: number, y: number) {
    this.isDragging = true;
    this.startX = x - (this.style.left || 0);
    this.startY = y - (this.style.top || 0);
  }

  // Method to drag the element
  drag(x: number, y: number) {
    if (this.isDragging) {
      this._style.left = x - this.startX;
      this._style.top = y - this.startY;
      this.stage.update();
    }
  }

  // Method to stop dragging
  stopDrag() {
    this.isDragging = false;
  }

  appendChild(element: any): void {
    this.children.push(element);
    element.parentNode = this;
    this.stage.children.push(element);
    this.stage.update();
  }

  createTextElement(): void {
    this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
    this.ctx.font = "12px serif";
    let metrics = this.ctx.measureText(this.textContent);
    let height =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    this.ctx.fillText(
      this.textContent,
      this.getRelativeStyle("left") + (this.style.paddingLeft || 0),
      this.getRelativeStyle("top") + (this.style.paddingTop || 0) + height
    );
  }
  addEventListener(type: string, callback: () => void) {}
  isMouseOver(mouseX: number, mouseY: number): boolean {
    const { left, top, width, height } = this.style;

    return (
      mouseX >= this.getRelativeStyle("left") &&
      mouseX <= this.getRelativeStyle("left") + (width || 0) &&
      mouseY >= this.getRelativeStyle("top") &&
      mouseY <= this.getRelativeStyle("top") + (height || 0)
    );
  }

  getRelativeStyle(key: keyof Style): number {
    // Assuming that the `style` property of parentNode is of type Partial<Style>
    // to safely handle the case when `parentNode` is undefined or the style key is not defined.
    const parentStyleValue = this.parentNode
      ? (this.parentNode.style[key] as number)
      : 0;
    return (parentStyleValue || 0) + (this.style[key] as number);
  }
  render() {}
}
