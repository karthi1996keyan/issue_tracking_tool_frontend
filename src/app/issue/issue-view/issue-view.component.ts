import { Component, OnInit,EventEmitter} from '@angular/core';

import {ActivatedRoute,Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {IssueService} from './../../issue.service';
import { FileSelectDirective, FileUploader} from 'ng2-file-upload'

import {UserService} from './../../user.service';
import {ToastrService, ActiveToast} from 'ngx-toastr';
import { saveAs } from 'file-saver';
import {Location} from '@angular/common';

@Component({
  selector: 'app-issue-view',
  templateUrl: './issue-view.component.html',
  styleUrls: ['./issue-view.component.css']
})
export class IssueViewComponent implements OnInit {

  

  private uri='http://api.meetinplanner.xyz/api/upload';

  public attachments:any=[];

  public uploader: FileUploader = new FileUploader({
    url: this.uri
    });

    public onFileSelected(event: EventEmitter<File[]>) {
      const file: File = event[0];
 
    }
     


  public response:any;
  public fileId=[];
  public attachmentList=[];
  public title:any;
  public allUsers=[];
  public allIssues=[];
  public description:any;
  public status:any;
  public reporter:any;
  public fileName:any=[];
  public issueId:any;
  public commnetData:any=[];
  public comment:any;
  public assignedTo:any;
  public assignedToId:any;
  public userName:any;
  public reporterId:any;

  
  public allStatus=["Backlog","In-Progress","In-Test","Done"];



  constructor(public toastr:ToastrService,
    public issueService:IssueService,
    public userService:UserService,
    public cookieService:CookieService,
    public _route:ActivatedRoute,
    public router:Router,
    public location:Location ) { }

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

    this.getSingleIssue();
    this.getAllUsers();
    
    setTimeout(() => {
      
    this.getAttachemnts();
  }, 1000);
  this.getCommnet();
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
    this.toastr.error('Authorization missing or logout')
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

  //get single issue details 

  public getSingleIssue=()=>
  {
    this.issueId=this._route.snapshot.paramMap.get('issueId');
    let authToken=this.cookieService.get('authToken');
    this.issueService.getSingleIssue(this.issueId,authToken).subscribe(
      (response)=>
      {
        if(response.status === 200)
        {
          this.response=response.data[0];
          this.title=this.response.title;
          this.status=this.response.status;
          this.description=this.response.description;
          this.reporter=this.response.reporter;
          this.assignedTo=this.response.assignedTo;
          this.assignedToId=this.response.assignedToId;
          this.reporterId=this.response.reporterId;

          for(let imgId of response.data[0].images)
          {
            this.fileId.push(imgId);
          }
        }
        else
        {
          this.toastr.error(response.message);
        }
      },
      (error)=>
      {
        
        this.toastr.error('Some error occured');
        this.router.navigate(['/error']);
      }

    );
  }

  public getAttachemnts=()=>
  {
    this.issueService.getAllAttachments().subscribe(
      (response)=>
      {
          this.attachmentList.push(response['data']);
          for(let x of this.attachmentList)
          {
            for(let y of x)
            {
              for(let a of this.fileId)
              {
                if(a === y._id)
                {
                  this.fileName.push(y.filename);
                }
              }
            }
          }
      }
    )
  }

  public download=(index)=>
  {
    let fileId=this.fileName[index];
    this.issueService.downloadAttachemnts(fileId).subscribe(
        (response)=>
        {
            saveAs(response,response['filename']);
        }
      
    )

  }

  public getCommnet=()=>
  {
    
    
    let authToken=this.cookieService.get('authToken');
    this.issueService.getComment(this.issueId,authToken).subscribe(
      (response)=>
      {
        this.commnetData=response.data;

      }
    )
    
  }

  public deleteIssue=()=>
  {
    
    let authToken=this.cookieService.get('authToken');
    this.issueService.deleteIssue(this.issueId,authToken).subscribe(
      (response)=>
      {
        this.toastr.success(response.message);
        setTimeout(()=>
        {
          this.router.navigate(['/dashboard']);
        },1000);
      }
    )
  }

  public goBack=()=>
  {
    this.location.back();
  }

  public addComment=()=>
  {
    let makeComment={
      issueId:this.issueId,
      description:this.comment,
      reporter:this.cookieService.get('userName'),
      reporterId:this.cookieService.get('userId')
    }
    let authToken=this.cookieService.get('authToken');
    this.issueService.addComment(makeComment,authToken).subscribe(
      (reponse)=>
      {
        this.toastr.success(reponse['message']);
        this.getCommnet();
        this.comment='';
      }
    )
  

  }//end add comment

  public addWatch=()=>
  {
    let response=
    {
      watcherId:this.cookieService.get('userId'),
      issueId:this.issueId
    };
    let authToken=this.cookieService.get('authtoken');
    this.issueService.createWatch(response,authToken).subscribe(
      (response)=>
      {
        this.toastr.success(response['message']);
      }

    )
  }

  public editIssue=()=>
  {
    console.log(this.attachments);
    //find attachments
    for(let y of this.attachments)
    {
      this.fileId.push(y.file.id);
    }
    let issue = {
      issueId:this.issueId,
      status: this.status,
      title: this.title,
      reporter: this.reporter,
      reporterId: this.reporterId,
      description: this.description,
      assignedTo: this.assignedTo,
      assignedToId: this.assignedToId,
      images: this.fileId
    }
    let authToken=this.cookieService.get('authToken');
    this.issueService.editIssue(issue,authToken)
    .subscribe(
      (response) => {
        if (response['status'] == 200) {
          this.toastr.success('Issue Edited Successfully');
          setTimeout(() => {
            this.router.navigate([`/issue/view/${this.issueId}`])
          }, 2000);
        }
        else
        {
          
        this.toastr.error(response.message);
        }
      },
      (error)=>
      {
        
        this.toastr.error('Some error occured');
        this.router.navigate(['/error']);

      }
    )

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
