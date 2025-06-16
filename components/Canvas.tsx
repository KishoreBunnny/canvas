"use client";

import { useEffect, useRef, useState } from "react";
import *  as fabric from 'fabric';
import { useTool } from "@/context/ToolContext";
import { initShape, resizeShape, DrawShapeType } from "@/utils/shapes";
import { setupEraserTool } from "@/utils/eraser";

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

    const { tool, setTool,dark,setDark } = useTool()

    const drawingShape = useRef<fabric.Object | null>(null);
    const startPoint = useRef<fabric.Point | null>(null);



    useEffect(() => {
        if (canvasRef.current) {
            const fullWidth = window.innerWidth;
            const fullHeight = window.innerHeight;

            const initCanvas = new fabric.Canvas(canvasRef.current, {
                width: fullWidth,
                height: fullHeight,
                selection: true,
            });


            initCanvas.renderAll();
            setCanvas(initCanvas);

            const resize = () => {
                initCanvas.setWidth(window.innerWidth);
                initCanvas.setHeight(window.innerHeight);
                initCanvas.renderAll();
            };
            window.addEventListener("resize", resize);

            return () => {
                initCanvas.dispose();
                window.removeEventListener("resize", resize);
            };
        }
    }, []);

    //for all shapes

    //useeffect for eraser
    useEffect(() => {
        if (!canvas || tool !== "eraser") return;

        const cleanup = setupEraserTool(canvas);

        return () => {
            cleanup();
        };
    }, [tool, canvas,dark]);


  



    useEffect(() => {
        if (!canvas || !tool) return;

        if (tool === "rect" || tool === "diamond" || tool === "line" || tool === "arrow" || tool === "circle" || tool === "pen" || tool === "text") {
            canvas.defaultCursor = "crosshair"; 
        } else {
            canvas.defaultCursor = "default";
        }

        canvas.isDrawingMode = false;
        if (tool === "pen") {
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
            canvas.freeDrawingBrush.color =dark? "#e5e5e5":"#171717",
            canvas.freeDrawingBrush.width = 2;

            return () => {
                canvas.isDrawingMode = false;
                setTool("");
            };
        }


        if (tool === "eraser") {
            const handleMouseDown = (opt: any) => {
                const pointer = canvas.getPointer(opt.e);
                const target = canvas.findTarget(opt.e);
                if (target) {
                    canvas.remove(target);
                    canvas.requestRenderAll();
                }
            };

            canvas.on("mouse:down", handleMouseDown);

            return () => {
                canvas.off("mouse:down", handleMouseDown);
            };
        }

        const drawingTools: DrawShapeType[] = [
            "rect",
            "circle",
            "diamond",
            "line",
            "arrow",
            "pen",
            "text",
            "eraser"
        ];
        if (!drawingTools.includes(tool as DrawShapeType)) return;

        const handleMouseDown = (opt: any) => {
            const pointer = canvas.getPointer(opt.e);
            const shape = initShape(tool as DrawShapeType, pointer,dark);
            if (shape) {
                canvas.selection = false;
                canvas.discardActiveObject();
                drawingShape.current = shape;
                startPoint.current = pointer;
                canvas.add(shape);

                if (tool === "text") {
                    const textShape = shape as fabric.IText;
                    canvas.setActiveObject(textShape);
                    textShape.enterEditing();
                    textShape.hiddenTextarea?.focus();
                    drawingShape.current = null;
                    startPoint.current = null;
                    setTool("");
                }

            }
        };

        const handleMouseMove = (opt: any) => {
            if (!drawingShape.current || !startPoint.current) return;
            const pointer = canvas.getPointer(opt.e);
            resizeShape(tool as DrawShapeType, drawingShape.current, pointer, startPoint.current);
            canvas.renderAll();
        };

        const handleMouseUp = () => {
            if (drawingShape.current) {
                drawingShape.current.set({
                    selectable: true,
                    hasControls: true,
                    hasBorders: true,
                });

                if (tool !== "line" && tool !== "arrow") {
                    drawingShape.current.set({
                        hasControls: true,
                        hasBorders: true,   
                    });
                }

                canvas.setActiveObject(drawingShape.current);
                canvas.renderAll();
            }

            canvas.selection = true;
            drawingShape.current = null;
            startPoint.current = null;
            setTool("");
        };

        canvas.on("mouse:down", handleMouseDown);
        canvas.on("mouse:move", handleMouseMove);
        canvas.on("mouse:up", handleMouseUp);

        return () => {
            canvas.off("mouse:down", handleMouseDown);
            canvas.off("mouse:move", handleMouseMove);
            canvas.off("mouse:up", handleMouseUp);
        };
    }, [tool, canvas,dark]);














    return (
        <div className="w-full h-full bg-neutral-50 dark:bg-neutral-900 relative z-10">
            <canvas ref={canvasRef} className="w-full h-full " />
        </div>
    );
}
