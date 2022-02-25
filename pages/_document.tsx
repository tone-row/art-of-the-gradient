import { GetServerSideProps } from "next";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { resetServerContext } from "react-beautiful-dnd";
import { getBaseURL } from "../lib/state";

export const getServerSideProps: GetServerSideProps = async (context) => {
  resetServerContext();
  return { props: {} };
};

const TITLE = "L'art du dégradé ~ The Art of the Gradient";
const DESCRIPTION =
  "A CSS Gradient Generator. Your go-to gizmo for generating goofy gradients";
const DEFAULT_IMAGE = `${getBaseURL()}/screenshot.png`;
class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
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
          <link
            href="https://fonts.googleapis.com/css2?family=Space+Mono&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" href="/favicon.ico" />
          <style
            dangerouslySetInnerHTML={{
              __html: `@font-face {
        font-family: "PP Agrandir";
        src: url("/fonts/PPAgrandir-TextBold.woff2") format("woff2");
        font-weight: 700;
      }
      @font-face {
        font-family: "PP Agrandir Narrow";
        src: url("/fonts/PPAgrandir-NarrowRegular.woff2") format("woff2");
        font-weight: 400;
      }`,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
