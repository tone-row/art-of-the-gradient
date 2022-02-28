import { atomWithStorage, splitAtom } from "jotai/utils";

import { AppState } from "./types";
import { ColorResult } from "react-color";
import { PresetColor } from "react-color/lib/components/sketch/Sketch";
import { atom } from "jotai";
import { blendModes } from "./constants";
import { generateLayer } from "./generateLayer";
import { inflate } from "pako";

const LOCAL_STORAGE_KEY_BASE = "art-of-the-gradient";
export const SETTINGS_KEY = "settings";
export const LAYERS_KEY = "layers";
export function keyWithPath(
  key: string,
  path: string = typeof window !== "undefined" ? window.location.pathname : ""
) {
  return LOCAL_STORAGE_KEY_BASE + path + key;
}

export function rgba(c: ColorResult["rgb"]) {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a})`;
}

export const settingsAtom = atomWithStorage<AppState["settings"]>(
  keyWithPath(SETTINGS_KEY),
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
settingsAtom.onMount = (set) => {
  const dataStr = new URLSearchParams(window.location.search).get("data");
  if (!dataStr) {
    set((it) => it);
    return;
  }
  const data = JSON.parse(
    inflate(dataStr.split("-").map(parseFloat), { to: "string" })
  ) as AppState;
  set(data.settings);
};

export const layersAtom = atom<AppState["layers"]>([]);
layersAtom.onMount = (set) => {
  const dataStr = new URLSearchParams(window.location.search).get("data");
  if (!dataStr) return;
  const data = JSON.parse(
    inflate(dataStr.split("-").map(parseFloat), { to: "string" })
  ) as AppState;
  set(data.layers);
};

export const layersAtomWithStorage = atomWithStorage<AppState["layers"]>(
  keyWithPath(LAYERS_KEY),
  (() => {
    const numLayers = Math.floor(Math.random() * 3) + 1;
    const layers: AppState["layers"] = [];
    for (let i = 0; i < numLayers; i++) {
      layers.push(generateLayer(layers));
    }
    return layers;
  })()
);
layersAtomWithStorage.onMount = (set) => {
  const dataStr = new URLSearchParams(window.location.search).get("data");
  if (!dataStr) return;
  const data = JSON.parse(
    inflate(dataStr.split("-").map(parseFloat), { to: "string" })
  ) as AppState;
  set(data.layers);
};
export const layerAtomAtoms = splitAtom(layersAtomWithStorage);

export const allColorsAtom = atom((get) => {
  return get(layersAtomWithStorage).reduce<PresetColor[]>(
    (acc, layer, layerIndex) => {
      return acc.concat(
        layer.colors.map((color, colorIndex) => {
          return {
            title: `Layer ${layerIndex} Color ${colorIndex}`,
            color: `${rgba(color.color)}`,
          };
        })
      );
    },
    []
  );
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
  let gradients = get(layersAtomWithStorage).filter((layer) => layer.active);
  return getBackgroundCssFromGradients(gradients);
});

export const getBackgroundSizeAtom = (settings: AppState["settings"]) =>
  `${settings.width.amt}${settings.width.unit} ${settings.height.amt}${settings.height.unit}`;
export const backgroundSizeAtom = atom((get) => {
  const settings = get(settingsAtom);
  return getBackgroundSizeAtom(settings);
});

export const getBackgroundPositionAtom = (settings: AppState["settings"]) =>
  `${settings.x.amt}${settings.x.unit} ${settings.y.amt}${settings.y.unit}`;
export const backgroundPositionAtom = atom((get) => {
  const settings = get(settingsAtom);
  return getBackgroundPositionAtom(settings);
});

export function randomId(existing: string[] = []) {
  let id = Math.random().toString(36).substring(2, 15);
  while (existing.includes(id)) {
    id = Math.random().toString(36).substring(2, 15);
  }
  return id;
}

export const getBaseURL = () => {
  const baseURL =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
      ? "https://art-of-the-gradient.tone-row.com"
      : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000";
  return baseURL;
};

export const TITLE = "L'art du dégradé ~ The Art of the Gradient";
export const DESCRIPTION =
  "Your go-to gizmo for generating goofy gradients- i.e., a CSS Gradient Generator";
