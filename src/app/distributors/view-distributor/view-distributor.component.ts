import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/shared/services/global.service';
import { HttpService } from 'src/app/shared/services/http.service';

@Component({
  selector: 'app-view-distributor',
  templateUrl: './view-distributor.component.html',
  styleUrls: ['./view-distributor.component.scss']
})
export class ViewDistributorComponent implements OnInit {

  id !: string;
  distributorData: any;
  readableResponse: any;
  toDecode: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpservice: HttpService, 
    private global: GlobalService,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(val=>{
      this.id = val['id'];
      // console.log(this.id)
    })
    this.viewDistributor();
  }

  viewDistributor(){
    this.httpservice.getDetailsById('outlet/', this.id)
    .subscribe(res =>{
     this.distributorData = res['data'];
     this.toDecode = res['data']['approved']
     console.log(this.distributorData)
     console.log(this.toDecode)
    })
    this.decodeResponse();
  } 

  onBack(){
    this.router.navigate(['/distributors/all-distributors'])
  }
  
  //decode response from backend to readable data by user 
  decodeResponse(){
    if(this.toDecode = true){
      this.readableResponse = true;  
    }
    else{
      this.readableResponse = false;
    }
    
    // let response = this.toDecode;
    // this.global.responseDecoder(response);
    // console.log(this.readableResponse)
   }
  
  }
