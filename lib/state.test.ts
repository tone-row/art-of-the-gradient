import { defaultTypeSettings } from "./constants";
import { getBackgroundCssFromGradients, randomId } from "./state";
import { AppState } from "./types";

describe("getBackgroundCssFromGradients", () => {
  test("works for solid gradient", () => {
    const gradients: AppState["layers"] = [
      {
        id: randomId(),
        type: "solid",
        active: true,
        colors: [
          {
            color: { r: 0, g: 0, b: 0, a: 1 },
            size: { amt: 0, unit: "%" },
            blend: false,
          },
        ],
        typeSettings: defaultTypeSettings,
      },
    ];
    expect(getBackgroundCssFromGradients(gradients)).toBe("rgba(0, 0, 0, 1)");
  });

  test("works for linear gradients", () => {
    const gradients: AppState["layers"] = [
      {
        id: randomId(),
        active: true,
        type: "solid",
        colors: [
          {
            color: { r: 0, g: 0, b: 0, a: 1 },
            size: { amt: 0, unit: "%" },
            blend: false,
          },
        ],
        typeSettings: defaultTypeSettings,
      },
      {
        id: randomId(),
        active: true,
        type: "repeating-linear",
        colors: [
          {
            color: { r: 255, g: 0, b: 0, a: 1 },
            size: { amt: 50, unit: "%" },
            blend: false,
          },
          {
            color: { r: 255, g: 255, b: 0, a: 1 },
            size: { amt: 50, unit: "%" },
            blend: false,
          },
        ],
        typeSettings: defaultTypeSettings,
      },
    ];
    expect(getBackgroundCssFromGradients(gradients)).toBe(
      "rgba(0, 0, 0, 1), repeating-linear-gradient(90deg, rgba(255, 0, 0, 1), rgba(255, 0, 0, 1) 50%, rgba(255, 255, 0, 1) 50%, rgba(255, 255, 0, 1) calc(50% + 50%))"
    );
  });

  test("can mix px and percent", () => {
    const gradients: AppState["layers"] = [
      {
        id: randomId(),
        active: true,
        type: "repeating-linear",
        colors: [
          {
            color: { r: 255, g: 0, b: 0, a: 1 },
            size: { amt: 50, unit: "px" },
            blend: false,
          },
          {
            color: { r: 255, g: 255, b: 0, a: 1 },
            size: { amt: 50, unit: "px" },
            blend: false,
          },
          {
            color: { r: 255, g: 100, b: 100, a: 1 },
            size: { amt: 50, unit: "%" },
            blend: false,
          },
        ],
        typeSettings: defaultTypeSettings,
      },
    ];
    expect(getBackgroundCssFromGradients(gradients)).toBe(
      "repeating-linear-gradient(90deg, rgba(255, 0, 0, 1), rgba(255, 0, 0, 1) 50px, rgba(255, 255, 0, 1) 50px, rgba(255, 255, 0, 1) calc(50px + 50px), rgba(255, 100, 100, 1) calc(50px + 50px), rgba(255, 100, 100, 1) calc(50px + 50px + 50%))"
    );
  });

  test("works on radial, linear", () => {
    const gradients: AppState["layers"] = [
      {
        id: randomId(),
        active: true,
        type: "solid",
        colors: [
          {
            color: { r: 0, g: 0, b: 0, a: 1 },
            size: { amt: 0, unit: "%" },
            blend: false,
          },
        ],
        typeSettings: defaultTypeSettings,
      },
      {
        id: randomId(),
        active: true,
        type: "repeating-radial",
        colors: [
          {
            color: { r: 255, g: 0, b: 0, a: 1 },
            size: { amt: 50, unit: "%" },
            blend: false,
          },
        ],
        typeSettings: defaultTypeSettings,
      },
      {
        id: randomId(),
        active: true,
        type: "repeating-linear",
        colors: [
          {
            color: { r: 255, g: 0, b: 0, a: 1 },
            size: { amt: 50, unit: "%" },
            blend: false,
          },
          {
            color: { r: 255, g: 255, b: 0, a: 1 },
            size: { amt: 50, unit: "%" },
            blend: false,
          },
        ],
        typeSettings: defaultTypeSettings,
      },
    ];
    expect(getBackgroundCssFromGradients(gradients)).toBe(
      "rgba(0, 0, 0, 1), repeating-radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 1), rgba(255, 0, 0, 1) 50%), repeating-linear-gradient(90deg, rgba(255, 0, 0, 1), rgba(255, 0, 0, 1) 50%, rgba(255, 255, 0, 1) 50%, rgba(255, 255, 0, 1) calc(50% + 50%))"
    );
  });

  test("fade", () => {
    let gradients: AppState["layers"] = [
      {
        id: randomId(),
        active: true,
        type: "linear",
        colors: [
          {
            color: { r: 255, g: 0, b: 0, a: 1 },
            size: { amt: 50, unit: "px" },
            blend: false,
          },
          {
            color: { r: 255, g: 255, b: 0, a: 1 },
            size: { amt: 50, unit: "px" },
            blend: true,
          },
        ],
        typeSettings: defaultTypeSettings,
      },
    ];
    expect(getBackgroundCssFromGradients(gradients)).toBe(
      "linear-gradient(90deg, rgba(255, 0, 0, 1), rgba(255, 0, 0, 1) 50px, rgba(255, 255, 0, 1) calc(50px + 50px))"
    );

    gradients[0].colors[1].blend = false;
    expect(getBackgroundCssFromGradients(gradients)).toBe(
      "linear-gradient(90deg, rgba(255, 0, 0, 1), rgba(255, 0, 0, 1) 50px, rgba(255, 255, 0, 1) 50px, rgba(255, 255, 0, 1) calc(50px + 50px))"
    );
  });
});
