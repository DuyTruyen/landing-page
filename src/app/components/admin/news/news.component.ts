import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { NewService } from 'src/app/services/news-service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { AppConfigService } from 'src/app/shared/app-config.service';

@Component({
    selector: 'app-group-roles',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {

  breadcrumbItem: MenuItem[];
  home: MenuItem;

  url: any;
  msg = "";
  fileName="";
  newsForm: FormGroup;
  searchData = {
      skip: 0,
      take: 40,
      keyword: '',
      status:null
    };

  listItems: any = [];
  totalItemCount = 0;
  loading = false;
  cols: any[] = [];

  newsDialogHeader = '';
  isVisibleNewsDlg= false;
  isEditItem = false;
  selectedItem: any;
  blobChoosenFile:any = null;

  isVisibleDeleteItemDialog = false;
  textConfirmDelete = '';

  constructor(private fb: FormBuilder,
              private newsService: NewService,
              private notification: NotificationService,
              private fileUploadService: FileUploadService,
              protected configService: AppConfigService
  ) {
      this.newsForm = this.fb.group({
          title: [null],
          status: [null],
          // image: [null], //[null, [Validators.required]],
          summary: [null],
          content: [null]
        });
      this.breadcrumbItem = [
          { label: 'Quản lý tin tức' },
          { label: 'Danh sách tin tức' },
        ];

        this.home = {
          icon: 'pi pi-home',
          routerLink: '/admin/admin-dashboard',
        };
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'title', header: 'Tiêu đề',  isOpSort: false, iconSort : 0, width: '60%' },
      { field: 'dateCreated', header: 'Thời gian đăng',  isOpSort: false, iconSort : 0, width: '15%' },
    ];
    this.search();
  }

  search() {
    this.loading = true;
    this.newsService.getNews(this.searchData).subscribe({
      next: (res) => {
        if (res.data != undefined) {
          this.listItems = res.data;
          // this.listItems.forEach((u: any) => (u.enable = !u.disable));
          this.totalItemCount = res.count;
          console.log(this.listItems);
        }
        else {
          if(res.errors && res.errors.length > 0) {
              res.errors.forEach((el: any) => {
                  this.notification.error(el.errorMessage);
              });
          }
          else {
              this.notification.error('Tìm kiếm không thành công');
          }
        }
      },
    })
    .add(() => {
      this.loading = false;
    });
  }

  onSearch() {
    this.searchData.skip = 0;
    this.searchData.take = 40;
    this.search();
  }

  onClearSearch() {
    this.searchData.keyword = '';
    this.search();
  }

  onPageChange(data: any) {
    this.searchData.skip = data.first;
    this.searchData.take = data.rows;
    this.search();
  }

  selectItem(item: any) {
    this.selectedItem = item;
  }

  toggleEnable(item: any) {
    console.log('status: ' + item.status);
    let payload = {
      title: item.title,
      thumbnail: item.thumbnail,
      summary: item.summary,
      content: item.content,
      status: item.status,
    };
    console.log(payload);
    this.newsService.update(item.id, payload).subscribe({
        next: (res) => {
            if (res.ret && res.ret[0].code == 200) {
                this.notification.success(
                    'Cập nhật trạng thái thành công',
                    ''
                );
                this.search();
            }
            else {
                if(res.errors && res.errors.length > 0){
                    res.errors.forEach((el: any) => {
                        this.notification.error(el.errorMessage);
                    });
                }
                else{
                    this.notification.error('Cập nhật trạng thái không thành công');
                }
            }
        },
    });
  }

  onCreateItem() {
    this.newsForm.patchValue({
      id: 0,
      title: '',
      status: null,
      // image: '',
      summary: '',
      content: ''
    });
    this.isVisibleNewsDlg = true;
    this.newsDialogHeader = 'Thêm tin tức';
    this.url= "";
    this.selectedItem = null;
    this.isEditItem = false;
  }

  selectFile(event: any) {
    if(!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "Only images are supported";
      return;
    }

    this.blobChoosenFile = event.target.files[0];

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.msg = "";
      this.url = reader.result;
    }
  }

  onEditItem(item: any) {
    this.selectedItem = item;
    this.newsForm.reset();
    this.newsForm.patchValue({
        id: item.id,
        title: item.title,
        status: item.status,
        // thumbnail: item.thumbnail,
        summary: item.summary,
        content: item.content,
    });
    this.isVisibleNewsDlg = true;
    this.isEditItem = true;
    this.newsDialogHeader = 'Cập nhật bài viết';
    this.url = item.thumbnail;
  }

  onDeleteItem(item: any) {
      this.selectedItem = item;
      this.textConfirmDelete = `Bạn có thực sự muốn xóa bài viết <b>${item.title}</b>?`;
      this.isVisibleDeleteItemDialog = true;
  }

  onSaveItem() {
    console.log('onSaveItem');
    if (this.newsForm.valid) {
      if(this.blobChoosenFile != null) {
        this.doUploadImage();
      }
      else {
        this.doSaveItem();
      }
    }
    else {
        Object.values(this.newsForm.controls).forEach((control) => {
            if (control.invalid) {
                control.markAsDirty();
                control.updateValueAndValidity({ onlySelf: true });
            }
        });
    }
  }

  doSaveItem() {
    if (!this.isEditItem) {
      this.createItem();
    } else {
      this.updateItem();
    }
  }

  updateItem() {
    this.newsService
        .update(this.selectedItem.id, {
            ...this.newsForm.value,
            thumbnail: this.url,
        })
        .subscribe({
            next: (res) => {
              console.log(res);
              if (res.ret && res.ret[0].code == 200) {
                  this.notification.success('Cập nhật bài viết thành công', '');
                  this.isVisibleNewsDlg = false;
                  this.search();
              }else{
                if(res.errors && res.errors.length > 0){
                    res.errors.forEach((el: any) => {
                        this.notification.error(el.errorMessage);
                    });
                } else if(res.ret) {
                  this.notification.error('Cập nhật bài viết không thành công! Error: ' + res.ret[0].message);
                } else {
                    this.notification.error('Cập nhật bài viết không thành công! Error: unknown');
                    console.error(res);
                }
              }
            },
        });
  }

  createItem() {
      console.log('createItem');
      this.newsService.create({
            ...this.newsForm.value,
            thumbnail: this.url,
        }).subscribe({
          next: (res) => {
              if (res.ret && res.ret[0].code == 201) {
                  this.notification.success('Thêm mới bài viết thành công', '');
                  this.isVisibleNewsDlg = false;
                  this.search();
              } else {
                  if(res.errors && res.errors.length > 0){
                      res.errors.forEach((el: any) => {
                          this.notification.error(el.errorMessage);
                      });
                  } else if(res.ret) {
                      this.notification.error('Thêm mới bài viết không thành công! Error: ' + res.ret[0].message);
                  } else {
                      this.notification.error('Thêm mới bài viết không thành công! Error: unknown');
                      console.error(res);
                  }
              }
          },
      });
  }

  deleteItem() {
      this.newsService.deleteById(this.selectedItem.id).subscribe({
          next: (res) => {
              if (res.isValid) {
                  this.notification.success('Xóa bài viết thành công', '');
                  this.isVisibleDeleteItemDialog = false;
                  this.search();
              } else {
                  if(res.errors && res.errors.length > 0){
                      res.errors.forEach((el: any) => {
                          this.notification.error(el.errorMessage);
                      })
                  }else{
                      this.notification.error('Xóa bài viết không thành công!', res.msg);
                  }
              }
          },
      });
  }

  doUploadImage() {
    if(this.blobChoosenFile != null) {
      console.log('doUploadImage', this.blobChoosenFile);
      this.fileUploadService.upload(this.blobChoosenFile).subscribe({
        next: (res) => {
          console.log(res);
          if(res.filePath) {
            const config = this.configService.getConfig();
            this.url = config.api.fileUrl + '/' + res.filePath;
            console.log(this.url);
            this.doSaveItem();
          }
          else {
            this.notification.error('Upload ảnh không thành công!', (res.msg != undefined)?res.msg:'Unknown error.');
          }
        }
      });
    }
  }
}
