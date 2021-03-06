import { useAtom } from "jotai";
import { settingsAtom } from "../lib/state";
import { NumberInput } from "./NumberInput";
import produce from "immer";
import { GrPowerReset } from "react-icons/gr";

export default function Size() {
  const [settings, update] = useAtom(settingsAtom);
  const isDefaultSettings =
    settings.width.amt === 100 &&
    settings.width.unit === "%" &&
    settings.height.amt === 100 &&
    settings.height.unit === "%";
  return (
    <section className="size">
      <div className="section-header">
        <h2>Size</h2>
        <button
          className="app-btn"
          type="button"
          disabled={isDefaultSettings}
          onClick={() => {
            update((s) =>
              produce(s, (draft) => {
                draft.width.amt = 100;
                draft.width.unit = "%";
                draft.height.amt = 100;
                draft.height.unit = "%";
              })
            );
          }}
        >
          <GrPowerReset size={14} color="currentColor" />
          <span>Reset</span>
        </button>
      </div>
      <label>
        Width
        <NumberInput
          value={settings.width.amt}
          unit={settings.width.unit}
          inputId="Width"
          label="Width"
          updateAmt={(amt) =>
            update(
              produce(settings, (draft) => {
                draft.width.amt = amt;
              })
            )
          }
          updateUnit={(unit) =>
            update(
              produce(settings, (draft) => {
                draft.width.unit = unit;
              })
            )
          }
          horizontal
        />
      </label>
      <label>
        Height
        <NumberInput
          value={settings.height.amt}
          unit={settings.height.unit}
          inputId="Height"
          label="Height"
          updateAmt={(amt) =>
            update(
              produce(settings, (draft) => {
                draft.height.amt = amt;
              })
            )
          }
          updateUnit={(unit) =>
            update(
              produce(settings, (draft) => {
                draft.height.unit = unit;
              })
            )
          }
          horizontal
        />
      </label>
    </section>
  );
}
