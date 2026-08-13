import React, { useId } from 'react';

function OrnamentSvg({ className, preserveAspectRatio = 'xMidYMid slice' }) {
  const patternId = `kama-edge-${useId().replace(/:/g, '')}`;

  return (
    <svg
      className={className}
      viewBox="0 0 120 12"
      preserveAspectRatio={preserveAspectRatio}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={patternId} x="0" y="0" width="24" height="12" patternUnits="userSpaceOnUse">
          <path
            d="M12 2 L16 6 L12 10 L8 6 Z"
            fill="none"
            stroke="#425B43"
            strokeWidth="0.7"
            opacity="0.18"
          />
          <path
            d="M0 6 L4 4 L8 6 L12 4 L16 6 L20 4 L24 6"
            fill="none"
            stroke="#C9953D"
            strokeWidth="0.6"
            opacity="0.14"
          />
        </pattern>
      </defs>
      <rect width="120" height="12" fill={`url(#${patternId})`} />
    </svg>
  );
}

export default function EdgeOrnament({ variant = 'frame' }) {
  if (variant === 'band') {
    return (
      <>
        <div className="absolute top-0 left-0 right-0 h-3 overflow-hidden pointer-events-none" aria-hidden="true">
          <OrnamentSvg className="h-full w-full" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-3 overflow-hidden pointer-events-none" aria-hidden="true">
          <OrnamentSvg className="h-full w-full" />
        </div>
      </>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[45] overflow-hidden print:hidden" aria-hidden="true">
      <OrnamentSvg className="absolute top-0 left-0 w-full h-3" />
      <OrnamentSvg className="absolute bottom-0 left-0 w-full h-3" />
      <OrnamentSvg
        className="absolute top-0 left-0 h-3 w-[100vh] origin-top-left rotate-90"
        preserveAspectRatio="none"
      />
      <OrnamentSvg
        className="absolute top-0 right-0 h-3 w-[100vh] origin-top-right -rotate-90"
        preserveAspectRatio="none"
      />
    </div>
  );
}
