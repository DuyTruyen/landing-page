import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/shared/notification.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { AppointmentService } from 'src/app/services/appointment.service';
import { DepartmentService } from 'src/app/services/department.service';
import { Constants } from 'src/app/shared/constants/constants';
import moment from 'moment';
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
    selectedItem: any = {};
    selectedGender: any;
    isVisibleAppointmentDlg = false;
    header = 'Xử lý thông tin hẹn khám';
    statusForm: FormGroup;
    appointmentStringDate: any;
    dobStringDate: any;
    visitTimeStringDate: any;
    APPOINTMENT_STATUS = Constants.APPOINTMENT_STATUS;
    APPOINTMENT_PRIORITY = Constants.APPOINTMENT_PRIORITY;
    GENDERS = Constants.GENDERS;
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
            node: [null],
            priority: [null]
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
    }

    search() {
        this.loading = true;
        this.appointmentAPI.getAppointment(this.searchForm).subscribe({
            next: (res) => {
                if (res.data != undefined) {
                    this.listItems = res.data;
                    this.totalItemCount = res.total;
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

    getDepartments() {
        this.departmentService.getAll().subscribe({
            next: (res) => {
                if (res) {
                    this.lstDepartments = res.data;
                } else {
                    if (res.errors && res.errors.length > 0) {
                        res.errors.forEach((el: any) => {
                            this.notification.error(el.message);
                        })
                    } else {
                        this.notification.error('Lấy dữ liệu không thành công');
                    }
                }
            }
        })
    }

    onUpdateStatus(item: any) {
        this.selectedItem = item;
        this.statusForm.patchValue({
            id: item.id,
            status: item.status,
            node: item.node,
            priority: item.priority,
        })
    }

    updateStatus() {
        if (this.statusForm.valid) {
            this.appointmentAPI.putStatus(this.selectedItem.id, this.statusForm.value).subscribe({
                next: (res) => {
                    if (res.ret && res.ret[0].code == 200) {
                        this.notification.success('Cập nhật trạng thái thành công', '');
                        this.search();
                    } else {
                        if (res.errors && res.errors.length > 0) {
                            res.errors.forEach((el: any) => {
                                this.notification.error(el.errorMessage);
                            });
                        } else if (res.ret) {
                            this.notification.error('Cập nhật trạng thái không thành công! Error: ' + res.ret[0].message);
                        } else {
                            this.notification.error('Cập nhật trạng thái không thành công! Error: unknown');
                        }
                    }
                }
            })
        }
    }

    onSearch() {
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

    dbClickUpdate(data: any) {
        this.isVisibleAppointmentDlg = true;
        this.selectedItem = data;
        this.appointmentStringDate = moment(this.selectedItem.appointmentDate).toDate();
        this.dobStringDate = moment(this.selectedItem.dob).toDate();
        this.visitTimeStringDate = moment(this.selectedItem.visitTime).toDate();
        const selectedGender = this.GENDERS.find(g => g.value == this.selectedItem.gender);
        if(selectedGender) {
            this.selectedGender = selectedGender;
        }
        this.statusForm.get('status')?.setValue(this.selectedItem.status);
        this.statusForm.get('priority')?.setValue(this.selectedItem.priority);
        this.statusForm.get('node')?.setValue(this.selectedItem.node);
    }
}
