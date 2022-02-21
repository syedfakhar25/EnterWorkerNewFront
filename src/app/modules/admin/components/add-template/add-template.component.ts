import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrls: ['./add-template.component.css']
})
export class AddTemplateComponent implements OnInit {

  
  imageSrc: string = '';
  file:any;
fileSource:any;

  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();

    templateName = new FormControl('');
    taskTitle = new FormControl('');
  
  templateId: any;
  role: any;
  steps: any;

  
  constructor(public router:Router,
    public shared:SharedDataService,
    public toast:ToasterService,private http:HttpClient) {
      this.role = this.shared.role
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

  @ViewChild(MatStepper) myStepper: MatStepper;
  ngAfterViewInit() {
      this.myStepper._getIndicatorType = () => 'number';

  }

  addTemplate(){

    if(this.templateName.value == '' || this.templateName.value == undefined || this.templateName.value == null){
      this.toast.error('Template name is required!');
      return;
     }
     else if(this.templateName.value != ''){
      
      var myFormData = new FormData();
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      myFormData.append('name', this.templateName.value);

    this.http.post('https://cloneback.turnkey.no/api/admin/add-template', 
    
    myFormData, 
    
    {headers: headers}).subscribe((data: any) => {
      this.templateId = data[0].id;
      this.createFirstStep();
      this.myStepper.next();
      // this.router.navigate(['admin/customers'])
      //  this.toast.success('Template Added Successfully!','Success')

      },
      (error: any) => {
        console.log('oops', error)
      //  this.toast.error(error.error.errors.email[0], 'Oops');
      }
    );

     }
  }

  createFirstStep(){
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.http.post('https://cloneback.turnkey.no/api/admin/add-temp-step',{

        'step_order': 1,
        'template_id': this.templateId,
      },{ headers: headers}).subscribe((data:any)=>{
        // console.log(data);
        this.getSteps();
     })
  }

  getSteps() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/admin/get-temp-step/' + this.templateId, { headers: headers }).subscribe((data: any) => {
      this.steps = data[0];
      console.log("steps", data)
      this.taskTitle.setValue('');
      // this.Important.setValue('');
      // this.status1.setValue('0');
      // this.deadline1.setValue('');
      // this.employee.setValue('-1');
      // this.stepPercentage.setValue('');
    })
  }

  createStep(order: any) {

    // let company_worker: any = null;

    // if (this.role == 'company worker') {
    //   company_worker = 1;
    // }

    // console.log(company_worker);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.post('https://cloneback.turnkey.no/api/admin/add-temp-step', {
      'template_id': this.templateId,
      // 'active': 0,
      'step_order': order,
      // 'task_status': 1,
      // 'percentage': 0,
      // 'company_worker': company_worker
    }, { headers: headers }).subscribe((data: any) => {
      console.log(data);
      // window.location.reload();
      this.getSteps();
    })
    this.toast.success('Step Added Successfully!', 'success')
  }

  addItem(id: any) {

    if (this.taskTitle.value == null || this.taskTitle.value == undefined || this.taskTitle.value == '') {
      this.toast.error('Please write down the task title')
      return;
    }
    else {
      console.log('Step ID', id);
      console.log('Task Title', this.taskTitle.value);
      // console.log('Project ID', this.templateId);

      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.http.post('https://cloneback.turnkey.no/api/admin/add-temp-task',
        {
          title: this.taskTitle.value,
          step_id: id,
          template_id: this.templateId,
        }, { headers: headers }).subscribe((data: any) => {
          console.log(data);
          this.taskTitle.setValue('');
          // window.location.reload()
          this.getSteps();
          this.toast.success('Task Added Successfully!')
        })
    }
  }

  
  updateTsk(event: any, step: any) {
    let countImportant = 0;
    let countImportantDone = 0;
    let tasks: any;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.put('https://cloneback.turnkey.no/api/admin/edit-temp-task/' + event.id,
      {
        // step_id: event.step_id,
        // company_worker: event?.company_worker,
        // employee_id: event.employee_id,
        // title: event.title,
        // task_status: event.task_status,
        // is_important: event.is_important,
        // deadline: event.deadline,
        title: event.title,
      }, { headers: headers }).subscribe((data: any) => {
        this.getSteps();
        this.toast.success('Task updated successfully!');
      }) 

      // this.updatePercentage();
  }

  deleteStep(id: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.delete('https://cloneback.turnkey.no/api/admin/delete-temp-step/' + id, { headers: headers }).subscribe((data: any) => {
      console.log(data);
      // window.location.reload()
      this.getSteps();
    })

    this.toast.success('Step Deleted Successfully!', 'success')
  }

  deleteTsk(id: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.delete('https://cloneback.turnkey.no/api/admin/delete-temp-task/' + id, { headers: headers }).subscribe((data: any) => {
      // window.location.reload()
      this.getSteps();
    })
    this.toast.success('Task Deleted Successfully!')
  } 
 
  goToTemplates(){
    this.router.navigate(['admin/templates']);
  }

  SubmitTemplate(){

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.put('https://cloneback.turnkey.no/api/admin/submit-template/' + this.templateId, 
    { headers: headers }).subscribe((data: any) => {
      this.toast.success('Template Added Successfully!');
      this.router.navigate(['admin/templates'])
    })

  }

  // onFileChange(event:any) {
  //   const reader = new FileReader();
    
  //   if(event.target.files && event.target.files.length) {
  //    this.file = event.target.files[0];
  //     reader.readAsDataURL(this.file);
    
  //     reader.onload = () => {
   
  //       this.imageSrc = reader.result as string;
     
       
  //         this.fileSource= reader.result
       
        
  //     };
      
  //   }
  // }

    //Header Functions
    logout(){
      this.shared.logOut();
    }
    changeLang(img:any,lang:any){}

}
