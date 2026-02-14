import React from 'react';

const TREE_COLORS = {
  trunk: '#8B6914',
  trunkDark: '#6B4F10',
  leaf: '#4caf68',
  leafLight: '#6fcf97',
  leafDark: '#2d8049',
  gold: '#f2c027',
  goldLight: '#f5cf57',
  soil: '#3d2b1f',
};

function Seed() {
  return (
    <g className="tree-stage seed">
      <ellipse cx="150" cy="270" rx="40" ry="8" fill={TREE_COLORS.soil} opacity="0.5" />
      <ellipse cx="150" cy="260" rx="12" ry="15" fill="#8B6914">
        <animate attributeName="ry" values="14;16;14" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <path d="M148 248 Q150 240 152 248" fill={TREE_COLORS.leaf} opacity="0.6">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
      </path>
    </g>
  );
}

function Sprout() {
  return (
    <g className="tree-stage sprout">
      <ellipse cx="150" cy="270" rx="45" ry="10" fill={TREE_COLORS.soil} opacity="0.5" />
      <line x1="150" y1="270" x2="150" y2="230" stroke={TREE_COLORS.trunk} strokeWidth="4" strokeLinecap="round" />
      <g>
        <ellipse cx="140" cy="228" rx="14" ry="9" fill={TREE_COLORS.leaf} transform="rotate(-20 140 228)">
          <animate attributeName="rx" values="13;15;13" dur="2.5s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="162" cy="232" rx="12" ry="8" fill={TREE_COLORS.leafLight} transform="rotate(15 162 232)">
          <animate attributeName="rx" values="11;13;11" dur="3s" repeatCount="indefinite" />
        </ellipse>
      </g>
    </g>
  );
}

function Sapling() {
  return (
    <g className="tree-stage sapling">
      <ellipse cx="150" cy="275" rx="50" ry="10" fill={TREE_COLORS.soil} opacity="0.4" />
      <path d="M150 275 L150 200 Q148 195 145 200 M150 230 Q140 220 130 225 M150 215 Q160 205 170 210"
        stroke={TREE_COLORS.trunk} strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="150" cy="190" r="22" fill={TREE_COLORS.leaf}>
        <animate attributeName="r" values="21;24;21" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="135" cy="210" r="14" fill={TREE_COLORS.leafLight} opacity="0.9" />
      <circle cx="168" cy="205" r="12" fill={TREE_COLORS.leafDark} opacity="0.8" />
      <circle cx="150" cy="180" r="10" fill={TREE_COLORS.leafLight} opacity="0.7" />
    </g>
  );
}

function YoungTree() {
  return (
    <g className="tree-stage young-tree">
      <ellipse cx="150" cy="280" rx="60" ry="12" fill={TREE_COLORS.soil} opacity="0.3" />
      {/* Trunk */}
      <path d="M150 280 L150 180 M150 240 Q130 225 120 235 M150 220 Q170 200 180 210 M150 200 Q135 185 125 195"
        stroke={TREE_COLORS.trunk} strokeWidth="7" fill="none" strokeLinecap="round" />
      {/* Canopy */}
      <circle cx="150" cy="170" r="35" fill={TREE_COLORS.leaf}>
        <animate attributeName="r" values="34;37;34" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="125" cy="195" r="22" fill={TREE_COLORS.leafLight} opacity="0.9" />
      <circle cx="178" cy="190" r="20" fill={TREE_COLORS.leafDark} opacity="0.85" />
      <circle cx="140" cy="155" r="18" fill={TREE_COLORS.leafLight} opacity="0.7" />
      <circle cx="165" cy="160" r="16" fill={TREE_COLORS.leaf} opacity="0.8" />
      {/* Small fruits */}
      <circle cx="135" cy="175" r="3" fill={TREE_COLORS.gold} opacity="0.8">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="168" cy="170" r="3" fill={TREE_COLORS.gold} opacity="0.7" />
    </g>
  );
}

