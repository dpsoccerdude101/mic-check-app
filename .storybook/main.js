const path = require('path');

module.exports = {
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        'storybook-addon-material-ui',
    ],
    framework: '@storybook/react',
    core: {
        builder: 'webpack5',
    },
    typescript: '{ reactDocgen: false }',
    webpackFinal: async (config, { configType }) => {
        config.resolve.modules = [
            path.resolve(__dirname, '..'),
            'node_modules',
        ];

        return config;
    },
};
