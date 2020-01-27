import { API } from '@storybook/api';
import { IconButton, Icons, TooltipLinkList, WithTooltip } from '@storybook/components';
import { Link } from '@storybook/components/dist/tooltip/TooltipLinkList';
import memoize from 'memoizerific';
import React, { useLayoutEffect } from 'react';
import { ADDON_ID, EVENTS, PARAM_KEY } from '../constants';
import { SelectorOption, SelectorParams } from './Container';

const createSelectorOptions = memoize(10)(
  (option: SelectorOption, change: (option: SelectorOption) => void): Link => ({
    id: option.id || option.title,
    title: option.title,
    onClick: () => {
      change(option);
    },
  }),
);

const getCurrentlySelectedOption = (
  list: SelectorOption[],
  currentSelected: SelectorOption | undefined,
  defaultSelected: SelectorOption | undefined,
): SelectorOption | undefined => {
  if (!list.length) {
    return defaultSelected;
  }

  if (currentSelected && defaultSelected && currentSelected.value === defaultSelected.value) {
    return currentSelected;
  }

  if (currentSelected && list.find(i => i && i.value === currentSelected.value)) {
    return currentSelected;
  }

  return list.find(i => i.default) || defaultSelected;
};

export function Selector(props: { api: API; item: SelectorParams; selected: SelectorOption }) {
  const { api, item, selected } = props;

  const change = (currentSelected: SelectorOption | undefined) => {
    if (currentSelected) {
      api.setAddonState<SelectorOption>(PARAM_KEY, currentSelected);
    }
    api.emit(`${ADDON_ID}/${item.name}/${EVENTS.UPDATE}`, currentSelected);
  };
  const defaultOption = item.options.find(option => option.default);
  const selectedItem = getCurrentlySelectedOption(item.options, selected, defaultOption);
  const links = item.options.map(option => createSelectorOptions(option, change));

  useLayoutEffect(() => {
    api.emit(`${ADDON_ID}/${item.name}/${EVENTS.RENDERED}`, selectedItem || defaultOption);
    return api.emit(`${ADDON_ID}/${item.name}/${EVENTS.DESTROYING}`);
  });

  return (
    <WithTooltip placement="top" trigger="click" tooltip={<TooltipLinkList links={links} />} closeOnClick={true}>
      <IconButton
        key={ADDON_ID}
        active={selectedItem && defaultOption && selectedItem.value !== defaultOption.value}
        title={item.title}
      >
        <Icons icon={item.icon} />
      </IconButton>
    </WithTooltip>
  );
}
