import { Component, OnInit } from '@angular/core';


//import user serivce 
import {UserService} from './../../user.service';

import {Router} from '@angular/router';

import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName:any;
  public lastName:any;
  public mobileNumber:any;
  public email:any;
  public password:any;

  
  constructor(public toastr:ToastrService,
    public userService:UserService,
    public router:Router) { }

  ngOnInit() {
  }

  //functions here

  public goToLoginPage():any
  {
    this.router.navigate(['/login']);
  }

  public signUpFunction():any
  {
    if(!this.firstName)
    {
      this.toastr.warning('Firstname is missing')
    }
    else if(!this.lastName)
    {
      this.toastr.warning('Lastname is missing')
    }
    else if(!this.mobileNumber)
    {
      this.toastr.warning('Mobile number is missing')
    }
    else if(!this.email)
    {
      this.toastr.warning('email is missing')
    }
    else if(!this.password)
    {
      this.toastr.warning('Password is missing')
    }
    else
    {
       let signUpData=
       {
         firstName:this.firstName,
         lastName:this.lastName,
         mobileNumber:this.mobileNumber,
         email:this.email,
         password:this.password
       }
       this.userService.signUpFunction(signUpData)
       .subscribe(
         (success)=>
         {
           if(success.status === 200)
           {
             this.toastr.success('User created Successfully');

             setTimeout(() => {
               this.goToLoginPage();
             }, 2000);
           }
           else
           {
              this.toastr.error(success.message);
           }
         },

         (error)=>
         {
          this.toastr.error('Some error  occured . Signup Failed ')  
          this.router.navigate(['/error']);
            
         }
       )
    }
  }


}
