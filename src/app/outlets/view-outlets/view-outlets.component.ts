import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../shared/services/http.service';

@Component({
  selector: 'app-view-outlets',
  templateUrl: './view-outlets.component.html',
  styleUrls: ['./view-outlets.component.scss']
})
export class ViewOutletsComponent implements OnInit {


  id !: string;
  outletData: any;

  constructor(private activatedRoute: ActivatedRoute, private httpservice: HttpService) { }

//get id from route which we'll use to get data
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(val=>{
      this.id = val['id'];
      console.log(this.id)
    })
    this.viewOutlet();
  }
viewOutlet(){
 this.httpservice.getDetailsById('outlet/', this.id)
 .subscribe(res =>{
  this.outletData = res['data'];
  console.log(this.outletData)
 })
}
//  viewOutlet(){
//   this.httpservice.getDataById(this.elementId)
//   .subscribe(res=>{
//     this.outletData = res;
//     console.log(this.outletData)
//   })
//  }

}
