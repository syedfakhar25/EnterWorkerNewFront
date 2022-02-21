import { TranslationWidth } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import {  Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { map, share } from "rxjs/operators";
import { ConfigService } from 'src/providers/config/config.service';
import { SharedDataService } from 'src/providers/shared-data/shared-data.service';
import { ToasterService } from 'src/providers/toastr-sevice/toaster.service';
@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {


role:any;
  time = new Date();
  rxTime = new Date();
  intervalId: any;
  subscription!: Subscription;

  currentDate = new Date();
  
  Important = new FormControl(false);
  title = new FormControl('');
  employee = new FormControl(0);
  status1 = new FormControl('');
  active = new FormControl(0);
  deadline1 = new FormControl('');
  stepPercentage = new FormControl(0);
 managername= new FormControl('');


 contractPdfFileName: any;
drawingPdfFileName: any;
offerNoRricePdfFileName: any;
offerPdfFileName: any;

// formData={
//   clientname: '',
//  projectname:'',
//  startdate:'',
//  enddate:'',
//  projectdesc:'',
//  street:'',
//  city:'',
//  postalcode:'',
//  customer_id:null,
//  manager_id:null
// }

formData={
  title: '',
  percentage: 0,
  deadline: '',
  clientname: '',
 projectname:'',
 startdate:'',
 enddate: '',
 customerAddress:'',
 CustomerPostalCode: '',
 ProjectCity: '',
 CustomerCity: '',
 ProjectAddress: '',
 ProjectPostal: '',
 customer:'',
 projectdesc:'',
 workingDays: '',
//  city:'',
//  postalcode:'',
 customer_id:null,
 manager_id:null

}
employee_name: any;
selection = [
  { id: 1, name: 'Fabio'},
];

empSelection = [
  { id: 1, name: 'Fabio'},
];

CWSelection = [
  { id: 1, name: 'Fabio'},
];
  
AllCustomers:any[]=[];
AllManagers:any[]=[];
  Employees: any[];
  allProjectComapnies: any;
  responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number; }[];
  availableEmps: any;
  allProjectManagers: any;
  projectManagers: any;
  projectId: any;
  totalPercentage: any;
  allEmployyesOfProject: any[];
  ProjectDetails: any;
  constructor(public router:Router,private http:HttpClient, public modalService: NgbModal,
    public config:ConfigService,public toast:ToasterService,public shared:SharedDataService) {
    this.role = this.shared.role
    this.fetchAllCustomers()
  //  this.fetchAllManagers();
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

      this.responsiveOptions = [
        {
          breakpoint: '1024px',
          numVisible: 5,
          numScroll: 5
        },
        {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
        },
        {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
        }
      ];
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  closeResult: string = '';
  addCompanyWorker(content: any) {
    // this.getAllCompanyEmployees();
    this.getAllCompanies();
    // this.getAllCompanies();
    // this.Employees = '';
    // this.formData.title = '';
    // this.formData.percentage = 0;
    // this.formData.deadline = ''
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class'
    }).result.then((result) => {


      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getBusinessDatesCount() {
    let count = 0;
    const curDate = new Date(new Date(this.formData.startdate).getTime());
    while (curDate <= new Date(this.formData.enddate)) {
        const dayOfWeek = curDate.getDay();
        if(dayOfWeek !== 0 && dayOfWeek !== 6) count++;
        curDate.setDate(curDate.getDate() + 1);
    }
    // alert(count);
    this.formData.workingDays = count.toString();
    return count;
}

  sameAddress(){
    this.formData.ProjectAddress = this.formData.customerAddress;
    this.formData.ProjectPostal = this.formData.CustomerPostalCode;
    this.formData.ProjectCity = this.formData.CustomerCity;

  }

  createProject(){
    
    if(this.formData.projectname == '' || this.formData.projectname == null || this.formData.projectname == undefined){
      this.toast.warning('Project Name is missing','Error')
      return;
    }
    if(this.formData.clientname == '' || this.formData.clientname == null || this.formData.clientname == undefined){
      this.toast.warning('Client Name is missing','Error')
      return;
    }
  
    if(this.formData.startdate == '' || this.formData.startdate == null || this.formData.startdate == undefined){
      this.toast.warning('Start Date is missing','Error')
      return;
    }
    if(this.formData.enddate == '' || this.formData.enddate == null || this.formData.enddate == undefined){
      this.toast.warning('End Date is missing','Error')
      return;
    }
    // if(this.formData.projectdesc == '' || this.formData.projectdesc == null || this.formData.projectdesc == undefined){
    //   this.toast.warning('Project Description is missing','Error')
    //   return;
    // }
    if(this.formData.ProjectAddress == '' || this.formData.ProjectAddress == null || this.formData.ProjectAddress == undefined){
      this.toast.warning('Project Address is missing','Error')
      return;
    }
  
    if(this.formData.ProjectPostal == '' || this.formData.ProjectPostal == null || this.formData.ProjectPostal == undefined){
      this.toast.warning('Postal Code is missing','Error')
      return;
    }
    if(this.formData.ProjectCity == '' || this.formData.ProjectCity == null || this.formData.ProjectCity == undefined){
      this.toast.warning('Project City is missing','Error')
      return;
    }
    if(this.formData.startdate > this.formData.enddate){
      this.toast.warning('Start date is greater than End date','Error')
      return;
    }
    var d1 = new Date(this.formData.startdate);
    var d2 = new Date(this.formData.enddate);

    if(d1.getTime()>d2.getTime()){
      this.toast.warning('Project End Date Cannot Be Greater Than Start Date!','Error')
      return;
    }
   
    else{
      // if(this.role == 'project manager'){
      // this.formData.manager_id =this.shared.customerData.id
      // }
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.http.post('https://cloneback.turnkey.no/api/manager/projects',{
        "customer_id": this.formData.clientname,
        "name": this.formData.projectname,
        "description": this.formData.projectdesc,
        "street": this.formData.ProjectAddress,
        "postal_code": this.formData.ProjectPostal,
        "city": this.formData.ProjectCity,
        "start_date": this.formData.startdate,
        "end_date": this.formData.enddate,
        "cus_address": this.formData.customerAddress,
        "cus_city": this.formData.CustomerCity,
        "cus_postal_code":  this.formData.CustomerPostalCode,
      },{ headers: headers}).subscribe((data:any)=>{

    
      //  console.log("response",data)
      // project id after creation of project
      this.projectId = data.data.id;
        this.myStepper.next();
        this.firstStepCreation();
        this.getSteps();
        this.getAddedEmployees();
        this.getProjectDetails();
      //  this.toast.success('Project has been added successfully!','Success')          
     })
    }
  }

  @ViewChild(MatStepper) myStepper: MatStepper;
  ngAfterViewInit() {
      this.myStepper._getIndicatorType = () => 'number';

  }

  offerWithPriceFile: any;
  offerWithoutPriceFile: any;
  drawingFile: any;
  contractFile: any;
  @ViewChild('file')
  file: ElementRef;
  @ViewChild('file2')
  file2: ElementRef;
  @ViewChild('file3')
  file3: ElementRef;
  @ViewChild('file4')
  file4: ElementRef;

  uploadOfferWithPriceFile(event: any) {
    this.offerWithPriceFile = null;
    this.offerWithPriceFile = event.target.files[0];
    this.offerPdfFileName = event.target.files[0].name;
  }

  uploadOfferWithoutPriceFile(event: any) {
    this.offerWithoutPriceFile = null;
    this.offerWithoutPriceFile = event.target.files[0];
    this.offerNoRricePdfFileName = event.target.files[0].name;
  }

  uploadDrawingFile(event: any) {
    this.drawingFile = null;
    this.drawingFile = event.target.files[0];
    this.drawingPdfFileName = event.target.files[0].name;
  }

  uploadContractFile(event: any) {
    this.contractFile = null;
    this.contractFile = event.target.files[0];
    this.contractPdfFileName = event.target.files[0].name;

  }

  resetOfferWithPriceFile(element: any) {
    element.value = "";
    this.offerWithPriceFile = null;
    this.offerPdfFileName = '';
    this.file.nativeElement.value = "";

  }

  resetOfferWithoutPriceFile(element: any) {
    element.value = "";
    this.offerWithoutPriceFile = null;
    this.offerNoRricePdfFileName = '';
    this.file2.nativeElement.value = "";
  }

  resetDrawingFile(element: any) {
    element.value = "";
    this.drawingFile = null;
    this.drawingPdfFileName = '';
    this.file3.nativeElement.value = "";
  }

  resetContractFile(element: any) {
    element.value = "";
    this.contractFile = null;
    this.contractPdfFileName = '';
    this.file4.nativeElement.value = "";
  }
  firstStepCreation(){
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.post('https://cloneback.turnkey.no/api/manager/steps',{
      'project_id': this.projectId,
      'active':1,
      'step_order':1,
      'task_status':1
    },{ headers: headers}).subscribe((data:any)=>{
      // console.log(data);
      this.getSteps();
      // setInterval(() => {
      //   let a = 'total'
      //   let navigationExtras: NavigationExtras = {
      //     state: {
      //       user: a
      //     }
      //   };
        // this.router.navigate(['admin/projects']);
    //  }, 5000);
     })
  }

  getRemainingEmployees() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/employee-for-project/' + this.projectId , { headers: headers }).subscribe((data: any) => {
      // this.allProjectManagers = data.data;

      this.availableEmps = data.data;
      console.log("rem emps", data)
      console.log("rem array", this.availableEmps)
    },
      (error: any) => {
        console.log('oops', error)

      }

    );
  }

  getSelection(item: any) {
    return this.selection.findIndex(s => s.id === item.id) !== -1;
  }
  
  getAllManagers() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    this.http.get('https://cloneback.turnkey.no/api/manager-for-project/' + this.projectId , { headers: headers }).subscribe((data: any) => {
      this.allProjectManagers = data.data;
    },
      (error: any) => {
        console.log('oops', error)

      }

    );
  }

  addEmployee(content: any) {
    this.getRemainingEmployees();
    // this.getProjectEmployees();
    // this.Employees = '';
    // this.formData.title = '';
    // this.formData.percentage = 0;
    // this.formData.deadline = ''
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class'
    }).result.then((result) => {
      // this.getProjectEmployees();
      
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  removeEmployee(employeeId: any){
    
    const headers = new HttpHeaders();
      let httpParams = new HttpParams().set('employee', employeeId);

      let options = { params: httpParams };

      this.http.delete('https://cloneback.turnkey.no/api/manager/remove-team-member/' + this.projectId,
      options).subscribe((data: any) => {
      this.getAddedEmployees();
      this.getAllEmployees();
       this.toast.success('Employee removed Successfully!')
     })
    
  }

  addMember(content: any) {
    this.getAllManagers()
    // this.employeeId = '';
    // this.formData.title = '';
    // this.formData.percentage = 0;
    // this.formData.deadline = ''
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      windowClass: 'custom-class'
    }).result.then((result) => {


      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getProjectManagers() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    this.http.get('https://cloneback.turnkey.no/api/admin/get-managers/' + this.projectId , { headers: headers }).subscribe((data: any) => {
      this.projectManagers = data[0];
      // console.log("PROJECT",data[0]);
    },
      (error: any) => {
        console.log('oops', error)

      }

    );
  }
  
  removeProjectManager(managerId: any){

    const headers = new HttpHeaders();
      let httpParams = new HttpParams().set('manager', managerId);

      let options = { params: httpParams };

      this.http.delete('https://cloneback.turnkey.no/api/manager/remove-manager/' + this.projectId,
      options).subscribe((data: any) => {
       this.getProjectManagers();
       this.getAllEmployees();
       this.toast.success('Project manager removed Successfully!')
     })

  }

  changeHandler(item: any) {
    const id = item.id;

    const index = this.selection.findIndex(u => u.id === id);
    if (index === -1) {
      // ADD TO SELECTION
      // this.selection.push(item);
      this.selection = [...this.selection, item];
    } else {
      // REMOVE FROM SELECTION
      this.selection = this.selection.filter(user => user.id !== item.id)
      // this.selection.splice(index, 1)
    }
  }

  getEmpSelection(item: any) {
    return this.empSelection.findIndex(s => s.id === item.id) !== -1;
  }

  getCWSelection(item: any){
    return this.CWSelection.findIndex(s => s.id === item.id) !== -1;
  }

  changeCWHandler(item: any) {
    const id = item.id;

    const index = this.CWSelection.findIndex(u => u.id === id);
    if (index === -1) {
      // ADD TO SELECTION
      // this.selection.push(item);
      this.CWSelection = [...this.CWSelection, item];
    } else {
      // REMOVE FROM SELECTION
      this.CWSelection = this.CWSelection.filter(user => user.id !== item.id)
      // this.selection.splice(index, 1)
    }
  }

  companies: any[] = []
  getAllCompanies() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    // this.http.get('https://cloneback.turnkey.no/api/all-company-workers', { headers: headers }).subscribe((data: any) => {
    this.http.get('https://cloneback.turnkey.no/api/company-for-project/' + this.projectId, { headers: headers }).subscribe((data: any) => {

      //  console.log(data)
      this.companies = data[0];
      console.log("company data", data[0])



      //    console.log(this.projectManagers.length)
      // this.collectionSize1 = this.projectManagers.length
    })
  }

  addDocuments(){
  
    var formdataWithoutPrice = new FormData();
    var formdataWithPrice = new FormData();
    var formdataDrawing = new FormData();
    var formdataContract = new FormData();

    formdataWithoutPrice.append("project_offer", this.offerWithoutPriceFile);
    formdataWithPrice.append("offer_with_price", this.offerWithoutPriceFile);
    formdataDrawing.append("project_drawing", this.drawingFile);
    formdataContract.append("contract", this.contractFile);

    let requestOptions1: RequestInit = {
      method: 'POST',
      body: formdataWithoutPrice,
      redirect: 'follow'
    };
    let requestOptions2: RequestInit = {
      method: 'POST',
      body: formdataWithPrice,
      redirect: 'follow'
    };
    let requestOptions3: RequestInit = {
      method: 'POST',
      body: formdataDrawing,
      redirect: 'follow'
    };
    let requestOptions4: RequestInit = {
      method: 'POST',
      body: formdataContract,
      redirect: 'follow'
    };

    fetch("https://cloneback.turnkey.no/api/admin/upload-project-offer/" + this.projectId, requestOptions1)
      .then(response => response.text())
      .then(result => console.log("SUCESS",result))
      .catch(error => console.log('error', error));

      fetch("https://cloneback.turnkey.no/api/admin/upload-project-offer-price/" + this.projectId, requestOptions2)
      .then(response => response.text())
      .then(result => console.log("SUCESS",result))
      .catch(error => console.log('error', error));
    
      fetch("https://cloneback.turnkey.no/api/admin/upload-project-drawing/" + this.projectId, requestOptions3)
      .then(response => response.text())
      .then(result => console.log("SUCESS",result))
      .catch(error => console.log('error', error));

      fetch("https://cloneback.turnkey.no/api/admin/upload-project-contract/" + this.projectId, requestOptions4)
      .then(response => response.text())
      .then(result => console.log("SUCESS",result))
      .catch(error => console.log('error', error));



    // this.modalService.dismissAll();
    this.myStepper.next();
    // this.toast.success('Files Uploaded Successfully!', 'Success')
    // setInterval(() => {
    //   window.location.reload();
    // }, 5000);
}


  removeCompanyWorker(workerId: any){
    
    const headers = new HttpHeaders();
      let httpParams = new HttpParams().set('company', workerId);

      let options = { params: httpParams };

      this.http.delete('https://cloneback.turnkey.no/api/manager/remove-company/' + this.projectId,
      options).subscribe((data: any) => {
        this.getProjectAssignedComapnies();
        this.getAllEmployees();
       this.toast.success('Company worker removed Successfully!')
     })
    
  }

  getProjectAssignedComapnies() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    this.http.get('https://cloneback.turnkey.no/api/manager/get-projects_company-workers/' + this.projectId, { headers: headers }).subscribe((data: any) => {
      
      this.allProjectComapnies = data[0];
      console.log("get workeres company0",data);
    },
      (error: any) => {
        console.log('oops', error)

      }

    );
  }

  changeEmpHandler(item: any) {
    const id = item.id;

    const index = this.empSelection.findIndex(u => u.id === id);
    if (index === -1) {
      // ADD TO SELECTION
      // this.selection.push(item);
      this.empSelection = [...this.empSelection, item];
    } else {
      // REMOVE FROM SELECTION
      this.empSelection = this.empSelection.filter(user => user.id !== item.id)
      // this.selection.splice(index, 1)
    }
  }

  addSelectedEmpls(){
    let ids:number[]= this.empSelection.filter(f => f.id != 1).map(({id}) => id);

    const headers = new HttpHeaders();
    // var formData= new FormData();
    headers.append('Content-Type', 'form-data');
    headers.append('Accept', 'application/json');
    // for(var i=0; i < ids.length; i++){
    //   formData.append("manager_id"+[i] , ids[i].toString());
    // }
    this.http.post('https://cloneback.turnkey.no/api/admin/project-team', {
      
      // "manager_id": this.slctMangerID,
      // this.mana.manager_id: this.;

      "project_id": this.projectId,
      "employee_id": ids
    }, { headers: headers }).subscribe((data: any) => {
      this.modalService.dismissAll();

      // window.location.reload()
      // this.getProjectManagers();
      this.getAddedEmployees();
      this.getAllEmployees();
      // this.getRemainingEmployees();
      // console.log(data)
    this.toast.success('Employee Added Successfully!', 'Success');
    },
      (error: any) => {
        console.log('oops', error)
        //  
      })


  }
  

  addSelectedManagers(){
    let ids:number[]= this.selection.filter(f => f.id != 1).map(({id}) => id);

    const headers = new HttpHeaders();
    var formData= new FormData();
    headers.append('Content-Type', 'form-data');
    headers.append('Accept', 'application/json');
    // for(var i=0; i < ids.length; i++){
    //   formData.append("manager_id"+[i] , ids[i].toString());
    // }
    this.http.post('https://cloneback.turnkey.no/api/admin/add-manager/' + this.projectId, {
      
      // "manager_id": this.slctMangerID,
      // this.mana.manager_id: this.;
      "manager_id": ids
    }, { headers: headers }).subscribe((data: any) => {
      this.modalService.dismissAll();

      // window.location.reload()
      this.getProjectManagers();
      this.getAllEmployees();
      this.toast.success('Project Manager Added Successfully!', 'Success');
      // console.log(data)

    },
      (error: any) => {
        console.log('oops', error)
        //  
      })

    // this.toast.success('Project Manager Added Successfully!', 'Success');

  }

  // submit(){
  //   if(this.formData.projectname == '' || this.formData.projectname == null || this.formData.projectname == undefined){
  //     this.toast.warning('Project Name is missing','Error')
  //     return;
  //   }
  //   if(this.formData.clientname == '' || this.formData.clientname == null || this.formData.clientname == undefined){
  //     this.toast.warning('Client Name is missing','Error')
  //     return;
  //   }
  
  //   if(this.formData.startdate == '' || this.formData.startdate == null || this.formData.startdate == undefined){
  //     this.toast.warning('Start Date is missing','Error')
  //     return;
  //   }
  //   if(this.formData.enddate == '' || this.formData.enddate == null || this.formData.enddate == undefined){
  //     this.toast.warning('End Date is missing','Error')
  //     return;
  //   }
  //   if(this.formData.projectdesc == '' || this.formData.projectdesc == null || this.formData.projectdesc == undefined){
  //     this.toast.warning('Project Description is missing','Error')
  //     return;
  //   }
  //   if(this.formData.street == '' || this.formData.street == null || this.formData.street == undefined){
  //     this.toast.warning('Street Address is missing','Error')
  //     return;
  //   }
  
  //   if(this.formData.postalcode == '' || this.formData.postalcode == null || this.formData.postalcode == undefined){
  //     this.toast.warning('Postal Code is missing','Error')
  //     return;
  //   }
  //   if(this.formData.city == '' || this.formData.city == null || this.formData.city == undefined){
  //     this.toast.warning('City is missing','Error')
  //     return;
  //   }
  //   var d1 = new Date(this.formData.startdate);
  //   var d2 = new Date(this.formData.enddate);

  //   if(d1.getTime()>d2.getTime()){
  //     this.toast.warning('Project End Date Cannot Be Greater Than Start Date!','Error')
  //     return;
  //   }
   
  //   else{
  //     // if(this.role == 'project manager'){
  //     // this.formData.manager_id =this.shared.customerData.id
  //     // }
  //     const headers = new HttpHeaders();
  //     headers.append('Content-Type', 'multipart/form-data');
  //     headers.append('Accept', 'application/json');
  //     this.http.post('https://cloneback.turnkey.no/api/manager/projects',{
  //       "customer_id": this.formData.clientname,
  //       "name": this.formData.projectname,
        
  //       "description": this.formData.projectdesc,
  //       "street": this.formData.street,
  //       "postal_code": this.formData.postalcode,
  //       "city": this.formData.city,
  //       "start_date": this.formData.startdate,
  //       "end_date": this.formData.enddate
  //     },{ headers: headers}).subscribe((data:any)=>{

    
  //      console.log(data.data)

  //      this.toast.success('Project has been added successfully!','Success')
  //      const headers = new HttpHeaders();
  // headers.append('Content-Type', 'multipart/form-data');
  // headers.append('Accept', 'application/json');
  // this.http.post('https://cloneback.turnkey.no/api/manager/steps',{
  //   'project_id':data.data.id,
  //   'active':1,
  //   'step_order':1,
  //   'task_status':1
  // },{ headers: headers}).subscribe((data:any)=>{
  //   console.log(data);

  //   // setInterval(() => {
  //   //   let a = 'total'
  //   //   let navigationExtras: NavigationExtras = {
  //   //     state: {
  //   //       user: a
  //   //     }
  //   //   };
  //     this.router.navigate(['admin/projects']);
  // //  }, 5000);
  //  })

 
            
          
  //    })
  //   }
 
   
  // }
  cancel(){
    this.router.navigate(['admin/employees'])
    
  }

  fetchAllCustomers(){
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/all-customer',
    { headers: headers}).subscribe((data:any)=>{

    
      this.AllCustomers = data.data
      
    })
  }

  submitProject(){
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.put('https://cloneback.turnkey.no/api/admin/submit/' + this.projectId, { headers: headers }).subscribe((data: any) => {
      this.toast.success('Project Added Successfully!', 'Success');
      this.router.navigate(['admin/projects'])
    })

  }

  SelectClient(a:any){
    console.log(a);
    var i=0
    for(i;i<this.AllCustomers.length;i++){
     if(this.AllCustomers[i].first_name == a){
      
       this.formData.customer_id = this.AllCustomers[i].id;
     }
    }
    
  }

  important: any;


  addItem(id: any) {

    // console.log("employee field",this.employee);
    if(this.allEmployyesOfProject != null && this.employee.value != null){
      let variableOne = this.allEmployyesOfProject.filter(itemInArray => itemInArray.id === Number(this.employee.value));
      // console.log("value", variableOne)

    if (this.Important.value == true) {
      this.important = 1;
    }
    else if (this.Important.value == false) {
      this.important = 0;
    }
    var d1 = new Date(this.deadline1.value);
    var d2 = new Date(this.ProjectDetails.end_date);
    var d3 = new Date(this.ProjectDetails.start_date);

    if (this.title.value == null || this.title.value == undefined || this.title.value == '') {
      this.toast.error('Please write down the task ')
      return;
    }

    if (this.status1.value == null || this.status1.value == undefined || this.status1.value == '') {
      this.toast.error('Please select Task Status')
      return;
    }

    if (this.deadline1.value == null || this.deadline1.value == undefined || this.deadline1.value == '') {
      this.toast.error('Please select Task Deadline')
      return;
    }

    if (d1.getTime() > d2.getTime()) {
      this.toast.warning('Task Deadline Cannot Be Greater Than Project End Date!', 'Error')
      return;
    }

    if (d1.getTime() < d3.getTime()) {
      this.toast.warning('Task Deadline Cannot Be Less Than Project Start Date!', 'Error')
      return;
    }
    if (this.employee.value == null || this.employee.value == undefined) {
      this.toast.error('Please Select Employee to assign task to!')
      return;
    }
    
    else {
      console.log('Step ID', id);
      console.log('Employee ID', this.employee.value),
      console.log('Task Title', this.title.value),
      console.log('Task Status', this.status1.value),
      console.log('Is Important', this.important),
      console.log('Task Deadline', this.deadline1.value),
      console.log('Project ID', this.projectId);
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');

      if(variableOne[0].designation_name == 'project manager'){
        this.http.post('https://cloneback.turnkey.no/api/admin/tasks',
        {
          manager_id: Number(this.employee.value),
          employee_id: 0,
          company_id: 0,
          title: this.title.value,
          task_status: Number(this.status1.value),
          step_id: id,
          is_important: this.important,
          deadline: this.deadline1.value,
          project_id: this.projectId,
        }, { headers: headers }).subscribe((data: any) => {
          console.log(data);
          this.employee.setValue('');
          // window.location.reload()
          this.getSteps();
          this.toast.success('Task Added Successfully!')
        })
      }
      else if(variableOne[0].designation_name != 'project manager' && variableOne[0].designation_name != null){
        this.http.post('https://cloneback.turnkey.no/api/admin/tasks',
        {
          employee_id: Number(this.employee.value),
          manager_id: 0,
          company_id: 0,
          title: this.title.value,
          task_status: Number(this.status1.value),
          step_id: id,
          is_important: this.important,
          deadline: this.deadline1.value,
          project_id: this.projectId,
        }, { headers: headers }).subscribe((data: any) => {
          console.log(data);
          this.employee.setValue('');
          // window.location.reload()
          this.getSteps();
          this.toast.success('Task Added Successfully!')
        })
      }
      else{
        this.http.post('https://cloneback.turnkey.no/api/admin/tasks',
        {
          company_id: Number(this.employee.value),
          manager_id: 0,
          employee_id: 0,
          title: this.title.value,
          task_status: Number(this.status1.value),
          step_id: id,
          is_important: this.important,
          deadline: this.deadline1.value,
          project_id: this.projectId,
        }, { headers: headers }).subscribe((data: any) => {
          console.log(data);
          this.employee.setValue('');
          // window.location.reload()
          this.getSteps();
          this.toast.success('Task Added Successfully!')
        })
      }

    }
  }
  else{
    this.toast.warning('Please Select Employee to assign task to!')
  }
}

  deleteStep(id: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.delete('https://cloneback.turnkey.no/api/admin/steps/' + id, { headers: headers }).subscribe((data: any) => {
      console.log(data);
      // window.location.reload()
      this.getSteps();
    })

    this.toast.success('Step Deleted Successfully!', 'success')
  }

  updateTsk(event: any, step: any) {
    let countImportant = 0;
    let countImportantDone = 0;
    let tasks: any;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.put('https://cloneback.turnkey.no/api/admin/tasks/' + event.id,
      {
        step_id: event.step_id,
        company_worker: event?.company_worker,
        employee_id: event.employee_id,
        title: event.title,
        task_status: event.task_status,
        is_important: event.is_important,
        deadline: event.deadline,
        project_id: event.project_id,
      }, { headers: headers }).subscribe((data: any) => {
        this.http.get('https://cloneback.turnkey.no/api/admin/get-tasks/' + step.id,
          { headers: headers }).subscribe((data: any) => {
            console.log(data[0]);
            let a = 0
            tasks = data[0]
            for (a; a < tasks.length; a++) {
              if (tasks[a].is_important == 1) {
                countImportant = countImportant + 1;
                if (tasks[a].task_status == 2) {
                  countImportantDone++;
                }
              }
            }
            console.log(countImportant)
            console.log(countImportantDone);
            if (countImportant == countImportantDone) {
              console.log('All important done')
              this.ActivateStep(step.id, event.project_id)
            }
            else {
              console.log('Not all important done')
              this.ActivateStep(step.id, event.project_id)
            }
          })
      })

      this.updatePercentage();
  }

  updateAssignedTo(event: any, step: any) {

    var d1 = new Date(event.deadline);
    var d2 = new Date(this.ProjectDetails.end_date);
    var d3 = new Date(this.ProjectDetails.start_date);
    console.log("d1", d1.getTime())
    console.log("d3 end", d3.getTime())

    if (d1.getTime() > d2.getTime()) {
      this.toast.warning('Task Deadline Cannot Be Greater Than Project End Date!', 'Error')
      this.getSteps()
      return;
    }

    if (d1.getTime() < d3.getTime()) {
      this.toast.warning('Task Deadline Cannot Be Less Than Project Start Date!', 'Error')
      this.getSteps()
      return;
    }

    let variableOne;
    let countImportant = 0;
    let countImportantDone = 0;
    let tasks: any;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    if(event.employee_id != 0){
            // console.log("empl id", event.employee_id)
            variableOne = this.allEmployyesOfProject.filter(itemInArray => itemInArray.id === Number(event.employee_id));
            if(variableOne[0].designation_name == 'project manager'){
              this.http.put('https://cloneback.turnkey.no/api/admin/tasks/' + event.id,
              {
                step_id: event.step_id,
                company_worker: event?.company_worker,
                manager_id: event.employee_id,
                employee_id: 0,
                company_id: 0,
                title: event.title,
                task_status: event.task_status,
                is_important: event.is_important,
                deadline: event.deadline,
                project_id: event.project_id,
              }, { headers: headers }).subscribe((data: any) => {
                this.http.get('https://cloneback.turnkey.no/api/admin/get-tasks/' + step.id,
                  { headers: headers }).subscribe((data: any) => {
                    console.log(data[0]);
                    let a = 0
                    tasks = data[0]
                    for (a; a < tasks.length; a++) {
                      if (tasks[a].is_important == 1) {
                        countImportant = countImportant + 1;
                        if (tasks[a].task_status == 2) {
                          countImportantDone++;
                        }
                      }
                    }
                    console.log(countImportant)
                    console.log(countImportantDone);
                    if (countImportant == countImportantDone) {
                      console.log('All important done')
                      this.ActivateStep(step.id, event.project_id)
                    }
                    else {
                      console.log('Not all important done')
                      this.ActivateStep(step.id, event.project_id)
                    }
                  })
              })
        
            }
            else if(variableOne[0].designation_name != 'project manager' && variableOne[0].designation_name != null){
              this.http.put('https://cloneback.turnkey.no/api/admin/tasks/' + event.id,
              {
                step_id: event.step_id,
                company_worker: event?.company_worker,
                manager_id: 0,
                employee_id: event.employee_id,
                company_id: 0,
                title: event.title,
                task_status: event.task_status,
                is_important: event.is_important,
                deadline: event.deadline,
                project_id: event.project_id,
              }, { headers: headers }).subscribe((data: any) => {
                this.http.get('https://cloneback.turnkey.no/api/admin/get-tasks/' + step.id,
                  { headers: headers }).subscribe((data: any) => {
                    console.log(data[0]);
                    let a = 0
                    tasks = data[0]
                    for (a; a < tasks.length; a++) {
                      if (tasks[a].is_important == 1) {
                        countImportant = countImportant + 1;
                        if (tasks[a].task_status == 2) {
                          countImportantDone++;
                        }
                      }
                    }
                    console.log(countImportant)
                    console.log(countImportantDone);
                    if (countImportant == countImportantDone) {
                      console.log('All important done')
                      this.ActivateStep(step.id, event.project_id)
                    }
                    else {
                      console.log('Not all important done')
                      this.ActivateStep(step.id, event.project_id)
                    }
                  })
              })
            }
            else{
                  this.http.put('https://cloneback.turnkey.no/api/admin/tasks/' + event.id,
                  {
                    step_id: event.step_id,
                    company_worker: event?.company_worker,
                    manager_id: 0,
                    employee_id: 0,
                    company_id: event.employee_id,
                    title: event.title,
                    task_status: event.task_status,
                    is_important: event.is_important,
                    deadline: event.deadline,
                    project_id: event.project_id,
                  }, { headers: headers }).subscribe((data: any) => {
                    this.http.get('https://cloneback.turnkey.no/api/admin/get-tasks/' + step.id,
                      { headers: headers }).subscribe((data: any) => {
                        console.log(data[0]);
                        let a = 0
                        tasks = data[0]
                        for (a; a < tasks.length; a++) {
                          if (tasks[a].is_important == 1) {
                            countImportant = countImportant + 1;
                            if (tasks[a].task_status == 2) {
                              countImportantDone++;
                            }
                          }
                        }
                        console.log(countImportant)
                        console.log(countImportantDone);
                        if (countImportant == countImportantDone) {
                          console.log('All important done')
                          this.ActivateStep(step.id, event.project_id)
                        }
                        else {
                          console.log('Not all important done')
                          this.ActivateStep(step.id, event.project_id)
                        }
                      })
                  })
            } 
    }
    else if(event.manager_id != 0){
      variableOne = this.allEmployyesOfProject.filter(itemInArray => itemInArray.id === Number(event.manager_id));
      if(variableOne[0].designation_name == 'project manager'){
        this.http.put('https://cloneback.turnkey.no/api/admin/tasks/' + event.id,
        {
          step_id: event.step_id,
          company_worker: event?.company_worker,
          manager_id: event.manager_id,
          employee_id: 0,
          company_id: 0,
          title: event.title,
          task_status: event.task_status,
          is_important: event.is_important,
          deadline: event.deadline,
          project_id: event.project_id,
        }, { headers: headers }).subscribe((data: any) => {
          this.http.get('https://cloneback.turnkey.no/api/admin/get-tasks/' + step.id,
            { headers: headers }).subscribe((data: any) => {
              console.log(data[0]);
              let a = 0
              tasks = data[0]
              for (a; a < tasks.length; a++) {
                if (tasks[a].is_important == 1) {
                  countImportant = countImportant + 1;
                  if (tasks[a].task_status == 2) {
                    countImportantDone++;
                  }
                }
              }
              console.log(countImportant)
              console.log(countImportantDone);
              if (countImportant == countImportantDone) {
                console.log('All important done')
                this.ActivateStep(step.id, event.project_id)
              }
              else {
                console.log('Not all important done')
                this.ActivateStep(step.id, event.project_id)
              }
            })
        })
  
      }
      else if(variableOne[0].designation_name != 'project manager' && variableOne[0].designation_name != null){
        this.http.put('https://cloneback.turnkey.no/api/admin/tasks/' + event.id,
        {
          step_id: event.step_id,
          company_worker: event?.company_worker,
          manager_id: 0,
          employee_id: event.manager_id,
          company_id: 0,
          title: event.title,
          task_status: event.task_status,
          is_important: event.is_important,
          deadline: event.deadline,
          project_id: event.project_id,
        }, { headers: headers }).subscribe((data: any) => {
          this.http.get('https://cloneback.turnkey.no/api/admin/get-tasks/' + step.id,
            { headers: headers }).subscribe((data: any) => {
              console.log(data[0]);
              let a = 0
              tasks = data[0]
              for (a; a < tasks.length; a++) {
                if (tasks[a].is_important == 1) {
                  countImportant = countImportant + 1;
                  if (tasks[a].task_status == 2) {
                    countImportantDone++;
                  }
                }
              }
              console.log(countImportant)
              console.log(countImportantDone);
              if (countImportant == countImportantDone) {
                console.log('All important done')
                this.ActivateStep(step.id, event.project_id)
              }
              else {
                console.log('Not all important done')
                this.ActivateStep(step.id, event.project_id)
              }
            })
        })
      }
      else{
            this.http.put('https://cloneback.turnkey.no/api/admin/tasks/' + event.id,
            {
              step_id: event.step_id,
              company_worker: event?.company_worker,
              manager_id: 0,
              employee_id: 0,
              company_id: event.manager_id,
              title: event.title,
              task_status: event.task_status,
              is_important: event.is_important,
              deadline: event.deadline,
              project_id: event.project_id,
            }, { headers: headers }).subscribe((data: any) => {
              this.http.get('https://cloneback.turnkey.no/api/admin/get-tasks/' + step.id,
                { headers: headers }).subscribe((data: any) => {
                  console.log(data[0]);
                  let a = 0
                  tasks = data[0]
                  for (a; a < tasks.length; a++) {
                    if (tasks[a].is_important == 1) {
                      countImportant = countImportant + 1;
                      if (tasks[a].task_status == 2) {
                        countImportantDone++;
                      }
                    }
                  }
                  console.log(countImportant)
                  console.log(countImportantDone);
                  if (countImportant == countImportantDone) {
                    console.log('All important done')
                    this.ActivateStep(step.id, event.project_id)
                  }
                  else {
                    console.log('Not all important done')
                    this.ActivateStep(step.id, event.project_id)
                  }
                })
            })
      } 
    }
    else{
      variableOne = this.allEmployyesOfProject.filter(itemInArray => itemInArray.id === Number(event.company_id));
      if(variableOne[0].designation_name == 'project manager'){
        this.http.put('https://cloneback.turnkey.no/api/admin/tasks/' + event.id,
        {
          step_id: event.step_id,
          company_worker: event?.company_worker,
          manager_id: event.company_id,
          employee_id: 0,
          company_id: 0,
          title: event.title,
          task_status: event.task_status,
          is_important: event.is_important,
          deadline: event.deadline,
          project_id: event.project_id,
        }, { headers: headers }).subscribe((data: any) => {
          this.http.get('https://cloneback.turnkey.no/api/admin/get-tasks/' + step.id,
            { headers: headers }).subscribe((data: any) => {
              console.log(data[0]);
              let a = 0
              tasks = data[0]
              for (a; a < tasks.length; a++) {
                if (tasks[a].is_important == 1) {
                  countImportant = countImportant + 1;
                  if (tasks[a].task_status == 2) {
                    countImportantDone++;
                  }
                }
              }
              console.log(countImportant)
              console.log(countImportantDone);
              if (countImportant == countImportantDone) {
                console.log('All important done')
                this.ActivateStep(step.id, event.project_id)
              }
              else {
                console.log('Not all important done')
                this.ActivateStep(step.id, event.project_id)
              }
            })
        })
  
      }
      else if(variableOne[0].designation_name != 'project manager' && variableOne[0].designation_name != null){
        this.http.put('https://cloneback.turnkey.no/api/admin/tasks/' + event.id,
        {
          step_id: event.step_id,
          company_worker: event?.company_worker,
          manager_id: 0,
          employee_id: event.company_id,
          company_id: 0,
          title: event.title,
          task_status: event.task_status,
          is_important: event.is_important,
          deadline: event.deadline,
          project_id: event.project_id,
        }, { headers: headers }).subscribe((data: any) => {
          this.http.get('https://cloneback.turnkey.no/api/admin/get-tasks/' + step.id,
            { headers: headers }).subscribe((data: any) => {
              console.log(data[0]);
              let a = 0
              tasks = data[0]
              for (a; a < tasks.length; a++) {
                if (tasks[a].is_important == 1) {
                  countImportant = countImportant + 1;
                  if (tasks[a].task_status == 2) {
                    countImportantDone++;
                  }
                }
              }
              console.log(countImportant)
              console.log(countImportantDone);
              if (countImportant == countImportantDone) {
                console.log('All important done')
                this.ActivateStep(step.id, event.project_id)
              }
              else {
                console.log('Not all important done')
                this.ActivateStep(step.id, event.project_id)
              }
            })
        })
      }
      else{
            this.http.put('https://cloneback.turnkey.no/api/admin/tasks/' + event.id,
            {
              step_id: event.step_id,
              company_worker: event?.company_worker,
              manager_id: 0,
              employee_id: 0,
              company_id: event.company_id,
              title: event.title,
              task_status: event.task_status,
              is_important: event.is_important,
              deadline: event.deadline,
              project_id: event.project_id,
            }, { headers: headers }).subscribe((data: any) => {
              this.http.get('https://cloneback.turnkey.no/api/admin/get-tasks/' + step.id,
                { headers: headers }).subscribe((data: any) => {
                  console.log(data[0]);
                  let a = 0
                  tasks = data[0]
                  for (a; a < tasks.length; a++) {
                    if (tasks[a].is_important == 1) {
                      countImportant = countImportant + 1;
                      if (tasks[a].task_status == 2) {
                        countImportantDone++;
                      }
                    }
                  }
                  console.log(countImportant)
                  console.log(countImportantDone);
                  if (countImportant == countImportantDone) {
                    console.log('All important done')
                    this.ActivateStep(step.id, event.project_id)
                  }
                  else {
                    console.log('Not all important done')
                    this.ActivateStep(step.id, event.project_id)
                  }
                })
            })
      } 
    }
    this.updatePercentage();
    
  }

  //Create Steps
  createStep(order: any) {

    let company_worker: any = null;

    if (this.role == 'company worker') {
      company_worker = 1;
    }

    console.log(company_worker);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.post('https://cloneback.turnkey.no/api/admin/step-in', {
      'project_id': this.projectId,
      'active': 0,
      'step_order': order,
      'task_status': 1,
      'percentage': 0,
      'company_worker': company_worker
    }, { headers: headers }).subscribe((data: any) => {
      console.log(data);
      // window.location.reload();
      this.getSteps();
    })
    this.toast.success('Step Added Successfully!', 'success')
  }

  updateStepPercentage(order: any, id: any, percentage: any){
    // console.log("perc", this.totalPerc);
    // if (this.totalPerc!= null && this.totalPerc <= 100 ) {
    //   console.log("perc total", this.totalPerc);
      const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    this.http.put('https://cloneback.turnkey.no/api/admin/check-percentage/' + this.projectId, 
    {
      id:  id
    }).subscribe((data: any) => {
      this.totalPercentage = data.data;
      this.totalPercentage = +this.totalPercentage + +percentage;
      console.log("total",  this.totalPercentage);
      console.log("return",  data.data);

    if( this.totalPercentage >= 0 && this.totalPercentage <= 100){

      this.http.put('https://cloneback.turnkey.no/api/admin/steps/' + id, {
        'project_id': this.projectId,
        // 'active': 0,
        'step_order': order,
        // 'task_status': 1,
        'percentage': percentage,
        // 'company_worker': ''
      }, { headers: headers }).subscribe((data: any) => {
        console.log(data);
        // window.location.reload();
        this.getSteps();
        this.toast.success('Step Percentage Updated Successfully!', 'success')
      })
    }
    else{
      this.getSteps();
     this.toast.warning('Total project percentage cannot exceed 100!')
    return
    }

    })


  // }
  // else{
  //    this.toast.success('Total project percentage cannot exceed 100!')
  //   return
  // }
   
   
  }

  fileEvent(event: any){
    if(event.target.files.length > 0) 
    {
      this.offerPdfFileName = event.target.files[0].name;
      this.contractPdfFileName = event.target.files[0].name;
      this.drawingPdfFileName = event.target.files[0].name;
      this.offerNoRricePdfFileName = event.target.files[0].name;
    }
  }

  addCW() {
    // console.log(this.data)
    // console.log(this.slctWorkerID)
    let ids:number[]= this.CWSelection.filter(f => f.id != 1).map(({id}) => id);

    const headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.post('https://cloneback.turnkey.no/api/manager/assign-company-worker/' + this.projectId, {

      "company_worker_id": ids,
    }, { headers: headers }).subscribe((data: any) => {
      this.modalService.dismissAll();

      this.getProjectAssignedComapnies();
      this.getAllEmployees();
      // window.location.reload()
      this.toast.success('Company Worker Added Successfully!', 'Success');
      console.log(data)

    },
      (error: any) => {
        console.log('oops', error)
        //    
      })
  }
  
  steps: any;

  getProjectDetails(){
    
    const headers = new HttpHeaders();

    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/admin/projects/' + this.projectId,
     { headers: headers }).subscribe((data: any) => {
      this.ProjectDetails = data.data;
      console.log("details", this.ProjectDetails)

    },
      (error: any) => {
        console.log('oops', error)
        //    
      })
  }
  
  getSteps() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.get('https://cloneback.turnkey.no/api/admin/get-steps/' + this.projectId, { headers: headers }).subscribe((data: any) => {
      this.steps = data[0];
      this.title.setValue('');
      this.Important.setValue('');
      this.status1.setValue('0');
      this.deadline1.setValue('');
      this.employee.setValue('-1');
      this.stepPercentage.setValue('');
    })
  }

  deleteTsk(id: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.delete('https://cloneback.turnkey.no/api/admin/tasks/' + id, { headers: headers }).subscribe((data: any) => {
      // window.location.reload()
      this.getSteps();
    })
    this.toast.success('Task Deleted Successfully!')
  } 

  ActivateStep(step_id: any, project_id: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.put('https://cloneback.turnkey.no/api/admin/step-automation/' + project_id,
      {
        step_id: step_id,
      }, { headers: headers }).subscribe((data: any) => {
        // window.location.reload()
        this.getSteps();
      })
    this.toast.success('Task Updated Successfully!')
  }


  getAddedEmployees() {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    this.http.get('https://cloneback.turnkey.no/api/manager/get-team/' + this.projectId, { headers: headers }).subscribe((data: any) => {
      let a: any[] = [];
      for (let b = 0; b < data[0].team.length; b++) {
        if (data[0].team[b].designation_name != 'project manager') {
          a.push(data[0].team[b])
        }

      }
      this.Employees = a
      // console.log("added emps", this.Employees);
    },
      (error: any) => {
        console.log('oops', error)

      }

    );
  }

  getAllEmployees(){
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    this.http.get('https://cloneback.turnkey.no/api/all-users-for-project/' + this.projectId, { headers: headers }).subscribe((data: any) => {
      let a: any[] = [];
      console.log("all data", data)
      for (let b = 0; b < data.data.employees.length; b++) {
        // if (data[0].team[b].designation_name != 'project manager') {
          console.log("emps", data.data.employees)
          a.push(data.data.employees[b])
        // }

      }
      for (let b = 0; b < data.data.managers.original[0].length; b++) {
          a.push(data.data.managers.original[0][b])
        

      }
      for (let b = 0; b < data.data.company.length; b++) {
          a.push(data.data.company[b])
        

      }
      this.allEmployyesOfProject = a
    },
      (error: any) => {
        console.log('oops', error)

      }

    );

  }

  updatePercentage(){

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    this.http.put('https://cloneback.turnkey.no/api/admin/project-percentage/' + this.projectId,
       { headers: headers }).subscribe((data: any) => {
        // window.location.reload()
        this.getSteps();
        this.toast.success('Step percentage Updated Successfully!')
      })
  }

  fetchAllManagers(){
    this.config.getSecondHttp('all-manager','').then((data:any)=>{
      this.AllManagers = data.data
      
     

    })
  }

  SelectManager(a:any){
   
    console.log(a);
    var i=0
    for(i;i<this.AllManagers.length;i++){
     if(this.AllManagers[i].first_name == a){
      
       this.formData.manager_id = this.AllManagers[i].id;
     }
    }
    
  }

  //Header functions
  
 logout(){
  this.shared.logOut();
 }


 changeLang(img:any,lang:any){}
  
}
