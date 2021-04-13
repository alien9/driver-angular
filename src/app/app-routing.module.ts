import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component'
import { LoginComponent } from './login/login.component'
import { IndexComponent } from './index/index.component'
import { InputComponent } from './input/input.component'

const routes: Routes = [
  { path: 'map', component: MapComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: IndexComponent },
  { path: 'input', component: InputComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
