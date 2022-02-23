import { atom } from "jotai";
import { splitAtom, atomWithStorage } from "jotai/utils";

import { ColorResult } from "react-color";
import { PresetColor } from "react-color/lib/components/sketch/Sketch";
import { AppState } from "./types";
import { generateLayer } from "./generateLayer";
import { blendModes } from "./constants";

export function rgba(c: ColorResult["rgb"]) {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
}

export const settingsAtom = atomWithStorage<AppState["settings"]>(
  "css-gradient-settings",
  (() => {
    // random blend mode
    const blend = blendModes[Math.floor(Math.random() * blendModes.length)];
    return {
      width: { amt: 100, unit: "%" },
      height: { amt: 100, unit: "%" },
      x: { amt: 0, unit: "%" },
      y: { amt: 0, unit: "%" },
      blend,
    };
  })()
);
export const layersAtom = atomWithStorage<AppState["layers"]>(
  "css-gradient-layers",
  (() => {
    const numLayers = Math.floor(Math.random() * 3) + 1;
    const layers: AppState["layers"] = [];
    for (let i = 0; i < numLayers; i++) {
      layers.push(generateLayer(layers));
    }
    return layers;
  })()
);
export const layerAtomAtoms = splitAtom(layersAtom);

export const allColorsAtom = atom((get) => {
  return get(layersAtom).reduce<PresetColor[]>((acc, layer, layerIndex) => {
    return acc.concat(
      layer.colors.map((color, colorIndex) => {
        return {
          title: `Layer ${layerIndex} Color ${colorIndex}`,
          color: `${rgba(color.color)}`,
        };
      })
    );
  }, []);
});

function mergeDistances(d: string[]) {
  let filterD = d.filter(Boolean);
  if (filterD.length === 0) return "";
  if (filterD.length === 1) return " " + filterD[0];
  return ` calc(${filterD.join(" + ")})`;
}

function getColorStrings(colors: AppState["layers"][number]["colors"]) {
  let gradientFnStrings = [],
    distances = [],
    index = 0;

  for (let color of colors) {
    if (index === 0 || !color.blend)
      gradientFnStrings.push(
        `${rgba(color.color)}${mergeDistances(distances)}`
      );
    distances.push(`${color.size.amt}${color.size.unit}`);
    gradientFnStrings.push(`${rgba(color.color)}${mergeDistances(distances)}`);
    index += 1;
  }

  return gradientFnStrings;
}

function getConicColorStrings(colors: AppState["layers"][number]["colors"]) {
  let gradientFnStrings = [],
    distances = [],
    index = 0;

  for (let color of colors) {
    if (index === 0 || !color.blend)
      gradientFnStrings.push(
        `${rgba(color.color)}${mergeDistances(distances)}`
      );
    distances.push(`${color.size.amt}${color.size.unit}`);
    gradientFnStrings.push(`${rgba(color.color)}${mergeDistances(distances)}`);
    index += 1;
  }

  return gradientFnStrings;
}

export function getBackgroundCssFromGradients(gradients: AppState["layers"]) {
  let gradientStrings: string[] = [];
  for (const gradient of gradients) {
    switch (gradient.type) {
      case "solid":
        gradientStrings.push(rgba(gradient.colors[0].color));
        break;
      case "linear":
        gradientStrings.push(
          `${gradient.type}-gradient(${
            gradient.typeSettings.linear.angle.amt
          }deg, ${getColorStrings(gradient.colors).join(", ")})`
        );
        break;
      case "repeating-linear":
        gradientStrings.push(
          `${gradient.type}-gradient(${
            gradient.typeSettings.repeatingLinear.angle.amt
          }deg, ${getColorStrings(gradient.colors).join(", ")})`
        );
        break;
      case "conic":
        gradientStrings.push(
          `${gradient.type}-gradient(from ${
            gradient.typeSettings.conic.from.amt
          }${gradient.typeSettings.conic.from.unit} at ${
            gradient.typeSettings.conic.x.amt
          }${gradient.typeSettings.conic.x.unit} ${
            gradient.typeSettings.conic.y.amt
          }${gradient.typeSettings.conic.y.unit}, ${getConicColorStrings(
            gradient.colors
          ).join(", ")})`
        );
        break;
      case "repeating-conic":
        gradientStrings.push(
          `${gradient.type}-gradient(from ${
            gradient.typeSettings.repeatingConic.from.amt
          }${gradient.typeSettings.repeatingConic.from.unit} at ${
            gradient.typeSettings.repeatingConic.x.amt
          }${gradient.typeSettings.repeatingConic.x.unit} ${
            gradient.typeSettings.repeatingConic.y.amt
          }${
            gradient.typeSettings.repeatingConic.y.unit
          }, ${getConicColorStrings(gradient.colors).join(", ")})`
        );
        break;
      case "radial":
        gradientStrings.push(
          `${gradient.type}-gradient(${gradient.typeSettings.radial.shape} at ${
            gradient.typeSettings.radial.x.amt
          }${gradient.typeSettings.radial.x.unit} ${
            gradient.typeSettings.radial.y.amt
          }${gradient.typeSettings.radial.y.unit}, ${getColorStrings(
            gradient.colors
          ).join(", ")})`
        );
        break;
      case "repeating-radial":
        gradientStrings.push(
          `${gradient.type}-gradient(${
            gradient.typeSettings.repeatingRadial.shape
          } at ${gradient.typeSettings.repeatingRadial.x.amt}${
            gradient.typeSettings.repeatingRadial.x.unit
          } ${gradient.typeSettings.repeatingRadial.y.amt}${
            gradient.typeSettings.repeatingRadial.y.unit
          }, ${getColorStrings(gradient.colors).join(", ")})`
        );
    }
  }
  return gradientStrings.join(", ");
}

export const backgroundCssAtom = atom((get) => {
  let gradients = get(layersAtom).filter((layer) => layer.active);
  return getBackgroundCssFromGradients(gradients);
});

export const backgroundSizeAtom = atom((get) => {
  const settings = get(settingsAtom);
  return `${settings.width.amt}${settings.width.unit} ${settings.height.amt}${settings.height.unit}`;
});

export const backgroundPositionAtom = atom((get) => {
  const settings = get(settingsAtom);
  return `${settings.x.amt}${settings.x.unit} ${settings.y.amt}${settings.y.unit}`;
});

export function randomId(existing: string[] = []) {
  let id = Math.random().toString(36).substring(2, 15);
  while (existing.includes(id)) {
    id = Math.random().toString(36).substring(2, 15);
  }
  return id;
}