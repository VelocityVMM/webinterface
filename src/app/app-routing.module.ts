import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OverviewComponent } from './overview/overview.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { canActivateFn } from './auth/auth.service';
import { UserlistComponent } from './user/userlist/userlist.component';
import { GroupviewComponent } from './group/groupview/groupview.component';
import { MedialistComponent } from './media/medialist/medialist.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "dashboard", component: DashboardComponent, canActivate: [canActivateFn], children: [
    { path: "", redirectTo: 'overview', pathMatch: 'full' },
    { path: "overview", component: OverviewComponent },
    { path: "users", component: UserlistComponent },
    { path: "groups", component: GroupviewComponent },
    { path: "media", component: MedialistComponent }
  ] },
  {path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