function MightyOak() {
  return (
    <g className="tree-stage mighty-oak">
      <ellipse cx="150" cy="285" rx="70" ry="14" fill={TREE_COLORS.soil} opacity="0.25" />
      {/* Thick trunk with roots */}
      <path d="M142 285 Q140 250 138 220 Q136 190 140 175 M158 285 Q160 250 162 220 Q164 190 160 175"
        stroke={TREE_COLORS.trunk} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M150 285 L150 170" stroke={TREE_COLORS.trunk} strokeWidth="12" strokeLinecap="round" />
      {/* Roots */}
      <path d="M140 280 Q120 285 110 280 M160 280 Q180 285 190 280"
        stroke={TREE_COLORS.trunkDark} strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Branches */}
      <path d="M150 220 Q120 200 105 210 M150 200 Q180 175 195 185 M150 190 Q125 170 115 180"
        stroke={TREE_COLORS.trunk} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Large canopy */}
      <circle cx="150" cy="150" r="48" fill={TREE_COLORS.leaf}>
        <animate attributeName="r" values="47;50;47" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="110" cy="185" r="28" fill={TREE_COLORS.leafLight} opacity="0.9" />
      <circle cx="192" cy="178" r="25" fill={TREE_COLORS.leafDark} opacity="0.85" />
      <circle cx="130" cy="135" r="22" fill={TREE_COLORS.leafLight} opacity="0.75" />
      <circle cx="175" cy="140" r="20" fill={TREE_COLORS.leaf} opacity="0.8" />
      <circle cx="150" cy="120" r="18" fill={TREE_COLORS.leafLight} opacity="0.6" />
      {/* Fruits */}
      {[
        [125, 160], [170, 155], [145, 135], [160, 175], [135, 180]
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={TREE_COLORS.gold} opacity="0.9">
          <animate attributeName="opacity" values="0.7;1;0.7" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
  );
}

function EtzChaim() {
  return (
    <g className="tree-stage etz-chaim">
      {/* Glow */}
      <circle cx="150" cy="160" r="80" fill="url(#treeGlow)" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite" />
      </circle>
      <ellipse cx="150" cy="285" rx="75" ry="14" fill={TREE_COLORS.soil} opacity="0.2" />
      {/* Majestic trunk */}
      <path d="M150 285 L150 150" stroke={TREE_COLORS.trunk} strokeWidth="14" strokeLinecap="round" />
      <path d="M143 285 Q138 250 135 220 Q132 190 136 170 M157 285 Q162 250 165 220 Q168 190 164 170"
        stroke={TREE_COLORS.trunk} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Deep roots */}
      <path d="M138 282 Q115 290 100 282 M162 282 Q185 290 200 282 M145 284 Q128 295 115 290 M155 284 Q172 295 185 290"
        stroke={TREE_COLORS.trunkDark} strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Grand branches */}
      <path d="M150 230 Q115 210 95 220 M150 210 Q185 185 205 195 M150 195 Q118 175 100 185 M150 180 Q182 158 195 168"
        stroke={TREE_COLORS.trunk} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Magnificent canopy */}
      <circle cx="150" cy="135" r="58" fill={TREE_COLORS.leaf}>
        <animate attributeName="r" values="56;60;56" dur="7s" repeatCount="indefinite" />
      </circle>
      <circle cx="98" cy="185" r="32" fill={TREE_COLORS.leafLight} opacity="0.9" />
      <circle cx="204" cy="178" r="30" fill={TREE_COLORS.leafDark} opacity="0.85" />
      <circle cx="118" cy="125" r="26" fill={TREE_COLORS.leafLight} opacity="0.75" />
      <circle cx="185" cy="130" r="24" fill={TREE_COLORS.leaf} opacity="0.8" />
      <circle cx="150" cy="100" r="25" fill={TREE_COLORS.leafLight} opacity="0.65" />
      <circle cx="130" cy="155" r="20" fill={TREE_COLORS.leafDark} opacity="0.7" />
      <circle cx="172" cy="150" r="18" fill={TREE_COLORS.leafLight} opacity="0.75" />
      {/* Golden fruits */}
      {[
        [120, 150], [175, 145], [140, 120], [165, 170], [130, 180],
        [155, 110], [108, 165], [190, 160], [145, 95], [160, 135]
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={TREE_COLORS.goldLight}>
          <animate attributeName="r" values="4;6;4" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;1;0.8" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Star of David at top */}
      <g transform="translate(150, 78)" opacity="0.9">
        <polygon points="0,-10 8.66,5 -8.66,5" fill="none" stroke={TREE_COLORS.gold} strokeWidth="1.5" />
        <polygon points="0,10 8.66,-5 -8.66,-5" fill="none" stroke={TREE_COLORS.gold} strokeWidth="1.5" />
        <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
      </g>
    </g>
  );
}

const stages = [Seed, Sprout, Sapling, YoungTree, MightyOak, EtzChaim];

export default function TreeSVG({ level = 0, size = 300 }) {
  const StageComponent = stages[Math.min(level, 5)];

  return (
    <svg
      viewBox="0 0 300 300"
      width={size}
      height={size}
      className="tree-svg"
      style={{ filter: level >= 5 ? 'drop-shadow(0 0 20px rgba(242, 192, 39, 0.3))' : 'none' }}
    >
      <defs>
        <radialGradient id="treeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={TREE_COLORS.gold} stopOpacity="0.4" />
          <stop offset="100%" stopColor={TREE_COLORS.gold} stopOpacity="0" />
        </radialGradient>
      </defs>
      <StageComponent />
    </svg>
  );
}
