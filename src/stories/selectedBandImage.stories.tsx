// /stories/pages/home.stories.jsx
import React from 'react';
import { Button } from './Button';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { makeStyles } from '@mui/styles';
import SelectedBandImage from '../components/ticket/order/bandImages/selectedBandImage';
import { Colors } from 'src/constants';

interface StylesDictionary {
    [Key: string]: React.CSSProperties;
}

const classes: StylesDictionary = {
    img: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '10%',
    },
    icon: {
        fontSize: '.8rem',
    },
    imgWrapper: { width: 150, height: 95 },
    innerWrapper: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
    },
    wrapper: {
        borderRadius: 15,
        cursor: 'pointer',
        display: 'inline-flex',
        marginBottom: 20,
        paddingRight: 15,
        width: '100%',
    },
};

export default {
    title: 'Pages/Ticket/Order/selectedBandImage',
    component: SelectedBandImage,
} as ComponentMeta<typeof SelectedBandImage>;

const Template: ComponentStory<typeof SelectedBandImage> = (args) => (
    <SelectedBandImage {...args} />
);

export const MikePintoMediaCard = Template.bind({});
MikePintoMediaCard.args = {
    band: {
        name: 'Mike Pinto',
        profilePictureId: '04cea2f1-f392-9f67-0845-3a00f67d7cd6',
    },
    bandId: '299a7bc2-6a25-63fc-ad40-3a00f67ad126',
    classes: classes,
    sourceBandId: '',
};

export const MamaDukeMediaCard = Template.bind({});
MamaDukeMediaCard.args = {
    band: {
        name: 'Mama Duke',
        profilePictureId: '8a931876-26ea-8eb5-153a-39fe252d531c',
    },
    bandId: '299a7bc2-6a25-63fc-ad40-3a00f67ad126',
    classes: classes,
    sourceBandId: '',
};
