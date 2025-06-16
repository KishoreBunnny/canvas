"use client"
import *  as fabric from 'fabric';


export type DrawShapeType = "rect" | "circle" | "diamond" | "line" | "arrow" | "pen" | "text" | "eraser";

export function initShape(tool: DrawShapeType, pointer: fabric.Point, dark: boolean) {


    switch (tool) {
        case "rect":
                return new fabric.Rect({
                    left: pointer.x,
                    top: pointer.y,
                    width: 1,
                    height: 1,
                    fill: dark ? "#171717" : "#f5f5f5",
                    stroke: dark ? "#e5e5e5" : "#171717",
                    strokeWidth: 2,
                    rx: 20,
                    ry: 20,
                    selectable: true,
                } as any);


        case "circle":
            return new fabric.Circle({
                left: pointer.x,
                top: pointer.y,
                radius: 1,
                fill: dark ? "#171717" : "#f5f5f5",
                stroke: dark ? "#e5e5e5" : "#171717",
            } as any);

        case "diamond":
            return new fabric.Rect({
                left: pointer.x,
                top: pointer.y,
                width: 1,
                height: 1,
                fill: dark ? "#171717" : "#f5f5f5",
                stroke: dark ? "#e5e5e5" : "#171717",
                strokeWidth: 2,
                rx: 20,
                ry: 20,
                angle: 45,
                originX: "center",
                originY: "center",
            } as any);

        case "line":
            return new fabric.Line([
                pointer.x,
                pointer.y,
                pointer.x + 1,
                pointer.y + 1,
            ], {
                // fill: "#171717",
                stroke: dark ? "#e5e5e5" : "#171717",
                strokeWidth: 2,
            } as any);

        case "arrow": {
            const x1 = 0;
            const y1 = 0;
            const x2 = 1;
            const y2 = 1;

            const line = new fabric.Line([x1, y1, x2, y2], {
                stroke: dark ? "#e5e5e5" : "#171717",
                strokeWidth: 2,
            });

            const arrowHeadSize = line.strokeWidth * 6;
            const arrowHead = new fabric.Triangle({
                left: x2,
                top: y2,
                width: arrowHeadSize,
                height: arrowHeadSize,
                fill: dark ? "#e5e5e5" : "#171717",
                originX: "center",
                originY: "center",
                angle: 45,
            });

            const group = new fabric.Group([line, arrowHead], {
                left: pointer.x,
                top: pointer.y,
                hasControls: true,
                hasBorders: true,
                selectable: true,
                objectCaching: false,
            });

            (group as any)._line = line;
            (group as any)._arrowHead = arrowHead;


            return group;
        }

        case "text":
            return new fabric.IText("", {
                left: pointer.x,
                top: pointer.y,
                fontSize: 30,
                fill: dark ? "#e5e5e5" : "#171717",
                fontFamily: "Comic Sans MS"
            } as any);


        default:
            return null;
    }
}

export function resizeShape(
    tool: DrawShapeType,
    shape: fabric.Object,
    pointer: fabric.Point,
    start: fabric.Point
) {
    switch (tool) {
        case "rect":
            shape.set({
                width: Math.abs(pointer.x - start.x),
                height: Math.abs(pointer.y - start.y),
            });
            shape.set({
                left: Math.min(pointer.x, start.x),
                top: Math.min(pointer.y, start.y),
            });
            break;

        case "circle":
            const radius = Math.max(
                Math.abs(pointer.x - start.x),
                Math.abs(pointer.y - start.y)
            ) / 2;
            shape.set({ radius });
            shape.set({
                left: (pointer.x + start.x) / 2 - radius,
                top: (pointer.y + start.y) / 2 - radius,
            });

            break;

        case "line":
            (shape as fabric.Line).set({ x2: pointer.x, y2: pointer.y });
            break;

        case "arrow":
            const arrowGroup = shape as fabric.Group;
            const lineInGroup = (arrowGroup as any)._line as fabric.Line;
            const arrowHeadInGroup = (arrowGroup as any)._arrowHead as fabric.Triangle;

            const newX2 = pointer.x - start.x;
            const newY2 = pointer.y - start.y;

            lineInGroup.set({ x2: newX2, y2: newY2 });

            const angle = Math.atan2(newY2 - lineInGroup.y1!, newX2 - lineInGroup.x1!);
            arrowHeadInGroup.set({
                left: newX2,
                top: newY2,
                angle: angle * (180 / Math.PI) + 90,
            });


            arrowGroup.setCoords();
            arrowGroup.dirty = true;
            break;


        case "diamond":
            const diamondWidth = Math.abs(pointer.x - start.x);
            const diamondHeight = Math.abs(pointer.y - start.y);
            shape.set({
                width: diamondWidth,
                height: diamondHeight,
                left: (pointer.x + start.x) / 2,
                top: (pointer.y + start.y) / 2,
            });
            break;

        case "text":
            break;

        default:
            break;
    }
}



