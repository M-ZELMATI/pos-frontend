import { useState, useEffect, useCallback } from "react";

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

const BREAKPOINTS: Record<Breakpoint, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

interface ScreenSize {
  width: number;
  height: number;
  lessThan: (breakpoint: Breakpoint | number) => boolean;
  greaterThan: (breakpoint: Breakpoint | number) => boolean;
}

export function useScreenSize(): ScreenSize {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // initial

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resolveBreakpoint = useCallback((bp: Breakpoint | number) => {
    if (typeof bp === "number") return bp;
    return BREAKPOINTS[bp];
  }, []);

  const lessThan = useCallback(
    (bp: Breakpoint | number) => size.width < resolveBreakpoint(bp),
    [size.width, resolveBreakpoint]
  );

  const greaterThan = useCallback(
    (bp: Breakpoint | number) => size.width > resolveBreakpoint(bp),
    [size.width, resolveBreakpoint]
  );

  return { ...size, lessThan, greaterThan };
}
