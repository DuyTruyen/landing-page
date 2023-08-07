import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { AppointmentService } from 'src/app/services/appointment.service';
import { DepartmentService } from 'src/app/services/department.service'
import { Constants } from 'src/app/shared/constants/constants';

@Component({
    selector: 'app-appointment',
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {
    breadcrumbItem: MenuItem[];
    home: MenuItem;

    loading = false;
    listItems: any = [];
    lstDepartments: any = [];
    totalDepartmen = 0;
    cols: any[] = [];
    totalItemCount = 0;
    selectedItem: any;
    dbSelected: any
    isVisibleAppointmentDlg = false;
    header = 'Xử lý thông tin hẹn khám';
    statusForm: FormGroup;
    searchData = {
        skip: 0,
        take: 40,
        status: null,
    }

    searchForm = {
        appointmentDate: new Date(),
        dateCreated: new Date(),
        phoneNo: '',
        name: '',
        departmentId: null,
        status: this.searchData.status,
        take: this.searchData.take,
        skip: this.searchData.skip,
    }
    constructor(
        private notification: NotificationService,
        private appointmentAPI: AppointmentService,
        private departmentService: DepartmentService,
        private fb: FormBuilder,
    ) {
        this.statusForm = this.fb.group({
            id: [null],
            status: [null],
        })
        this.breadcrumbItem = [
            { label: 'Quản lý lịch hẹn' },
            { label: 'Danh sách lịch hẹn' },
        ];

        this.home = {
            icon: 'pi pi-home',
            routerLink: '/admin/admin-dashboard',
        };
    }

    ngOnInit(): void {
        this.search();
        this.getDepartments();
        this.cols = [
            { field: 'name', header: 'Họ tên', width: '14%' },
            { field: 'phoneNo', header: 'SDT', width: '14%' },
            { field: 'departmentName', header: 'Chuyên khoa', width: '12%' },
            { field: 'status', header: 'Trạng thái', width: '12' },
        ]
    }

    search() {
        this.loading = true;
        this.appointmentAPI.getAppointment(this.searchForm).subscribe({
            next: (res) => {
                if (res.data != undefined) {
                    console.log('res', res);
                    this.listItems = res.data;
                    this.totalItemCount = res.total;
                    console.log("listItems", this.listItems);
                } else {
                    if (res.errors && res.errors.length > 0) {
                        res.errors.forEach((el: any) => {
                            this.notification.error(el.errorMessage);
                        });
                    } else {
                        this.notification.error('Tìm kiếm không thành công');
                    }
                }
            },
        }).add(() => {
            this.loading = false;
        });
    }

    getDepartments(){
        this.departmentService.getAll().subscribe({
          next:(res) => {
            if(res){
              this.lstDepartments = res.data;
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
      }

      updateStatus(){
        this.appointmentAPI.updateStatus( this.statusForm.value, this.selectedItem.id ).subscribe({
            next: (res) => {
                if(res.ret && res.ret[0].code == 200) {
                    this.notification.success('Cập nhật trạng thái thành công', '');
                    console.log('res', res);
                }else{
                    if(res.errors && res.errors.length > 0){
                        res.errors.forEach((el: any) => {
                            this.notification.error(el.errorMessage);
                        });
                    } else if(res.ret) {
                      this.notification.error('Cập nhật trạng thái không thành công! Error: ' + res.ret[0].message);
                    } else {
                        this.notification.error('Cập nhật trạng thái không thành công! Error: unknown');
                        console.error(res);
                    }
                }
            }
        })
      }

    onSearch() {
        // this.searchForm = {
        //     appointmentDate: new Date(),
        //     dateCreated: new Date(),
        //     phoneNo: '',
        //     name: '',
        //     departmentId: null,
        //     status: this.searchData.status,
        //     take: this.searchData.take,
        //     skip: this.searchData.skip,
        // }
        this.searchForm.skip = 0;
        this.searchForm.take = 40;
        this.search();
    }

    onClearSearch() {
        this.searchForm = {
            appointmentDate: new Date(),
            dateCreated: new Date(),
            phoneNo: '',
            name: '',
            departmentId: null,
            status: this.searchData.status,
            take: this.searchData.take,
            skip: this.searchData.skip,
        };
        this.search();
    }

    onPageChange(data: any) {
        this.searchForm.skip = data.first;
        this.searchForm.take = data.rows;
        this.search();
    }

    selectItem(item: any) {
        this.selectedItem = item;
    }

    dbClickUpdate(data: any) {
        console.log('dbClickUpdate',data);
        this.isVisibleAppointmentDlg = true;
        this.dbSelected = data;
        console.log('dbSelected',this.dbSelected);
    }

}
