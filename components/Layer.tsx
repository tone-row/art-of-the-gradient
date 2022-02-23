import { Atom, useAtom } from "jotai";
import { allColorsAtom, layersAtom, rgba } from "../lib/state";
import produce from "immer";
import {
  CSSProperties,
  forwardRef,
  Fragment,
  HTMLAttributes,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import VisuallyHidden from "@reach/visually-hidden";
import { Plus } from "./icons/Plus.svg";
import { RGBColor, SketchPicker } from "react-color";
import { AppState, Amount } from "../lib/types";
import { NumberInput, Options } from "./NumberInput";
import { MdDragIndicator } from "react-icons/md";
import { BsTrash2 } from "react-icons/bs";
import { DraggableProvided } from "react-beautiful-dnd";
import * as Popover from "@radix-ui/react-popover";
import { Toggle } from "./icons/Toggle.svg";
import { IoMdClose } from "react-icons/io";
import * as RadioGroup from "@radix-ui/react-radio-group";
import throttle from "lodash.throttle";
import { backgroundTypes } from "../lib/constants";
import { randomColor } from "../lib/generateLayer";

const rotationUnitTypes = ["conic", "repeating-conic"];
const rotationUnits = ["deg", "turn"];
const nonRotationUnits = ["px", "%"];

const UPDATES_PER_SECOND = 3;
export const Layer = memo(
  forwardRef<
    HTMLDivElement,
    {
      atom: Atom<AppState["layers"][number]>;
      layerIndex: number;
      dragHandleProps: DraggableProvided["dragHandleProps"];
      draggableProps: DraggableProvided["draggableProps"];
    } & HTMLAttributes<HTMLDivElement>
  >(function Layer(
    { atom, layerIndex, draggableProps, dragHandleProps, ...props },
    ref
  ) {
    const [layer] = useAtom(atom);
    const [layers, updateLayers] = useAtom(layersAtom);
    // stores last units used per layer
    const shouldUseRotationUnits = rotationUnitTypes.includes(layer.type);
    const lastUnits = useRef<Amount["unit"][]>(
      Array(100).fill(shouldUseRotationUnits ? "px" : "deg")
    );
    const options = shouldUseRotationUnits ? rotationUnits : nonRotationUnits;

    // Switch unit if necessary
    useEffect(() => {
      updateLayers((layers) => {
        return produce(layers, (draft) => {
          let i = 0;
          for (const color of draft[layerIndex].colors) {
            if (
              (shouldUseRotationUnits &&
                !rotationUnits.includes(color.size.unit)) ||
              (!shouldUseRotationUnits &&
                rotationUnits.includes(color.size.unit))
            ) {
              let last = color.size.unit;
              color.size.unit = lastUnits.current[i];
              lastUnits.current[i] = last;
            }
            i++;
          }
        });
      });
    }, [layerIndex, shouldUseRotationUnits, updateLayers]);

    return (
      <div
        className={`layer ${layer.active ? "" : "inactive"}`}
        ref={ref}
        {...draggableProps}
        {...props}
      >
        <div className="layer-inner">
          <aside className="layer-sidebar">
            <IconButton
              aria-label={`Toggle layer ${layerIndex} visibility`}
              onClick={() => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].active = !draft[layerIndex].active;
                  });
                });
              }}
            >
              <Toggle width={24} checked={layer.active} />
            </IconButton>
            <IconButton
              className="drag-handle"
              aria-label="Drag"
              {...dragHandleProps}
            >
              <MdDragIndicator size={24} />
            </IconButton>
            {layers.length > 1 ? (
              <DeleteLayer
                layerIndex={layerIndex}
                handleClick={() => {
                  updateLayers((layers) => {
                    return produce(layers, (draft) => {
                      draft.splice(layerIndex, 1);
                    });
                  });
                }}
              />
            ) : (
              <span />
            )}
          </aside>
          <div className="layer-lower">
            <div className="layer-color-list">
              {layer.colors.map((color, i) => (
                <Fragment key={i}>
                  <LayerColor
                    colorIndex={i}
                    layerIndex={layerIndex}
                    color={color}
                    numColors={layer.colors.length}
                    updateColor={throttle(
                      (c) => {
                        updateLayers((l) => {
                          return produce(l, (draft) => {
                            draft[layerIndex].colors[i].color = c;
                          });
                        });
                      },
                      1000 / UPDATES_PER_SECOND,
                      { trailing: true }
                    )}
                    deleteColor={() => {
                      updateLayers((l) =>
                        produce(l, (draft) => {
                          draft[layerIndex].colors.splice(i, 1);
                        })
                      );
                    }}
                  />
                  <aside className="layer-color-aside">
                    <NumberInput
                      value={color.size.amt}
                      unit={color.size.unit}
                      options={options}
                      inputId={`${layerIndex}-${i}-size`}
                      label={`Layer ${layerIndex} color ${i} size`}
                      updateUnit={(u: Amount["unit"]) => {
                        updateLayers((l) =>
                          produce(l, (draft) => {
                            draft[layerIndex].colors[i].size.unit = u;
                          })
                        );
                      }}
                      updateAmt={(n) => {
                        updateLayers((l) =>
                          produce(l, (draft) => {
                            draft[layerIndex].colors[i].size.amt = n;
                          })
                        );
                      }}
                    />
                    {i < layer.colors.length - 1 && (
                      <button
                        className={
                          "fade-btn " +
                          (layers[layerIndex].colors[i + 1].blend
                            ? "active"
                            : "")
                        }
                        onClick={() => {
                          updateLayers((l) =>
                            produce(l, (draft) => {
                              draft[layerIndex].colors[i + 1].blend =
                                !draft[layerIndex].colors[i + 1].blend;
                            })
                          );
                        }}
                        style={
                          {
                            "--to": rgba(layer.colors[i + 1].color),
                            "--from": rgba(color.color),
                          } as CSSProperties
                        }
                      >
                        <VisuallyHidden>Fade</VisuallyHidden>
                      </button>
                    )}
                  </aside>
                </Fragment>
              ))}
            </div>
            <button
              className="add-color app-btn"
              onClick={() => {
                updateLayers((l) =>
                  produce(l, (draft) => {
                    let colorSettings: Pick<
                      AppState["layers"][number]["colors"][0],
                      "blend" | "size"
                    >;
                    if (draft[layerIndex].colors.length > 0) {
                      colorSettings = {
                        blend: layer.colors[layer.colors.length - 1].blend,
                        size: {
                          amt: layer.colors[layer.colors.length - 1].size.amt,
                          unit: layer.colors[layer.colors.length - 1].size.unit,
                        },
                      };
                    } else {
                      colorSettings = {
                        blend: true,
                        size: {
                          amt: 20,
                          unit: shouldUseRotationUnits ? "deg" : "px",
                        },
                      };
                    }

                    draft[layerIndex].colors.push({
                      ...colorSettings,
                      color: randomColor({
                        include: draft.reduce<RGBColor[]>(
                          (acc, layer) =>
                            acc.concat(layer.colors.map((c) => c.color)),
                          []
                        ),
                      }),
                    });
                  })
                );
              }}
            >
              <Plus aria-hidden width={12} />
              <span>Add Color</span>
            </button>
          </div>
          <div className="layer-upper">
            <RadioGroup.Root
              className="layer-types"
              onValueChange={(value) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].type =
                      value as AppState["layers"][number]["type"];
                  });
                });
              }}
            >
              {backgroundTypes.map((t) => {
                if (layerIndex !== layers.length - 1 && t.value === "solid") {
                  return null;
                }
                return (
                  <RadioGroup.Item
                    key={t.value}
                    value={t.value}
                    aria-label={`Layer ${layerIndex} type ${t.value}`}
                    className={
                      "background-type-btn " +
                      t.value +
                      (layer.type === t.value ? " checked" : "")
                    }
                  />
                );
              })}
            </RadioGroup.Root>
            <LayerTypeSettings layer={layer} layerIndex={layerIndex} />
          </div>
        </div>
      </div>
    );
  })
);
Layer.displayName = "Layer";

