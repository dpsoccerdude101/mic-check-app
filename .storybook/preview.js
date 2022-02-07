//.storybook/preview.js
import 'nprogress/nprogress.css';
import '../src/styles/global.css';
import mainTheme from '../src/theme';
import * as NextImage from 'next/image';
import Colors from 'src/constants/colors';
import { createTheme } from '@material-ui/core/styles';
import { muiTheme } from 'storybook-addon-material-ui';
import { ThemeProvider } from '@emotion/react';

//export const decorators = [muiTheme([mainTheme])];
export const decorators = [
    (Story) => (
        <ThemeProvider theme={mainTheme}>
            <Story />
        </ThemeProvider>
    ),
];

const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, 'default', {
    configurable: true,
    value: (props) => <OriginalNextImage {...props} unoptimized />,
});

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};
