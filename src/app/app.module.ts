import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello/hello.component';
import { HttpClientModule } from '@angular/common/http';
import { GreenComponent } from './green/green.component';
import { RedComponent } from './red/red.component';
import { AnalyseComponent } from './analyse/analyse.component';
import { FormsModule } from '@angular/forms';
import { CauseComponent } from './cause/cause.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    GreenComponent,
    RedComponent,
    AnalyseComponent,
    CauseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
