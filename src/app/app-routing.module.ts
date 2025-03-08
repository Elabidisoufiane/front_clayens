import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GreenComponent } from './green/green.component';
import { RedComponent } from './red/red.component';
import { AnalyseComponent } from './analyse/analyse.component';
import { HelloComponent } from './hello/hello.component';
import { CauseComponent } from './cause/cause.component';

const routes: Routes = [
  
  { path: "green/:id/:label/:line/:unite", component: GreenComponent },
  { path: "red/:id/:label/:line/:unite", component: RedComponent },
  { path: "analyse/:id/:name/:unite/:line", component: AnalyseComponent },
  { path: "causes/:defect/:id/:name/:line/:unite", component: HelloComponent },
  { path: "description/:defect/:id/:name/:line/:unite", component: CauseComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
