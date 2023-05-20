import React, { useEffect } from 'react';
import Animated from 'react-native-reanimated';
import { AnimatedItem } from './item';
import { StyleProp, TextStyle } from 'react-native';
import { AnimatedItemAnimateProps } from './animations';

export type AnimatedDigitProps = {
    id: React.Key;
    item: AnimatedItem;
    measure: (key: React.Key, width?: number) => void;
    style: StyleProp<TextStyle>;
} & AnimatedItemAnimateProps;

export const AnimatedDigit = ({
    id,
    item,
    measure,
    style,
    ...animateProps
}: AnimatedDigitProps) => {
    useEffect(() => {
        return () => {
            measure(id, undefined);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Animated.Text
            onLayout={(e) => measure(id, e.nativeEvent.layout.width)}
            style={style}
            {...animateProps}
        >
            {item.value}
        </Animated.Text>
    );
};
