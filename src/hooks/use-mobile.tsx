import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    checkIsMobile()
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(checkIsMobile());
    };
    mql.addEventListener("change", onChange);
    setIsMobile(checkIsMobile());
    return () => {
      console.log("remove event listener");
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return !!isMobile;
}

function checkIsMobile() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}
