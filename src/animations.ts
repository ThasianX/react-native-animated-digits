import { View } from 'react-native';
import { Layout, withTiming } from 'react-native-reanimated';
import { AnimateProps } from 'react-native-reanimated';
import { AnimatedItemType } from './item';

export const AnimationConstants = {
    COMMA_ANIMATION_DURATION: 150,
    ELEMENT_ANIMATION_DURATION: 150,
    OPACITY_MIN: 0,
    OPACITY_MAX: 1,
    SCALE_MIN: 0.75,
    SCALE_MAX: 1,
    TRANSLATE_X_BASE: 0,
    TRANSLATE_Y_BASE: 0,
    COMMA_ENTER_TRANSLATE_X_RATIO: 0.12,
    COMMA_EXIT_TRANSLATE_X_RATIO: 0.08,
    DIGIT_EXIT_TRANSLATE_X_RATIO: 0.025,
    DIGIT_TRANSLATE_Y_RATIO: 0.03,
};

type MakeAnimationParams = {
    from: number;
    to: number;
};

export const makeAnimation = ({
    translateX,
    translateY,
    scale,
    opacity,
    duration,
}: {
    translateX?: MakeAnimationParams;
    translateY?: MakeAnimationParams;
    scale?: MakeAnimationParams;
    opacity?: MakeAnimationParams;
    duration: number;
}) => {
    return () => {
        'worklet';

        return {
            initialValues: {
                transform: [
                    ...(translateX ? [{ translateX: translateX.from }] : []),
                    ...(translateY ? [{ translateY: translateY.from }] : []),
                    ...(scale ? [{ scale: scale.from }] : []),
                ],
                ...(opacity ? { opacity: opacity.from } : {}),
            },
            animations: {
                transform: [
                    ...(translateX
                        ? [
                              {
                                  translateX: withTiming(translateX.to, {
                                      duration,
                                  }),
                              },
                          ]
                        : []),
                    ...(translateY
                        ? [
                              {
                                  translateY: withTiming(translateY.to, {
                                      duration,
                                  }),
                              },
                          ]
                        : []),
                    ...(scale
                        ? [
                              {
                                  scale: withTiming(scale.to, {
                                      duration,
                                  }),
                              },
                          ]
                        : []),
                ],
                ...(opacity
                    ? {
                          opacity: withTiming(opacity.to, {
                              duration,
                          }),
                      }
                    : {}),
            },
        };
    };
};

export type AnimatedItemAnimateProps = Required<
    Pick<AnimateProps<View>, 'entering' | 'exiting' | 'layout'>
>;

export type EnterAnimationConfigCreator = {
    [key in AnimatedItemType]: (
        width: number
    ) => AnimatedItemAnimateProps['entering'];
};

export type EnterAnimationConfig = {
    [key in AnimatedItemType]: AnimatedItemAnimateProps['entering'];
};

export const defaultInitialEnterAnimationConfig: EnterAnimationConfig = (() => {
    const makeSharedElementAnimation = () =>
        makeAnimation({
            opacity: {
                from: AnimationConstants.OPACITY_MIN,
                to: AnimationConstants.OPACITY_MAX,
            },
            duration: AnimationConstants.ELEMENT_ANIMATION_DURATION,
        });
    return {
        [AnimatedItemType.FIRST]: makeSharedElementAnimation(),
        [AnimatedItemType.COMMA]: makeSharedElementAnimation(),
        [AnimatedItemType.DIGIT]: makeSharedElementAnimation(),
        [AnimatedItemType.DOT]: makeSharedElementAnimation(),
        [AnimatedItemType.PREFIX]: makeSharedElementAnimation(),
        [AnimatedItemType.SUFFIX]: makeSharedElementAnimation(),
    };
})();

