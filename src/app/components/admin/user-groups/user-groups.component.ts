import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserGroupService } from 'src/app/services/user-group.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss'],
})
export class UserGroupsComponent implements OnInit {
  _isVisibleUserGroupDialog = false;
  // Title Danh sách Group
  breadcrumbItem: MenuItem[];
  home: MenuItem;
  isEnableUserGroupButton = false;

  set isVisibleUserGroupDialog(value: boolean) {
    this._isVisibleUserGroupDialog = value;
    if (!value) {
      this.userGroupForm.markAsPristine();
    }
  }
  get isVisibleUserGroupDialog() {
    return this._isVisibleUserGroupDialog;
  }
  isVisibleDeleteItemDialog = false;
  textConfirmDelete = '';
  isVisibleListUsers = false;
  userGroups: any = [];
  cols: any[] = [];
  selectedUserGroup: any = {};
  userGroupDialogHeader = '';
  isEditUserGroup = false;
  userGroupForm: FormGroup;
  deletedItem: any = {};
  searchData = {
    skip: 0,
    take: Constants.TABLE_PARAM.PAGE_SIZE,
    keyword: '',
  };
  loading = false;
  total = 0;
  constructor(private fb: FormBuilder, private notification: NotificationService, private userGroupService: UserGroupService) {
    this.userGroupForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required]],
      description: [null],
    });

    // Title Danh sách group
    this.breadcrumbItem = [{ label: 'Quản lý group' }, { label: 'Danh sách group' }];

    this.home = {
      icon: 'pi pi-home',
      routerLink: '/admin/admin-dashboard',
    };
  }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Tên nhóm', isOpSort: true, iconSort: 0, width: '30rem' },
      { field: 'description', header: 'Mô tả', isOpSort: false, iconSort: 0, width: '68rem' },
    ];
    this.search();
  }

  search() {
    this.loading = true;
    this.userGroupService
      .getAll()
      .subscribe({
        next: (res) => {
          this.userGroups = res;
          // if (res.isValid) {
          //   this.userGroups = res.jsonData.data;
          //   this.total = res.jsonData.total;
          //   //   console.log(this.userGroups);
          // } else {
          //     if(res.errors && res.errors.length > 0){
          //         res.errors.forEach((el: any) => {
          //             this.notification.error(el.errorMessage)
          //         })
          //     }else{
          //         this.notification.error('Không tìm kiếm được dữ liệu')
          //     }
          // }
        },
        error: () => {
          this.notification.error('Không tải được group');
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  onCreateItem() {
    this.userGroupForm.patchValue({
      id: 0,
      name: '',
      description: '',
    });
    this.isVisibleUserGroupDialog = true;
    this.isEditUserGroup = false;
    this.userGroupDialogHeader = 'Thêm mới group';
  }

  onEditItem(item: any) {
    this.userGroupForm.patchValue({
      id: item.id,
      name: item.name,
      description: item.description,
    });
    this.isVisibleUserGroupDialog = true;
    this.isEditUserGroup = true;
    this.userGroupDialogHeader = 'Sửa thông tin group';
  }

  onDeleteItem(item: any) {
    this.textConfirmDelete = `Xác nhận xóa group <b>${item.name}</b>?`;
    this.deletedItem = item;
    this.isVisibleDeleteItemDialog = true;
  }

  onPageChange(data: any) {
    this.searchData.skip = data.first;
    this.searchData.take = data.rows;
    this.search();
  }
  onSearch(data: any) {
    this.loading = true;
    this.userGroupService
      .search(data)
      .subscribe({
        next: (res) => {
          if (res.isValid) {
            this.userGroups = res.jsonData.data;
            this.total = res.jsonData.total;
            console.log(this.userGroups);
          } else {
            if (res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                this.notification.error(el.errorMessage);
              });
            } else {
              this.notification.error('Không tìm kiếm được nhóm');
            }
          }
        },
      })
      .add(() => {
        this.loading = false;
      });
  }

  selectUserGroup(userGroup: any) {
    if (userGroup != null) {
      this.selectedUserGroup = userGroup;
      this.isEnableUserGroupButton = true;
    } else {
      this.isEnableUserGroupButton = false;
    }
    console.log('userGroup:', userGroup);
  }

  saveItem() {
    if (this.userGroupForm.valid) {
      if (!this.isEditUserGroup) {
        this.createUserGroup();
      } else {
        this.updateUserGroup();
      }
    } else {
      Object.values(this.userGroupForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  openUseInGroup() {
    this.isVisibleListUsers = true;
  }
  updateUserGroup() {
    this.userGroupService.update(this.userGroupForm.value.id, this.userGroupForm.value).subscribe({
      next: (res) => {
        this.notification.success('Cập nhật thành công', '');
        this.isVisibleUserGroupDialog = false;
        this.search();
        // if (res.isValid) {
        //   this.notification.success('Cập nhật thành công', '');
        //   this.isVisibleUserGroupDialog = false;
        //   this.search();
        // } else {
        //     if(res.errors && res.errors.length > 0){
        //         res.errors.forEach((el: any) => {
        //             this.notification.error(el.errorMessage)
        //         })
        //     }else{
        //         this.notification.error('Cập nhật nhóm không thành công')
        //     }
        // }
      },
      error: () => {
        this.notification.error('Thêm mới nhóm không thành công');
      },
    });
  }

  createUserGroup() {
    this.userGroupService.create(this.userGroupForm.value).subscribe({
      next: (res) => {
        this.notification.success('Thêm mới thành công', '');
        this.search();
        // if (res.isValid) {
        //   this.isVisibleUserGroupDialog = false;
        // } else {
        //     if(res.errors && res.errors.length > 0){
        //         res.errors.forEach((el: any) => {
        //             this.notification.error(el.errorMessage)
        //         })
        //     }else{
        //         this.notification.error('Thêm mới nhóm không thành công')
        //     }
        // }
      },
      error: () => {
        this.notification.error('Thêm mới nhóm không thành công');
      },
    });
  }

  deleteUserGroup() {
    this.userGroupService.deleteById(this.deletedItem.id).subscribe({
      next: (res) => {
        this.notification.success('Xóa group thành công', '');
        this.isVisibleDeleteItemDialog = false;
        this.search();
        // if (res.isValid) {
        // } else {
        //     if(res.errors && res.errors.length > 0){
        //         res.errors.forEach((el: any) => {
        //             this.notification.error(el.errorMessage)
        //         })
        //     }else{
        //         this.notification.error('Xóa group không thành công')
        //     }
        // }
      },
      error: () => {
        this.notification.error('Xóa group không thành công');
      },
    });
  }

  resetSearch() {
    this.searchData = {
      skip: 0,
      take: Constants.TABLE_PARAM.PAGE_SIZE,
      keyword: '',
    };
    this.search();
  }

  // Luật sắp xếp
  customSort(col: any) {
    var dataField = col.field;
    // console.log(dataField);
    dataField = dataField.charAt(0).toUpperCase() + dataField.slice(1);
    // console.log(dataField);
    // console.log('col.isOpSort: '  + col.isOpSort);
    // Chuyển trạng thái Icon
    this.resetIconDefaultRest(col);

    // Chuyển trạng thái Icon kế tiếp
    col.iconSort++;
    col.iconSort = col.iconSort % 3;
    if (col.isOpSort) {
      // console.log('col.isOpSort: '  + col.isOpSort);
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
