import React, { useRef } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { AnimatedItem } from './item';
import { AnimatedItemKeyExtractor } from './key';
import { AnimationConstants } from './animations';

export type AnimatedDigitsProps = {
    itemsRef: React.MutableRefObject<AnimatedItem[]>;
    width: number;
    keyExtractor: AnimatedItemKeyExtractor;
};

export const useScaledDigits = ({
    itemsRef,
    width,
    keyExtractor,
}: AnimatedDigitsProps) => {
    const sizes = useRef<{ [key: React.Key]: number }>({});
    const scale = useSharedValue(1);
    const scales = useRef<number[]>([]);

    // Measures width of current digits and scales it appropriately to fit max width
    const measure = (key: React.Key, digitWidth?: number) => {
        // Measure visible digits
        if (digitWidth) {
            if (sizes.current[key]) {
                return;
            }
            sizes.current[key] = digitWidth;
        } else {
            delete sizes.current[key];
        }

        // Wait for all new digits to be rendered and measured
        if (
            itemsRef.current.length === Object.keys(sizes.current).length &&
            itemsRef.current.every(
                (item) => !!sizes.current[keyExtractor(item)]
            )
        ) {
            // Calculate the scaled width
            const unscaledWidth = itemsRef.current.reduce(
                (acc, item) => acc + sizes.current[keyExtractor(item)]!,
                0
            );
            const scaledWidth = unscaledWidth * scale.value;
            if (scaledWidth > width) {
                // Scale the digits down if over the max specified width. The current scale is
                // appended to the stack to cache the scale up
                scales.current.push(scale.value);
                const newScale = scale.value * 0.7;
                scale.value = withTiming(newScale, {
                    duration: AnimationConstants.ELEMENT_ANIMATION_DURATION,
                });
            } else if (
                scales.current.length >= 1 &&
                scaledWidth / 0.7 <= width
            ) {
                // Scale the digits up if under the previously max scaled width
                const previousScale = scales.current.pop()!;
                scale.value = withTiming(previousScale, {
                    duration: AnimationConstants.ELEMENT_ANIMATION_DURATION,
                });
            }
        }
    };

    return { scale, measure };
};
