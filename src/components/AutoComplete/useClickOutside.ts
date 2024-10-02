import { MouseEventHandler, RefObject, useEffect } from "react";

export default function useClickOutside({
  target,
  onClickOutside,
}: {
  target: RefObject<HTMLElement>;
  onClickOutside: MouseEventHandler<HTMLElement>;
}) {
  useEffect(() => {
    const handleClick = (evt: any) => {
      if (target.current?.contains(evt.target)) {
        return;
      }
      onClickOutside(evt);
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [onClickOutside, target]);
}
