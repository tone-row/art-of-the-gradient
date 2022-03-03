import { AppState, LayerType } from "./types";
import { COLORS, backgroundTypes, defaultTypeSettings } from "./constants";

import { RGBColor } from "react-color";
import { randomId } from "./state";

type Layer = AppState["layers"][number];

function colorsEqual(a: RGBColor, b: RGBColor): boolean {
  return a.r === b.r && a.g === b.g && a.b === b.b;
}

// Get a random color
export function randomColor({
  exclude = [],
  include = [],
}: {
  exclude?: RGBColor[];
  include?: RGBColor[];
}): RGBColor {
  let colors = [...COLORS, ...include];
  if (exclude.length) {
    colors = colors.filter(
      (color) => !exclude.some((c) => colorsEqual(c, color))
    );
  }
  const color = colors[Math.floor(Math.random() * colors.length)];
  return color;
}

type LayerTypeWithoutSolid = Exclude<LayerType, "solid">;
function getRandomType(exclude: LayerType[] = []): LayerTypeWithoutSolid {
  const types = backgroundTypes
    .map((t) => t.value)
    .filter((t) => !exclude.includes(t))
    .filter((t) => t !== "solid");
  return types[
    Math.floor(Math.random() * types.length)
  ] as LayerTypeWithoutSolid;
}

type LayerWithoutColors = {
  typeSettings: Layer["typeSettings"];
  colors: Omit<Layer["colors"][number], "color">[];
};

// Need AT LEAST one for each type
const randomLayers: Record<
  LayerTypeWithoutSolid,
  Array<
    LayerWithoutColors & {
      /** Ability to post-process layer, connect colors, etc. */
      post?: (layer: Layer) => Layer;
    }
  >
