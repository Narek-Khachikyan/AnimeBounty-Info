import { useEffect, useRef } from "react";

const useAutoLoadOnVisible = ({ enabled = true, isLoaded = false, onLoad, rootMargin = "220px 0px" }) => {
  const nodeRef = useRef(null);
  const onLoadRef = useRef(onLoad);

  useEffect(() => {
    onLoadRef.current = onLoad;
  }, [onLoad]);

  useEffect(() => {
    if (!enabled || isLoaded) return undefined;

    const node = nodeRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      onLoadRef.current?.();
      return undefined;
    }

    let didLoad = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!didLoad && entry.isIntersecting) {
        didLoad = true;
        onLoadRef.current?.();
        observer.disconnect();
      }
    }, { rootMargin });

    observer.observe(node);

    return () => observer.disconnect();
  }, [enabled, isLoaded, rootMargin]);

  return nodeRef;
};

export default useAutoLoadOnVisible;
