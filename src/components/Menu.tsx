import { useAppContext } from "../context"

const BEAUTYS = [
    [.3,.5],
    [.285,.01],
    [-1.417022285618, 0.0099534],
    [-.6,.6],
    [-0.7806625878796623,-0.16673388946109258],
    [-0.038088, .9754633]
];

export const Menu = () => {
    const context = useAppContext();

    const handleAlgoInput = (e) => {
        if (e.target.value == 0) {
            context.setAlgo('Julia');
        } else {
            context.setAlgo('Mandelbrot');
        }
    }

    const random = () => {
        context.setCJulia([Math.random()*2 - 1 , Math.random()*2 - 1 ]);
    }

    const beauty = () => {
        const [a,b] = BEAUTYS[ Math.floor(Math.random()*BEAUTYS.length) ];
        context.setCJulia([a,b]);
    }

    return <div className="menu">
        <div className="form-group">
            <label htmlFor="maxIterations">Iterations</label>
            <input type="number" 
                value={context.maxIterations} 
                id="maxIterations"
                name="maxIterations" 
                min={10} 
                step={10}
                onChange={(e) => context.setMaxIterations(parseInt(e.target.value))}/>
        </div>
        <div className="form-group">
            Julia
            <input type="range" 
                value={context.algo == 'Julia' ? 0 : 1} 
                id="algo"
                name="algo" 
                min={0}
                max={1}
                step={1}
                onChange={handleAlgoInput}/>
            Mandelbrot
        </div>
        {
            context.algo == 'Julia' && <>
                <div className="form-group">
                    <label htmlFor="alpha">Alpha</label>
                    <input type="number" 
                        value={context.cJulia[0]} 
                        id="alpha"
                        name="alpha" 
                        step={0.001}
                        onChange={(e) => context.setCJulia([parseFloat(e.target.value), context.cJulia[1]]) }/>
                </div>
                <div className="form-group">
                    <label htmlFor="Beta">Beta</label>
                    <input type="number" 
                        value={context.cJulia[1]} 
                        id="Beta"
                        name="Beta" 
                        step={0.001}
                        onChange={(e) => context.setCJulia([context.cJulia[0],parseFloat(e.target.value)]) }/>
                </div>
                <div className="form-group">
                    <button onClick={random}>Random</button>
                    <button onClick={beauty}>Beautiful</button>
                </div>
            </>
        }
    </div>
}