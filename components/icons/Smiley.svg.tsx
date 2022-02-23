import { SVGProps } from "react";

export const Smiley = (props: SVGProps<SVGSVGElement>) => (
  <svg
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x={0}
    y={0}
    viewBox="-4 -3 56 56"
    xmlSpace="preserve"
    {...props}
  >
    <style>{".st0{fill:#fff;stroke:#000;clip-path:url(#SVGID_2_)}"}</style>
    <defs>
      <path id="SVGID_1_" d="M3.89 4.89h40.26v40.26H3.89z" />
    </defs>
    <clipPath id="SVGID_2_">
      <use
        xlinkHref="#SVGID_1_"
        style={{
          overflow: "visible",
        }}
      />
    </clipPath>
    <g id="smileyface">
      <circle className="st0" cx={24.02} cy={25.02} r={19.63} fill="white" />
      <path
        className="st0"
        d="M10.28 24.71c0 7.59 6.15 13.74 13.74 13.74s13.74-6.15 13.74-13.74"
      />
      <path
        d="M15.95 20.59c1.5 0 2.72-1.22 2.72-2.72 0-1.5-1.22-2.72-2.72-2.72s-2.72 1.22-2.72 2.72c0 1.51 1.22 2.72 2.72 2.72m16.13 0c1.5 0 2.72-1.22 2.72-2.72 0-1.5-1.22-2.72-2.72-2.72-1.5 0-2.72 1.22-2.72 2.72a2.723 2.723 0 0 0 2.72 2.72"
        style={{
          clipPath: "url(#SVGID_2_)",
        }}
      />
    </g>
    <path
      id="myTextPath"
      d="M23 0a23 23 0 0 1-46 0 23 23 0 0 1 46 0"
      transform="translate(24.02 25.02)"
      fill="none"
      stroke="none"
      strokeWidth={0}
    />
    <g id="spin-text" transform="rotate(100 24.02 25.02)">
      <text>
        <textPath
          xlinkHref="#myTextPath"
          style={{
            fontSize: 6,
            fontFamily: "&quot",
          }}
        >
          {"Press “H” to toggle controls"}
        </textPath>
      </text>
    </g>
  </svg>
);
