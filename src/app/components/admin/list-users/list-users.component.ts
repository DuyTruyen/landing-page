import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/shared/notification.service';
import { Constants } from 'src/app/shared/constants/constants';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';

import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit {
  _isVisibleUserDialog = false;
  set isVisibleUserDialog(value: boolean) {
    this._isVisibleUserDialog = value;
    if (!value) {
      this.usersForm.markAsPristine();
    }
  }
  get isVisibleUserDialog() {
    return this._isVisibleUserDialog;
  }
  _isVisibleUserEdit = false;
  set isVisibleUserEdit(value: boolean) {
    this._isVisibleUserEdit = value;
    if (!value) {
      this.usersForm.markAsPristine();
    }
  }
  get isVisibleUserEdit() {
    return this._isVisibleUserEdit;
  }


  // Title Danh sách User
  breadcrumbItem: MenuItem[];
  breadcrumbHome: MenuItem;

  isEditUser = false;
  isVisibleDisableUserDialog = false;
  isVisibleEnableUserDialog = false;
  textConfirmDisableUser = '';
  textConfirmEnableUser = '';
  disableItem: any = {};
  userDialogHeader = '';
  searchData = {
    skip: 0,
    take: 40,
    keyword: '',
  };
  loading = false;
  total = 0;
  users: any = [];
  cols: any[] = [];
  selectedUser: any = {};
  usersForm: FormGroup;
  usersFormEdit: FormGroup;
  confirmLabelDisable = "";
  confirmLabelEnable = "";
  isVisibleListGroups = false;
  currentUser:any = {};
  _isVisibleAddAccountDialog = false;
  set isVisibleAddAccountDialog(value: boolean) {
    this._isVisibleAddAccountDialog = value;
    if (!value) {
      this.accountForm.markAsPristine();
    }
  }
  get isVisibleAddAccountDialog() {
    return this._isVisibleAddAccountDialog;
  }
  accountForm: FormGroup;
  disabledUserId = '';

  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private userService: UserService
  ) {
    this.usersForm = this.fb.group({
      id: [null],
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phoneNo: [null],
      username: [null, [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      repeatPassword: [null, [Validators.required, this.confirmationValidator]],
    });
    this.usersFormEdit = this.fb.group({
      id: [null],
      fullname: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phoneNo: [null],
      username: [null, [Validators.required]],
    //   password: [null, [Validators.required]],
    //   disable: [null],
    //   enable: [null],
    //   hisCode: [null],
    });
    this.accountForm = this.fb.group({
      username: [null, [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)]],
    });

    // Danh sách title
    this.breadcrumbItem = [
        { label: 'Quản lý user' },
        { label: 'Danh sách user' },
    ];

    this.breadcrumbHome = {
        icon: 'pi pi-home',
        routerLink: '/admin/admin-dashboard',
    };
  }

  usernameErrorMessage(form: FormGroup): string{
      const usernameControl = form.get('username');
      if(usernameControl && usernameControl.invalid && usernameControl.touched){
          if (usernameControl.hasError('required')) {
              return '*Tên đăng nhập không được để trống';
          }
          if (usernameControl.hasError('pattern')) {
              return '*Tên đăng nhập không được sử dụng kí tự đặc biệt';
          }
      }
      return '';
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.usersForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };

    ngOnInit(): void {
    this.cols = [
      { field: 'fullname', header: 'Họ và tên', isOpSort: true, iconSort : 0, width: '15rem' },
      { field: 'username', header: 'Tài khoản', isOpSort: true, iconSort : 0, width: '25rem' },
      { field: 'phoneNo', header: 'SĐT', isOpSort: true, iconSort : 0, width: '15rem' },
      { field: 'email', header: 'Email', isOpSort: true, iconSort : 0, width: '25rem' },
    ];
    this.search();
  }

  search() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (res) => {
        this.users = res
        // if (res.isValid) {
        //   this.users = res
        //   console.log(this.users);
        //   this.users.forEach((u: any) => (u.enable = !u.disable));
        //   this.total = res.jsonData.total;
        // }else{
        //     if(res.errors && res.errors.length > 0){
        //         res.errors.forEach((el: any) => {
        //             this.notification.error(el.errorMessage)
        //         })
        //     }else{
        //         this.notification.error('Tìm kiếm không thành công')
        //     }
        // }
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
  }

  onCreatUser() {
    this.usersForm.patchValue({
      id: 0,
      fullName: '',
      email: '',
      phoneNo: '',
      username: '',
      password: '',
      repass: '',
      hisCode: '',
    });
    this.isVisibleUserDialog = true;
    this.isEditUser = false;
    this.userDialogHeader = 'Thêm tài khoản mới';
  }

  onCreateAccount() {
    this.accountForm.patchValue({
      username: ''
    });
    this.isVisibleAddAccountDialog = true;
    this.isEditUser = false;
  }

  onEditUser(item: any) {
    this.currentUser = item;
    this.usersFormEdit.patchValue({
      id: item.id,
      fullname: item.fullname,
      email: item.email,
      phoneNo: item.phoneNo,
      username: item.username,
    //   password: '********',
    //   hisCode: item.hisCode
    });
    this.isVisibleUserEdit = true;
    this.isEditUser = true;
    this.userDialogHeader = 'Sửa thông tin tài khoản';
  }

  saveItem() {
    if (this.usersForm.valid && !this.isEditUser) {
      this.createUser();
    } else {
      Object.values(this.usersForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  saveAccount() {
    if (this.accountForm.valid && !this.isEditUser) {
      this.createAccount();
    } else {
      Object.values(this.accountForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  saveItemEdit() {
    if (this.usersFormEdit.valid && this.isEditUser) {
      this.updateUser();
    } else {
      Object.values(this.usersFormEdit.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  createUser() {
    const formValue = this.usersForm.value;
    const payload = {
      username: formValue.username,
      fullName: formValue.fullName,
      password: formValue.password,
      email: formValue.email,
      phoneNo: formValue.phoneNo,
      repeatPassword: formValue.repeatPassword,
    };
    this.userService.create(payload).subscribe({
      next: (res) => {
          this.notification.success('Thêm mới user thành công', '');
          this.isVisibleUserDialog = false;
          this.search();
        // if (res.isValid) {
        // }else{
        //     if(res.errors && res.errors.length > 0){
        //         res.errors.forEach((el: any) => {
        //             this.notification.error(el.errorMessage)
        //         })
        //     }else{
        //         this.notification.error('Thêm mới user không thành công')
        //     }
        // }
      },
      error: ()=>{
        this.notification.error('Thêm mới user không thành công')
      }
    });
  }

  createAccount() {
    const formValue = this.accountForm.value;
    const payload = {
      username: formValue.username,
    };
    this.userService.addUsername(payload).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Thêm thành công', '');
          this.isVisibleDisableUserDialog = false;
          this.search();
        }else{
            if(res.errors && res.errors.length > 0){
                res.errors.forEach((el: any) => {
                    this.notification.error(el.errorMessage)
                })
            }else{
                this.notification.error('Thêm mới tài khoản không thành công')
            }
        }
      }
    });
  }

  updateUser() {
    const formEditValue = this.usersFormEdit.value;
    const payloadEdit = {
      id: formEditValue.id,
      fullname: formEditValue.fullname,
      email: formEditValue.email,
      phoneNo: formEditValue.phoneNo,
      username: formEditValue.username,
      role : this.currentUser.userRoles?.map((el:any)=>el.roleId),
    //   password: formEditValue.password,
    //   hisCode: formEditValue.hisCode,
    };
    this.userService.update(formEditValue.id, payloadEdit).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Cập nhật user thành công', '');
          this.isVisibleUserEdit = false;
          this.search();
        }else{
            if(res.errors && res.errors.length > 0){
                res.errors.forEach((el: any) => {
                    this.notification.error(el.errorMessage)
                })
            }else{
                this.notification.error('Cập nhật user không thành công')
            }
        }
      }
    });
  }

  onChangeEnable(item: any) {
    if (!item.enable) {
      this.disabledUserId = item.id;
      this.textConfirmDisableUser = `Xác nhận Disable tài khoản <b>${item.username} - ${item.fullname}</b>?`;
      this.confirmLabelDisable = "Disable";
      this.isVisibleDisableUserDialog = true;
    }
    else {
      this.disabledUserId = item.id;
      this.textConfirmEnableUser = `Xác nhận Enable tài khoản <b>${item.username} - ${item.fullname}</b>?`;
      this.confirmLabelEnable = "Enable";
      this.isVisibleEnableUserDialog = true;
    }
  }
  onSearch(data:any){
    this.loading = true;
    this.userService.getUsers(data).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.users = res.jsonData.data;
          console.log(this.users);
          this.users.forEach((u: any) => (u.enable = !u.disable));
          this.total = res.jsonData.total;
        }else{
            if(res.errors && res.errors.length > 0){
                res.errors.forEach((el: any) => {
                    this.notification.error(el.errorMessage)
                })
            }else{
                this.notification.error('Tìm kiếm không thành công')
            }
        }
      },
    }).add(() => {
        this.loading = false;
      });
  }

  disableUser() {
    this.userService.updateDisable(this.disabledUserId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Disable User thành công', '');
          this.isVisibleDisableUserDialog = false;
          this.search();
        } else {
            if(res.errors && res.errors.length > 0){
                res.errors.forEach((el: any) => {
                    this.notification.error(el.errorMessage)
                })
            }else{
                this.notification.error('Disable User không thành công')
            }
        }
      }
    });
  }

  cancelDisable() {
    this.search();
  }

  enableUser() {
    this.userService.updateDisable(this.disabledUserId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Enable User thành công', '');
          this.isVisibleEnableUserDialog = false;
          this.search();
        }else{
            if(res.errors && res.errors.length > 0){
                res.errors.forEach((el: any) => {
                    this.notification.error(el.errorMessage)
                })
            }else{
                this.notification.error('Enable User không thành công')
            }
        }
      }
    });
  }

  cancelEnable() {
    this.search();
  }

  selectUser(user: any) {
      this.selectedUser = user;
  }

  openListGroups() {
    this.isVisibleListGroups = true;
  }


    // Luật sắp xếp
    customSort(col: any) {
        return
        var dataField = col.field;
        // console.log(dataField);
        dataField = dataField.charAt(0).toUpperCase() + dataField.slice(1);
        // console.log(dataField);
        // console.log('col.isOpSort: '  + col.isOpSort);
        // Chuyển trạng thái Icon
        this.resetIconDefaultRest(col);

        // Chuyển trạng thái Icon kế tiếp
        col.iconSort ++;
        col.iconSort  = col.iconSort  % 3;
        if (col.isOpSort) {
            // console.log('col.isOpSort: '  + col.isOpSort);
            this.onSearch({
                    take: 40,
                    skip: 0,
                    keyword: '',
                    sortField: dataField,
                    sortDir: this.getOpSort(col)
                }
            );
        }
      }
      getOpSort(col:any){
        var opSort =  '';
        switch(col.iconSort ){
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

      resetIconDefaultRest(col: any){
        // const index = this.todoList.indexOf(item);
        // this.todoList[index] = { ...item, ...changes };
        const index = this.cols.indexOf(col);
        for (let colRe of this.cols){
            let indexRe = this.cols.indexOf(colRe);
            if(indexRe !== index){
                colRe.iconSort =  0;
            }
        }
      }
}
