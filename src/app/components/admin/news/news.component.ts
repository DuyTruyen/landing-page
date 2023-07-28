import { Component, OnInit } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { NewService } from 'src/app/services/news-service';
@Component({
    selector: 'app-group-roles',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  
    breadcrumbItem: MenuItem[];
    home: MenuItem;
    newDialogHeader = '';
    isVisibleNewDialog= false;
    url: any; 
  	msg = "";
    fileName="";
 //   isEditUserGroup = false;
    newsForm: FormGroup;
    searchData = {
        Skip: 0,
        Take: 40,
        Keyword: '',
        Status:true
      };
    news: any = [];
    loading = false;
    constructor(    private fb: FormBuilder,
        private newService: NewService,
        private notification: NotificationService,

    ) {
        this.newsForm = this.fb.group({
            title: [null],
            status: [null],
            image: [null, [Validators.required]],
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
        this.search();
        
    }
    search()
    {
        this.newService.getNew(this.searchData).subscribe({
            next: (res) => {
              if (res.isValid) {
                this.news = res.jsonData.data;
                console.log(this.news);
                this.news.forEach((u: any) => (u.enable = !u.disable));
               
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
    onCreateItem() {
        this.newsForm.patchValue({
          id: 0,
          title: '',
          status: null,
          image: '',
          summary: '',
          content: ''
        });
        this.isVisibleNewDialog = true;
        //this.isEditUserGroup = false;
        this.newDialogHeader = 'Thêm tin tức';
        this.url= "";
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
        
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        
        reader.onload = (_event) => {
          this.msg = "";
          this.url = reader.result; 
        }
      }
  
}
