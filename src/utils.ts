import { Dimensions } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;

export const exactNumberWithCommas = (x: string) => {
    'worklet';

    const hasDot = x.indexOf('.') !== -1;
    const parts = x.split('.');

    return (
        (parts?.[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '') +
        (hasDot ? `.${parts[1] ? parts[1] : ''}` : '')
    );
};
