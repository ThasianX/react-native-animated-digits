import { useMemo, useRef } from 'react';
import { AnimatedItem, MakeAnimatedItems } from './item';

export type AnimatedDigitsProps = {
    value: string;
    prefix?: string;
    suffix?: string;
    makeAnimatedItems: MakeAnimatedItems;
};

export const useAnimatedItems = ({
    value,
    prefix,
    suffix,
    makeAnimatedItems,
}: AnimatedDigitsProps) => {
    const itemsRef = useRef<AnimatedItem[]>([]);
    const items = useMemo(() => {
        const items = [
            ...(prefix
                ? [
                      {
                          type: 'prefix',
                          value: prefix,
                      } as AnimatedItem,
                  ]
                : []),
            ...makeAnimatedItems(value),
            ...(suffix
                ? [
                      {
                          type: 'suffix',
                          value: suffix,
                      } as AnimatedItem,
                  ]
                : []),
        ];
        itemsRef.current = items;
        return items;
    }, [makeAnimatedItems, prefix, suffix, value]);

    return { items, itemsRef };
};
