import React from 'react';
import { addons, types } from '@storybook/addons';

import { Selector } from './containers/Selector';
import { IconKey } from '@storybook/components/dist/icon/icons';

export const register = (title: string, addonId: string, paramKey: string, titleDesc: string, icon: IconKey) => {
  addons.register(addonId, api => {
    addons.add(addonId, {
      title,
      type: types.TOOL,
      match: ({ viewMode }) => viewMode === 'story',
      render: () => (
        <Selector api={api} addonId={addonId} title={title} paramKey={paramKey} titleDesc={titleDesc} icon={icon} />
      ),
    });
  });
};