export const defaultEnterAnimationConfigCreator: EnterAnimationConfigCreator =
    (() => {
        const sharedSimpleAnimation = () =>
            makeAnimation({
                scale: {
                    from: AnimationConstants.SCALE_MIN,
                    to: AnimationConstants.SCALE_MAX,
                },
                opacity: {
                    from: AnimationConstants.OPACITY_MIN,
                    to: AnimationConstants.OPACITY_MAX,
                },
                duration: AnimationConstants.ELEMENT_ANIMATION_DURATION,
            });
        const sharedComplexAnimation = (width: number) =>
            makeAnimation({
                translateY: {
                    from: Math.floor(
                        AnimationConstants.DIGIT_TRANSLATE_Y_RATIO * width
                    ),
                    to: AnimationConstants.TRANSLATE_Y_BASE,
                },
                scale: {
                    from: AnimationConstants.SCALE_MIN,
                    to: AnimationConstants.SCALE_MAX,
                },
                opacity: {
                    from: AnimationConstants.OPACITY_MIN,
                    to: AnimationConstants.OPACITY_MAX,
                },
                duration: AnimationConstants.ELEMENT_ANIMATION_DURATION,
            });
        return {
            [AnimatedItemType.FIRST]: sharedSimpleAnimation,
            [AnimatedItemType.PREFIX]: sharedSimpleAnimation,
            [AnimatedItemType.SUFFIX]: sharedSimpleAnimation,
            [AnimatedItemType.DOT]: sharedComplexAnimation,
            [AnimatedItemType.DIGIT]: sharedComplexAnimation,
            [AnimatedItemType.COMMA]: (width: number) =>
                makeAnimation({
                    translateX: {
                        from: Math.floor(
                            AnimationConstants.COMMA_ENTER_TRANSLATE_X_RATIO *
                                width
                        ),
                        to: AnimationConstants.TRANSLATE_X_BASE,
                    },
                    opacity: {
                        from: AnimationConstants.OPACITY_MIN,
                        to: AnimationConstants.OPACITY_MAX,
                    },
                    duration: AnimationConstants.COMMA_ANIMATION_DURATION,
                }),
        };
    })();

export type ExitAnimationConfigCreator = {
    [key in AnimatedItemType]: (
        width: number
    ) => AnimatedItemAnimateProps['exiting'];
};

export type ExitAnimationConfig = {
    [key in AnimatedItemType]: AnimatedItemAnimateProps['exiting'];
};

export const defaultExitAnimationConfigCreator: ExitAnimationConfigCreator =
    (() => {
        const sharedSimpleAnimation = () =>
            makeAnimation({
                scale: {
                    from: AnimationConstants.SCALE_MAX,
                    to: AnimationConstants.SCALE_MIN,
                },
                opacity: {
                    from: AnimationConstants.OPACITY_MAX,
                    to: AnimationConstants.OPACITY_MIN,
                },
                duration: AnimationConstants.ELEMENT_ANIMATION_DURATION,
            });
        const sharedComplexAnimation = (width: number) =>
            makeAnimation({
                translateX: {
                    from: AnimationConstants.TRANSLATE_X_BASE,
                    to: Math.floor(
                        AnimationConstants.DIGIT_EXIT_TRANSLATE_X_RATIO * width
                    ),
                },
                translateY: {
                    from: AnimationConstants.TRANSLATE_Y_BASE,
                    to: Math.floor(
                        AnimationConstants.DIGIT_TRANSLATE_Y_RATIO * width
                    ),
                },
                scale: {
                    from: AnimationConstants.SCALE_MAX,
                    to: AnimationConstants.SCALE_MIN,
                },
                opacity: {
                    from: AnimationConstants.OPACITY_MAX,
                    to: AnimationConstants.OPACITY_MIN,
                },
                duration: AnimationConstants.ELEMENT_ANIMATION_DURATION,
            });
        return {
            [AnimatedItemType.FIRST]: sharedSimpleAnimation,
            [AnimatedItemType.PREFIX]: sharedSimpleAnimation,
            [AnimatedItemType.SUFFIX]: sharedSimpleAnimation,
            [AnimatedItemType.DOT]: sharedComplexAnimation,
            [AnimatedItemType.DIGIT]: sharedComplexAnimation,
            [AnimatedItemType.COMMA]: (width: number) =>
                makeAnimation({
                    translateX: {
                        from: AnimationConstants.TRANSLATE_X_BASE,
                        to: Math.floor(
                            AnimationConstants.COMMA_EXIT_TRANSLATE_X_RATIO *
                                width
                        ),
                    },
                    opacity: {
                        from: AnimationConstants.OPACITY_MAX,
                        to: AnimationConstants.OPACITY_MIN,
                    },
                    duration: AnimationConstants.COMMA_ANIMATION_DURATION,
                }),
        };
    })();

export type LayoutAnimation = AnimatedItemAnimateProps['layout'];
export const defaultLayoutAnimation: LayoutAnimation = Layout.duration(
    AnimationConstants.ELEMENT_ANIMATION_DURATION
);
