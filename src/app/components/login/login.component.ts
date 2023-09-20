import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  usersForm: FormGroup|any;
  constructor(private fb: FormBuilder, private notification: NotificationService,private router:Router) {
    this.usersForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required]],
    });
  }
  navigate(){
    this.router.navigate(['/signup'])
  }
  ngOnInit(): void {}
}
