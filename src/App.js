import { useReducer } from 'react';
import './App.css';

// Components
import Button from './component/DigitBtn'
import Operation from './component/OperationBtn';

export const INPUT = {

  INPUT: 'input',

  OPERATION: 'OPERATION',

  CLEAR: 'clear',

  DELETE: 'delete-digit',

  RESULT: 'result',

}

function reducer(state, { type, payload }) {

  // eslint-disable-next-line default-case
  switch (type) {

    case INPUT.INPUT:

      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }

      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }

      if (payload.digit === "." && state.currentOperand?.includes(".")) {
        return state
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }

    case INPUT.CLEAR:
      return {};

    case INPUT.OPERATION:

      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand === Number.POSITIVE_INFINITY)
        return state;

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      return {
        ...state,
        previousOperand: result(state),
        operation: payload.operation,
        currentOperand: null,
      }

    case INPUT.RESULT:

      if (
        state.operation === null || state.currentOperand == null || state.previousOperand == null) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: result(state),
      }

    case INPUT.DELETE:

      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false,
        }
      }

      if (state.currentOperand == null) {
        return state
      }

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {

  if (operand == null) return

  const [integer, decimal] = operand.split(".")

  if (decimal == null) return INTEGER_FORMATTER.format(integer)

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`

}

function result({ currentOperand, previousOperand, operation }) {

  const prev = parseFloat(previousOperand)

  const current = parseFloat(currentOperand)

  if (isNaN(prev) || isNaN(current)) return ""

  let computation = ""

  // eslint-disable-next-line default-case
  switch (operation) {

    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break

  }

  return computation.toString()
}

function App() {

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

  return (
    <div className="App">

      <h1>Calculator App</h1>

      <div className="calculator-grid">

        <div className="output">

          <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
          <div className="current-operand">{formatOperand(currentOperand)}</div>

        </div>

        <button onClick={() => dispatch({ type: INPUT.CLEAR })} className="span-two">AC</button>
        <button onClick={() => dispatch({ type: INPUT.DELETE })}>del</button>
        <Operation operation="÷" dispatch={dispatch} />
        <Button digit="7" dispatch={dispatch} />
        <Button digit="8" dispatch={dispatch} />
        <Button digit="9" dispatch={dispatch} />
        <Operation operation="*" dispatch={dispatch} />
        <Button digit="4" dispatch={dispatch} />
        <Button digit="5" dispatch={dispatch} />
        <Button digit="6" dispatch={dispatch} />
        <Operation operation="+" dispatch={dispatch} />
        <Button digit="1" dispatch={dispatch} />
        <Button digit="2" dispatch={dispatch} />
        <Button digit="3" dispatch={dispatch} />
        <Operation operation="-" dispatch={dispatch} />
        <Button digit="." dispatch={dispatch} />
        <Button digit="0" dispatch={dispatch} />
        <button className='span-two' onClick={() => dispatch({ type: INPUT.RESULT })}>=</button>

      </div>

    </div>

  );

}

export default App;
