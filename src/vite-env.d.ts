/// <reference types="vite/client" />

declare module '*.svg' {
  import React from 'react';
  const SVGComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVGComponent;
}