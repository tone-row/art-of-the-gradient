import { SVGProps } from "react";

export const Toggle = ({
  checked = false,
  ...props
}: SVGProps<SVGSVGElement> & { checked?: boolean }) => (
  <svg
    viewBox="100 100 200 100"
    className={`layer-toggle ${checked ? "checked" : ""}`}
    {...props}
  >
    <rect x={100} y={100} width={200} height={100} rx={50} ry={50} />
    <circle
      style={{
        fill: "#dedede",
      }}
      cx={checked ? 248.581 : 148.581}
      cy={150.811}
      r={42.581}
    />
  </svg>
);
