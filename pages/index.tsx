import { CSSProperties, useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { animate } from "motion";

import {
  backgroundCssAtom,
  backgroundPositionAtom,
  backgroundSizeAtom,
  settingsAtom,
} from "../lib/state";
import { useAtom } from "jotai";
import { ToggleControls } from "../components/ToggleControls";
import { Blend } from "../components/Blend";
import dynamic from "next/dynamic";
import { Code } from "../components/Code";
import { Style } from "../components/Style";

const Layers = dynamic(() => import("../components/Layers"), {
  ssr: false,
});
const Size = dynamic(() => import("../components/Size"), {
  ssr: false,
});
const Position = dynamic(() => import("../components/Position"), {
  ssr: false,
});

const Home: NextPage = () => {
  const [css] = useAtom(backgroundCssAtom);
  const [size] = useAtom(backgroundSizeAtom);
  const [position] = useAtom(backgroundPositionAtom);
  const [settings] = useAtom(settingsAtom);

  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    // catch h key
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "h") {
        setIsVisible((v) => !v);
        // trigger Escape key down
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const container = document.querySelector(".container");
    if (!container) return;
    if (isVisible) {
      animate(
        container,
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
        },
        {
          duration: 0.5,
        }
      );
    } else {
      animate(
        container,
        {
          opacity: 0,
          scale: 0.9,
          filter: "blur(50px)",
        },
        {
          duration: 0.5,
        }
      );
    }
  }, [isVisible]);

  return (
    <div className="app" suppressHydrationWarning={true}>
      <Head>
        <title>L&#x27;art du dégradé ~ The Art of the Gradient</title>
      </Head>
      <Style
        css={`
          body {
            --bg: ${css};
            --size: ${size};
            --position: ${position};
            --blend: ${settings.blend};
          }
        `}
      />
      <ToggleControls setIsVisible={setIsVisible} />
      <div className="container">
        <header className="container-header">
          <h1>L&#x27;art du dégradé</h1>
          <div className="container-header-row">
            <a
              href="https://twitter.com/tone_row_"
              className="byline"
              target="_blank"
              rel="noreferrer"
            >
              <span style={{ fontFamily: "PP Agrandir", fontWeight: "700" }}>
                The Art of the Gradient
              </span>
              {" / "}
              Tone Row
            </a>
          </div>
        </header>
        <section className="preview">
          <div
            className="preview-inner"
            suppressHydrationWarning={true}
            style={
              {
                "--bg": css,
                "--size": size,
                "--position": position,
                "--blend": settings.blend,
              } as CSSProperties
            }
          />
        </section>
        <main>
          <Layers />
          <Blend />
          <Position />
          <Size />
          <Code />
        </main>
      </div>
    </div>
  );
};

export default Home;
