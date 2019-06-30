import { Component, OnInit } from '@angular/core';

import {Router} from '@angular/router';
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(public route:Router) { }

  ngOnInit() {
  }

  public goToLogin()
  {
    this.route.navigate(['/login'])
  }

}
