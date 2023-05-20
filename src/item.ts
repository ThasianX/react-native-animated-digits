import { exactNumberWithCommas } from './utils';

export enum AnimatedItemType {
    COMMA = 'comma',
    DIGIT = 'digit',
    DOT = 'dot',
    FIRST = 'first',
    PREFIX = 'prefix',
    SUFFIX = 'suffix',
}

export type AnimatedItem = (
    | {
          type:
              | AnimatedItemType.PREFIX
              | AnimatedItemType.SUFFIX
              | AnimatedItemType.DOT
              | AnimatedItemType.FIRST;
      }
    | {
          type: AnimatedItemType.DIGIT | AnimatedItemType.COMMA;
          count: number;
      }
) & { value: string };

export type MakeAnimatedItems = (value: string) => AnimatedItem[];

export const defaultMakeAnimatedItems: MakeAnimatedItems = (value) => {
    const valueChars = exactNumberWithCommas(value).split('');

    if (!valueChars.length) {
        return [];
    }

    let digitCount = 0;
    let commaCount = 0;
    return [
        { type: AnimatedItemType.FIRST, value: valueChars[0]! },
        ...valueChars.slice(1).map<AnimatedItem>((c) => {
            // There can only be 1 dot
            if (c === '.') {
                return { type: AnimatedItemType.DOT, value: '.' };
            }
            // Commas are identified by ascending order
            if (c === ',') {
                commaCount += 1;
                return {
                    type: AnimatedItemType.COMMA,
                    value: ',',
                    count: commaCount,
                };
            }
            // Digits are identified by ascending order
            digitCount += 1;
            return {
                type: AnimatedItemType.DIGIT,
                value: c,
                count: digitCount,
            };
        }),
    ];
};
