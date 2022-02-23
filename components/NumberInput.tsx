import { useCallback, useEffect, useRef, useState } from "react";
import { Amount } from "../lib/types";
import * as RadioGroup from "@radix-ui/react-radio-group";
import VisuallyHidden from "@reach/visually-hidden";

export function NumberInput({
  value,
  updateAmt,
  unit,
  updateUnit,
  options = ["px", "%"],
  horizontal = false,
  label,
  inputId,
}: {
  value: number;
  updateAmt: (n: number) => void;
  unit: Amount["unit"];
  updateUnit: (u: Amount["unit"]) => void;
  options?: string[];
  horizontal?: boolean;
  label: string;
  inputId: string;
}) {
  const [snapshot, setSnapshot] = useState(value);
  const [startVal, setStartVal] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const isDragging = startVal !== null;
  function onFocus() {
    setIsFocused(true);
  }
  const onStart = useCallback(
    (event) => {
      setSnapshot(value);
      setStartVal(event[horizontal ? "clientX" : "clientY"]);
    },
    [horizontal, value]
  );
  useEffect(() => {
    // Only change the value if the drag was actually started.
    const onUpdate = (event: MouseEvent) => {
      if (startVal) {
        updateAmt(
          horizontal
            ? event.clientX - startVal + snapshot
            : startVal - event.clientY + snapshot
        );
      }
    };

    // Stop the drag operation now.
    const onEnd = () => {
      setStartVal(null);
    };

    document.addEventListener("mousemove", onUpdate);
    document.addEventListener("mouseup", onEnd);
    return () => {
      document.removeEventListener("mousemove", onUpdate);
      document.removeEventListener("mouseup", onEnd);
    };
  }, [startVal, snapshot, updateAmt, horizontal]);
  return (
    <div className={"number-input" + (horizontal ? " horizontal" : "")}>
      <div className="number-with-buttons">
        <button
          className="increase"
          aria-label="increase"
          tabIndex={-1}
          onClick={() => {
            updateAmt(value + 1);
          }}
        ></button>
        <VisuallyHidden>
          <label htmlFor={inputId}>{label}</label>
        </VisuallyHidden>
        {isFocused ? (
          <FocusOnMount>
            <input
              className="number-input-text"
              type="number"
              id={inputId}
              value={value}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => {
                e.currentTarget.value &&
                  updateAmt(parseFloat(e.currentTarget.value));
              }}
            />
          </FocusOnMount>
        ) : (
          <input
            className="number-input-text"
            type="number"
            id={inputId}
            value={value}
            onMouseDown={onStart}
            onFocus={onFocus}
            readOnly
          />
        )}
        {/* {isDragging ? (
          <input
            key="dragging-input"
            className="number-input-text no-select"
            type="number"
            id={inputId}
            value={value}
            readOnly
          />
        ) : (
          <input
            key="non-dragging-input"
            className="number-input-text"
            type="number"
            id={inputId}
            defaultValue={value}
            onMouseDown={onStart}
            onFocus={onFocus}
            onClick={onFocus}
            onChange={(e) => {
              e.currentTarget.value &&
                updateAmt(parseFloat(e.currentTarget.value));
            }}
          />
        )} */}
        <button
          className="decrease"
          aria-label="decrease"
          tabIndex={-1}
          onClick={() => {
            updateAmt(value - 1);
          }}
        ></button>
      </div>
      <Options
        horizontal={horizontal}
        options={options as Amount["unit"][]}
        current={unit}
        update={updateUnit}
      />
    </div>
  );
}

function FocusOnMount({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (ref.current) {
      // focus first child
      // @ts-ignore
      ref.current.childNodes[0].focus();
    }
  }, []);
  return <span ref={ref}>{children}</span>;
}

export function Options<T extends string>({
  options,
  update,
  current,
  horizontal,
}: {
  options: T[];
  update: (v: T) => void;
  current: T;
  horizontal: boolean;
}) {
  return (
    <RadioGroup.Root
      value={current}
      className="unit-options"
      orientation={horizontal ? "horizontal" : "vertical"}
      onValueChange={(val: string) => update(val as unknown as T)}
    >
      {options.map((option) => (
        <RadioGroup.Item
          value={option}
          key={option}
          className="unit-option-label"
        >
          {option}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}
