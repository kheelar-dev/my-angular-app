import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
   
  },
  
  // {
  //   name: 'Master & Profile',
  //   title: true
  // },
  {
    name: 'Master Setup',
    url: '/master-setup',
    iconComponent: { name: 'cil-settings' },
    children: [
      {
        name: 'Operator',
        url: '/master-setup/operator',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Owner',
        url: '/master-setup/owner',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Container Type',
        url: '/master-setup/isocode',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Consignee/Shipper',
        url: '/master-setup/consignee',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Terminal',
        url: '/master-setup/terminal',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Vessel',
        url: '/master-setup/vessel',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  
  // {
  //   title: true,
  //   name: 'Utility'
  // },
  {
    name: 'Utility',
    url: '/login',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'User Management',
        url: '/auth-process/user-list',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 404',
        url: '/404',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 500',
        url: '/500',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  
  
];
