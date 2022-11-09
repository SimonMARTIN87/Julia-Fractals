import React, {createContext, useContext, useMemo, useState} from "react";
import { getJuliaConvergence, SpaceInterval } from "../julia";

export type AlgoType = 'Julia' | 'Mandelbrot';

export interface IAppContext {
    cJulia: [number, number],
    maxIterations: number,
    algo: AlgoType,
    computedValues: Array<Array<number>>;
    colors: Array<Array<number>>;
    interval: SpaceInterval;
    setCJulia?: (val) => void,
    setMaxIterations?: (val) => void,
    setColor?: (index, val) => void,
    addColor?: () => void,
    randomizeColors?: () => void,
    setInterval?: (obj: SpaceInterval) => void,
    setAlgo?: (a: AlgoType) => void,
}

const initialValue: IAppContext = {
    cJulia: [-1,0],
    maxIterations: 50,
    colors: [
        [0, 0, 0],
        [57, 6, 75],
        [69, 38, 192],
        [6, 254, 192],
        [18, 253, 57],
        [238, 255, 0],
        [242, 134, 33],
        [253, 83, 216],
        [255, 0, 0]
    ],
    
    computedValues: [],
    interval: {xMin: -2, yMin: -2, xMax:2, yMax: 2, xPoints: 600, yPoints: 600},
    algo: 'Julia',
}

export const AppContext = createContext<IAppContext>(initialValue);

const getRandomByte = () => Math.floor( Math.random() * 255);
const getRandomColor = () => (new Array(3).fill(0)).map( getRandomByte);

export const AppContextProvider = (props) => {
    const [cJulia, setCJulia] = useState<[number, number]>(initialValue.cJulia);
    const [maxIterations, setMaxIterations] = useState<number>(initialValue.maxIterations);
    const [colors, setColors] = useState<number[][]>(initialValue.colors);
    const [interval, setInterval] = useState<SpaceInterval>(initialValue.interval);
    const [algo, setAlgo] = useState<AlgoType>(initialValue.algo);

    const computedValues = useMemo( () => {
        //console.time('julia')
        const xPrecision = (interval.xMax - interval.xMin) / interval.xPoints;
        const yPrecision = (interval.yMax - interval.yMin) / interval.yPoints;
        let res = [];
        for (let y = interval.yMax; y >= interval.yMin; y-=yPrecision) {
            let line = [];
            for (let x = interval.xMin; x <= interval.xMax; x+=xPrecision) {
                const iteration = algo == 'Julia' ? getJuliaConvergence([cJulia[0],cJulia[1]], [x,y], maxIterations) : getJuliaConvergence([x,y],[0,0], maxIterations);
                line.push( iteration/maxIterations )
            }
            res.push(line);
        }
        //console.timeEnd('julia')
        return res;
    }, [interval, maxIterations, cJulia, algo]);

    const setColor = (index, val) => {
        if (index < colors.length) {
            const col = val.slice(1).split(/(.{2})/).filter(n=>n).map( v => parseInt(v,16) );
            colors[index] = col;
            setColors( [...colors] );
        }
    }

    const randomizeColors = () => {
        setColors( (new Array(colors.length)).fill(0).map(getRandomColor) );
    };

    

    const addColor = () => {
        setColors([...colors, getRandomColor() ]);
    }

    return <AppContext.Provider value={{
        cJulia, setCJulia,
        maxIterations, setMaxIterations,
        colors, setColor, addColor, randomizeColors,
        interval, setInterval,
        algo, setAlgo,
        computedValues
    }}>
        {props.children}
    </AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext);