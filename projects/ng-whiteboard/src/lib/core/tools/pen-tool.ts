import { PenElement } from '../elements';
import { createElement } from '../elements/element.utils';
import { ElementType, ToolType, WhiteboardElementStyle } from '../types';
import { BaseTool } from './base-tool';
import { calculatePath } from '../utils';

export class PenTool extends BaseTool {
  type = ToolType.Pen;
  element: PenElement | null = null;

  override handlePointerDown(event: PointerEvent): void {
    if (!this.active) return;

    const points = this.dataService.getCanvasCoordinates([event.offsetX, event.offsetY]);

    this.element = createElement(ElementType.Pen, {
      points: [points],
      path: calculatePath([points]),
      style: this.getElementStyle(),
    });

    this.dataService.addToDraft(this.element);
  }

  override handlePointerMove(event: PointerEvent): void {
    if (!this.active || !this.element) return;

    const [x, y] = this.dataService.getCanvasCoordinates([event.offsetX, event.offsetY]);
    const points = this.element.points;
    points.push([x, y]);
    this.element.points = points;
    this.element.path = calculatePath(points);
  }

  override handlePointerUp(): void {
    if (!this.active) return;
    if (this.element) {
      this.dataService.commitDraftToData();
      this.element = null;
    }
  }

  private getElementStyle(): WhiteboardElementStyle {
    return {
      strokeColor: this.whiteboardConfig.strokeColor,
      strokeWidth: this.whiteboardConfig.strokeWidth,
      lineCap: this.whiteboardConfig.lineCap,
      lineJoin: this.whiteboardConfig.lineJoin,
      dasharray: this.whiteboardConfig.dasharray,
      dashoffset: this.whiteboardConfig.dashoffset,
    };
  }
}
