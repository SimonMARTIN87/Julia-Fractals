import { useAppContext } from "../context"

export const Colors = () => {

    const context = useAppContext();

    const handleChange = (event, i) => {
        context.setColor(i, event.target.value);
    }
    return <>
        {
            context.colors.map( (color, index) => {
                const hex = '#'+color.map( v => v.toString(16).padStart(2,'0')).join('');                
                return <input type="color" key={index} value={hex} onChange={(e) => handleChange(e, index)}/>
            })
        }
        <button onClick={() => context.addColor()}>+</button>
    </>

}