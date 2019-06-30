import { Component, OnInit ,EventEmitter } from '@angular/core';

//import user serivce 
import {IssueService} from './../../issue.service';

import {UserService} from './../../user.service';

import {Router} from '@angular/router';

import {ToastrService} from 'ngx-toastr';
import {CookieService} from 'ngx-cookie-service';
import { FileUploader,FileLikeObject} from 'ng2-file-upload';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private uri='http://api.meetinplanner.xyz/api/upload';

  public attachments:any=[];

  public uploader: FileUploader = new FileUploader({
    url: this.uri
    });

    public onFileSelected(event: EventEmitter<File[]>) {
      const file: File = event[0];
 
    }
     

  public title:any;
  public description:any;
  public status:any;
  public searchHeading:any;
  public assignedTo:any;
  public searchData:any;
  public files=[];
  public assignedIssue=[];
  public watch=[];
  public count=[];
  public notifyData=[];
  public allSearchData=[];
  public notifyToggler:boolean=false;
  public noModel:boolean=false;
  public userName:any;

  public allStatus=["Backlog","In-Progress","In-Test","Done"];
  public allUsers=[];
  public allIssues=[];
  public notification=[];

  constructor(public toastr:ToastrService,
    public router:Router,
    public issueService:IssueService,
    public userService:UserService,
    public cookieService:CookieService) { }

  ngOnInit() {

    if(this.cookieService.get('authToken') != null &&
    this.cookieService.get('userId') != null &&
    this.cookieService.get('userName') != null &&
    this.cookieService.get('authToken') != undefined &&
    this.cookieService.get('userId') != undefined &&
    this.cookieService.get('userName') != undefined &&
    this.userService.getUserInformationFromLocalStorage()  != null  &&
    this.userService.getUserInformationFromLocalStorage() != undefined
      )
  {
      this.userName=this.cookieService.get('userName');
    this.getAllUsers();
    this.getIssue();
    this.getWatchList();
    this.getNotification();
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
    }
    this.uploader.onCompleteItem=(item:any,response:any,status:any,headers:any)=>
    {
      this.attachments.push(JSON.parse(response));
    }
  }
  else
  {
    this.toastr.error('Authorization missin or logout already');
    this.router.navigate(['/login']);

  }

  }

  //functions here

  public getAllUsers:any=()=>
  {
    let authToken=this.cookieService.get('authToken');
    this.userService.getAllUsers(authToken).subscribe(
      (userData)=>
      {
        this.allIssues=userData.data;
        for(let user of userData.data)
        {
          this.allUsers.push(user);
        }
      }
    )
  }//get all users 

  public createIssue=()=>
  {

    //find user name from user Id
    for(let x of this.allUsers)
    {
      if(x.userId === this.assignedTo)
      {
        var name=x.firstName+" "+x.lastName;
      }
    }

    //find attachments
    for(let y of this.attachments)
    {
      this.files.push(y.file.id);
    }

    let reporter=this.cookieService.get('userName');
    let reporterId=this.cookieService.get('userId');


    let issue=
    {
      status:this.status,
      title:this.title,
      description:this.description,
      assignedToId:this.assignedTo,
      assignedTo:name,
      reporter:reporter,
      reporterId:reporterId,
      images:this.files
    }

    let authToken=this.cookieService.get('authToken');
    this.issueService.createIssue(issue,authToken)
    .subscribe(
      (success)=>
      {
        if(success.status === 200)
        {
          this.toastr.success('Created Successfully');
          setTimeout(()=>
          {
            this.router.navigate([`/issue/view/${success.data.issueId}`]);
          },2000);
        }
        else
        {
          this.toastr.error(success.message);
        }
      },
      (error)=>
      {
        this.toastr.error('Some error occured');
        this.router.navigate(['/error']);
      }

    );



  }//nend create issue

  public getIssue=()=>
  {
    let userId=this.cookieService.get('userId');
    let authToken=this.cookieService.get('authToken');
    this.issueService.getAllIssues(authToken).subscribe(
      (response)=>
      {
        
        if(response.data != null)
        {
          for(let x of response['data'])
          {
            if(x.assignedToId === this.cookieService.get('userId'))
            {
               this.assignedIssue.push(x);
            }
          }
        }
      }
    )

  }//end get issue

  public getWatchList=()=>
  {
    
    let authToken=this.cookieService.get('authToken');
    this.issueService.getWatch(authToken).subscribe(
    (response)=>
    {
      
      if(response.data != null)
      {
      for(let details of response['data'])
      {
        if(details.watcherId === this.cookieService.get('userId'))
        {
          if(this.allIssues != null)
          {
            for(let issue of this.assignedIssue)
            {
              if(details.issueId === issue.issueId)
              {
                this.watch.push(issue);
                console.log(this.watch);
              }
            }
          }
        }
      }
    }
    }
    )
  }//end getwatch

  /**
   *  notifyCount=
 =>  */
  public  notifyCount=()=> {
    console.log('notify');
    let authToken=this.cookieService.get('authToken');
    
    let userId=this.cookieService.get('userId');
    this.issueService.countNotify(userId,authToken).subscribe(
      (response)=>
      {
        if(response['status']===200){
          return this.notifyToggler = true;
        }
      }
    )
  }

  public searchIssue: any = () => {
    this.issueService.searchIssue(this.searchData).subscribe(
      (response) => {
        if (response['status'] == 200) {
          
         this.noModel=true;
          this.searchHeading=this.searchData;
          this.searchData = "";
          this.allSearchData = response['data'];
          console.log(this.allSearchData);
         
        } else 
        {
          
          this.searchData = "";
         this.noModel=true;
          this.toastr.info(response['message']);
        }
      },
      (error) => {
        console.log(error);
        this.toastr.error('Some error ocurred');
      }
    )

  }


  public getNotification=()=>
  {
    let authToken=this.cookieService.get('authToken');
    let userId=this.cookieService.get('userId');
    this.issueService.getNotifications(userId,authToken).subscribe(
      (response)=>
      {
        console.log(response);
        this.notification.push(response['data']);
        if(this.notification != null)
        {
          
        for(let x of this.notification)
        {
          if(x  != null)
          {
            for(let y of x)
            {
              if(y.notificationCount === 1)
              {
                this.count.push(y.notificationCount);
                let id=y.issueId;
                for(let a of y.description)
                {
                  let des=a;
                  let data={
                    issueId:id,
                    description:des
                  }
                  this.notifyData.push(data);
                }
              }
            }
          }
          
          if(this.count.length===0){
            return this.notifyToggler = true
          }
        }
        }
      }
    );

  }

  public logoutFunction()
  {
    let userId=this.cookieService.get('userId');
    let authToken=this.cookieService.get('authToken');
    this.userService.logoutFunction(userId,authToken)
    .subscribe(
      (success)=>
      {
        if(success.status === 200)
        {
          localStorage.clear();
          this.cookieService.delete('authToken');
          this.cookieService.delete('userId','/');
          this.cookieService.delete('userName','/');
          this.toastr.success(success.message);
          setTimeout(() => {
            this.router.navigate(['/login']); 
          },2000);
        }
        else if(success.status == 404)
        {
          this.toastr.error('Already logout or invalid authorization token ! login again');
          this.router.navigate(['/login']);
        }
        else
        {
          this.toastr.error(success.message);
          this.router.navigate(['/error']);
        } 
      },
      (err)=>
      {
        if(err.status == 404)
        {
          this.toastr.error("Logout Failed ","Already Logged out or Invalid User");
          this.router.navigate(['/login']);
        }
        else
        {
          this.toastr.error("Some Error Occured","Error!");
          this.router.navigate(['/error']);
        }
      }
    )

  } //end logout

}


