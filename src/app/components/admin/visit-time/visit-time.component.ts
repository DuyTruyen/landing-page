import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { VisitTimeService } from 'src/app/services/visit-time.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { NoWhitespaceValidator } from 'src/app/shared/validators/no-whitespace.validator';

@Component({
  selector: 'app-visit-time',
  templateUrl: './visit-time.component.html',
  styleUrls: ['./visit-time.component.scss'],
})
export class VisitTimeComponent implements OnInit {
  _isVisibleSourceHospitalDialog = false;
  set isVisibleSourceHospitalDialog(value: boolean) {
    this._isVisibleSourceHospitalDialog = value;
    if (!value) {
      this.sourceHospitalForm.markAsPristine();
    }
  }
  get isVisibleSourceHospitalDialog() {
    return this._isVisibleSourceHospitalDialog;
  }

  cols: any[] = [];
  // sourceHospital:any=[];
  sourceHospitalDialogHeader = '';
  loading = false;
  sourceHospitalForm: FormGroup;
  sourceHospitals: any = [];
  isEditSourceHospital = false;
  isVisibleDeleteItemDialog = false;
  textConfirmDelete = '';
  deletedItem: any = {};
  searchData = {
    skip: 0,
    take: 40,
    keyword: '',
  };

  // Breakcrum Page source-hospital
  breadcrumbItem: MenuItem[];
  breadcrumbHome: MenuItem;

