import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit {

  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();

  template_name:any;

  Templates:any [ ]=[]

  page = 1;
pageSize = 20
collectionSize = 0;


  constructor(public config:ConfigService,public shared:SharedDataService, private http:HttpClient,
    public router:Router,public toast:ToasterService) {
    this.getAllTemplates();
   }

  ngOnInit() {
    // Using Basic Interval
    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);

    // Using RxJS Timer
    this.subscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe(time => {
        this.rxTime = time;
      });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getAllTemplates(){
   this.config.getSecondHttp('admin/all-templates','').then((data:any)=>{
     this.Templates = data[0];
     this.collectionSize = this.Templates[0].length
   })
  }

  AddTemplate(){
      // if(this.role == 'admin'){
        this.router.navigate(['admin/add-template']);
      // }
    }

    deleteTemplate(id: any) {
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.http.delete('https://cloneback.turnkey.no/api/admin/delete-template/' + id, 
      { headers: headers }).subscribe((data: any) => {
        this.getAllTemplates();
        this.toast.success('Template Deleted Successfully!')
      })

    }

  DeleteCustomer(id:any){
    this.config.deleteSecondHttp('admin/users/'+id,'').then((data:any)=>{
      
      console.log(data);

      window.location.reload();
   
    this.toast.success('Customer Deleted Successfully!','Success')
    })
  }

  EditCustomer(a:any){
    console.log(a);
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/edit-customer'], navigationExtras);
  }
  openProfile(a:any){
    console.log(a);
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/customer-profile'], navigationExtras);
  }

  openChat(a:any){
    
    console.log(a);
    let navigationExtras: NavigationExtras = {
      state: {
        user: a
      }
    };
    this.router.navigate(['admin/chat'], navigationExtras);
    //this.router.navigate(['admin/chat'])
  }

    //Header functions
  
    logout(){
      this.shared.logOut();
    }
  
  
    changeLang(img:any,lang:any){}
}
