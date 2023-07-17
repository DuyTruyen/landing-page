import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListLabelsService } from 'src/app/services/list-labels.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MenuItem } from 'primeng/api';
@Component({
    selector: 'app-list-labels',
    templateUrl: './list-labels.component.html',
    styleUrls: ['./list-labels.component.scss'],
})
export class ListLabelsComponent implements OnInit {
    color2: any = {
        h: 100,
        s: 50,
        b: 50,
    };

    _isVisibleLabelDialog = false;
    set isVisibleLabelDialog(value: boolean) {
        this._isVisibleLabelDialog = value;
        if (!value) {
            this.labelForm.markAsPristine();
        }
    }
    get isVisibleLabelDialog() {
        return this._isVisibleLabelDialog;
    }
    isVisibleDeleteItemDialog = false;
    listLabels: any = [];
    cols: any[] = [];
    selectedLabel: any;
    listLabelDialogHeader = '';
    isEditLabel = false;
    labelForm: FormGroup;
    deletedItem: any = {};
    searchData = {
        take: 40,
        skip: 0,
        keyword: '',
        sortField: '',
        sortDir: ''
    };
    textConfirmDelete = '';
    loading = false;

    // Breakcrum Page list-labels
    breadcrumbItem: MenuItem[];
    breadcrumbHome: MenuItem;

    colColor = {
        field: 'color',
        header: 'Màu nhãn',
        isOpSort : true,
        iconSort : 0,
    };

    colDisable = {
        field: 'disable',
        header: 'Enable',
        isOpSort : true,
        iconSort : 0,
    };
    constructor(
        private fb: FormBuilder,
        private notification: NotificationService,
        private listLabelsService: ListLabelsService
    ) {
        this.labelForm = this.fb.group({
            id: [0],
            name: ['', [Validators.required]],
            color: ['#FFE7CC', [Validators.required]],
            priority: [''],
            disable: [false],
        });

        // Breakcrum Page list-labels
        this.breadcrumbItem = [
            { label: 'Quản lý danh mục' },
            { label: 'DS label gán nhãn' },
        ];

        this.breadcrumbHome = {
            icon: 'pi pi-home',
            routerLink: '/admin/admin-dashboard',
        };
    }

    ngOnInit() {
        this.cols = [
            { field: 'id', header: 'Id',  isOpSort: false, iconSort : 0, width: '20rem' },
            { field: 'name', header: 'Tên nhãn',  isOpSort: true, iconSort : 0,  width: '56.7rem' },
            { field: 'priority', header: 'Độ ưu tiên',  isOpSort: true, iconSort : 0, width: '8rem' },
        ];
        this.getAll();
    }

    getAll() {
        this.loading = true;
        this.listLabelsService
            .getAll()
            .subscribe({
                next: (res) => {
                    if (res.isValid) {
                        this.listLabels = res.jsonData;
                    }else{
                        if(res.errors && res.errors.length > 0){
                            res.errors.forEach((el: any) => {
                                this.notification.error(el.errorMessage)
                            })
                        }else{
                            this.notification.error('Lấy dữ liệu không thành công')
                        }
                    }
                },
            })
            .add(() => {
                this.loading = false;
            });
    }

    onCreateItem() {
        this.labelForm.reset();
        this.labelForm.patchValue({
            id: 0,
            name: '',
            color: '#ffffff',
            priority: '',
            disable: false,
        });
        this.isVisibleLabelDialog = true;
        this.isEditLabel = false;
        this.listLabelDialogHeader = 'Thêm mới label';
    }

    onEditItem(item: any) {
        this.selectedLabel = item;
        this.labelForm.reset();
        this.labelForm.patchValue({
            id: item.id,
            name: item.name,
            color: item.color,
            priority: item.priority,
        });
        this.isVisibleLabelDialog = true;
        this.isEditLabel = true;
        this.listLabelDialogHeader = 'Sửa thông tin label';
    }

    onDeleteItem(item: any) {
        this.deletedItem = item;
        this.textConfirmDelete = `Xác nhận xóa label <b>${item.name}</b>?`;
        this.isVisibleDeleteItemDialog = true;
    }

