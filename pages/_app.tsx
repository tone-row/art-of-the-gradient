import "modern-normalize";

import "../styles/globals.css";
import "../styles/Blend.css";
import "../styles/Code.css";
import "../styles/Blend.css";
import "../styles/Layer.css";
import "../styles/Layers.css";
import "../styles/NumberInput.css";
import "../styles/Size.css";
import "../styles/ToggleControls.css";
import "../styles/Toggle.svg.css";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
