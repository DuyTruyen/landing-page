import { Component, OnInit} from '@angular/core';
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
  profileCols: any[] = [];
  sessionCols: any[] = [];
  customers:any[] = [];
  members:any[] = [];
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
  sessionLengthMap: Map<number, number> = new Map<number, number>();
  total = 0;
  searchData = {
    skip: 0,
    take: 40,
    name: '',
  };

  constructor(
    private notification: NotificationService,
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
      {field: 'name', header: 'Họ tên', width: '16rem'},
      {field: 'phoneNo', header: 'SĐT', width: '10rem'},
      {field: 'transformedDob', header: 'Ngày sinh', width: '10rem'},
      {field: 'address', header:'Địa chỉ', width: '22rem'},
      {field: 'patientCode', header: 'Mã BN', width: '10rem'},
      {field: 'syncStatus', header: 'Trạng thái', width: '10rem'},
      {field: 'registerDate', header: 'Ngày đăng kí', width: '10rem'},
    ]
    this.profileCols = [
      {header:'Thông tin bệnh nhân', width: '50rem'},
      {header:'Mã BN',width: '15rem'},
      {header:'Số điện thoại',width:'15rem'},
      {header:'Ca khám gần nhất',width:'20rem'},
      {header:'', width:'15rem'}
    ]
    this.sessionCols = [
      {field:'visitDate', header:'Thời gian khám', width: '12rem'},
      {field:'reason', header:'Lý do khám', width: '16rem'},
      {field:'departmentName', header:'Khoa, phòng', width: '12rem'},
      {field:'diagnostic', header:'Chẩn đoán',width: '20rem'},
      {field:'conclusion', header:'Kết luận', width: '12rem'}
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
      }, complete: () => {
        this.loading = false; 
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
    const filteredCustomers = this.members = this.customers.filter(customer => customer.userId === selectedUserId);
    this.members = filteredCustomers.sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) {
        return -1; 
      } else if (!a.isPrimary && b.isPrimary) {
        return 1;
      } else {
        return 0;
      }
    });
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
      }, complete: () => {
        this.loading = false; 
      }
    });
    this.isVisibleProfileDialog = false;
    this.isVisibleHisProfileDialog = true;
  }
  syncOffProfile(id:any){
    this.synced = !this.synced;
    this.hisCode = null;
  }
  updateProfile(profile:any){
    this.loading = true;
    this.customerService.sync(this.hisCode,this.selectedProfile.id).subscribe({
      next: (res) => {
        if(res.ret[0].code === 200){
          this.notification.success("Đồng bộ hồ sơ thành công");
          this.selectedCustomer = profile;
          this.synced = this.selectedProfile.isSync;
          this.search();
        } else if(res.ret[0].code === 400){
          this.notification.warn(res.ret[0].message);
        }else{
          if(res.errors && res.errors.length > 0){
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage)
            })
          }else{
            this.notification.error('Lấy dữ liệu không thành công')
          }
        }
      }, complete: () => {
        this.loading = false; 
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
          this.sessions = res;
          this.sessionLengthMap.set(this.selectedProfile.id, res.length);
        } else{
          if(res.errors && res.errors.length > 0){
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage)
            })
          }else{
            this.notification.error('Lấy dữ liệu không thành công')
          }
        }
      }, 
      complete: () => {
        this.loading = false; 
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
          this.customers = res.customers.map((customer: any) => ({
            ...customer,
            genderName: customer.gender === 0 ? 'Nữ' : 'Nam',
            syncStatus: customer.isSync == true ? "Đã đồng bộ" : "Chưa đồng bộ",
            transformedDob: new DatePipe('en-US').transform(customer.dob, 'dd/MM/yyyy'),
            registerDate: new DatePipe('en-US').transform(customer.dateCreated, 'dd/MM/yyyy')
            }));
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
        },complete: () => {
          this.loading = false; 
        }
      })
      .add(() => {
        this.loading = false;
      });
    }
  resetSearch() {
    this.searchData = {
        skip: 0,
        take: 40,
        name: '',
    };
    this.search();
  }
  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