const DeleteLayer = memo(function DeleteLayer({
  handleClick,
  layerIndex,
}: {
  handleClick: () => void;
  layerIndex: number;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton aria-label={`Delete layer ${layerIndex}`}>
          <BsTrash2 size={24} />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content className="popover">
        <Popover.Arrow className="popover-arrow" />
        <div className="popover-inner">
          <span>Delete layer?</span>
          <Popover.Close asChild>
            <button>Cancel</button>
          </Popover.Close>
          <button onClick={handleClick} className="delete-btn">
            Delete
          </button>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
});

const LayerColor = memo(function LayerColor({
  color,
  updateColor,
  numColors,
  deleteColor,
  layerIndex,
  colorIndex,
}: {
  color: AppState["layers"][number]["colors"][number];
  updateColor: (c: RGBColor) => void;
  numColors: number;
  deleteColor: () => void;
  layerIndex: number;
  colorIndex: number;
}) {
  const [all] = useAtom(allColorsAtom);
  const [c, setC] = useState(color.color);
  useEffect(() => {
    updateColor(c);
  }, [c, updateColor]);
  return (
    <div className="layer-color-wrapper">
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            aria-label={`Change layer ${layerIndex} color ${colorIndex}`}
            className="layer-color"
            style={{ "--bg": rgba(c) } as CSSProperties}
          />
        </Popover.Trigger>
        <Popover.Content
          className="color-popover"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (e.key === "h") {
              console.log("hi");
            }
          }}
        >
          <SketchPicker
            color={c}
            onChange={(r) => setC(r.rgb)}
            presetColors={all}
          />
        </Popover.Content>
      </Popover.Root>
      {numColors > 1 ? <DeleteColor deleteColor={deleteColor} /> : null}
    </div>
  );
});