    search() {
        this.loading =true;
        this.listLabelsService.search(this.searchData).subscribe({
            next: (res) => {
                if (res.isValid) {
                    // this.ObservationTypes = res.jsonData.data;
                    this.listLabels = res.jsonData.data;
                    // console.log('this.ObservationTypes ',this.ObservationTypes );
                    // this.ObservationTypes.forEach((u:any) => (u.enable = !u.disable));
                    // this.total = res.jsonData.total;
                }else{
                    if(res.errors && res.errors.length > 0){
                        res.errors.forEach((el: any) => {
                            this.notification.error(el.errorMessage)
                        })
                    }else{
                        this.notification.error('Tìm kiếm không thành công')
                    }
                }
            }
        }).add(() => {
            this.loading = false;
        })
      }

      resetSearch() {
        this.searchData = {
            take: 40,
            skip: 0,
            keyword: '',
            sortField: '',
            sortDir: ''
        };
        this.search();
      }



    selectLabel(label: any) {
        this.selectedLabel = label;
    }

    saveItem() {
        if (this.labelForm.valid) {
            if (!this.isEditLabel) {
                this.createLabel();
            } else {
                this.updateLabel();
            }
        } else {
            Object.values(this.labelForm.controls).forEach((control) => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }

    updateLabel() {
        this.listLabelsService
            .update(this.labelForm.value.id, {
                ...this.labelForm.value,
                disable: this.selectedLabel.disable,
            })
            .subscribe({
                next: (res) => {
                    if (res.isValid) {
                        this.notification.success('Cập nhật thành công', '');
                        this.isVisibleLabelDialog = false;
                        this.getAll();
                    }else{
                        if(res.errors && res.errors.length > 0){
                            res.errors.forEach((el: any) => {
                                this.notification.error(el.errorMessage)
                            })
                        }else{
                            this.notification.error('Cập nhật không thành công')
                        }
                    }
                },
            });
    }

    createLabel() {
        this.listLabelsService.create(this.labelForm.value).subscribe({
            next: (res) => {
                if (res.isValid) {
                    this.notification.success('Thêm mới thành công', '');
                    this.isVisibleLabelDialog = false;
                    this.getAll();
                }else{
                    if(res.errors && res.errors.length > 0){
                        res.errors.forEach((el: any) => {
                            this.notification.error(el.errorMessage)
                        })
                    }else{
                        this.notification.error('Thêm mới không thành công')
                    }
                }
            },
        });
    }

    deleteLabel() {
        this.listLabelsService.deleteById(this.deletedItem.id).subscribe({
            next: (res) => {
                if (res.isValid) {
                    this.notification.success('Xóa label thành công', '');
                    this.isVisibleDeleteItemDialog = false;
                    this.getAll();
                }else{
                    if(res.errors && res.errors.length > 0){
                        res.errors.forEach((el: any) => {
                            this.notification.error(el.errorMessage)
                        })
                    }else{
                        this.notification.error('Xóa label không thành công')
                    }
                }
            },
        });
    }
    toggle(item: any) {
        let payload = {
            name: item.name,
            color: item.color,
            priority: item.priority,
            disable: !item.disable,
        };
        this.listLabelsService.update(item.id, payload).subscribe({
            next: (res) => {
                if (res.isValid) {
                    this.notification.success(
                        'Cập nhật trạng thái thành công',
                        ''
                    );
                    this.getAll();
                }else {
                    if(res.errors && res.errors.length > 0){
                        res.errors.forEach((el: any) => {
                            this.notification.error(el.errorMessage)
                        })
                    }else{
                        this.notification.error('Cập nhật trạng thánh không thành công')
                    }
                }
            },
        });
    }


    searchLabel(data: any) {
        this.loading =true;
        this.listLabelsService.search(data).subscribe({
            next: (res) => {
                if (res.isValid) {
                    // this.ObservationTypes = res.jsonData.data;
                    this.listLabels = res.jsonData.data;
                }else{
                    if(res.errors && res.errors.length > 0){
                        res.errors.forEach((el: any) => {
                            this.notification.error(el.errorMessage)
                        })
                    }else{
                        this.notification.error('Tìm kiếm label không thành công')
                    }
                }
            }
        }).add(() => {
            this.loading = false;
        })
      }


      // Luật sắp xếp
  customSort(col: any) {
    var dataField = col.field;
    console.log(dataField);
    dataField = dataField.charAt(0).toUpperCase() + dataField.slice(1);
    console.log(dataField);
    console.log('col.isOpSort: '  + col.isOpSort);
    // Chuyển trạng thái Icon
    this.resetIconDefaultRest(col);


    // Chuyển trạng thái Icon kế tiếp
    col.iconSort ++;
    col.iconSort  = col.iconSort  % 3;

    if (col.isOpSort) {
        // console.log('col.isOpSort: '  + col.isOpSort);

        this.searchLabel({
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
