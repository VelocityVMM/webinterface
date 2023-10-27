import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from  '@angular/common/http';
import { OverviewComponent } from './overview/overview.component';
import { UsersComponent } from './users/users.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { NotificationComponent } from './notification/notification.component';
import { GroupsComponent } from './groups/groups.component';
import { TreeNodeComponent } from './tree-node/tree-node.component';
import { GroupassignComponent } from './groupassign/groupassign.component';
import { PermissionlistComponent } from './permissionlist/permissionlist.component';
import { MediaComponent } from './media/media.component';
import { PoolpermissionsComponent } from './poolpermissions/poolpermissions.component';
import { MediauploadComponent } from './mediaupload/mediaupload.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    OverviewComponent,
    UsersComponent,
    NotfoundComponent,
    NotificationComponent,
    GroupsComponent,
    TreeNodeComponent,
    GroupassignComponent,
    PermissionlistComponent,
    MediaComponent,
    PoolpermissionsComponent,
    MediauploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
