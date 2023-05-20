import { useRef, useEffect } from 'react';

export const useInitialRender = () => {
    const isInitialRender = useRef(true);

    useEffect(() => {
        isInitialRender.current = false;
    }, []);

    return isInitialRender;
};