const DeleteColor = memo(function DeleteColor({
  deleteColor,
}: {
  deleteColor: () => void;
}) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <IconButton className="delete-color" aria-label="Delete Color">
          <IoMdClose size={20} />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content className="popover">
        <Popover.Arrow className="popover-arrow" />
        <div className="popover-inner">
          <span>Delete color?</span>
          <Popover.Close asChild>
            <button>Cancel</button>
          </Popover.Close>
          <button onClick={deleteColor} className="delete-btn">
            Delete
          </button>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
});

const IconButton = memo(
  forwardRef<HTMLButtonElement, HTMLAttributes<HTMLButtonElement>>(
    function IconButton({ className = "", ...props }, ref) {
      return (
        <button ref={ref} className={`icon-btn ${className}`} {...props} />
      );
    }
  )
);

const LayerTypeSettings = memo(function LayerTypeSettings({
  layer,
  layerIndex,
}: {
  layer: AppState["layers"][number];
  layerIndex: number;
}) {
  const [, updateLayers] = useAtom(layersAtom);

  switch (layer.type) {
    case "solid":
      return null;
    case "linear":
      return (
        <div className="layer-type-settings">
          <label className="horizontal">
            <span>Angle</span>
            <NumberInput
              horizontal
              inputId={`layer-${layerIndex}-angle`}
              label={`Layer ${layerIndex} angle`}
              value={layer.typeSettings.linear.angle.amt}
              unit={layer.typeSettings.linear.angle.unit}
              options={["deg", "turn"]}
              updateUnit={(u: Amount["unit"]) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.linear.angle.unit = u;
                  });
                });
              }}
              updateAmt={(n) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.linear.angle.amt = n;
                  });
                });
              }}
            />
          </label>
        </div>
      );
    case "repeating-linear":
      return (
        <div className="layer-type-settings">
          <label className="horizontal">
            <span>Angle</span>
            <NumberInput
              horizontal
              inputId={`layer-${layerIndex}-angle`}
              label={`Layer ${layerIndex} angle`}
              value={layer.typeSettings.repeatingLinear.angle.amt}
              unit={layer.typeSettings.repeatingLinear.angle.unit}
              options={["deg", "turn"]}
              updateUnit={(u: Amount["unit"]) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.repeatingLinear.angle.unit =
                      u;
                  });
                });
              }}
              updateAmt={(n) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.repeatingLinear.angle.amt =
                      n;
                  });
                });
              }}
            />
          </label>
        </div>
      );
    case "radial":
      return (
        <div className="layer-type-settings">
          <label className="horizontal">
            <span>Shape</span>
            <Options
              options={["circle", "ellipse"]}
              current={layer.typeSettings.radial.shape}
              horizontal
              update={(v) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.radial.shape = v;
                  });
                });
              }}
            />
          </label>
          <label className="horizontal">
            <span>X</span>
            <NumberInput
              horizontal
              inputId={`layer-${layerIndex}-x`}
              label={`Layer ${layerIndex} x`}
              value={layer.typeSettings.radial.x.amt}
              unit={layer.typeSettings.radial.x.unit}
              options={["%", "px"]}
              updateUnit={(u: Amount["unit"]) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.radial.x.unit = u;
                  });
                });
              }}
              updateAmt={(n) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.radial.x.amt = n;
                  });
                });
              }}
            />
          </label>
          <label className="horizontal">
            <span>Y</span>
            <NumberInput
              horizontal
              inputId={`layer-${layerIndex}-y`}
              label={`Layer ${layerIndex} y`}
              value={layer.typeSettings.radial.y.amt}
              unit={layer.typeSettings.radial.y.unit}
              options={["%", "px"]}
              updateUnit={(u: Amount["unit"]) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.radial.y.unit = u;
                  });
                });
              }}
              updateAmt={(n) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.radial.y.amt = n;
                  });
                });
              }}
            />
          </label>
        </div>
      );
    case "repeating-radial":
      return (
        <div className="layer-type-settings">
          <label className="horizontal">
            <span>Shape</span>
            <Options
              options={["circle", "ellipse"]}
              current={layer.typeSettings.repeatingRadial.shape}
              horizontal
              update={(v) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.repeatingRadial.shape = v;
                  });
                });
              }}
            />
          </label>
          <label className="horizontal">
            <span>X</span>
            <NumberInput
              horizontal
              inputId={`layer-${layerIndex}-x`}
              label={`Layer ${layerIndex} x`}
              value={layer.typeSettings.repeatingRadial.x.amt}
              unit={layer.typeSettings.repeatingRadial.x.unit}
              options={["%", "px"]}
              updateUnit={(u: Amount["unit"]) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.repeatingRadial.x.unit = u;
                  });
                });
              }}
              updateAmt={(n) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.repeatingRadial.x.amt = n;
                  });
                });
              }}
            />
          </label>
          <label className="horizontal">
            <span>Y</span>
            <NumberInput
              horizontal
              inputId={`layer-${layerIndex}-y`}
              label={`Layer ${layerIndex} y`}
              value={layer.typeSettings.repeatingRadial.y.amt}
              unit={layer.typeSettings.repeatingRadial.y.unit}
              options={["%", "px"]}
              updateUnit={(u: Amount["unit"]) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.repeatingRadial.y.unit = u;
                  });
                });
              }}
              updateAmt={(n) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.repeatingRadial.y.amt = n;
                  });
                });
              }}
            />
          </label>
        </div>
      );
    case "conic":
      return (
        <div className="layer-type-settings">
          <label className="horizontal">
            <span>From</span>
            <NumberInput
              horizontal
              inputId={`layer-${layerIndex}-from`}
              label={`Layer ${layerIndex} from`}
              value={layer.typeSettings.conic.from.amt}
              unit={layer.typeSettings.conic.from.unit}
              options={["deg", "turn"]}
              updateUnit={(u: Amount["unit"]) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.conic.from.unit = u;
                  });
                });
              }}
              updateAmt={(n) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.conic.from.amt = n;
                  });
                });
              }}
            />
          </label>
          <label className="horizontal">
            <span>X</span>
            <NumberInput
              horizontal
              inputId={`layer-${layerIndex}-x`}
              label={`Layer ${layerIndex} x`}
              value={layer.typeSettings.conic.x.amt}
              unit={layer.typeSettings.conic.x.unit}
              options={["%", "px"]}
              updateUnit={(u: Amount["unit"]) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.conic.x.unit = u;
                  });
                });
              }}
              updateAmt={(n) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.conic.x.amt = n;
                  });
                });
              }}
            />
          </label>
          <label className="horizontal">
            <span>Y</span>
            <NumberInput
              horizontal
              inputId={`layer-${layerIndex}-y`}
              label={`Layer ${layerIndex} y`}
              value={layer.typeSettings.conic.y.amt}
              unit={layer.typeSettings.conic.y.unit}
              options={["%", "px"]}
              updateUnit={(u: Amount["unit"]) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.conic.y.unit = u;
                  });
                });
              }}
              updateAmt={(n) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.conic.y.amt = n;
                  });
                });
              }}
            />
          </label>
        </div>
      );
    case "repeating-conic":
      return (
        <div className="layer-type-settings">
          <label className="horizontal">
            <span>From</span>
            <NumberInput
              horizontal
              inputId={`layer-${layerIndex}-from`}
              label={`Layer ${layerIndex} from`}
              value={layer.typeSettings.repeatingConic.from.amt}
              unit={layer.typeSettings.repeatingConic.from.unit}
              options={["deg", "turn"]}
              updateUnit={(u: Amount["unit"]) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.repeatingConic.from.unit = u;
                  });
                });
              }}
              updateAmt={(n) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.repeatingConic.from.amt = n;
                  });
                });
              }}
            />
          </label>
          <label className="horizontal">
            <span>X</span>
            <NumberInput
              horizontal
              inputId={`layer-${layerIndex}-x`}
              label={`Layer ${layerIndex} x`}
              value={layer.typeSettings.repeatingConic.x.amt}
              unit={layer.typeSettings.repeatingConic.x.unit}
              options={["%", "px"]}
              updateUnit={(u: Amount["unit"]) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.repeatingConic.x.unit = u;
                  });
                });
              }}
              updateAmt={(n) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.repeatingConic.x.amt = n;
                  });
                });
              }}
            />
          </label>
          <label className="horizontal">
            <span>Y</span>
            <NumberInput
              horizontal
              inputId={`layer-${layerIndex}-y`}
              label={`Layer ${layerIndex} y`}
              value={layer.typeSettings.repeatingConic.y.amt}
              unit={layer.typeSettings.repeatingConic.y.unit}
              options={["%", "px"]}
              updateUnit={(u: Amount["unit"]) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.repeatingConic.y.unit = u;
                  });
                });
              }}
              updateAmt={(n) => {
                updateLayers((layers) => {
                  return produce(layers, (draft) => {
                    draft[layerIndex].typeSettings.repeatingConic.y.amt = n;
                  });
                });
              }}
            />
          </label>
        </div>
      );
    default:
      return null;
  }
});
