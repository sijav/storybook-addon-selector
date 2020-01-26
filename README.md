# Story Selector Addon
The Storybook selector addon can be used to select and share config between stories in Storybook.

[Framework Support same as backgrounds addon](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

## Installation
```sh
yarn add --dev storybook-addon-selector
```
or
```sh
npm i -D storybook-addon-selector
```

## Configuration
Then create a file called `main.js` in your storybook config.

Add following content to it:

```js
module.exports = {
  addons: ['storybook-addon-selector/register']
}
```

## Usage
Then write your stories like this:

```js
import React from 'react';

export default {
  title: 'Button',
  parameters: {
    selector: [
      {
        name: 'unique-name1',
        icon: 'globe',
        title: 'title',
        options: [
          { value: 'value1', title: 'option1', default: true },
          { value: 'value2', title: 'option2' }
        ],
      },
      {
        name: 'unique-name2',
        icon: 'icon-name',
        title: 'title',
        options: [
          { value: 'value1', title: 'option1', default: true },
          { value: 'value2', title: 'option2' }
        ],
      },
    ],
  },
};

export const defaultView = () => (
  <button>Click me</button>
);
```

Then you can listen to addon channel for selected option

```js
addons.getChannel().on('storybook/selector/unique-name/rendered', data => {
  console.log(data) // { value: 'value1', title: 'option1', default: true }
  forceReRender();
});
addons.getChannel().on('storybook/selector/unique-name/update', data => {
  console.log(data) // { value: 'value2', title: 'option2' }
});
addons.getChannel().on('storybook/selector/unique-name/destroying', () => {
  // do some codes
});
```

You can add the selectors to all stories with `addParameters` in `.storybook/preview.js`:

```js
import { addParameters } from '@storybook/react'; // <- or your storybook framework

addParameters({
  selector: [
    {
      name: 'unique-name',
      icon: 'globe',
      title: 'title',
      options: [
        { value: 'value1', title: 'option1', default: true },
        { value: 'value2', title: 'option2' }
      ],
    },
  ],
});
```

If you want to override selectors for a single story or group of stories, pass the `selector` parameter:

```js
import React from 'react';

export default {
  title: 'Button',
}

export const defaultView = () => (
  <button>Click me</button>
);
defaultView.story = {
  parameters: {
    selector: [
      {
        name: 'unique-name',
        icon: 'globe',
        title: 'title',
        options: [
          { value: 'value1', title: 'option1', default: true },
          { value: 'value2', title: 'option2' }
        ],
      },
    ],
  },
};
```

If you don't want to use selectors for a story, you can set the `selector` parameter to `[]` to skip the addon:

```js
import React from 'react';

export default {
  title: 'Button',
}

export const noSelectors = () => (
  <button>Click me</button>
);
noSelectors.story = {
  parameters: {
    selector: [],
  },
};
```