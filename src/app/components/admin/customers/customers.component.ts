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

  cols: any[] = [];
  customers:any[] = [];
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
  synced = false;
  syncLabel = 'Đồng bộ hồ sơ HIS';

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
      {field: 'name', header: 'Tên khách hàng', isOpSort: true, iconSort : 0, width: '15rem'},
      {field: 'phoneNo', header: 'SĐT', isOpSort: false, iconSort : 0, width: '10rem'},
      {field: 'transformedDob', header: 'Ngày sinh', width: '10rem'},
      {field: 'address', header:'Địa chỉ', width: '25rem'},
      {field: 'patientCode', header: 'Mã BN', isOpSort: true, iconSort : 0, width: '10rem'},
      {field: 'status', header: 'Trạng thái', isOpSort: true, iconSort : 0, width: '10rem'},
      {field: 'registerDate', header: 'Ngày đăng kí', isOpSort: false, iconSort : 0, width: '10rem'},
    ]
    this.getAll();
  }
  getAll() {
    this.loading = true;
    this.customerService.getAll().subscribe ({
      next: (res) => {
        if (res && res.customers) {
          this.customers = res.customers.map((customer: any) => ({
          ...customer,
          genderName: customer.gender === 0 ? 'Nữ' : 'Nam',
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
  }
  onShowProfile(rowData:any){
    console.log('clicked');
    this.selectedProfile = rowData;
    this.isVisibleProfileDialog = true;
}
  showCustomerCard(customer:any){
    this.selectedCustomer = customer;
    this.showCard = !this.showCard;
  }
  syncProfile(){
    this.isVisibleProfileDialog = false;
    this.isVisibleHisProfileDialog = true;
    this.synced = !this.synced;
    this.syncLabel = this.synced ? "Bỏ đồng bộ HIS" : "Đồng bộ hồ sơ HIS";
  }
  updateProfile(){
    this.isVisibleHisProfileDialog = false;
    this.isVisibleProfileDialog = true;
  }
  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
