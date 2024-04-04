import { KeywordControlPanel } from './components';
import reducers from './reducers';

const applyConfig = (config) => {
  config.addonRoutes = [
    ...config.addonRoutes,
    {
      path: '/controlpanel/keywords',
      component: KeywordControlPanel,
    },
  ];
  config.addonReducers = { ...config.addonReducers, ...reducers };
  config.settings = {
    ...config.settings,
    isMultilingual: false,
    supportedLanguages: ['en'],
    defaultLanguage: 'en',
  };
  return config;
};

export default applyConfig;
