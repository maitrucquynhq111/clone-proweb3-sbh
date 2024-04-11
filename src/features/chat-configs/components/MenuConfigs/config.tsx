import {
  // BsGear,
  BsChatLeftQuote,
  BsChatLeftDots,
  BsChatLeftText,
  BsJournalBookmark,
  BsChatSquareText,
  // BsPeople,
  // BsMenuUp,
  // BsKey,
} from 'react-icons/bs';
import { MdLabelOutline } from 'react-icons/md';
import { FiFlag } from 'react-icons/fi';
import { MenuBlockType } from './types';
import { MainRouteKeys } from '~app/routes/enums';
import { MainRoutes } from '~app/routes/main/config';

export const menus: MenuBlockType[] = [
  {
    title: '',
    childs: [
      {
        title: MainRoutes[MainRouteKeys.ChatConfigsPages].title || '',
        path: MainRoutes[MainRouteKeys.ChatConfigsPages].path,
        icon: <FiFlag size={24} />,
        permissions: MainRoutes[MainRouteKeys.ChatConfigsPages].permissions,
      },
    ],
    permissions: MainRoutes[MainRouteKeys.ChatConfigsPages].permissions,
  },
  {
    title: 'menu-block.general-managements',
    childs: [
      // {
      //   title: MainRoutes[MainRouteKeys.ChatConfigsGeneral].title || '',
      //   path: MainRoutes[MainRouteKeys.ChatConfigsGeneral].path,
      //   icon: <BsGear size={24} />,
      //   permissions: MainRoutes[MainRouteKeys.ChatConfigsGeneral].permissions,
      // },
      {
        title: MainRoutes[MainRouteKeys.ChatConfigsLabel].title || '',
        path: MainRoutes[MainRouteKeys.ChatConfigsLabel].path,
        icon: <MdLabelOutline size={24} />,
        permissions: MainRoutes[MainRouteKeys.ChatConfigsLabel].permissions,
      },
      {
        title: MainRoutes[MainRouteKeys.ChatConfigsQuickMessage].title || '',
        path: MainRoutes[MainRouteKeys.ChatConfigsQuickMessage].path,
        icon: <BsChatLeftQuote size={24} />,
        permissions: MainRoutes[MainRouteKeys.ChatConfigsQuickMessage].permissions,
      },
    ],
    permissions: '*',
  },
  {
    title: 'menu-block.own-management',
    childs: [
      {
        title: MainRoutes[MainRouteKeys.ChatConfigsFrequentlyQuestion].title || '',
        path: MainRoutes[MainRouteKeys.ChatConfigsFrequentlyQuestion].path,
        icon: <BsJournalBookmark size={24} />,
        permissions: MainRoutes[MainRouteKeys.ChatConfigsFrequentlyQuestion].permissions,
      },
      {
        title: MainRoutes[MainRouteKeys.ChatConfigsAutoMessage].title || '',
        path: MainRoutes[MainRouteKeys.ChatConfigsAutoMessage].path,
        icon: <BsChatLeftDots size={24} />,
        permissions: MainRoutes[MainRouteKeys.ChatConfigsAutoMessage].permissions,
      },
      {
        title: MainRoutes[MainRouteKeys.ChatConfigsAbsenceMessage].title || '',
        path: MainRoutes[MainRouteKeys.ChatConfigsAbsenceMessage].path,
        icon: <BsChatLeftText size={24} />,
        permissions: MainRoutes[MainRouteKeys.ChatConfigsAbsenceMessage].permissions,
      },
      {
        title: MainRoutes[MainRouteKeys.ChatConfigsComment].title || '',
        path: MainRoutes[MainRouteKeys.ChatConfigsComment].path,
        icon: <BsChatSquareText size={24} />,
        permissions: MainRoutes[MainRouteKeys.ChatConfigsComment].permissions,
      },
      // {
      //   title: MainRoutes[MainRouteKeys.ChatConfigsSplitConversation].title || '',
      //   path: MainRoutes[MainRouteKeys.ChatConfigsSplitConversation].path,
      //   icon: <BsPeople size={24} />,
      //   permissions: MainRoutes[MainRouteKeys.ChatConfigsSplitConversation].permissions,
      // },
    ],
    permissions: '*',
  },
  // {
  //   title: 'menu-block.chatbot',
  //   childs: [
  //     {
  //       title: MainRoutes[MainRouteKeys.ChatConfigsChatBotScript].title || '',
  //       path: MainRoutes[MainRouteKeys.ChatConfigsChatBotScript].path,
  //       icon: <BsMenuUp size={24} />,
  //       permissions: MainRoutes[MainRouteKeys.ChatConfigsChatBotScript].permissions,
  //     },
  //     {
  //       title: MainRoutes[MainRouteKeys.ChatConfigsChatBotKeyword].title || '',
  //       path: MainRoutes[MainRouteKeys.ChatConfigsChatBotKeyword].path,
  //       icon: <BsKey size={24} />,
  //       permissions: MainRoutes[MainRouteKeys.ChatConfigsChatBotKeyword].permissions,
  //     },
  //   ],
  //   permissions: '*',
  // },
];
