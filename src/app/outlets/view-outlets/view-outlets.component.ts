import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { GlobalService } from 'src/app/shared/services/global.service';
import { HttpService } from '../../shared/services/http.service';

@Component({
  selector: 'app-view-outlets',
  templateUrl: './view-outlets.component.html',
  styleUrls: ['./view-outlets.component.scss']
})
export class ViewOutletsComponent implements OnInit {


  id !: string;
  outletData: any;
  readableResponse: any;
  toDecode: any;

  @ViewChild("decode") decode: ElementRef;

  // @Input() toolTipBackTitle:string = "Go back to outlets";
  // @Input() toolTipBackColor:string = "blue";
  // @Input() toolTipBackPosition = 'bottom';

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpservice: HttpService, 
    private global: GlobalService,
    private router: Router
    ){ }

//get id from route which we'll use to get data
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(val=>{
      this.id = val['id'];
      // console.log(this.id)
    })
    this.viewOutlet();
    
  }
  
// ngAfterViewInit(): void {
//     this.decode.nativeElement.focus();
//     console.log(this.decode.nativeElement)

//     this.decode.nativeElement.innerHTML = `<div>Hi, I am child added by directly calling the native APIs.</div>`;
  
//   }

viewOutlet(){
 this.httpservice.getDetailsById('outlet/', this.id)
 .subscribe(res =>{
  this.outletData = res['data'];
  this.toDecode = res['data']['approved']
  console.log(this.outletData)
  console.log(this.toDecode)
 })
 this.decodeResponse();
}

onBack(){
  this.router.navigate(['/outlets/list-outlets'])
}

//decode response from backend to readable data by user 
decodeResponse(){

  if(this.toDecode = true){
    this.readableResponse = true;
    // this.readableResponse = `<i nz-icon nzType="check-circle" nzTheme="twotone" style="text-color: green;"></i>`;  
  }
  else{
    this.readableResponse = false;
    // this.readableResponse = `<i nz-icon nzType="close-circle" nzTheme="twotone  style="text-color: red;""></i>`;
  }
  
  // let response = this.toDecode;
  // this.global.responseDecoder(response);
  // console.log(this.readableResponse)
}

//  viewOutlet(){
//   this.httpservice.getDataById(this.elementId)
//   .subscribe(res=>{
//     this.outletData = res;
//     console.log(this.outletData)
//   })
//  }

}
