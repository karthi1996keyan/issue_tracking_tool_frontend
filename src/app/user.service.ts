import { Injectable } from '@angular/core';

import {Observable} from 'rxjs';
import {HttpErrorResponse,HttpClient} from '@angular/common/http';
import {HttpParams,HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public baseUrl='http://api.meetinplanner.xyz/api/v1.0.0/users';
  constructor(public http:HttpClient) { }

  //end points

  /**
   * set user details to localStorage
   */
  public setUserInformationToLocalStorage=(data)=>
  {
    localStorage.setItem('userInfo',JSON.stringify(data));
  }//end set user details

  /**
   * get user details from local storage
   */

   public getUserInformationFromLocalStorage=()=>
   {
     return JSON.parse(localStorage.getItem('userInfo'));
   } //end get user details

   /**
    * signup function
    */

   public signUpFunction(data):Observable<any>
   {  
      const params=new HttpParams()
      .set('firstName',data.firstName)
      .set('lastName',data.lastName)
      .set('mobileNumber',data.mobileNumber)
      .set('email',data.email)
      .set('password',data.password)

      return this.http.post(`${this.baseUrl}/signup`,params);
   } //end signup

   /**
    * login function
    */

    public loginFunction(data):Observable<any>
    {
      const params=new HttpParams()
      .set('email',data.email)
      .set('password',data.password)

      return this.http.post(`${this.baseUrl}/login`,params);
    }//end login

    /**
     * logout function
     */

     public logoutFunction(userId,authToken):Observable<any>
     {
       const params=new HttpParams()
       .set('userId',userId)

       return this.http.post(`${this.baseUrl}/logout?authToken=${authToken}`,params);
     }//end logout

     public getAllUsers(authToken):Observable<any>
     {
       return this.http.get(`${this.baseUrl}/view/all?authToken=${authToken}`);
     }//end get all users

     public getSingleUserDetail(userId,authToken):Observable<any>
     {
       return this.http.get(`${this.baseUrl}/view/${userId}/?authToken=${authToken}`);
     }//end get all users

     

     



}
