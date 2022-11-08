import React, {createContext, useContext, useMemo, useState} from "react";
import { getJuliaConvergence } from "../julia";

const MIN = -2, MAX = 2;

export interface IAppContext {
    cJulia: [number, number],
    precision: number,
    maxIterations: number,
    computedValues: Array<Array<number>>;
    colors: Array<Array<number>>;
    setCJulia?: (val) => void,
    setPrecision?: (val) => void,
    setMaxIterations?: (val) => void,
    setColor?: (index, val) => void,
    addColor?: () => void,
}

const initialValue: IAppContext = {
    cJulia: [.335,.05],
    precision: 0.01,
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
}

export const AppContext = createContext<IAppContext>(initialValue);

const getRandomByte = () => Math.floor( Math.random() * 255);
const getRandomColor = () => [getRandomByte(), getRandomByte(), getRandomByte()];

export const AppContextProvider = (props) => {
    const [cJulia, setCJulia] = useState<[number, number]>(initialValue.cJulia);
    const [precision, setPrecision] = useState<number>(initialValue.precision);
    const [maxIterations, setMaxIterations] = useState<number>(initialValue.maxIterations);
    const [colors, setColors] = useState<number[][]>(initialValue.colors);

    const computedValues = useMemo( () => {
        console.time('julia')
        let res = [];
        for (let y = MIN; y <= MAX; y+=precision) {
            let line = [];
            for (let x = MIN; x <= MAX; x+=precision) {
                const iteration = getJuliaConvergence([cJulia[0],cJulia[1]], [x,y], maxIterations);
                line.push( iteration/maxIterations )
            }
            res.push(line);
        }
        console.timeEnd('julia')
        return res;
    }, [precision, maxIterations, cJulia]);

    const setColor = (index, val) => {
        if (index < colors.length) {
            const col = val.slice(1).split(/(.{2})/).filter(n=>n).map( v => parseInt(v,16) );
            colors[index] = col;
            setColors( [...colors] );
        }
    }

    

    const addColor = () => {
        setColors([...colors, getRandomColor() ]);
    }

    return <AppContext.Provider value={{
        cJulia, setCJulia,
        precision, setPrecision,
        maxIterations, setMaxIterations,
        colors, setColor, addColor,
        computedValues
    }}>
        {props.children}
    </AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext);