import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppContext } from "../context";

export const Drawer = () => {
    const canvasRef = useRef<HTMLCanvasElement>();
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
    const context = useAppContext();
    const [scale, setScale] = useState<number>(1);
    const [pan, setPan] = useState<[number,number]>([0,0]);

    const clear = () => {
        if (canvasRef.current && ctx) {
            ctx.clearRect(0,0,canvasRef.current.width, canvasRef.current.height);
        }
    }

    const handleWheel = (event) => {
        const diff = event.deltaY > 0 ? -0.5 : 0.5;
        setScale(Math.max(scale + diff, 0.5));
    }

    const handleMove = (event) => {
        if (event.buttons == '1') {
            setPan([pan[0]+event.movementX, pan[1]+event.movementY]);
        }
        
    }

    const resetPanAndZoom = () => {
        setScale(1);
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
            console.time('draw');
            const len = context.computedValues.length; 

            const fakeCanvas = document.createElement('canvas');
            fakeCanvas.width = len;
            fakeCanvas.height = len;
            const fakeCtx = fakeCanvas.getContext('2d');

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
            fakeCtx.putImageData(img,0,0);
            const diff  = -((600*scale)-600)/2;
            ctx.drawImage(fakeCanvas, 0,0,len,len,diff+pan[0],diff+pan[1],600*scale,600*scale);
            console.timeEnd('draw')
        }
    }

    useEffect( () => {
        if (canvasRef.current) {
            setCtx(canvasRef.current.getContext('2d'));
        }
    }, [canvasRef.current]);

    useEffect( () => {
        clear();
        drawImageData();
    }, [ctx, scale, pan, context.computedValues, context.colors]);
    
    return <>
    <canvas ref={canvasRef} width="600" height="600" onWheel={handleWheel} onMouseMove={handleMove} onDoubleClick={resetPanAndZoom}></canvas>
    <button onClick={download} >Download</button>
    </>

}