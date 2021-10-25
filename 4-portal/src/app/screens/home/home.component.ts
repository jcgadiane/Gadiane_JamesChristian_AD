import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router:Router, private api: HttpClient) { }

  ngOnInit(): void {
    this.populate();
  }

  users: any  = [];

  async populate(){
    this.users = await this.api.get(environment.API_URL+"/user/all").toPromise();
    console.log(this.users);
  }

  nav(destination:string){
    this.router.navigate([destination]);
  }

}
