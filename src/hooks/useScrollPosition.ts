import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback as useDebounce } from 'use-debounce';
import horizontalAnimateScroll from 'src/utils/scrollTo';

export const useScrollPosition = (
  ref: React.RefObject<HTMLElement>,
  listenResizeEvent: boolean = false,
  debounceDelay: number = 50,
): [boolean, boolean, (leftValue: number) => void, () => void] => {
  const [isOnTheLeft, setIsOnTheLeft] = useState(false);
  const [isOnTheRight, setIsOnTheRight] = useState(false);
  const rafId = useRef<null | number>(null);
  const computePosition = useCallback(() => {
    if (ref.current) {
      setIsOnTheLeft(ref.current && ref.current.scrollLeft > 0);
      setIsOnTheRight(
        ref.current &&
          ref.current.scrollWidth !== ref.current.clientWidth + ref.current.scrollLeft,
      );
    }
  }, [ref]);

  const horizontalScrollTo = useCallback(
    (left: number) => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      if (window && ref.current) {
        try {
          horizontalAnimateScroll(ref, left, 300, rafId);
        } catch (error) {
          // 사파리에서 scrollOptions 지원하지 않음
          // ref.current.scroll({ left: ref.current.scrollLeft + left, behavior: 'smooth' });
        }
      }
    },
    [ref, rafId],
  );

  const handleWheelEvent = useCallback(
    event => {
      if (Math.abs(event.deltaX) > 10 && rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    },
    [rafId],
  );
  const [debouncedHScrollHandler] = useDebounce(computePosition, debounceDelay, [ref]);
  const [debouncedResizeHandler] = useDebounce(computePosition, 500, [ref]);
  useEffect(() => {
    if (window && ref.current) {
      ref.current.addEventListener('scroll', debouncedHScrollHandler);
      ref.current.addEventListener('wheel', handleWheelEvent);

      if (listenResizeEvent) {
        window.addEventListener('resize', debouncedResizeHandler);
      }
      computePosition();

      return () => {
        if (!ref.current) {
          return;
        }
        if (rafId.current) {
          cancelAnimationFrame(rafId.current);
        }

        ref.current.removeEventListener('scroll', debouncedHScrollHandler);
        ref.current.removeEventListener('wheel', handleWheelEvent);

        if (listenResizeEvent) {
          window.removeEventListener('resize', debouncedResizeHandler);
        }
      };
    }
    return () => {};
  }, [
    ref,
    computePosition,
    debouncedHScrollHandler,
    debouncedResizeHandler,
    listenResizeEvent,
    handleWheelEvent,
    rafId,
  ]);

  return [isOnTheLeft, isOnTheRight, horizontalScrollTo, computePosition];
};
