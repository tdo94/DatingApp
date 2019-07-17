import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyServiceService } from 'src/app/_services/alertify-service.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter()
  model: any = {};
  registerForm: FormGroup;

  constructor (
    private authService: AuthService,
    private alertifyService: AlertifyServiceService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator })
  }
  // FB.GROUP IS EQUIVALENT OF NEW FORMGROUP
  // this.registerForm = new FormGroup({
  //   username: new FormControl('', Validators.required),
  //   password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]),
  //   confirmPassword: new FormControl('', Validators.required)
  // }, this.passwordMatchValidator)

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : { 'mismatch': true };
  }

  register() {
    // this.authService.register(this.model).subscribe(() => {
    //   this.alertifyService.success('Registered');
    //   this.router.navigate(['/'])
    // }, err => {
    //   this.alertifyService.error(err)
    // });
    console.log(this.registerForm.value);
  }

  cancel() {
    this.cancelRegister.emit(true);
  }
}
