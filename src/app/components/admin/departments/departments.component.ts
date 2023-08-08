import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import {DepartmentService} from 'src/app/services/department.service'
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {
  _isVisibleDepartmentDialog = false;
  set isVisibleDepartmentDialog(value:boolean){
    this._isVisibleDepartmentDialog = value;
    if(!value){
      this.departmentForm.markAsPristine();
    }
  }
  get isVisibleDepartmentDialog(){
    return this._isVisibleDepartmentDialog;
  }
  cols:any[] = [];
  departments:any[] = [];
  breadcrumbItem: MenuItem[];
  breadcrumbHome: MenuItem;
  loading = false;
  checked = false;
  total = 0;
  departmentForm: FormGroup;
  departmentHeaderDialog = '';
  textConfirmDelete = '';
  isVisibleDeleteItemDialog = false;
  deletedItem:any = {};
  selectedDepartment = {};
  isEditDepartment = false;
  searchData = {
    skip: 0,
    take: 40,
    keyword: '',
  };
  constructor(
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private notification: NotificationService,
  ){
    this.departmentForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.pattern(/\S/)]],
      description: [null],
      status: [null],
    });
    this.breadcrumbItem = [
      { label: 'Quản lý chuyên khoa' },
      { label: 'Danh sách chuyên khoa ' },
    ];
    this.breadcrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/admin/admin-dashboard',
    };
  }
  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'Tên chuyên khoa', isOpSort: true, iconSort : 0, width: '24rem' },
      { field: 'description', header: 'Mô tả', isOpSort: true, iconSort : 0, width: '52rem' },
      { field: 'status', header: 'Trạng thái',  width: '6rem' }
    ];
    this.getAll();
  }
  getAll(){
    this.loading = true;
    this.departmentService.getAll().subscribe({
      next:(res) => {
        if(res){
          this.departments = res.data;
          this.total = res.total;
        }else{
          if(res.errors && res.errors.length > 0){
            res.errors.forEach((el: any) => {
              this.notification.error(el.message);
            })
          }else{
            this.notification.error("Lấy dữ liệu không thành công");
          }
        }
      }
    })
    .add(() =>{
      this.loading = false;
    });
  }
  selectItem(department: any){
    this.selectedDepartment = department;
    this.onEditItem(department);
  }
  saveItem(){
    if(this.departmentForm.valid){
    if(!this.isEditDepartment){
      this.createDepartment();
    }else{
      this.updateDepartment();
    }
    }else{
       Object.values(this.departmentForm.controls).forEach((control) => {
        if(control.invalid){
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf : true});
          }
        });
      }
  }
  onCreateItem(){
    this.departmentForm.reset();
    this.departmentForm.patchValue({
      id: 0,
      name: '',
      description: '',
      status: null,
    });
    this.isVisibleDepartmentDialog = true;
    this.departmentHeaderDialog = "Thêm mới chuyên khoa";
  }
  createDepartment(){
    this.departmentService.create(this.departmentForm.value).subscribe({
      next:(res) => {
        if(res) {
          this.notification.success('Thêm mới thành công','');
          this.isVisibleDepartmentDialog = false;
          this.search();
        }else{
          if(res.errors && res.errors.length > 0){
            res.errors.forEach((el:any) => {
              this.notification.error(el.errorMessage);
            });
          }else{
            this.notification.error('Thêm mới không thành công');
          }
        }
      }
    });
  }
  onEditItem(item:any){
    this.departmentForm.reset();
    this.departmentForm.patchValue({
      id: item.id,
      name: item.name,
      description: item.description,
      status: item.status,
    })
    this.checked = item.status;
    this.isVisibleDepartmentDialog = true;
    this.isEditDepartment = true;
    this.departmentHeaderDialog = "Sửa thông tin chuyên khoa";
  }
  updateDepartment(){
    this.departmentService.update(this.departmentForm.value.id,this.departmentForm.value).subscribe({
      next:(res) => {
        if(res){
          this.notification.success('Cập nhật thành công');
          this.isVisibleDepartmentDialog = false;
          this.search();
        }else{
          if(res.errors && res.errors.length > 0){
            res.errors.forEach((el:any) => {
              this.notification.error(el.errorMessage);
            });
          }else{
            this.notification.error('Cập nhật không thành công');
          }
        }
      }
    });
  }
  onDeleteItem(item:any){
    this.deletedItem = item;
    this.isVisibleDeleteItemDialog = true;
    this.textConfirmDelete = `Xác nhận xoá chuyên khoa <b>${item.name}</b>`
  }
  deleteDepartment(){
    this.departmentService.deleteById(this.deletedItem.id).subscribe({
      next:(res) => {
        if(res){
          this.notification.success('Xoá chuyên khoa thành công');
          this.isVisibleDeleteItemDialog = false;
          this.search();
        }else{
          if(res.errors && res.errors.length > 0){
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage)
            })
          }else{
            this.notification.error('Xóa chuyên khoa không thành công')
          }
        }
      }
    });
  }
  onSearch(searchData: any) {
    this.loading = true;
    this.departmentService.search(searchData).subscribe({
      next:(res) => {
        if(res){
          this.departments = res.data;
        }else{
          if(res.errors && res.errors.length > 0){
            res.errors.forEach((el: any) => {
              this.notification.error(el.errorMessage)
            });
          }else{
            this.notification.error('Tìm kiếm bác sĩ không thành công')
          }
        }
      }
    })
    .add(() => {
        this.loading = false;
    });
  }
 search() {
  this.loading = true;
  this.departmentService.search(this.searchData).subscribe({
    next:(res) => {
      if(res){
        this.departments = res.data;
        this.total = res.total;
      }else{
        if( res.errors && res.errors.length > 0){
          res.errors.forEach((el: any) => {
            this.notification.error(el.errorMessage)
          })
        }else{
          this.notification.error('Tìm kiếm bác sĩ không thành công')
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
  onPageChange(data: any) {
    this.searchData.skip = data.first;
    this.searchData.take = data.rows;
    this.search();
    console.log(data);
  }
}

