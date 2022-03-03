import { CSSProperties, useEffect, useRef, useState } from "react";
import {
  backgroundCssAtom,
  backgroundPositionAtom,
  backgroundSizeAtom,
  getBaseURL,
  keyWithPath,
  settingsAtom,
  useRandomize,
} from "../lib/state";

import { Code } from "../components/Code";
import { GrMagic } from "react-icons/gr";
import Head from "next/head";
import type { NextPage } from "next";
import Share from "../components/Share";
import { Style } from "../components/Style";
import { Support } from "../components/Support";
import { ToggleControls } from "../components/ToggleControls";
import { animate } from "motion";
import dynamic from "next/dynamic";
import { useAtom } from "jotai";

const TITLE = "L'art du dégradé ~ The Art of the Gradient";
const DESCRIPTION =
  "Your go-to gizmo for generating goofy gradients- i.e., a CSS Gradient Generator";
const DEFAULT_IMAGE = `${getBaseURL()}/screenshot.png`;

const Layers = dynamic(() => import("../components/Layers"), {
  ssr: false,
});
const Size = dynamic(() => import("../components/Size"), {
  ssr: false,
});
const Position = dynamic(() => import("../components/Position"), {
  ssr: false,
});

const Blend = dynamic(() => import("../components/Blend"), {
  ssr: false,
});

const Home: NextPage = () => {
  const [css] = useAtom(backgroundCssAtom);
  const [size] = useAtom(backgroundSizeAtom);
  const [position] = useAtom(backgroundPositionAtom);
  const [settings] = useAtom(settingsAtom);
  const [showInterface, setShowInterface] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const randomize = useRandomize();
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

  useEffect(() => {
    function onVisibilityChange() {
      if (document.hidden) {
        // localStorage.removeItem(IS_OPEN_IN_ANOTHER_TAB);
        return setShowInterface(true);
      }
      setShowInterface(false);
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  // Don't render interface if another tab is open
  if (showInterface) {
    return null;
  }

  return (
    <div className="app" suppressHydrationWarning={true}>
      <Head>
        <title>L&#x27;art du dégradé ~ The Art of the Gradient</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content={TITLE} key="title" />
        <meta
          property="og:description"
          content={DESCRIPTION}
          key="description"
        />
        <meta property="og:image" content={DEFAULT_IMAGE} key="og:image" />
        <meta
          name="twitter:image"
          content={DEFAULT_IMAGE}
          key="twitter:image"
        />
        <meta
          property="twitter:image:alt"
          content="CSS Gradient"
          key="twitter:image:alt"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@tone_row_" />
        <meta name="twitter:creator" content="@rob______gordon" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
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
        <button
          onClick={(e) => {
            randomize();
            const el = e.currentTarget;
            el.classList.remove("abracadabra");
            requestAnimationFrame(() => {
              el.classList.add("abracadabra");
            });
          }}
          className="random-button"
        >
          <GrMagic />
          <span>Random Gradient</span>
        </button>
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
          <Share />
          <Support />
        </main>
      </div>
    </div>
  );
};

export default Home;
