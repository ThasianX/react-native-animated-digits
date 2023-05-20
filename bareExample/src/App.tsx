import 'react-native-reanimated';
import 'react-native-gesture-handler';

import {
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    AnimationConstants as _AnimationConstants,
    AnimatedDigits,
    AnimatedItemType,
    defaultEnterAnimationConfigCreator,
    defaultExitAnimationConfigCreator,
    EnterAnimationConfigCreator,
    ExitAnimationConfigCreator,
    makeAnimation,
} from 'react-native-animated-digits';
import { OnScreenDecimalPad } from './OnScreenDecimalPad';
import React, { useCallback, useState } from 'react';
import {
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SHAKE_DURATION = 40;
const SHAKE_X = 10;

const AnimationConstants = {
    ..._AnimationConstants,
    DIGIT_TRANSLATE_Y_RATIO: 0.1,
};

const lotteryEnterAnimationConfigCreator: EnterAnimationConfigCreator = (() => {
    return {
        ...defaultEnterAnimationConfigCreator,
        [AnimatedItemType.DIGIT]: (width: number) =>
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
            }),
    };
})();

const lotteryExitAnimationConfigCreator: ExitAnimationConfigCreator = (() => {
    return {
        ...defaultExitAnimationConfigCreator,
        [AnimatedItemType.DIGIT]: (width: number) =>
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
            }),
    };
})();

export default function App() {
    const [isLottery, setIsLottery] = useState(false);

    const [usd, setUsd] = useState('0');
    const translateX = useSharedValue(0);

    const shake = useCallback(() => {
        translateX.value = withRepeat(
            withSequence(
                withTiming(-SHAKE_X, { duration: SHAKE_DURATION }),
                withTiming(SHAKE_X, { duration: SHAKE_DURATION }),
                withTiming(0, { duration: SHAKE_DURATION })
            ),
            2
        );
    }, [translateX]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.numberContainer}>
                <AnimatedDigits
                    key={`lottery-${isLottery}`}
                    prefix="$"
                    value={usd}
                    enterAnimationConfigCreator={
                        isLottery
                            ? lotteryEnterAnimationConfigCreator
                            : defaultEnterAnimationConfigCreator
                    }
                    exitAnimationConfigCreator={
                        isLottery
                            ? lotteryExitAnimationConfigCreator
                            : defaultExitAnimationConfigCreator
                    }
                    textProps={styles.numberText}
                />
            </View>
            <View>
                <OnScreenDecimalPad
                    showDot
                    onPress={(c) => {
                        const dotIndex = usd.indexOf('.');

                        // Error if input is greater than allowed max or over decimal limit
                        if (
                            dotIndex !== -1 &&
                            (c === '.' || usd.length - dotIndex > 2)
                        ) {
                            return shake();
                        }

                        if (usd === '0' && c !== '.') {
                            setUsd(c);
                        } else {
                            setUsd(`${usd}${c}`);
                        }
                    }}
                    onBackspace={() => {
                        if (usd === '0') {
                            return shake();
                        }
                        setUsd(usd.slice(0, -1) || '0');
                    }}
                />
                <TouchableOpacity
                    onPress={() => setIsLottery(!isLottery)}
                    style={styles.switchButton}
                >
                    <Text style={styles.switchButtonText}>
                        Switch to {isLottery ? 'regular' : 'lottery'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    numberContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    numberText: {
        color: '#7501FF',
        fontSize: SCREEN_WIDTH * 0.3,
        letterSpacing: -2,
    },
    switchButton: {
        backgroundColor: 'rgba(117, 1, 255, 0.1)',
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        marginHorizontal: 32,
    },
    switchButtonText: { color: '#7501FF', fontSize: 16 },
});
