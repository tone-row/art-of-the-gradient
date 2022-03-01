import Document, { Head, Html, Main, NextScript } from "next/document";

import { Analytics } from "../components/Analytics";
import { GetServerSideProps } from "next";
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

          <Analytics />
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
