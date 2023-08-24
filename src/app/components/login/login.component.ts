import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { StorageKeys } from 'src/app/shared/constants/constants';
import { AuthService } from 'src/app/services/auth.service';
import { AuthStateService } from 'src/app/shared/app-state/auth-state.service';
import { NotificationService } from 'src/app/shared/notification.service';
const nonWhiteSpaceRegExp: RegExp = new RegExp("\\S");
import {Subscription} from 'rxjs';
import { Constants } from 'src/app/shared/constants/constants';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild("notify_login", {read: ElementRef}) notifyLogin!: ElementRef;
  loginForm!: FormGroup;
  slogan = {
    content: '',
    author: ''
  }
  loading = false;
  sub!: Subscription;
  messageError!: string;
  constructor(
    public configService: AppConfigService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authState: AuthStateService,
    private authService: AuthService,
    private notification: NotificationService,
  ) {
    this.loginForm = this.fb.group({
        username: ['', [Validators.required, Validators.pattern(nonWhiteSpaceRegExp)]],
        password: ['', [Validators.required]],
      });
  }

  ngOnDestroy(): void {
      if( this.sub ){
        this.sub.unsubscribe();
      }
  }

  ngOnInit(): void {
  }

  login(): void {
    this.sub = this.authService.login(this.loginForm.value).subscribe(res => {
        if(res !== null) {
            localStorage.setItem(StorageKeys.TOKEN, res.token);
            localStorage.setItem(StorageKeys.USER, JSON.stringify(res));
            // location.href = '/admin-dashboard';
            this.authState.dispatch(res);
            this.router.navigate(['/admin-dashboard']);
        }
    }, error => {
        if(error.error && error.error.message) {
            this.messageError = error.error.message;
        } else {
            this.messageError = StorageKeys.LOGIN_FAIL
        }
    })
    // if (this.loginForm.valid) {
    //   this.loading = true;
    //   this.authService.login(this.loginForm.value).subscribe({
    //     next: (res) => {
    //       if (res) {
    //         // console.log('StorageKeys.TOKEN, res.jsonData.value : ', res.jsonData == null ? "null" : res.jsonData.value);
    //         localStorage.setItem(StorageKeys.TOKEN, res.token);
    //         localStorage.setItem(StorageKeys.USER, JSON.stringify(res));
    //         this.authState.dispatch(res);
    //         this.configService.loadOtherConfig(
    //             ()=>{
    //                 let returnUrl = '';
    //                 if (this.route.snapshot.queryParams['returnUrl']) {
    //                     returnUrl = this.route.snapshot.queryParams['returnUrl'];
    //                 }
    //                 this.router.navigate([returnUrl]);
    //             }
    //         )

    //       }else{
    //         // Thông báo lỗi dạng Notification
    //         // res.errors.forEach((err:any) => {
    //         //     this.notification.error(err.errorMessage,'');
    //         // });

    //         // Thông báo lỗi Error trên UI Login
    //         const parentElement = this.notifyLogin.nativeElement;
    //         parentElement.innerText = '*' + res?.errors[0].errorMessage;
    //         // const pDatatableWrapper = parentElement.querySelector(".p-datatable-wrapper");
    //         // pDatatableWrapper.style.height=`calc(100vh - ${this.calcHeight}px)`
    //       }
    //     },

    //     error:(err) => {
    //         // console.log('Error:', err);
    //         this.notification.error('Đã có lỗi hệ thống xảy ra. Xin vui lòng liên hệ Admin HVID!','');
    //     },

    //   }).add(() => {
    //     this.loading = false;
    //   });
    // } else {
    //   Object.values(this.loginForm.controls).forEach((control) => {
    //     if (control.invalid) {
    //       control.markAsDirty();
    //       control.updateValueAndValidity({ onlySelf: true });
    //     }
    //   });
    // }
  }
  removeTextErrorLogin(){
    const parentElement = this.notifyLogin.nativeElement;
    parentElement.innerText = '';
  }
}
