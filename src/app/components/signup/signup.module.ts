import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';

import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NotificationService } from 'src/app/shared/notification.service';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [
    SignupComponent
  ],
  imports: [
    CommonModule,
    SignupRoutingModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    RippleModule,
    ButtonModule,
    ToastModule,
    CheckboxModule
  ]
})
export class SignupModule { }
