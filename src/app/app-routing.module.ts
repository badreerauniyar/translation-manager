import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LanguageSelectionComponent } from './pages/language-selection/language-selection.component';
import { TranslationDashboardComponent } from './pages/translation-dashboard/translation-dashboard.component';

const routes: Routes = [
  {
    path:'',
    component:LanguageSelectionComponent
  },
  {
    path:'language-selection',
    component:LanguageSelectionComponent
  },
  {
    path:'translation-dashboard',
    component:TranslationDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
