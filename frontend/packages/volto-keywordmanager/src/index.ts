import type { ConfigType } from '@plone/registry';
import installSettings from './config/settings';

import { KeywordControlPanel } from './components';
import reducers from './reducers';

function applyConfig(config: ConfigType) {
  installSettings(config);
  config.addonRoutes = [
    ...config.addonRoutes,
    {
      path: '/controlpanel/keywords',
      component: KeywordControlPanel,
    },
  ];
  config.addonReducers = { ...config.addonReducers, ...reducers };

  return config;
}

export default applyConfig;
