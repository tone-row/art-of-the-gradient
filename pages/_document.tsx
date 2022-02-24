import { GetServerSideProps } from "next";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { resetServerContext } from "react-beautiful-dnd";

export const getServerSideProps: GetServerSideProps = async (context) => {
  resetServerContext();
  return { props: {} };
};

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta property="og:title" content="L'art du dégradé" key="title" />
          <meta
            property="og:description"
            content="Your go-to gizmo for generating goofy gradients"
            key="description"
          />
          <meta
            property="twitter:card"
            content="summary_large_image"
            key="twitter:card"
          />
          <meta
            property="twitter:site"
            content="@tone_row_"
            key="twitter:site"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Space+Mono&display=swap"
            rel="stylesheet"
          />
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
