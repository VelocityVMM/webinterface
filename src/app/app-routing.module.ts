import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OverviewComponent } from './overview/overview.component';
import { UsersComponent } from './users/users.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { GroupsComponent } from './groups/groups.component';
import { MediaComponent } from './media/media.component';

const routes: Routes = [
  { path: "", component: AppComponent, pathMatch: "full"},
  { path: "login", component: LoginComponent },
  { path: "dashboard", component: DashboardComponent, children: [
    { path: "overview", component: OverviewComponent },
    { path: "users", component: UsersComponent },
    { path: "groups", component: GroupsComponent },
    { path: "media", component: MediaComponent }
  ] },
  {path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
