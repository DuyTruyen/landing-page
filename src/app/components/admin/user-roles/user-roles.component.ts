import { Component, OnInit } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { Roles } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';

import { MenuItem } from 'primeng/api';
import { error } from 'console';
@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {
  cols:any[] = [];
  searchData = {
    skip: 0,
    take: 40,
    keyword: ''
  };
  loading = false;
  total = 0;
  userRoles: any = [];
  roles: any = [];

//   Tile Xem phân quyền User
  breadcrumbItem: MenuItem[];
  breadcrumbHome: MenuItem;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private notification: NotificationService,
  ) {

    //   Tile Xem phân quyền User
    this.breadcrumbItem = [
        {label: 'Quản lý user'},
        {label: 'Xem phân quyền user'}
    ]

    this.breadcrumbHome= {
        icon: 'pi pi-home',
        routerLink: '/admin/admin-dashboard',
    }
   }

  ngOnInit(): void {
    this.cols = [
        {field:'id', header:'UserID', isOpSort: false, iconSort : 0, width:'15rem'},
        {field:'username', header:'Tài khoản', isOpSort: true, iconSort : 0, width:'12rem'},
        {field:'fullname', header:'Họ và tên', isOpSort: true, iconSort : 0, width:'12rem'},
    ]
    this.getRoles().then(r => this.searchUser());
  }

  getRoles() {
    return new Promise((resolve, reject) => {
      this.roleService.getAll().subscribe({
        next: (res) => {
            this.roles = res;
            // this.roles = res.jsonData.map((r: any) => r.name);
            resolve(true);
        //   if (res.isValid) {
        //   }else {
        //       if ( res.errors && res.errors.length > 0){
        //           res.errors.forEach((el: any) => {
        //               this.notification.error(el.errorMessage)
        //           })
        //       }else {
        //           this.notification.error('Không lấy được thông tin quyền của người dùng')
        //       }
        //   }
        },
        error:(err)=>{
            this.notification.error('Không lấy được thông tin quyền của người dùng')
        }
      },
     );
    })
  }
  searchUser() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (res) => {
        res.forEach((el:any)=>{
            el.userRolesProcess = el.userRoles.map((el:any)=>el.roleId);
        })
        this.userRoles = res;
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
    }).add(() => {
        this.loading = false
      });
  }
  search() {
    this.loading = true;
    this.userService.getUserRoles(this.searchData).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.userRoles = res.jsonData.data;
          this.total = res.jsonData.total;
        }else {
            if ( res.errors && res.errors.length > 0){
                res.errors.forEach((el: any) => {
                    this.notification.error(el.errorMessage)
                })
            }else {
                this.notification.error('Không lấy tìm kiếm được người dùng')
            }
        }
      }
    }).add(() => {
      this.loading = false
    });
  }

  resetSearch() {
    this.searchData = {
      skip: 0,
      take: 40,
      keyword: ''
    };
    this.search();
  }

  onPageChange(data: any) {
    this.searchData.skip = data.first;
    this.searchData.take = data.rows;
    this.search();
  }

  onSearch(data: any) {
    this.loading = true;
    this.userService.getUserRoles(data).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.userRoles = res.jsonData.data;
          this.total = res.jsonData.total;
        }else {
            if ( res.errors && res.errors.length > 0){
                res.errors.forEach((el: any) => {
                    this.notification.error(el.errorMessage)
                })
            }else {
                this.notification.error('Không tìm kiếm được quyền người dùng')
            }
        }
      }
    }).add(() => {
      this.loading = false
    });
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
