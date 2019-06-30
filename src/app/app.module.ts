import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {UserService} from './user.service';
import {HttpClientModule} from '@angular/common/http';

//import custom modules here
import {UserModule} from './user/user.module';
import {IssueModule} from '../app/issue/issue.module';

import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import { FileSelectDirective,FileUploadModule } from 'ng2-file-upload';
import {CookieService} from 'ngx-cookie-service';
import { ErrorComponent } from './error/error.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
 
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    FileUploadModule,
    
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    RouterModule.forRoot([]),
    IssueModule,
    UserModule,
  ],
  declarations: [
    AppComponent,
    ErrorComponent,
    NotFoundComponent
  ],
  providers: [UserService,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
