import { Component, OnInit } from '@angular/core';
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
  set isVisibleProfileDialog(value: boolean) {
    this._isVisibleProfileDialog = value;
  }
  get isVisibleProfileDialog() {
    return this._isVisibleProfileDialog;
  }

  _isVisibleHisProfileDialog = false;
  set isVisibleHisProfileDialog(value: boolean) {
    this._isVisibleHisProfileDialog = value;
  }
  get isVisibleHisProfileDialog() {
    return this._isVisibleHisProfileDialog;
  }

  _isVisibleSessionDialog = false;
  set isVisibleSessionDialog(value: boolean) {
    this._isVisibleSessionDialog = value;
  }
  get isVisibleSessionDialog() {
    return this._isVisibleSessionDialog;
  }

  cols: any[] = [];
  profileCols: any[] = [];
  sessionCols: any[] = [];
  customers: any[] = [];
  members: any[] = [];
  breadcrumbItem: MenuItem[];
  home: MenuItem;
  loading = false;
  customerDialogHeader = '';
  checked = true;
  showCard = false;
  showProfile = false;
  selectedProfile: any;
  selectedCustomer: any;
  selectedUserId: number | null = null;
  hisCode: any;
  hisProfiles: any[] = [];
  sessions: any[] = [];
  sessionLength: Map<number, number> = new Map<number, number>();
  total = 0;
  searchData = {
    skip: 0,
    take: 40,
    name: '',
  };
  isVisibleConfirmDialog: boolean = false;
  textConfirm: string = '';
  unSyncItem: any;

  constructor(
    private notification: NotificationService,
    private customerService: CustomerService,
  ) {
    this.breadcrumbItem = [
      { label: 'Quản lý khách hàng' },
      { label: 'Danh sách khách hàng' },
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
      { field: 'name', header: 'Họ tên', width: '16rem' },
      { field: 'phoneNo', header: 'SĐT', width: '10rem' },
      { field: 'transformedDob', header: 'Ngày sinh', width: '10rem' },
      { field: 'address', header: 'Địa chỉ', width: '22rem' },
      { field: 'patientCode', header: 'Mã BN', width: '10rem' },
      { field: 'syncStatus', header: 'Trạng thái', width: '10rem' },
      { field: 'registerDate', header: 'Ngày đăng kí', width: '10rem' },
    ]
    this.profileCols = [
      { header: 'Thông tin bệnh nhân', width: '50rem' },
      { header: 'Mã BN', width: '10rem' },
      { header: 'Số điện thoại', width: '10rem' },
      { header: 'Ca khám gần nhất', width: '20rem' },
      { header: '', width: '15rem' }
    ]
    this.sessionCols = [
      { field: 'visitDate', header: 'Thời gian khám', width: '12rem' },
      { field: 'reason', header: 'Lý do khám', width: '16rem' },
      { field: 'departmentName', header: 'Khoa, phòng', width: '12rem' },
      { field: 'diagnostic', header: 'Chẩn đoán', width: '20rem' },
      { field: 'conclusion', header: 'Kết luận', width: '12rem' }
    ]
    this.getAll();
  }
  getAll() {
    this.loading = true;
    this.customerService.getAll().subscribe({
      next: (res) => {
        if (res) {
          this.customers = res.customers.map((customer: any) => ({
            ...customer,
            genderName: customer.gender === 0 ? 'Nữ' : 'Nam',
            syncStatus: customer.isSync == true ? "Đã đồng bộ" : "Chưa đồng bộ",
            transformedDob: new DatePipe('en-US').transform(customer.dob, 'dd/MM/yyyy'),
            registerDate: new DatePipe('en-US').transform(customer.dateCreated, 'dd/MM/yyyy')
          }));
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage)
            })
          } else {
            this.notification.error('Lấy dữ liệu không thành công')
          }
        }
      }, complete: () => {
        this.loading = false;
      }
    }).add(() => {
      this.loading = false
    });
  }

  selectItem(customer: any) {
    if (customer) {
      this.selectedCustomer = customer;
      this.hisCode = customer.patientCode;
    }
    this.onShowProfile(this.selectedCustomer);
    this.showCard = false;
  }

  onShowProfile(customer: any) {
    this.isVisibleProfileDialog = true;
    this.selectedProfile = customer;
    this.loading = true;
    this.customerService.getMember(this.selectedProfile.userId).subscribe({
      next: (res) => {
        if (res) {
          this.members = res;
          this.members.forEach(t => t.isShow == false);
          this.members = this.members.sort((a, b) => {
            if (a.isPrimary && !b.isPrimary) {
              return -1;
            } else if (!a.isPrimary && b.isPrimary) {
              return 1;
            } else {
              return 0;
            }
          });
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage)
            })
          } else {
            this.notification.error('Lấy dữ liệu không thành công')
          }
        }
      }, complete: () => {
        this.loading = false;
      }
    })
  }

  showCustomerCard(customer: any) {
    this.selectedCustomer = customer;
    this.members.forEach(item => {
      if(item.id == customer.id){
        item.isShow = !item.isShow
      }
    })
  }

  syncProfile(member: any) {
    this.loading = true;
    this.customerService.getInfo(member.patientCode).subscribe({
      next: (res) => {
        if (res) {
          this.hisCode = member.patientCode;
          this.hisProfiles = res;
        } else {
          this.hisProfiles = []
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage)
            })
          } else {
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

  unSyncProfile() {
    let id = this.unSyncItem.id;
    this.customerService.unSync(id).subscribe({
      next: (res) => {
        if (res) {
          this.selectedProfile.isSync = false;
          this.hisCode = null;
          this.isVisibleConfirmDialog = false;
          this.members.forEach(item => {
            if(item.id == id){
              item.isSync = false;
              item.patientCode = '';
            }
          })
          this.search();
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage)
            })
          } else {
            this.notification.error('Lấy dữ liệu không thành công')
          }
        }
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  updateProfile(profile: any) {
    this.customerService.sync(this.hisCode, this.selectedProfile.id).subscribe({
      next: (res) => {
        this.loading = true;
        if (res.ret[0].code === 200) {
          this.notification.success("Đồng bộ hồ sơ thành công");
          this.selectedCustomer = profile;

          this.members.forEach(item => {
            if(item.id == this.selectedProfile.id){
              item.isSync = true;
              item.patientCode = this.hisCode;
            }
          })

          this.selectedProfile.isSync = true;
          this.search();
          this.customerService.getSession(this.selectedProfile.id).subscribe({
            next: (res) => {
              if (res) {
                this.sessionLength.set(this.selectedProfile.id, res.length);
              }
            }
          })
        } else if (res.ret[0].code === 400) {
          this.notification.warn(res.ret[0].message);
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage)
            })
          } else {
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

  showSession() {
    this.loading = true;
    this.customerService.getSession(this.selectedProfile.id).subscribe({
      next: (res) => {
        if (res) {
          this.sessions = res;
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage)
            })
          } else {
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
      next: (res) => {
        if (res) {
          this.customers = res.customers.map((customer: any) => ({
            ...customer,
            genderName: customer.gender === 0 ? 'Nữ' : 'Nam',
            syncStatus: customer.isSync == true ? "Đã đồng bộ" : "Chưa đồng bộ",
            transformedDob: new DatePipe('en-US').transform(customer.dob, 'dd/MM/yyyy'),
            registerDate: new DatePipe('en-US').transform(customer.dateCreated, 'dd/MM/yyyy')
          }));
          this.total = res.total;
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage)
            })
          } else {
            this.notification.error('Tìm kiếm khách hàng không thành công')
          }
        }
      }, complete: () => {
        this.loading = false;
      }
    })
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

  confirmUnSync(member: any){
    this.unSyncItem = member;
    this.isVisibleConfirmDialog = true;
    this.textConfirm = "Bạn bỏ hủy đồng bộ bệnh nhân có mã " + member.patientCode;
  }
}
