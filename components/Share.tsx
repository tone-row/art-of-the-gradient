import { atom, useAtom } from "jotai";
import { getBaseURL, layersAtomWithStorage, settingsAtom } from "../lib/state";
import { useReducer, useState } from "react";

import { AiOutlineCheck } from "react-icons/ai";
import { BiCodeCurly } from "react-icons/bi";
import { BsFillFileImageFill } from "react-icons/bs";
import { FiCodepen } from "react-icons/fi";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { IoMdShare } from "react-icons/io";
import { Twitter } from "./icons/Twitter.svg";
import { codeStringAtom } from "./Code";
import pako from "pako";

const searchParamsAtom = atom<URLSearchParams>((get) => {
  const settings = get(settingsAtom);
  const layers = get(layersAtomWithStorage);
  const compressed = pako
    .deflate(JSON.stringify({ settings, layers }))
    .toString()
    .replace(/,/g, "-");
  // new searchparams
  return new URLSearchParams({
    data: compressed,
  });
});
const shareLinkAtom = atom((get) => {
  const searchParams = get(searchParamsAtom);
  return `${getBaseURL()}/share?${searchParams}`;
});

const DEFAULT_TWEETS = [
  "Check out this gradient! @tone_row_",
  "Check out this CSS Gradient Generator by @tone_row_",
];
const tweetLinkAtom = atom((get) => {
  const url = get(shareLinkAtom);
  // get random default
  const text =
    DEFAULT_TWEETS[Math.floor(Math.random() * DEFAULT_TWEETS.length)];
  const searchParams = new URLSearchParams({
    url,
    text,
  });
  return `https://twitter.com/intent/tweet?${searchParams}`;
});

const downloadLinkAtom = atom((get) => {
  const searchParams = get(searchParamsAtom);
  return `${getBaseURL()}/api/thumbnail?url=${encodeURIComponent(
    `${getBaseURL()}/preview?${searchParams}`
  )}`;
});

export default function Share() {
  const [shareLink] = useAtom(shareLinkAtom);
  const [tweetLink] = useAtom(tweetLinkAtom);
  const [codeString] = useAtom(codeStringAtom);
  const codepenString = `html,body {height: 100%; margin: 0} ${codeString.replace(
    /\.your-element/g,
    "body"
  )}`;
  const [downloadLink] = useAtom(downloadLinkAtom);
  const [saving, setSaving] = useState(false);

  return (
    <div className="share-section">
      <CopyButton
        text="Copy CSS"
        toCopy={codeString}
        subtitle="Drop it directly in your code"
      >
        <BiCodeCurly size={36} />
      </CopyButton>
      <CopyButton
        text="Copy Link"
        toCopy={shareLink}
        subtitle="Share it! Comes with a nice preview!"
      >
        <IoMdShare size={36} />
      </CopyButton>
      <a
        className="app-btn-lg"
        href={tweetLink}
        target="_blank"
        rel="noreferrer"
      >
        <div className="icon">
          <Twitter width={36} />
        </div>
        <div className="app-btn-lg-right">
          <span className="app-btn-lg-title">Tweet</span>
          <span>Share it on Twitter</span>
        </div>
      </a>
      <form
        action="https://codepen.io/pen/define"
        method="POST"
        target="_blank"
      >
        <input
          type="hidden"
          name="data"
          value={JSON.stringify({ html: "", js: "", css: codepenString })}
        />
        <button className="app-btn-lg">
          <div className="icon">
            <FiCodepen size={36} />
          </div>
          <div className="app-btn-lg-right">
            <span className="app-btn-lg-title">CodePen</span>
            <span>Open in a new pen</span>
          </div>
        </button>
      </form>
      <button
        className="app-btn-lg"
        onClick={() => {
          setSaving(true);
          fetch(downloadLink, {
            method: "GET",
          })
            .then((res) => res.blob())
            .then((blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.style.display = "none";
              a.href = url;
              a.download = "gradient.png";
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
            })
            .finally(() => setSaving(false));
        }}
      >
        <div className="icon">
          {saving ? (
            <HiOutlineDotsHorizontal size={36} />
          ) : (
            <BsFillFileImageFill size={36} />
          )}
        </div>
        <div className="app-btn-lg-right">
          <span className="app-btn-lg-title">Save</span>
          <span>Save as a PNG</span>
        </div>
      </button>
    </div>
  );
}

type CopyState = { loading: boolean; copied: boolean };
function CopyButton({
  text,
  toCopy,
  subtitle = "",
  children,
}: {
  text: string;
  toCopy: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const [copyState, dispatch] = useReducer(
    (state: CopyState, action: Partial<CopyState>) => ({ ...state, ...action }),
    { loading: false, copied: false }
  );
  return (
    <button
      className="app-btn-lg"
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
      <div className="icon">
        {copyState.copied ? <AiOutlineCheck size={36} /> : children}
      </div>
      <div className="app-btn-lg-right">
        <span className="app-btn-lg-title">
          {copyState.loading ? "..." : copyState.copied ? "Copied" : text}
        </span>
        <span>{subtitle}</span>
      </div>
    </button>
  );
}
async function copyCode(code: string) {
  const clipboard = (await import("clipboardy")).default;
  await clipboard.write(code);
  return;
}
