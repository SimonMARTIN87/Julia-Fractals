import { useAppContext } from "../context"


export const Menu = () => {
    const context = useAppContext();

    return <div className="menu">
        <div className="form-group">
            <label htmlFor="precision">Precision</label>
            <input type="number" 
                value={context.precision} 
                id="precision"
                name="precision"
                max={1}
                min={0.001}
                step={0.001}
                onChange={(e) => context.setPrecision?.(parseFloat(e.target.value))}
            />
        </div>
        <div className="form-group">
            <label htmlFor="maxIterations">Iterations</label>
            <input type="number" 
                value={context.maxIterations} 
                id="maxIterations"
                name="maxIterations" 
                min={10} 
                max={100} 
                step={10}
                onChange={(e) => context.setMaxIterations(parseInt(e.target.value))}/>
        </div>
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
    </div>
}