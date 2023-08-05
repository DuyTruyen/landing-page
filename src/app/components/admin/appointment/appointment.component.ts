import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/notification.service';
import { MenuItem } from 'primeng/api';
import { AppointmentService } from 'src/app/services/appointment.service';

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
    cols: any[] = [];
    totalItemCount = 0;
    selectedItem: any;
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
        private appointmentAPI: AppointmentService
    ) {
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
        this.cols = [
            { field: '', header: 'Họ tên', width: '15%'},
            { field: '', header: 'SDT', width: '12%'},
            { field: '', header: 'Chuyên khoa', width: '12%'},
            { field: '', header: 'Trạng thái', width: '12'},
        ]
    }

    search() {
        this.loading = true;
        this.appointmentAPI.getAppointment(this.searchForm).subscribe({
            next: (res) => {
                if (res.data != undefined) {
                    console.log('res', res);
                    this.listItems = res.data;
                    this.totalItemCount = res.count;
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

}
