import { LayoutAnimation } from 'react-native';

export const smoothAccordionAnimation = {
    duration: 350,
    create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.opacity,
        springDamping: 0.8,
    },
    update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.8,
    },
    delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
    },
};

export const triggerAccordionAnimation = () => {
    LayoutAnimation.configureNext(smoothAccordionAnimation);
};
