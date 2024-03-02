import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from  '@angular/common/http';
import { OverviewComponent } from './overview/overview.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { NotificationComponent } from './notification/notification.component';
import { UserlistComponent } from './user/userlist/userlist.component';
import { ModalComponent } from './vcomponents/modal/modal.component';
import { ModalbuttonComponent } from './vcomponents/modalbutton/modalbutton.component';
import { CreateuserComponent } from './user/createuser/createuser.component';
import { GroupeditComponent } from './user/groupedit/groupedit.component';
import { PermissionassignComponent } from './user/permissionassign/permissionassign.component';
import { GroupviewComponent } from './group/groupview/groupview.component';
import { GroupnodeComponent } from './group/groupnode/groupnode.component';
import { PoolpermissionsComponent } from './group/poolpermissions/poolpermissions.component';
import { MedialistComponent } from './media/medialist/medialist.component';
import { MediauploadComponent } from './media/mediaupload/mediaupload.component';
import { CreatevmComponent } from './vm/createvm/createvm.component';
import { VmlistComponent } from './vm/vmlist/vmlist.component';
import { AttachmediaComponent } from './vm/attachmedia/attachmedia.component';
import { MediacreateComponent } from './media/mediacreate/mediacreate.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    OverviewComponent,
    NotfoundComponent,
    NotificationComponent,
    UserlistComponent,
    ModalComponent,
    ModalbuttonComponent,
    CreateuserComponent,
    GroupeditComponent,
    PermissionassignComponent,
    GroupviewComponent,
    GroupnodeComponent,
    PoolpermissionsComponent,
    MedialistComponent,
    MediauploadComponent,
    CreatevmComponent,
    VmlistComponent,
    AttachmediaComponent,
    MediacreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
