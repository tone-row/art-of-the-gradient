import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Tooltip from "@radix-ui/react-tooltip";

import { BlendMode } from "../lib/types";
import { CSSProperties } from "react";
import { blendModes } from "../lib/constants";
import produce from "immer";
import { settingsAtom } from "../lib/state";
import { useAtom } from "jotai";

export default function Blend() {
  const [settings, updateSettings] = useAtom(settingsAtom);
  return (
    <section className="blend">
      <h2>Blend</h2>
      <RadioGroup.Root
        className="blend-modes"
        value={settings.blend}
        onValueChange={(value) => {
          updateSettings(
            produce(settings, (draft) => {
              draft.blend = value as BlendMode;
            })
          );
        }}
      >
        {blendModes.map((mode) => {
          return (
            <Tooltip.Root key={mode}>
              <Tooltip.Trigger asChild>
                <RadioGroup.Item
                  value={mode}
                  style={{ "--m": mode } as CSSProperties}
                  className={"blend-mode"}
                  aria-label={`Blend mode: ${mode}`}
                >
                  <span className="blend-mode-left" />
                  <span className="blend-mode-right" />
                </RadioGroup.Item>
              </Tooltip.Trigger>
              <Tooltip.Content className="tooltip-outer">
                <Tooltip.Arrow className="tooltip-arrow" />
                <span className="tooltip-text">{mode}</span>
              </Tooltip.Content>
            </Tooltip.Root>
          );
        })}
      </RadioGroup.Root>
    </section>
  );
}
