import { INPUT } from "../App"

export default function Button({ dispatch, digit }) {
    return <button
        onClick={() => dispatch({ type: INPUT.INPUT, payload: { digit } })}>
        {digit}
    </button>
}