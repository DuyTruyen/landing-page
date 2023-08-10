import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';
import { UserGroupService } from 'src/app/services/user-group.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';
import { MenuItem } from 'primeng/api';
@Component({
    selector: 'app-group-roles',
    templateUrl: './group-roles.component.html',
    styleUrls: ['./group-roles.component.scss'],
})
export class GroupRolesComponent implements OnInit {
    cols:any[]=[];
    searchData = {
        skip: 0,
        take: Constants.TABLE_PARAM.PAGE_SIZE,
        keyword: '',
    };
    loading = false;
    loadingRole = false;
    total = 0;
    groups: any = [];
    roles: any = [];
    selectRow: any = [];
    tempGroups = [];

    // Breakcrum page Phân quyền group
    breadcrumbItem: MenuItem[];
    breadcrumbHome: MenuItem;

    constructor(
        private groupService: UserGroupService,
        private notification: NotificationService,
        private roleService: RoleService,
        private cdr : ChangeDetectorRef
    ) {

        // Breakcrum page Phân quyền group
        this.breadcrumbItem = [
            { label: 'Quản lý group' },
            { label: 'Phân quyền group' },
        ];

        this.breadcrumbHome = {
            icon: 'pi pi-home',
            routerLink: '/admin/admin-dashboard',
        };
    }

    ngOnInit(): void {
        this.cols = [
            {field:'save', header:'Save', isOpSort: false, iconSort : 0, width:'3rem'},
            {field:'id', header:'GroupID', isOpSort: false, iconSort : 0, width:'15rem'},
            {field:'name', header:'Tên nhóm', isOpSort: true, iconSort : 0, width:'12rem'},
        ];
        this.getRoles().then((r) => this.search());
    }

    getRoles() {
        return new Promise((resolve, reject) => {
            this.loadingRole = true;
            this.roleService.getAll().subscribe({
                next: (res) => {
                    this.roles = res;
                        this.loadingRole = false;
                        resolve(true);
                    // if (res.isValid) {
                    //     this.roles = res.jsonData;
                    //     this.loadingRole = false;
                    //     resolve(true);
                    // } else {
                    //     if(res.errors && res.errors.length > 0){
                    //         res.errors.forEach((el: any) => {
                    //             this.notification.error(el.errorMessage)
                    //         })
                    //     }else{
                    //         this.notification.error('Lấy dữ liệu không thành công')
                    //     }
                    // }
                },
                error:()=>{
                    this.notification.error('Lấy dữ liệu không thành công')
                }
            });
        });
    }

    search() {
        this.loading = true;
        this.groupService
            .getAll()
            .subscribe({
                next: (res) => {
                    this.groups = res
                    this.groups.forEach((g: any) => {
                        g.checkedRoles = [];
                        this.roles.forEach((r: any) => {
                            g.checkedRoles.push(g.groupRoles.map((el:any)=>{return el.roleId})
                                .includes(r.id));
                        });
                    });
                    // this.groups.forEach((el:any)=>{el.rowModified = false});
                    // this.tempGroups = JSON.parse(JSON.stringify(this.groups)) ;
                    console.log(this.groups);
                    // this.total = res.jsonData.total;
                    // if (res.isValid) {
                    //     this.groups = res.jsonData.data;
                    //     this.groups.forEach((g: any) => {
                    //         g.checkedRoles = [];
                    //         this.roles.forEach((r: any) => {
                    //             g.checkedRoles.push(g.roles.includes(r.name));
                    //         });
                    //     });
                    //     this.groups.forEach((el:any)=>{el.rowModified = false});
                    //     this.tempGroups = JSON.parse(JSON.stringify(this.groups)) ;
                    //     console.log(this.groups);
                    //     this.total = res.jsonData.total;
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
                error:()=>{
                    this.notification.error('Tìm kiếm không thành công')

                }
            })
            .add(() => {
                this.loading = false;
            });
    }
    // search() {
    //     this.loading = true;
    //     this.groupService
    //         .search(this.searchData)
    //         .subscribe({
    //             next: (res) => {
    //                 if (res.isValid) {
    //                     this.groups = res.jsonData.data;
    //                     this.groups.forEach((g: any) => {
    //                         g.checkedRoles = [];
    //                         this.roles.forEach((r: any) => {
    //                             g.checkedRoles.push(g.roles.includes(r.name));
    //                         });
    //                     });
    //                     this.groups.forEach((el:any)=>{el.rowModified = false});
    //                     this.tempGroups = JSON.parse(JSON.stringify(this.groups)) ;
    //                     console.log(this.groups);
    //                     this.total = res.jsonData.total;
    //                 }else{
    //                     if(res.errors && res.errors.length > 0){
    //                         res.errors.forEach((el: any) => {
    //                             this.notification.error(el.errorMessage)
    //                         })
    //                     }else{
    //                         this.notification.error('Tìm kiếm không thành công')
    //                     }
    //                 }
    //             },
    //         })
    //         .add(() => {
    //             this.loading = false;
    //         });
    // }

    onSearch(data: any) {
        this.loading = true;
        this.groupService
            .search(data)
            .subscribe({
                next: (res) => {
                    if (res.isValid) {
                        this.groups = res.jsonData.data;
                        this.groups.forEach((g: any) => {
                            g.checkedRoles = [];
                            this.roles.forEach((r: any) => {
                                g.checkedRoles.push(g.roles.includes(r.name));
                            });
                        });
                        this.groups.forEach((el:any)=>{el.rowModified = false});
                        console.log(this.groups);
                        this.tempGroups = JSON.parse(JSON.stringify(this.groups)) ;
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
            })
            .add(() => {
                this.loading = false;
            });
      }

    updateGroupRoles(group: any) {
        let roleIds = [];
        for (let i = 0; i < this.roles.length; ++i) {
            if (group.checkedRoles[i]) {
                roleIds.push(this.roles[i].id);
            }
        }
        let payload = {
            groupId: group.id,
            roles : roleIds
        }
        this.groupService.updateGroupRoles(payload).subscribe({
            next: (res) => {
                this.notification.success('Cập nhật thành công');
                // if (res.isValid) {
                //     group.rowModified = false;
                //     this.tempGroups = JSON.parse(JSON.stringify(this.groups));
                //     this.notification.success('Cập nhật thành công');
                // }else{
                //     if(res.errors && res.errors.length > 0){
                //         res.errors.forEach((el: any) => {
                //             this.notification.error(el.errorMessage)
                //         })
                //     }else{
                //         this.notification.error('Cập nhật không thành công')
                //     }
                // }
            },
            error: ()=>{
                this.notification.error('Cập nhật không thành công')
            }
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

    onPageChange(data: any) {
        this.searchData.skip = data.first;
        this.searchData.take = data.rows;
        this.search();
    }

    selectItem(data: any) {
        console.log(data);

        this.selectRow = data;
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

    checkDisableRow(data:any):boolean{
        // console.log(data);

        return this.selectRow.every((el:any)=>{return el.id != data.id});

    }
    onCheckBoxChange(event:any,rowData:any){
        console.log(event,rowData);
        this.tempGroups.forEach((el:any,index)=>{
            if(JSON.stringify(this.groups[index].checkedRoles)  != JSON.stringify(el.checkedRoles)
                ){
                    this.groups[index].rowModified= true;
                    console.log(this.groups);

                }
            else{
                this.groups[index].rowModified= false;
            }
        });
        this.cdr.detectChanges()

    }
}
