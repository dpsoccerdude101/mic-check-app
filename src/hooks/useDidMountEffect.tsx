/**
 * Written by Mehdi Dehghani (https://stackoverflow.com/a/57941438/18053419)
 */
import { DependencyList, useEffect, useRef } from 'react';

/**
 * Prevents running useEffect on initial render.
 * @param func
 * @param deps
 */
const useDidMountEffect = (func: () => void, deps: DependencyList) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    }, deps);
};

export default useDidMountEffect;
