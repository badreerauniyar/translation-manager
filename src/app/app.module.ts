import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LanguageSelectionComponent } from './pages/language-selection/language-selection.component';
import { TranslationDashboardComponent } from './pages/translation-dashboard/translation-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LanguageSelectionComponent,
    TranslationDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
