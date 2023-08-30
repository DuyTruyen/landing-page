import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { VisitTimeService } from 'src/app/services/visit-time.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';
import { NoWhitespaceValidator } from 'src/app/shared/validators/no-whitespace.validator';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-visit-time',
  templateUrl: './visit-time.component.html',
  styleUrls: ['./visit-time.component.scss'],
})
export class VisitTimeComponent implements OnInit {
  _isVisibleVisitTimeDialog = false;
  set isVisibleVisitTimeDialog(value: boolean) {
    this._isVisibleVisitTimeDialog = value;
    if (!value) {
      this.visitTimeForm.markAsPristine();
    }
  }
  get isVisibleVisitTimeDialog() {
    return this._isVisibleVisitTimeDialog;
  }

  cols: any[] = [];
  // visitTime:any=[];
  visitTimeDialogHeader = '';
  loading = false;
  visitTimeForm: FormGroup;
  visitTimes: any = [];
  isEditVisitTime = false;
  isVisibleDeleteItemDialog = false;
  textConfirmDelete = '';
  deletedItem: any = {};
  session = Constants.SESSION;
  total: number = 0;

  searchData = {
    skip: 0,
    take: 40,
    keyword: '',
    disabled: '',
    session: '',
  };

  // Breakcrum Page source-hospital
  breadcrumbItem: MenuItem[];
  breadcrumbHome: MenuItem;

  constructor(private fb: FormBuilder, private notification: NotificationService, private visitTimeService: VisitTimeService, private datePipe: DatePipe) {
    this.visitTimeForm = this.fb.group({
      id: [null],
      name: [new Date(), [Validators.required]],
      session: [null, [Validators.required]],
      enable: [true],
    });

    // Breakcrum Page source-hospital
    this.breadcrumbItem = [{ label: 'Quản lý danh mục' }, { label: 'Khung giờ khám' }];

    this.breadcrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/admin/admin-dashboard',
    };
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'Khung giờ', isOpSort: true, iconSort: 0, width: '40rem' },
      { field: 'session', header: 'Buổi', isOpSort: true, iconSort: 0, width: '40rem' },
      { field: 'disabled', header: 'Trạng thái', isOpSort: true, iconSort: 0, width: '10rem' },
    ];
    this.getAll();
  }

  getAll() {
    this.loading = true;
    this.visitTimeService
      .getAll(this.searchData)
      .subscribe({
        next: (res: any) => {
          this.visitTimes = res.data;
          this.total = res.total;
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  onCreatItem() {
    this.visitTimeForm.reset();
    this.visitTimeForm.patchValue({
      id: 0,
      name: new Date(),
      session: 1,
      enable: true,
    });
    this.isVisibleVisitTimeDialog = true;
    this.isEditVisitTime = false;
    this.visitTimeDialogHeader = 'Thêm mới khung giờ khám';
  }

  saveItem() {
    if (this.visitTimeForm.valid) {
      if (!this.isEditVisitTime) {
        this.createVisitTime();
      } else {
        this.updateVisitTime();
      }
    } else {
      Object.values(this.visitTimeForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  createVisitTime() {
    let value = this.visitTimeForm.value;
    value.disabled = !value.enable;
    this.visitTimeService.create(this.visitTimeForm.value).subscribe({
      next: (res: any) => {
        this.notification.success('Thêm mới thành công', '');
        this.isVisibleVisitTimeDialog = false;
        this.getAll();
      },
    });
  }

  updateVisitTime() {
    let value = this.visitTimeForm.value;
    value.disabled = !value.enable;
    this.visitTimeService.update(this.visitTimeForm.value.id, this.visitTimeForm.value).subscribe({
      next: (res: any) => {
        this.notification.success('Cập nhật thành công', '');
        this.isVisibleVisitTimeDialog = false;
        this.getAll();
      },
    });
  }

  onEditItem(item: any) {
    this.visitTimeForm.reset();
    this.visitTimeForm.patchValue({
      id: item.id,
      name: new Date(item.name),
      session: item.session,
      enable: !item.disabled,
    });
    this.isVisibleVisitTimeDialog = true;
    this.isEditVisitTime = true;
    this.visitTimeDialogHeader = 'Sửa thông tin khung giờ khám';
  }

  onDeleteItem(item: any) {
    this.deletedItem = item;
    const dateTime = new Date(item.name);
    const formattedTime = this.datePipe.transform(dateTime, 'HH:mm') || '';
    this.textConfirmDelete = `Xác nhận xóa khung giờ khám <b>${formattedTime}</b> ?`;
    this.isVisibleDeleteItemDialog = true;
  }

  deleteVisitTime() {
    this.visitTimeService.deleteById(this.deletedItem.id).subscribe({
      next: (res: any) => {
        this.notification.success('Xóa khung giờ khám thành công', '');
        this.isVisibleDeleteItemDialog = false;
        this.getAll();
      },
    });
  }

  search() {
    this.loading = true;
    this.visitTimeService
      .getAll(this.searchData)
      .subscribe({
        next: (res: any) => {
          this.visitTimes = res.data;
          this.total = res.total;
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
      session: '',
      disabled: '',
    };
    this.search();
  }
}
