import { Dispatch, useEffect } from "react";
import { Smiley } from "./icons/Smiley.svg";
import { animate } from "motion";
import { SetStateAction } from "jotai";

export function ToggleControls({
  setIsVisible,
}: {
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}) {
  useEffect(() => {
    animate(
      (p) => {
        const spinText = document.getElementById("spin-text"),
          smiley = document.getElementById("smileyface");
        if (!spinText || !smiley) return;
        spinText.setAttribute("transform", `rotate(${p * 360} 24.02 25.02)`);
        smiley.setAttribute("transform", `rotate(${p * -360} 24.02 25.02)`);
      },
      {
        duration: 23,
        direction: "normal",
        repeat: Infinity,
        easing: "linear",
      }
    );
  }, []);
  return (
    <button
      aria-label="Toggle Controls"
      className="toggle-controls"
      onClick={() => setIsVisible((n) => !n)}
    >
      <Smiley width={110} />
    </button>
  );
}
