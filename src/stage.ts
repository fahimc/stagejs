import { CanvasDiv } from "./canvas-div";
import { CanvasElement } from "./canvas-element";
import { StageInterface } from "./interface";

export class Stage implements StageInterface {
  events = {
    mouseover: [],
  };
  children: CanvasElement[]; // Assuming CanvasElement is a base class for elements like CanvasDiv
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  body: CanvasDiv; // Assuming CanvasDiv is a subclass of CanvasElement
  private _currentHoveredElements: CanvasElement[] = [];
  private selectedElement?: CanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.children = [];
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.body = new CanvasDiv(this.ctx, this);
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("click", this.onClick);
    document.body.addEventListener("resize", this.resize);
    this.resize();
  }
  resize = () => {
    this.canvas.width = (this.canvas.parentNode as HTMLDivElement)?.clientWidth;
    this.canvas.height = (
      this.canvas.parentNode as HTMLDivElement
    )?.clientHeight;
    this.body.style = {
      width: this.canvas.width,
      height: this.canvas.height,
    };
    this.update();
  };
  onMouseUp = () => {
    if (this.selectedElement) {
      this.selectedElement.stopDrag();
      this.selectedElement = undefined;
    }
  };
  onMouseDown = (event: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find the topmost canvas element that the mouse is over
    this.selectedElement = undefined;
    for (const child of this.children) {
      if (child.draggable && child.isMouseOver(x, y)) {
        this.selectedElement = child;
        // Assuming the last match is the topmost element
      }
    }

    if (this.selectedElement) {
      this.selectedElement.startDrag(x, y);
    }
  };

  onClick = (event: MouseEvent) => {
    //reset
    this.children.forEach((e) => {
      e.clicked = false;
    });
    this._currentHoveredElements.forEach((item) => (item.clicked = true));
    this.update();
  };
  onMouseMove = (event: MouseEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.selectedElement?.drag(x, y);
    //reset
    this.children.forEach((e) => {
      e.mouseOver = false;
    });
    this._currentHoveredElements = [];

    // Function to recursively find all elements under the mouse and their depths
    const findDeepestElement = (
      elements: CanvasElement[],
      currentDepth = 0
    ): { element: CanvasElement; depth: number }[] => {
      let deepestElements: { element: CanvasElement; depth: number }[] = [];
      elements.forEach((item) => {
        if (item.isMouseOver(x, y)) {
          deepestElements.push({ element: item, depth: currentDepth });
          if (item.children && item.children.length > 0) {
            deepestElements = deepestElements.concat(
              findDeepestElement(item.children, currentDepth + 1)
            );
          }
        }
      });
      return deepestElements;
    };

    // Find all elements under the mouse
    const allUnderMouse = findDeepestElement(this.children);

    // Determine the deepest element(s) under the mouse
    if (allUnderMouse.length > 0) {
      const maxDepth = Math.max(...allUnderMouse.map((e) => e.depth));
      const deepestUnderMouse = allUnderMouse.filter(
        (e) => e.depth === maxDepth
      );
      //reset click
      this.children.forEach((child) => {
        console.log(child, deepestUnderMouse);
        if (!deepestUnderMouse.find((item) => item.element == child)) {
          child.clicked = false;
        }
      });
      // For simplicity, we'll log all deepest elements if there are ties
      deepestUnderMouse.forEach((e) => {
        this._currentHoveredElements.push(e.element);
        e.element.mouseOver = true;
      });
    } else {
      this.children.forEach((e) => {
        e.clicked = false;
      });
    }

    this.update();
  };

  addEventListener(type: string, callback: () => void) {
    if ((this.events as any)[type]) {
      (this.events as any)[type].push(callback);
    }
  }

  createElement(tagName: string): CanvasDiv {
    switch (tagName) {
      case "div":
        return new CanvasDiv(this.ctx, this);
    }
    return new CanvasDiv(this.ctx, this);
  }

  update(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.body.render();
    this.children.forEach((item) => item.render());
  }
}
