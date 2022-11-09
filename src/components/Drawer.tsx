import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppContext } from "../context";

export const Drawer = () => {
    const canvasRef = useRef<HTMLCanvasElement>();
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
    
    const context = useAppContext();
    const [zoom, setZoom] = useState<number>(1.5);
    const [pan, setPan] = useState<[number,number]>([0,0]);

    useEffect( () => {
        if (canvasRef.current) {
            const {width, height} = canvasRef.current;
            const xUnit = width/4*zoom,
                yUnit = height/4*zoom;
            const xDiff = pan[0]/xUnit,
                yDiff = pan[1]/yUnit;

            let xMin = -2 / zoom - xDiff,
                xMax = 2 / zoom - xDiff,
                yMin = -2 / zoom + yDiff,
                yMax = 2 / zoom + yDiff;

            context.setInterval({xMin, xMax, yMax, yMin, xPoints: width, yPoints: height});
        }
    }, [zoom, pan]);


    const clear = () => {
        if (canvasRef.current && ctx) {
            ctx.clearRect(0,0,canvasRef.current.width, canvasRef.current.height);
        }
    }

    const handleWheel = (event) => {
        let nZ = Math.max(zoom*(event.deltaY > 0 ? .75 : 1.25) , 1);
        if (nZ == 1) {
            setPan([0,0]);
        } else {
            const ratio = (nZ/zoom);
            setPan([pan[0]*ratio, pan[1]*ratio]);
        }
        setZoom(nZ);
    }

    const handleMove = (event) => {
        if (event.buttons == '1' && zoom != 1) {
            setPan([pan[0]+event.movementX, pan[1]+event.movementY]);
        }
        
    }

    const resetPanAndZoom = () => {
        setZoom(1);
        setPan([0,0]);
    }

    const download = () => {
        if (canvasRef.current) {
            const a = document.createElement('a');
            a.download = 'fractal.png';
            a.href = canvasRef.current.toDataURL();
            a.click();
        }
    }


    const drawImageData = () => {       
        if (canvasRef.current && ctx && context.computedValues?.length > 0) {
            //console.time('draw');
            const len = context.computedValues.length; 

            const colors = context.colors;
            const seakLen = colors.length-1;

            const pixels = new Uint8ClampedArray(len*len*4);// RGBA=>4 ints by pixels
            context.computedValues.forEach( (line,y) => {
                line.forEach((value,x) => {
                    const i = (y*len + x)*4;
                    const [r,g,b] = colors[ Math.floor(value*seakLen) ];
                    pixels[i] = r;
                    pixels[i + 1] = g;
                    pixels[i + 2] = b;
                    pixels[i + 3] = 255;
                })
            });
            const img = new ImageData(pixels, len, len, {colorSpace:"srgb"});
            ctx.putImageData(img,0,0);
           // console.timeEnd('draw')
        }
    }

    const drawAxis = () => {
        if (canvasRef.current && ctx) {
            const {width, height} = canvasRef.current;
            const [xC, yC] = [width/2+pan[0], height/2+pan[1]];
            // TODO: apply pan

            ctx.beginPath();
            ctx.moveTo(0, yC);
            ctx.lineTo(width,yC);
            ctx.moveTo(xC, 0);
            ctx.lineTo(xC, height);
            ctx.stroke();

            const xUnit = width/4*zoom,
                  yUnit = height/4*zoom;

            ctx.strokeText('-2', xC-2*xUnit, yC);
            ctx.strokeText('-1', xC-xUnit, yC);
            ctx.strokeText('1', xC+xUnit, yC);
            ctx.strokeText('2', xC+2*xUnit, yC);

            ctx.strokeText('2', xC, yC-2*yUnit);
            ctx.strokeText('1', xC, yC-yUnit);
            ctx.strokeText('-1', xC, yC+yUnit);
            ctx.strokeText('-2', xC, yC+2*yUnit);
        }
    }

    useEffect( () => {
        if (canvasRef.current) {
            setCtx(canvasRef.current.getContext('2d'));
        }
    }, [canvasRef.current]);

    useEffect( () => {
        clear();
        drawAxis();
        drawImageData();
    }, [ctx, zoom, pan, context.computedValues, context.colors]);
    
    return <>
    <canvas ref={canvasRef} width="400" height="400" onWheel={handleWheel} onMouseMove={handleMove} onDoubleClick={resetPanAndZoom}></canvas>
    <button onClick={download} >Download</button>
    </>

}