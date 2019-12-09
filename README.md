# Story Selector Addon
The Storybook selector addon can be used to select and share config between stories in Storybook.

[Framework Support](https://github.com/storybookjs/storybook/blob/master/ADDONS_SUPPORT.md)

# Getting Started
Install this addon by adding the `storybook-addon-selector` dependency:
```sh
yarn add storybook-addon-selector
```
or
```sh
npm install storybook-addon-selector
```

First configure it as an addon by importing register and calling it to your addons.js file (located in the Storybook config directory).
```js
import { register } from 'storybook-addon-selector/register';

register('TITLE', 'ADDON_ID', 'PARAM_KEY', 'DESCRIPTION', 'ICON');
```
Then you can listen to addon channel for selected option
```js
addons.getChannel().on('ADDON_ID/update', data => {
    setSomething(data);
    forceReRender();
  });
addons.getChannel().on('ADDON_ID/rendered', data => {
    forceReRender();
  });
```