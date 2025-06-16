import *  as fabric from 'fabric';

export function setupEraserTool(canvas: fabric.Canvas) {
    let isErasing = false;

    canvas.defaultCursor = "crosshair";

    const handleMouseDown = (opt: any) => {
        isErasing = true;
        const target = canvas.findTarget(opt.e);
               canvas.defaultCursor = "crosshair";
        if (target) canvas.remove(target);
    };

    const handleMouseMove = (opt: any) => {
        if (!isErasing) return;
        const target = canvas.findTarget(opt.e);
               canvas.defaultCursor = "crosshair";
        if (target) canvas.remove(target);
    };

    const handleMouseUp = () => {
        isErasing = false;
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    return () => {
        canvas.off("mouse:down", handleMouseDown);
        canvas.off("mouse:move", handleMouseMove);
        canvas.off("mouse:up", handleMouseUp);
    };
}
