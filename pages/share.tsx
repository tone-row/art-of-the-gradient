import { CSSProperties, useEffect, useRef, useState } from "react";
import {
  DESCRIPTION,
  backgroundCssAtom,
  backgroundPositionAtom,
  backgroundSizeAtom,
  getBaseURL,
  settingsAtom,
} from "../lib/state";
import { GetServerSideProps, NextPage } from "next";

import CloneOptions from "../components/CloneOptions";
import { Code } from "../components/Code";
import Head from "next/head";
import { Style } from "../components/Style";
import { ToggleControls } from "../components/ToggleControls";
import { animate } from "motion";
import { useAtom } from "jotai";

type PageProps = { ogImageUrl: string; isSharedGradient: boolean };

export const getServerSideProps: GetServerSideProps<
  PageProps,
  {},
  { data?: string }
> = async ({ query }) => {
  let ogImageUrl = "";
  let isSharedGradient = false;
  if (query.data && typeof query.data === "string") {
    isSharedGradient = true;
    const searchParams = new URLSearchParams({ data: query.data });
    ogImageUrl = `${getBaseURL()}/api/thumbnail?url=${encodeURIComponent(
      `${getBaseURL()}/preview?${searchParams}`
    )}`;
  }
  return {
    props: { ogImageUrl, isSharedGradient },
  };
};

const Share: NextPage<PageProps> = ({ ogImageUrl, isSharedGradient }) => {
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
        <title>Art of the Gradient</title>
        <meta name="og:title" content={"Art of the Gradient"} />
        <meta name="twitter:title" content={"Art of the Gradient"} />
        <meta name="twitter:text:title" content={"Art of the Gradient"} />

        <meta name="description" content={DESCRIPTION} />
        <meta name="twitter:description" content={DESCRIPTION} />

        <meta name="twitter:card" content="summary_large_image" />

        <meta property="og:image" content={ogImageUrl} key="og:image" />
        <meta name="twitter:image" content={ogImageUrl} key="twitter:image" />

        <meta
          property="twitter:image:alt"
          content="CSS Gradient"
          key="twitter:image:alt"
        />
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
          <CloneOptions />
          <Code />
        </main>
      </div>
    </div>
  );
};

export default Share;
