import { INPUT } from "../App"

export default function Operation({ dispatch, operation }) {
    return <button
        onClick={() => dispatch({ type: INPUT.OPERATION, payload: { operation } })}>
        {operation}
    </button>
}