  constructor(private fb: FormBuilder, private notification: NotificationService, private visitTimeService: VisitTimeService) {
    this.sourceHospitalForm = this.fb.group({
      id: [null],
      name: [null, Validators.compose([Validators.required, NoWhitespaceValidator()])],
      address: [null],
      phoneNo: [null],
    });

    // Breakcrum Page source-hospital
    this.breadcrumbItem = [{ label: 'Quản lý danh mục' }, { label: 'Nơi gửi mẫu' }];

    this.breadcrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/admin/admin-dashboard',
    };
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'Id', isOpSort: false, iconSort: 0, width: '16rem' },
      { field: 'name', header: 'Nơi gửi mẫu', isOpSort: true, iconSort: 0, width: '32.7rem' },
      { field: 'address', header: 'Địa chỉ', isOpSort: true, iconSort: 0, width: '34rem' },
      { field: 'phoneNo', header: 'Số điện thoại', isOpSort: true, iconSort: 0, width: '16rem' },
    ];
    this.getAll();
  }
  getAll() {
    this.loading = true;
    this.visitTimeService
      .getAll()
      .subscribe({
        next: (res : any) => {
          if (res.isValid) {
            this.sourceHospitals = res.jsonData;
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notification.error(el.errorMessage);
              });
            } else {
              this.notification.error('Lấy dữ liệu nơi giửi mẫu không thành công');
            }
          }
        },
      })
      .add(() => {
        this.loading = false;
      });
  }
  onCreatItem() {
    this.sourceHospitalForm.reset();
    this.sourceHospitalForm.patchValue({
      id: 0,
      name: '',
      address: '',
      phoneNo: '',
    });
    this.isVisibleSourceHospitalDialog = true;
    this.isEditSourceHospital = false;
    this.sourceHospitalDialogHeader = 'Thêm mới nơi gửi mẫu';
  }
  saveItem() {
    if (this.sourceHospitalForm.valid) {
      if (!this.isEditSourceHospital) {
        this.createSourceHospital();
      } else {
        this.updateSourceHospital();
      }
    } else {
      Object.values(this.sourceHospitalForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  createSourceHospital() {
    this.visitTimeService.create(this.sourceHospitalForm.value).subscribe({
      next: (res : any) => {
        if (res.isValid) {
          this.notification.success('Thêm mới thành công', '');
          this.isVisibleSourceHospitalDialog = false;
          this.getAll();
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage);
            });
          } else {
            this.notification.error('Thêm mới nơi giửi mẫu không thành công');
          }
        }
      },
    });
  }
  selectSourceHospital(sourceHospital: any) {
    this.selectSourceHospital = sourceHospital;
  }
  updateSourceHospital() {
    this.visitTimeService.update(this.sourceHospitalForm.value.id, this.sourceHospitalForm.value).subscribe({
      next: (res : any) => {
        if (res.isValid) {
          this.notification.success('Cập nhật thành công', '');
          this.isVisibleSourceHospitalDialog = false;
          this.getAll();
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage);
            });
          } else {
            this.notification.error('Cập nhật nơi giửi mẫu không thành công');
          }
        }
      },
    });
  }
  onEditItem(item: any) {
    this.sourceHospitalForm.reset();
    this.sourceHospitalForm.patchValue({
      id: item.id,
      name: item.name,
      address: item.address,
      phoneNo: item.phoneNo,
    });
    this.isVisibleSourceHospitalDialog = true;
    this.isEditSourceHospital = true;
    this.sourceHospitalDialogHeader = 'Sửa thông tin nơi gửi mẫu';
  }
  onDeleteItem(item: any) {
    this.deletedItem = item;
    this.textConfirmDelete = `Xác nhận xóa nơi gửi mẫu <b>${item.name}</b>?`;
    this.isVisibleDeleteItemDialog = true;
  }
  onSearch(data: any) {
    this.loading = true;
    this.visitTimeService
      .search(data)
      .subscribe({
        next: (res: any) => {
          if (res.isValid) {
            // this.ObservationTypes = res.jsonData.data;
            this.sourceHospitals = res.jsonData.data;
            // //console.log('this.ObservationTypes ',this.ObservationTypes );
            // this.ObservationTypes.forEach((u:any) => (u.enable = !u.disable));
            // this.total = res.jsonData.total;
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notification.error(el.errorMessage);
              });
            } else {
              this.notification.error('Tìm kiểu nơi giửi mẫu không thành công');
            }
          }
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  deleteSourceHospital() {
    this.visitTimeService.deleteById(this.deletedItem.id).subscribe({
      next: (res : any) => {
        if (res.isValid) {
          this.notification.success('Xóa nơi gửi mẫu thành công', '');
          this.isVisibleDeleteItemDialog = false;
          this.getAll();
        } else {
          if (res.errors && res.errors.length > 0) {
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage);
            });
          } else {
            this.notification.error('Xóa nơi giửi mẫu không thành công');
          }
        }
      },
    });
  }
  search() {
    this.loading = true;
    this.visitTimeService
      .search(this.searchData)
      .subscribe({
        next: (res : any) => {
          if (res.isValid) {
            this.sourceHospitals = res.jsonData.data;
            // this.sourceHospitals.forEach((u:any) => (u.enable = !u.disable));
            // this.total = res.jsonData.total;
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notification.error(el.errorMessage);
              });
            } else {
              this.notification.error('Tìm kiểu nơi giửi mẫu không thành công');
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

  // Luật sắp xếp
  customSort(col: any) {
    var dataField = col.field;
    // //console.log(dataField);
    dataField = dataField.charAt(0).toUpperCase() + dataField.slice(1);
    // //console.log(dataField);
    // //console.log('col.isOpSort: '  + col.isOpSort);
    // Chuyển trạng thái Icon
    this.resetIconDefaultRest(col);

    // Chuyển trạng thái Icon kế tiếp
    col.iconSort++;
    col.iconSort = col.iconSort % 3;
    if (col.isOpSort) {
      // //console.log('col.isOpSort: '  + col.isOpSort);
      this.onSearch({
        take: 40,
        skip: 0,
        keyword: '',
        sortField: dataField,
        sortDir: this.getOpSort(col),
      });
    }
  }

  getOpSort(col: any) {
    var opSort = '';
    switch (col.iconSort) {
      case 0:
        opSort = '';
        break;
      case 1:
        opSort = 'asc';
        break;
      case 2:
        opSort = 'dsc';
        break;
    }
    return opSort;
  }

  resetIconDefaultRest(col: any) {
    // const index = this.todoList.indexOf(item);
    // this.todoList[index] = { ...item, ...changes };
    const index = this.cols.indexOf(col);
    for (let colRe of this.cols) {
      let indexRe = this.cols.indexOf(colRe);
      if (indexRe !== index) {
        colRe.iconSort = 0;
      }
    }
  }
}
