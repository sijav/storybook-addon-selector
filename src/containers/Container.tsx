import { API, Combo, Consumer } from '@storybook/api';
import { IconsProps } from '@storybook/components/dist/icon/icon';
import React, { Fragment } from 'react';
import { PARAM_KEY } from '../constants';
import { Selector } from './Selector';

export interface SelectorParams {
  name: string;
  icon: IconsProps['icon'];
  title: string;
  options: SelectorOption[];
}

export interface SelectorOption {
  title: string;
  value: string;
  default?: boolean;
  [key: string]: any;
}

const mapper = ({ api, state }: Combo): { items: SelectorParams[]; selecteds: { [key: string]: SelectorOption } } => {
  const story = state.storiesHash[state.storyId];
  const list: SelectorParams[] = story ? api.getParameters(story.id, PARAM_KEY) : [];
  const selecteds: { [key: string]: SelectorOption | null } = { ...(state.addons[PARAM_KEY] || {}) };
  list.forEach(item => {
    if (!selecteds[item.name]) {
      selecteds[item.name] = item.options.find(option => option.default) || null;
    }
  });

  return { items: list || [], selecteds };
};

export function Container(props: { api: API }) {
  return (
    <Consumer filter={mapper}>
      {({ items, selecteds }: ReturnType<typeof mapper>) => {
        return (
          <Fragment>
            {items
              .filter(item => item.options && item.options.length)
              .map((item, index) => (
                <Selector
                  item={item}
                  api={props.api}
                  selected={selecteds[item.name]}
                  key={`storybook-addon-selector-index-${index}`}
                />
              ))}
          </Fragment>
        );
      }}
    </Consumer>
  );
}
