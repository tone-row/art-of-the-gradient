import { useAtom } from "jotai";
import { settingsAtom } from "../lib/state";
import { NumberInput } from "./NumberInput";
import produce from "immer";
import { GrPowerReset } from "react-icons/gr";

export default function Position() {
  const [settings, update] = useAtom(settingsAtom);
  const isDefaultSettings =
    settings.x.amt === 0 &&
    settings.x.unit === "%" &&
    settings.y.amt === 0 &&
    settings.y.unit === "%";
  return (
    <section className="position">
      <div className="section-header">
        <h2>Position</h2>
        <button
          className="app-btn"
          type="button"
          disabled={isDefaultSettings}
          onClick={() => {
            update((s) =>
              produce(s, (draft) => {
                draft.x.amt = 0;
                draft.x.unit = "%";
                draft.y.amt = 0;
                draft.y.unit = "%";
              })
            );
          }}
        >
          <GrPowerReset size={14} color="currentColor" />
          <span>Reset</span>
        </button>
      </div>
      <label>
        X
        <NumberInput
          value={settings.x.amt}
          unit={settings.x.unit}
          inputId="X"
          label="Background Position X"
          updateAmt={(amt) =>
            update(
              produce(settings, (draft) => {
                draft.x.amt = amt;
              })
            )
          }
          updateUnit={(unit) =>
            update(
              produce(settings, (draft) => {
                draft.x.unit = unit;
              })
            )
          }
          horizontal
        />
      </label>
      <label>
        Y
        <NumberInput
          value={settings.y.amt}
          unit={settings.y.unit}
          inputId="Y"
          label="Background Position Y"
          updateAmt={(amt) =>
            update(
              produce(settings, (draft) => {
                draft.y.amt = amt;
              })
            )
          }
          updateUnit={(unit) =>
            update(
              produce(settings, (draft) => {
                draft.y.unit = unit;
              })
            )
          }
          horizontal
        />
      </label>
    </section>
  );
}
