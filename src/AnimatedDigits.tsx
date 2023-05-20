import React, { useMemo } from 'react';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { MakeAnimatedItems, defaultMakeAnimatedItems } from './item';
import { AnimatedDigit } from './AnimatedDigit';
import { AnimatedItemKeyExtractor, defaultItemKeyExtractor } from './key';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import {
    EnterAnimationConfig,
    EnterAnimationConfigCreator,
    ExitAnimationConfig,
    ExitAnimationConfigCreator,
    LayoutAnimation,
    defaultEnterAnimationConfigCreator,
    defaultExitAnimationConfigCreator,
    defaultInitialEnterAnimationConfig,
    defaultLayoutAnimation,
} from './animations';
import { SCREEN_WIDTH } from './utils';
import { useAnimatedItems } from './useAnimatedItems';
import { useScaledDigits } from './useScaledDigits';
import { useInitialRender } from './useInitialRender';

const DEFAULT_TEXT_PROPS = {
    fontSize: SCREEN_WIDTH * 0.3,
    letterSpacing: -2,
};
const DEFAULT_WIDTH = SCREEN_WIDTH * 0.9;

export type AnimatedDigitsProps = {
    value: string;
    prefix?: string;
    prefixProps?: StyleProp<TextStyle>;
    suffix?: string;
    suffixProps?: StyleProp<TextStyle>;
    width?: number;
    textProps?: StyleProp<TextStyle>;
    makeAnimatedItems?: MakeAnimatedItems;
    keyExtractor?: AnimatedItemKeyExtractor;
    initialEnterAnimationConfig?: EnterAnimationConfig;
    enterAnimationConfigCreator?: EnterAnimationConfigCreator;
    exitAnimationConfigCreator?: ExitAnimationConfigCreator;
    layoutAnimation?: LayoutAnimation;
    style?: StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>;
};

export const AnimatedDigits = ({
    value,
    prefix,
    prefixProps,
    suffix,
    suffixProps,
    textProps = DEFAULT_TEXT_PROPS,
    width = DEFAULT_WIDTH,
    makeAnimatedItems = defaultMakeAnimatedItems,
    keyExtractor = defaultItemKeyExtractor,
    initialEnterAnimationConfig = defaultInitialEnterAnimationConfig,
    enterAnimationConfigCreator = defaultEnterAnimationConfigCreator,
    exitAnimationConfigCreator = defaultExitAnimationConfigCreator,
    layoutAnimation = defaultLayoutAnimation,
    style,
}: AnimatedDigitsProps) => {
    const isInitialRender = useInitialRender();
    const { items, itemsRef } = useAnimatedItems({
        value,
        prefix,
        suffix,
        makeAnimatedItems,
    });
    const { scale, measure } = useScaledDigits({
        itemsRef,
        width,
        keyExtractor,
    });
    const { enterAnimationConfig, exitAnimationConfig } = useMemo(() => {
        return {
            enterAnimationConfig: Object.entries(
                enterAnimationConfigCreator
            ).reduce((acc, [type, callback]) => {
                return { ...acc, [type]: callback(width) };
            }, {} as EnterAnimationConfig),
            exitAnimationConfig: Object.entries(
                exitAnimationConfigCreator
            ).reduce((acc, [type, callback]) => {
                return { ...acc, [type]: callback(width) };
            }, {} as ExitAnimationConfig),
        };
    }, [width, enterAnimationConfigCreator, exitAnimationConfigCreator]);

    const innerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    }, [scale]);

    return (
        <Animated.View
            style={[
                {
                    width,
                    alignSelf: 'center',
                },
                style,
            ]}
        >
            <Animated.View
                style={[
                    {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                    innerAnimatedStyle,
                ]}
            >
                {items.map((item) => {
                    const id = keyExtractor(item);
                    return (
                        <AnimatedDigit
                            key={id}
                            id={id}
                            item={item}
                            measure={measure}
                            entering={
                                (isInitialRender.current
                                    ? initialEnterAnimationConfig
                                    : enterAnimationConfig)[item.type]
                            }
                            exiting={exitAnimationConfig[item.type]}
                            layout={layoutAnimation}
                            style={
                                item.type === 'prefix'
                                    ? [textProps, prefixProps]
                                    : item.type === 'suffix'
                                    ? [textProps, suffixProps]
                                    : textProps
                            }
                        />
                    );
                })}
            </Animated.View>
        </Animated.View>
    );
};
