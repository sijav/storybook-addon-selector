import React, { useState, useLayoutEffect } from 'react';

import { API, useStorybookState } from '@storybook/api';

import { IconButton, WithTooltip, TooltipLinkList, Icons } from '@storybook/components';
import { IconKey } from '@storybook/components/dist/icon/icons';
import { Link } from '@storybook/components/dist/tooltip/TooltipLinkList';

interface Option {
  title: string;
  value: string;
  default?: boolean;
  [key: string]: any;
}

interface Options {
  items?: Option[];
}

const createSelectorOptions = (option: Option, change: (option: Option) => void): Link => ({
  id: option.id || option.title,
  title: option.title,
  onClick: () => {
    change(option);
  },
});

const getCurrentlySelectedOption = (
  list: Option[],
  currentSelected: Option | null,
  defaultSelected: Option | null,
): Option | null => {
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

interface StoryBookState {
  storyId: string;
  storiesHash: {
    [key: string]: any;
  };
  [key: string]: any;
}

const getOptions = (api: API, state: StoryBookState, paramKey: string) => {
  const story = state.storiesHash[state.storyId];
  const params: Options = story ? api.getParameters(story.id, paramKey) || {} : {};

  return params.items || [];
};

export function Selector(props: {
  api: API;
  addonId: string;
  paramKey: string;
  title: string;
  titleDesc: string;
  icon: IconKey;
}) {
  const storybookState: StoryBookState = useStorybookState();
  const items = getOptions(props.api, storybookState, props.paramKey);
  const defaultOption: Option = items.find(item => item.default);

  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [isExpanded, setIsExpanded] = useState(false);

  function change(option: Option) {
    props.api.emit(`${props.addonId}/update`, option);
    setSelectedOption(option);
    setIsExpanded(false);
  }

  function onVisibilityChange(shouldBeExpanded: boolean) {
    const isExpandedHasChanged = isExpanded !== shouldBeExpanded;
    if (isExpandedHasChanged) {
      setIsExpanded(shouldBeExpanded);
    }
  }

  useLayoutEffect(() => {
    props.api.emit(`${props.addonId}/rendered`, selectedOption || defaultOption);
  });

  const links = items.map(item => createSelectorOptions(item, change));
  const selectedItem = getCurrentlySelectedOption(items, selectedOption, defaultOption);

  if (items.length === 0) {
    return null;
  }
  return (
    <WithTooltip
      placement="top"
      trigger="click"
      tooltipShown={isExpanded}
      onVisibilityChange={onVisibilityChange}
      tooltip={<TooltipLinkList links={links} />}
      closeOnClick={true}
    >
      <IconButton
        key={props.addonId}
        active={selectedItem && defaultOption && selectedItem.value !== defaultOption.value}
        title={props.titleDesc}
      >
        <Icons icon={props.icon} />
      </IconButton>
    </WithTooltip>
  );
}
