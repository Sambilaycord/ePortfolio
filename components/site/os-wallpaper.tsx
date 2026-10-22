import { cssVars } from "@/lib/utils";

const STARS = [
  [120, 90], [260, 160], [410, 70], [560, 130], [720, 60], [880, 150], [1010, 90], [1180, 140], [1320, 70], [1480, 120],
  [190, 240], [640, 220], [1090, 230], [1400, 250],
];

/** Pines scattered over the slopes: position, then size, so the near ones read larger. */
const PINES = [
  [120, 700, 1], [175, 712, 0.75], [230, 698, 0.9], [520, 738, 0.65], [880, 742, 0.7], [1430, 702, 1.05], [1500, 716, 0.8],
];

function Pine({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <g className="os-tree" transform={`translate(${x} ${y}) scale(${size})`}>
      <path d="M-26 0L0 -70 26 0z" />
      <path d="M-20 -34L0 -104 20 -34z" />
      <path d="M-13 -66L0 -128 13 -66z" />
    </g>
  );
}

/**
 * The desktop wallpaper: a green mountain valley in paper-cut layers, with mist between the
 * ranges and a little cabin in the meadow. By day it is a soft morning; by lamplight the
 * sky goes to stars and the cabin's window glows. Each layer drifts at its own pace as the
 * chapter scrolls, for depth.
 */
export function OsWallpaper() {
  return (
    <svg aria-hidden="true" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="os-wallpaper absolute inset-0 size-full">
      <defs>
        <linearGradient id="os-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="os-sky-top" />
          <stop offset="1" className="os-sky-bottom" />
        </linearGradient>
        <radialGradient id="os-cabin-glow">
          <stop offset="0" stopColor="#ffb766" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffb766" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#os-sky)" />
      <g className="os-stars">
        {STARS.map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r={index % 3 === 0 ? 2.4 : 1.6} fill="#fff6dc" className="sky-star" style={cssVars({ "--i": String(index) })} />
        ))}
      </g>
      <circle cx="1180" cy="250" r="64" className="os-sun" />

      <path
        className="os-hill os-hill--far"
        d="M-100 540L90 400 210 470 380 320 520 440 700 290 880 450 1040 340 1200 460 1380 350 1540 430 1700 380V900H-100z"
      />
      <ellipse cx="800" cy="520" rx="1000" ry="46" className="os-mist" />
      <path
        className="os-hill os-hill--mid"
        d="M-100 620L70 530 230 600 410 480 610 610 790 510 980 620 1160 520 1340 600 1520 530 1700 590V900H-100z"
      />
      <ellipse cx="700" cy="640" rx="900" ry="30" className="os-mist" />
      <g className="os-hill os-hill--near-group">
        <path className="os-hill--near" d="M-100 730C180 670 400 690 640 726S1040 776 1300 706 1580 684 1700 700V900H-100z" />
        <path className="os-meadow" d="M-100 812C260 772 560 790 860 812S1360 838 1700 800V900H-100z" />
        {PINES.map(([x, y, size]) => (
          <Pine key={`${x}-${y}`} x={x} y={y} size={size} />
        ))}
        {/* The cabin in the meadow, smoke curling from its chimney. */}
        <g transform="translate(1180 640)">
          <circle cx="40" cy="40" r="90" fill="url(#os-cabin-glow)" className="os-cabin-glow" />
          <path d="M0 40L40 8 80 40V86H0z" className="os-cabin" />
          <path d="M-8 44L40 4 88 44" className="os-roof" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <rect x="58" y="-4" width="10" height="26" className="os-cabin" />
          <rect x="16" y="50" width="20" height="18" rx="2" className="os-cabin-window" />
          <rect x="48" y="56" width="16" height="30" rx="2" className="os-roof" />
          <path className="desk-steam os-smoke" d="M63 -10c-8-10 8-16 0-28" fill="none" strokeWidth="5" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
