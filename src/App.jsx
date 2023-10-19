import { useReducer, useState } from "react";
import "./App.css";
import OperationButton from "./components/OperationButton";
import DigitalButton from "./components/DigitalButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
  CLEAR: "clear",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: payload.digit,
        };
      }

      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false,
        };
      }

      if (state.currentOperand == null) return state;

      if (state.currentOperand.length === 1)
        return { ...state, currentOperand: null };

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        operation: payload.operation,
        previousOperand: evaluate(state),
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.EVALUATE:
      if (
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.operation == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        currentOperand: evaluate(state),
        operation: null,
      };
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const current = parseFloat(currentOperand);
  const prev = parseFloat(previousOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let result = "";
  switch (operation) {
    case "+":
      return (result = prev + current);
      break;
    case "-":
      return (result = prev - current);
      break;
    case "/":
      return (result = prev / current);
      break;
    case "*":
      return (result = prev * current);
      break;
  }

  return result.toString();
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {previousOperand} {operation}
        </div>
        <div className="current-operand"> {currentOperand} </div>
      </div>
      <button
        className="span-two"
        onClick={() => {
          dispatch({ type: ACTIONS.CLEAR });
        }}
      >
        AC
      </button>
      <button
        onClick={() => {
          dispatch({ type: ACTIONS.DELETE_DIGIT });
        }}
      >
        DEL
      </button>
      <OperationButton operation="/" dispatch={dispatch}></OperationButton>
      <DigitalButton digit="1" dispatch={dispatch}></DigitalButton>
      <DigitalButton digit="2" dispatch={dispatch}></DigitalButton>
      <DigitalButton digit="3" dispatch={dispatch}></DigitalButton>
      <OperationButton operation="*" dispatch={dispatch}></OperationButton>
      <DigitalButton digit="4" dispatch={dispatch}></DigitalButton>
      <DigitalButton digit="5" dispatch={dispatch}></DigitalButton>
      <DigitalButton digit="6" dispatch={dispatch}></DigitalButton>
      <OperationButton operation="+" dispatch={dispatch}></OperationButton>
      <DigitalButton digit="7" dispatch={dispatch}></DigitalButton>
      <DigitalButton digit="8" dispatch={dispatch}></DigitalButton>
      <DigitalButton digit="9" dispatch={dispatch}></DigitalButton>
      <OperationButton operation="-" dispatch={dispatch}></OperationButton>
      <DigitalButton digit="." dispatch={dispatch}></DigitalButton>
      <DigitalButton digit="0" dispatch={dispatch}></DigitalButton>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
