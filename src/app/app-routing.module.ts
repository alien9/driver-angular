import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component'
import { LoginComponent } from './login/login.component'
import { LogoutComponent } from './logout/logout.component'
import { IndexComponent } from './index/index.component'
import { InputComponent } from './input/input.component'
import { ListComponent } from './list/list.component'
import { LocationComponent } from './location/location.component'

const routes: Routes = [
  { path: 'map', component: MapComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'location', component: LocationComponent },
  { path: 'index.html', component: InputComponent },
  { path: '', component: InputComponent },
  { path: 'input', component: InputComponent },
  { path: 'list', component: ListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
