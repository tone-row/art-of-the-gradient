import { atom, useAtom } from "jotai";
import { useReducer } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import {
  backgroundCssAtom,
  backgroundPositionAtom,
  backgroundSizeAtom,
  getBaseURL,
  layersAtomWithStorage,
  settingsAtom,
} from "../lib/state";
import { AiOutlineCheck } from "react-icons/ai";
import prettier from "prettier";
import parserCss from "prettier/parser-postcss";
import init, { transform } from "https://unpkg.com/@parcel/css-wasm";
import pako from "pako";

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

const codeStringAtomWithStorage = atom((get) => {
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

// codeStringAtom
// WITHOUT STORAGE

async function copyCode(code: string) {
  const clipboard = (await import("clipboardy")).default;
  await clipboard.write(code);
  return;
}

const shareLinkAtom = atom((get) => {
  const settings = get(settingsAtom);
  const layers = get(layersAtomWithStorage);
  const compressed = pako
    .deflate(JSON.stringify({ settings, layers }))
    .toString()
    .replace(/,/g, "-");
  // new searchparams
  const searchParams = new URLSearchParams({
    data: compressed,
  });
  return `${getBaseURL()}/share?${searchParams}`;
});

type CopyState = { loading: boolean; copied: boolean };
export function Code() {
  const [shareLink] = useAtom(shareLinkAtom);
  useAtom(isParcelReadyAtom);
  const [codeString] = useAtom(codeStringAtomWithStorage);
  return (
    <section className="code">
      <div className="section-header">
        <h2>Code</h2>
        <CopyButton text="Copy CSS" toCopy={codeString} />
        <CopyButton text="Copy Share Link" toCopy={shareLink} />
      </div>
      <SyntaxHighlighter language="css" style={vs} className="codeblock">
        {codeString}
      </SyntaxHighlighter>
    </section>
  );
}

function CopyButton({ text, toCopy }: { text: string; toCopy: string }) {
  const [copyState, dispatch] = useReducer(
    (state: CopyState, action: Partial<CopyState>) => ({ ...state, ...action }),
    { loading: false, copied: false }
  );
  return (
    <button
      className="app-btn"
      onClick={() => {
        dispatch({ loading: true });
        copyCode(toCopy).then(() => {
          dispatch({ loading: false, copied: true });
          // Reset After 5 Seconds
          setTimeout(() => {
            dispatch({ copied: false });
          }, 5000);
        });
      }}
    >
      {copyState.copied ? <AiOutlineCheck size={14} /> : null}
      <span>
        {copyState.loading ? "..." : copyState.copied ? "Copied" : text}
      </span>
    </button>
  );
}
