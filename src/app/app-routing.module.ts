import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'raids',
    loadChildren: () => import('./raids/raids.module').then( m => m.RaidsPageModule)
  },
  {
    path: 'guild',
    loadChildren: () => import('./guild/guild.module').then( m => m.GuildPageModule)
  },
  {
    path: 'auctions',
    loadChildren: () => import('./auctions/auctions.module').then( m => m.AuctionsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
