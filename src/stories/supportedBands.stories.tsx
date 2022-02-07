// /stories/pages/home.stories.jsx
import React from 'react';
import { Button } from './Button';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import SupportedBands from '../components/ticket/order/bandImages/supportedBands';

export default {
    title: 'Pages/Ticket/Order/supportedBands',
    component: SupportedBands,
} as ComponentMeta<typeof SupportedBands>;

export const SupportedBandsPage: ComponentStory<typeof SupportedBands> = () => (
    <SupportedBands />
);