> = {
  linear: [
    {
      typeSettings: {
        ...defaultTypeSettings,
        linear: {
          angle: {
            amt: 0,
            unit: "deg",
          },
        },
      },
      colors: [
        {
          blend: true,
          size: {
            amt: 0,
            unit: "%",
          },
        },
        {
          blend: true,
          size: {
            amt: 100,
            unit: "%",
          },
        },
      ],
    },
    {
      colors: [
        {
          blend: true,
          size: {
            amt: 33,
            unit: "%",
          },
        },
        {
          blend: true,
          size: {
            amt: 66,
            unit: "%",
          },
        },
      ],
      typeSettings: {
        ...defaultTypeSettings,
        linear: {
          angle: {
            amt: 0,
            unit: "deg",
          },
        },
      },
    },
  ],
  "repeating-linear": [
    {
      colors: [
        {
          blend: true,
          size: {
            amt: 30,
            unit: "px",
          },
        },
        {
          blend: true,
          size: {
            amt: 60,
            unit: "px",
          },
        },
        {
          blend: true,
          size: {
            amt: 30,
            unit: "px",
          },
        },
      ],
      typeSettings: {
        ...defaultTypeSettings,
        repeatingLinear: {
          angle: {
            amt: 10,
            unit: "deg",
          },
        },
      },
      post: (layer) => {
        const newColors = layer.colors.slice(0);
        newColors[2].color = newColors[0].color;
        const typeSettings = {
          ...layer.typeSettings,
          repeatingLinear: {
            ...layer.typeSettings.repeatingLinear,
            angle: {
              ...layer.typeSettings.repeatingLinear.angle,
              amt: Math.floor(Math.random() * 360),
            },
          },
        };
        return {
          ...layer,
          colors: newColors,
          typeSettings,
        };
      },
    },
  ],
  radial: [
    {
      colors: [
        {
          blend: false,
          size: {
            amt: 30,
            unit: "%",
          },
        },
        {
          blend: true,
          size: {
            amt: 30,
            unit: "%",
          },
        },
      ],
      typeSettings: {
        ...defaultTypeSettings,
        radial: {
          shape: "circle",
          x: {
            amt: 25,
            unit: "%",
          },
          y: {
            amt: 50,
            unit: "%",
          },
        },
      },
    },
    {
      colors: [
        {
          blend: true,
          size: {
            amt: 14,
            unit: "%",
          },
        },
        {
          blend: true,
          size: {
            amt: 1,
            unit: "%",
          },
        },
      ],
      typeSettings: {
        ...defaultTypeSettings,
        radial: {
          shape: "circle",
          x: {
            amt: 50,
            unit: "%",
          },
          y: {
            amt: 23,
            unit: "%",
          },
        },
      },
    },
  ],
  "repeating-radial": [
    {
      colors: [
        {
          blend: true,
          size: {
            amt: 15,
            unit: "px",
          },
        },
        {
          blend: true,
          size: {
            amt: 15,
            unit: "px",
          },
        },
        {
          blend: true,
          size: {
            amt: 15,
            unit: "px",
          },
        },
      ],
      typeSettings: {
        ...defaultTypeSettings,
        repeatingRadial: {
          shape: "ellipse",
          x: {
            amt: 50,
            unit: "%",
          },
          y: {
            amt: 150,
            unit: "%",
          },
        },
      },
    },
    {
      colors: [
        {
          blend: true,
          size: {
            amt: 5,
            unit: "px",
          },
        },
        {
          blend: true,
          size: {
            amt: 5,
            unit: "px",
          },
        },
        {
          blend: true,
          size: {
            amt: 40,
            unit: "px",
          },
        },
      ],
      typeSettings: {
        ...defaultTypeSettings,
        repeatingRadial: {
          shape: "circle",
          x: {
            amt: 50,
            unit: "%",
          },
          y: {
            amt: -200,
            unit: "%",
          },
        },
      },
      post: (layer) => {
        const newColors = layer.colors.slice(0);
        newColors[2].color = newColors[0].color;
        return {
          ...layer,
          colors: newColors,
        };
      },
    },
  ],
  conic: [
    {
      colors: [
        {
          blend: true,
          size: {
            amt: 0,
            unit: "deg",
          },
        },
        {
          blend: true,
          size: {
            amt: 135,
            unit: "deg",
          },
        },
      ],
      typeSettings: {
        ...defaultTypeSettings,
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
            amt: 0,
            unit: "%",
          },
        },
      },
    },
    {
      colors: [
        {
          blend: true,
          size: {
            amt: 30,
            unit: "deg",
          },
        },
        {
          blend: true,
          size: {
            amt: 30,
            unit: "deg",
          },
        },
        {
          blend: true,
          size: {
            amt: 30,
            unit: "deg",
          },
        },
      ],
      typeSettings: {
        ...defaultTypeSettings,
        conic: {
          from: {
            amt: 0,
            unit: "deg",
          },
          x: {
            amt: 0,
            unit: "%",
          },
          y: {
            amt: 100,
            unit: "%",
          },
        },
      },
    },
  ],
  "repeating-conic": [
    {
      colors: [
        {
          blend: true,
          size: {
            amt: 10,
            unit: "deg",
          },
        },
        {
          blend: true,
          size: {
            amt: 10,
            unit: "deg",
          },
        },
        {
          blend: true,
          size: {
            amt: 10,
            unit: "deg",
          },
        },
      ],
      typeSettings: {
        ...defaultTypeSettings,
        repeatingConic: {
          from: {
            amt: 10,
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
      },
      post: (layer) => {
        const newColors = layer.colors.slice(0);
        newColors[2].color = newColors[0].color;
        return {
          ...layer,
          colors: newColors,
        };
      },
    },
    {
      colors: [
        {
          blend: false,
          size: {
            amt: 3,
            unit: "deg",
          },
        },
        {
          blend: false,
          size: {
            amt: 3,
            unit: "deg",
          },
        },
        {
          blend: false,
          size: {
            amt: 3,
            unit: "deg",
          },
        },
      ],
      typeSettings: {
        ...defaultTypeSettings,
        repeatingConic: {
          from: {
            amt: 0,
            unit: "deg",
          },
          x: {
            amt: -10,
            unit: "%",
          },
          y: {
            amt: 50,
            unit: "%",
          },
        },
      },
      post: (layer) => {
        const newColors = layer.colors.slice(0);
        newColors[2].color = newColors[0].color;
        return {
          ...layer,
          colors: newColors,
        };
      },
    },
  ],
};

function addColorsToLayerWithoutColors(
  layer: LayerWithoutColors,
  userColors: RGBColor[] = []
): Pick<Layer, "typeSettings" | "colors"> {
  let lastColor: RGBColor[] = [];
  let colors: Layer["colors"] = [];
  for (const color of layer.colors) {
    const c = randomColor({ exclude: lastColor, include: userColors });
    colors.push({ ...color, color: c });
    lastColor = [c];
  }
  return {
    ...layer,
    colors,
  };
}

export function generateLayer(layers: AppState["layers"] = []): Layer {
  const ids = layers.map((layer) => layer.id);
  const userColors = layers.reduce<RGBColor[]>((acc, layer) => {
    return acc.concat(layer.colors.map(({ color }) => color));
  }, []);
  // prevent last 2 types from being repeated
  const types = layers.map((layer) => layer.type).slice(-2);
  const layerType = getRandomType(types);
  const possibleLayers = randomLayers[layerType];
  const { post, ...layerWithoutColors } =
    possibleLayers[Math.floor(Math.random() * possibleLayers.length)];

  const layer = {
    id: randomId(ids),
    active: true,
    type: layerType,
    ...addColorsToLayerWithoutColors(layerWithoutColors, userColors),
  };
  return post ? post(layer) : layer;
}
