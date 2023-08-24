import { Component, OnInit, ViewChild , TemplateRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MenuItem } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  _isVisibleProfileDialog = false;
  set isVisibleProfileDialog(value:boolean){
    this._isVisibleProfileDialog = value;
  }
  get isVisibleProfileDialog(){
    return this._isVisibleProfileDialog;
  }

  _isVisibleHisProfileDialog = false;
  set isVisibleHisProfileDialog(value:boolean){
    this._isVisibleHisProfileDialog = value;
  }
  get isVisibleHisProfileDialog(){
    return this._isVisibleHisProfileDialog;
  }

  _isVisibleSessionDialog = false;
  set isVisibleSessionDialog(value:boolean){
    this._isVisibleSessionDialog = value;
  }
  get isVisibleSessionDialog(){
    return this._isVisibleSessionDialog;
  }
  
  cols: any[] = [];
  customers:any[] = [];
  members:any[] = [];
  dataColumn:any[] = [];
  breadcrumbItem: MenuItem[];
  home: MenuItem;
  loading = false;
  customerDialogHeader = '';
  checked = true;
  showCard = false;
  showProfile = false;
  selectedProfile:any;
  selectedCustomer:any;
  selectedUserId:number | null = null;
  hisCode:any;
  hisProfiles:any[] = [];
  sessions:any[] = [];
  synced = false;
  syncLabel = 'Đồng bộ hồ sơ HIS';
  total = 0;
  searchData = {
    skip: 0,
    take: 40,
    keyword: '',
  };

  constructor(
    private notification: NotificationService,
    private fb: FormBuilder,
    private customerService: CustomerService,
  ) {
    this.breadcrumbItem = [
      { label: 'Quản lý khách hàng' },
      { label: 'Danh sách khách hàng' },
    ];

    this.home = {
      icon: 'pi pi-home',
      routerLink: '/admin/admin-dashboard',
    };
   }
  ngOnInit(): void {
    this.cols = [
      {field: 'name', header: 'Họ tên', width: '15rem'},
      {field: 'phoneNo', header: 'SĐT', width: '10rem'},
      {field: 'transformedDob', header: 'Ngày sinh', width: '10rem'},
      {field: 'address', header:'Địa chỉ', width: '25rem'},
      {field: 'patientCode', header: 'Mã BN', width: '10rem'},
      {field: 'syncStatus', header: 'Trạng thái', width: '10rem'},
      {field: 'registerDate', header: 'Ngày đăng kí', width: '10rem'},
    ]
    this.getAll();
  }
  getAll() {
    this.loading = true;
    this.customerService.getAll().subscribe ({
      next: (res) => {
        if (res ) {
          this.customers = res.customers.map((customer: any) => ({
          ...customer,
          genderName: customer.gender === 0 ? 'Nữ' : 'Nam',
          syncStatus: customer.isSync == true ? "Đã đồng bộ" : "Chưa đồng bộ",
          transformedDob: new DatePipe('en-US').transform(customer.dob, 'dd/MM/yyyy'),
          registerDate: new DatePipe('en-US').transform(customer.dateCreated, 'dd/MM/yyyy')
          }));
        }else{
          if(res.errors && res.errors.length > 0){
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage)
            })
          }else{
            this.notification.error('Lấy dữ liệu không thành công')
          }
        }
      }
    }) .add(() => {
      this.loading = false
    });
  }
  selectItem(customer: any){
    this.selectedCustomer = customer;
    this.onShowProfile(customer);
    this.hisCode = customer.patientCode;
    this.synced = customer.isSync;
    this.sessions = [];
    this.selectedCustomer = null;
  }
  onShowProfile(rowData:any){
    this.isVisibleProfileDialog = true;
    this.selectedProfile = rowData;
    const selectedUserId = rowData.userId;
    this.members = this.customers.filter(customer => customer.userId === selectedUserId);
}
  showCustomerCard(customer:any){
    this.selectedCustomer = customer;
    this.showCard = !this.showCard;
  }
  syncProfile(){
    this.loading = true;
    this.customerService.getInfo(this.hisCode).subscribe({
      next: (res) => {
        if(res) {
          this.hisProfiles = res;
        } else{
          if(res.errors && res.errors.length > 0){
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage)
            })
          }else{
            this.notification.error('Lấy dữ liệu không thành công')
          }
        }
      }
    });
    this.isVisibleProfileDialog = false;
    this.isVisibleHisProfileDialog = true;
  }
  syncOffProfile(id:any){}

  updateProfile(profile:any){
    this.loading = true;
    this.customerService.sync(this.hisCode,this.selectedProfile.id).subscribe({
      next: (res) => {
        console.log(res);
        if(res.ret[0].message){
          this.notification.warn(res.ret[0].message);
          this.members.push(profile);
          this.selectedCustomer = profile;
          console.log(this.selectedProfile);
          this.synced = this.selectedProfile.isSync;
          this.syncLabel = this.synced ? "Bỏ đồng bộ HIS" : "Đồng bộ hồ sơ HIS";
        } else{
          if(res.errors && res.errors.length > 0){
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage)
            })
          }else{
            this.notification.error('Lấy dữ liệu không thành công')
          }
        }
      }
    });
    this.isVisibleHisProfileDialog = false;
    this.isVisibleProfileDialog = true;
  }
  showSession(){
    this.loading = true;
    this.customerService.getSession(this.selectedProfile.id).subscribe({
      next: (res) => {
        if(res){
          console.log('session', res);  
          res.sort((a:any, b:any) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());       
          this.sessions = res;
        } else{
          if(res.errors && res.errors.length > 0){
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage)
            })
          }else{
            this.notification.error('Lấy dữ liệu không thành công')
          }
        }
      }
    });
    this.isVisibleSessionDialog = true;
    this.isVisibleProfileDialog = false;
  }
  search() {
    this.loading = true;
    this.customerService.search(this.searchData).subscribe({
      next:(res) => {
        if(res){
          this.customers = res.customers;
          this.total = res.total;
        }else{
          if( res.errors && res.errors.length > 0){
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage)
            })
          }else{
            this.notification.error('Tìm kiếm khách hàng không thành công')
            }
          }
        },
      })
      .add(() => {
        this.loading = false;
      });
    }
  resetSearch() {
    this.searchData = {
        skip: 0,
        take: 40,
        keyword: '',
    };
    this.search();
  }
  
  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
