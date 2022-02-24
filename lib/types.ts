import { ColorResult } from "react-color";

export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity";

export type Unit = "px" | "%" | "deg" | "turn";

export type Amount = {
  amt: number;
  unit: Unit;
};

export type LayerType =
  | "solid"
  | "linear"
  | "radial"
  | "conic"
  | "repeating-linear"
  | "repeating-radial"
  | "repeating-conic";

export type AppState = {
  layers: {
    id: string;
    active: boolean;
    colors: {
      color: ColorResult["rgb"];
      blend: boolean;
      size: Amount;
    }[];
    type: LayerType;
    typeSettings: {
      linear: {
        angle: Amount;
      };
      repeatingLinear: {
        angle: Amount;
      };
      radial: {
        shape: "circle" | "ellipse";
        x: Amount;
        y: Amount;
      };
      repeatingRadial: {
        shape: "circle" | "ellipse";
        x: Amount;
        y: Amount;
      };
      conic: {
        from: Amount;
        x: Amount;
        y: Amount;
      };
      repeatingConic: {
        from: Amount;
        x: Amount;
        y: Amount;
      };
    };
  }[];
  settings: {
    width: Amount;
    height: Amount;
    x: Amount;
    y: Amount;
    blend: BlendMode;
  };
};
