import { KeywordControlPanel } from './components';
import reducers from './reducers';
import TagIcon from '@plone/volto/icons/tag.svg';

const applyConfig = (config) => {
  config.settings.controlpanels = [
    {
      '@id': '/keywords',
      group: 'Content',
      title: 'Keywords',
    },
  ];
  config.settings.controlPanelsIcons = {
    ...config.settings.controlPanelsIcons,
    keywords: TagIcon,
  };
  // console.log(config.settings.controlPanelsIcons);
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
