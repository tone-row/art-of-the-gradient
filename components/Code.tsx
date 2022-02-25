import { atom, useAtom } from "jotai";
import {
  backgroundCssAtom,
  backgroundPositionAtom,
  backgroundSizeAtom,
  settingsAtom,
} from "../lib/state";
import init, { transform } from "https://unpkg.com/@parcel/css-wasm";

import SyntaxHighlighter from "react-syntax-highlighter";
import parserCss from "prettier/parser-postcss";
import prettier from "prettier";
import { vs } from "react-syntax-highlighter/dist/cjs/styles/hljs";

const _isParcelReadyAtom = atom(false);
const isParcelReadyAtom = atom(
  (get) => get(_isParcelReadyAtom),
  (_get, set) => {
    async function run() {
      await init();
      set(_isParcelReadyAtom, true);
    }
    run();
  }
);
isParcelReadyAtom.onMount = (run) => {
  run();
};

export const codeStringAtom = atom((get) => {
  let code = `background: ${get(backgroundCssAtom)}; background-size: ${get(
    backgroundSizeAtom
  )}; background-position: ${get(
    backgroundPositionAtom
  )}; background-blend-mode: ${get(settingsAtom).blend};`;

  const ready = get(isParcelReadyAtom);
  if (!ready) return "...";

  return prettier
    .format(
      new TextDecoder().decode(
        transform({
          filename: "style.css",
          code: new TextEncoder().encode(`.your-element {${code}}`),
          minify: true,
        }).code
      ),
      {
        parser: "css",
        plugins: [parserCss],
      }
    )
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join("\n");
});

export function Code() {
  useAtom(isParcelReadyAtom);
  const [codeString] = useAtom(codeStringAtom);

  return (
    <section className="code">
      <div className="section-header">
        <h2>Code</h2>
      </div>
      <SyntaxHighlighter language="css" style={vs} className="codeblock">
        {codeString}
      </SyntaxHighlighter>
    </section>
  );
}
