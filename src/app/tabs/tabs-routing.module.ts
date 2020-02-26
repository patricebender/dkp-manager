import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'raids',
        children: [
          {
            path: '',
            loadChildren: () =>
                import('../raids/raids.module').then(m => m.RaidsPageModule)
          }
        ]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/raids',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
