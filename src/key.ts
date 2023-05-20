import { AnimatedItem, AnimatedItemType } from './item';

export type AnimatedItemKeyExtractor = (item: AnimatedItem) => React.Key;

export const defaultItemKeyExtractor: AnimatedItemKeyExtractor = (item) => {
    switch (item.type) {
        case AnimatedItemType.FIRST: {
            return `first-${item.value}`;
        }
        case AnimatedItemType.COMMA: {
            return `comma-${item.count}`;
        }
        case AnimatedItemType.DIGIT: {
            return `digit-${item.count}`;
        }
        case AnimatedItemType.DOT: {
            return 'dot';
        }
        case AnimatedItemType.PREFIX: {
            return `prefix-${item.value}`;
        }
        case AnimatedItemType.SUFFIX: {
            return `suffix-${item.value}`;
        }
    }
};
