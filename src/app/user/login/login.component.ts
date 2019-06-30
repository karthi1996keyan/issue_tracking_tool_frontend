import { Component, OnInit } from '@angular/core';

//import user serivce 
import {UserService} from './../../user.service';

import {Router} from '@angular/router';

import {ToastrService} from 'ngx-toastr';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email:any;
  public password:any;


  constructor(public toastr:ToastrService,
    public router:Router,
    public userService:UserService,
    public cookieService:CookieService) { }

  ngOnInit() {
  }


  //functions here

  public gotToDashboard()
  {
    this.router.navigate(['/dashboard']);
  }
  public loginFunction()
  {
    if(!this.email)
    {
      this.toastr.warning('Email is missing');
    }
    else if(!this.password)
    {
      this.toastr.warning('Password is missing');
    }
    else
    {
      let loginData=
      {
        email:this.email,
        password:this.password
      }
      this.userService.loginFunction(loginData)
      .subscribe(
        (success)=>
        {
          if(success.status === 200)
          {
            console.log(success);
            let fullName=success.data.userDetails.firstName+ " "+success.data.userDetails.lastName;
            this.cookieService.set('authToken',success.data.authToken);
            this.cookieService.set('userId',success.data.userDetails.userId);
            this.cookieService.set('userName',fullName);
            this.userService.setUserInformationToLocalStorage(success.data);
            this.gotToDashboard();
            
          } 
          else
          {
            this.toastr.error(success.message);
          }
        },
        (error)=>
        {
          this.toastr.error('Some error Occured');
          this.router.navigate(['/error']);
        }
      )
    }
  }

  public googleLogin: any =()=>{
    window.open('http://api.meetinplanner.xyz/auth/google', "mywindow","location=1,status=1,scrollbars=1, width=800,height=800")
    let listener = window.addEventListener('message', (message) => {
      console.log(message)
      this.userService.setUserInformationToLocalStorage(message.data.user)
      this.cookieService.set('userId', message.data.user.userId);
      this.cookieService.set('UserName', message.data.user.firstName + ' ' + message.data.user.lastName);
      this.router.navigate(['/dashboard'])
    });
    
  }




}
