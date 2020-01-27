import { addons, types } from '@storybook/addons';
import React from 'react';
import { Container } from './containers/Container';
import { ADDON_ID } from './constants';

addons.register(ADDON_ID, api => {
  addons.add(ADDON_ID, {
    title: 'Selector',
    type: types.TOOL,
    match: ({ viewMode }) => viewMode === 'story',
    render: () => <Container api={api} />,
  });
});
