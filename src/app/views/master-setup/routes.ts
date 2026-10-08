import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: 'operator',
    loadComponent: () => import('./components/operator/operator.component').then(m => m.OperatorComponent),
  },
  {
    path: 'owner',
    loadComponent: () => import('./components/owner/owner.component').then(m => m.OwnerComponent),
  },
  {
    path: 'vessel',
    loadComponent: () => import('./components/vessel/vessel.component').then(m => m.VesselComponent),
  },
  {
    path: 'terminal',
    loadComponent: () => import('./components/terminal/terminal.component').then(m => m.TerminalComponent),
  },
  {
    path: 'isocode',
    loadComponent: () => import('./components/iso-code/iso-code.component').then(m => m.IsoCodeComponent),
  },
  {
    path: 'consignee',
    loadComponent: () => import('./components/consignee/consignee.component').then(m => m.ConsigneeComponent),
  }
];