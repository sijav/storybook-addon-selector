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

const mapper = ({ api, state }: Combo): { items: SelectorParams[]; selected: SelectorOption } => {
  const story = state.storiesHash[state.storyId];
  const list = story ? api.getParameters(story.id, PARAM_KEY) : [];
  const selected = state.addons[PARAM_KEY] || null;

  return { items: list || [], selected };
};

export function Container(props: { api: API }) {
  return (
    <Consumer filter={mapper}>
      {({ items, selected }: ReturnType<typeof mapper>) => {
        return (
          <Fragment>
            {items
              .filter(item => item.options && item.options.length)
              .map((item, index) => (
                <Selector
                  item={item}
                  api={props.api}
                  selected={selected}
                  key={`storybook-addon-selector-index-${index}`}
                />
              ))}
          </Fragment>
        );
      }}
    </Consumer>
  );
}
