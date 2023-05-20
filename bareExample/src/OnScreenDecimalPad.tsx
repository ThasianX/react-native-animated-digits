import React, { ReactNode } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const INTEGER_GRID = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
];
const ZERO_STR = '0';
const DECIMAL_STR = '.';

export type OnScreenDecimalPadProps = {
    onPress: (s: string) => void;
    onBackspace: () => void;
    showDot?: boolean;
    disabled?: boolean;
};

const TouchableCell = ({
    onPress,
    children,
}: {
    onPress: () => void;
    children?: ReactNode;
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={styles.cell}
        >
            {children}
        </TouchableOpacity>
    );
};

export const OnScreenDecimalPad = ({
    disabled,
    onPress,
    onBackspace,
    showDot = true,
}: OnScreenDecimalPadProps) => {
    return (
        <View
            pointerEvents={disabled ? 'none' : 'auto'}
            style={styles.container}
        >
            {INTEGER_GRID.map((integers) => {
                return (
                    <View key={integers.join('')} style={styles.row}>
                        {integers.map((integer) => {
                            return (
                                <TouchableCell
                                    key={integer}
                                    onPress={() => {
                                        onPress(integer.toString());
                                    }}
                                >
                                    <Text style={styles.text}>{integer}</Text>
                                </TouchableCell>
                            );
                        })}
                    </View>
                );
            })}
            <View style={styles.row}>
                <TouchableCell
                    onPress={() => {
                        if (!showDot) {
                            return;
                        }
                        onPress(DECIMAL_STR);
                    }}
                >
                    <Text style={styles.text}>
                        {showDot ? DECIMAL_STR : ''}
                    </Text>
                </TouchableCell>
                <TouchableCell
                    onPress={() => {
                        onPress(ZERO_STR);
                    }}
                >
                    <Text style={styles.text}>{ZERO_STR}</Text>
                </TouchableCell>
                <TouchableCell
                    onPress={() => {
                        onBackspace();
                    }}
                >
                    <Image
                        source={require('./chevron-left-solid.png')}
                        style={styles.chevronBack}
                    />
                </TouchableCell>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    chevronBack: {
        height: 16,
        width: 16,
    },
    container: {
        alignSelf: 'center',
        paddingVertical: 24,
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 28,
        fontWeight: '500',
        lineHeight: 34,
    },
});
