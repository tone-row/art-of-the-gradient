import { AppState, BlendMode, LayerType } from "./types";

import { RGBColor } from "react-color";

export const backgroundTypes: { value: LayerType }[] = [
  {
    value: "linear",
  },
  {
    value: "repeating-linear",
  },
  {
    value: "radial",
  },
  {
    value: "repeating-radial",
  },
  {
    value: "conic",
  },

  {
    value: "repeating-conic",
  },
  {
    value: "solid",
  },
];

export const blendModes: BlendMode[] = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
];

export const defaultTypeSettings: AppState["layers"][number]["typeSettings"] = {
  linear: {
    angle: {
      amt: 90,
      unit: "deg",
    },
  },
  repeatingLinear: {
    angle: {
      amt: 90,
      unit: "deg",
    },
  },
  radial: {
    shape: "circle",
    x: {
      amt: 50,
      unit: "%",
    },
    y: {
      amt: 50,
      unit: "%",
    },
  },
  repeatingRadial: {
    shape: "circle",
    x: {
      amt: 50,
      unit: "%",
    },
    y: {
      amt: 50,
      unit: "%",
    },
  },
  conic: {
    from: {
      amt: 90,
      unit: "deg",
    },
    x: {
      amt: 50,
      unit: "%",
    },
    y: {
      amt: 50,
      unit: "%",
    },
  },
  repeatingConic: {
    from: {
      amt: 90,
      unit: "deg",
    },
    x: {
      amt: 50,
      unit: "%",
    },
    y: {
      amt: 50,
      unit: "%",
    },
  },
};

export // Colors
const COLORS: RGBColor[] = [
  { r: 255, g: 0, b: 90, a: 0.5 },
  { r: 255, g: 100, b: 0, a: 0.5 },
  { r: 130, g: 220, b: 160, a: 0.5 },
  { r: 30, g: 0, b: 255, a: 0.5 },
  { r: 230, g: 255, b: 0, a: 0.5 },
];

export const defaultSettings: AppState["settings"] = {
  width: { amt: 100, unit: "%" },
  height: { amt: 100, unit: "%" },
  x: { amt: 0, unit: "%" },
  y: { amt: 0, unit: "%" },
  blend: "normal",
};
