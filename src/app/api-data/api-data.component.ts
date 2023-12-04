import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-api-data',
  templateUrl: './api-data.component.html',
  styleUrls: ['./api-data.component.css']
})
export class ApiDataComponent {
  data:any;

  constructor(private http: HttpClient){}

  ngOnInit(): void{
    this.getData();
  }
  getData(): void{
    this.http.get("https://fakestoreapi.com/products").subscribe(data =>{
      this.data = data;
    })
  }
}
