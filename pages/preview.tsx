import { GetServerSideProps, NextPage } from "next";
import { inflate } from "pako";
import { Style } from "../components/Style";
import {
  getBackgroundCssFromGradients,
  getBackgroundPositionAtom,
  getBackgroundSizeAtom,
} from "../lib/state";
import { AppState } from "../lib/types";

export const getServerSideProps: GetServerSideProps<
  {},
  {},
  { data: string }
> = async ({ query }) => {
  let dataStr = "";
  if (query.data && typeof query.data === "string") dataStr = query.data;
  const data = JSON.parse(
    inflate(dataStr.split("-").map(parseFloat), { to: "string" })
  ) as AppState;

  const backgroundCssAtom = getBackgroundCssFromGradients(data.layers);
  const backgroundSizeAtom = getBackgroundSizeAtom(data.settings);
  const backgroundPositionAtom = getBackgroundPositionAtom(data.settings);

  let code = `background: ${backgroundCssAtom}; background-size: ${backgroundSizeAtom}; background-position: ${backgroundPositionAtom}; background-blend-mode: ${data.settings.blend};`;

  return { props: { code } };
};

const Preview: NextPage<{ code: string }> = ({ code }) => {
  return (
    <Style
      css={`
        body {
          ${code}
        }
      `}
    />
  );
};

export default Preview;
