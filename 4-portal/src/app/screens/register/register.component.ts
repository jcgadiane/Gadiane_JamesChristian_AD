import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private router: Router,
    private api: HttpClient,
    private fb: FormBuilder
  ) {}

  // registerForm: FormGroup = new FormGroup({
  //   fCName: new FormControl('', Validators.required),
  //   fCAge: new FormControl(0, Validators.min(1)),
  //   fCEmail: new FormControl('', Validators.required),
  //   fCPassword: new FormControl('', Validators.required),
  //   fCPassword2: new FormControl('', Validators.required),
  // });

  registerForm = this.fb.group({
    fCName: ['', Validators.required],
    fCAge: [
      '',
      {
        validators: [Validators.required, Validators.min(1)],
      },
    ],
    fCEmail: [
      '',
      {
        validators: [Validators.required, Validators.email],
        updateOn: 'blur',
      },
    ],
    fCPassword: [
      '',
      {
        validators: [Validators.required, Validators.minLength(8)],
        updateOn: 'blur'
      },
    ],
    fCPassword2: [
      '',
      {
        validators: [Validators.required, Validators.minLength(8)],
        updateOn: 'blur'
      },
    ],
  });

  error: string = '';

  ngOnInit(): void {}

  nav(destination: string) {
    this.router.navigate([destination]);
  }

  onSubmit() {
    if (
      this.registerForm.value['fCPassword'] !==
      this.registerForm.value['fCPassword2']
    ) {
      this.error = "Password doesn't match!";
      alert(this.error);
      return;
    }
    if (!this.registerForm.valid) {
      {
        this.error = 'No fields must be empty';
        return;
      }
    }
    if (this.registerForm.valid) {
      var payload: {
        name: string;
        email: string;
        age: number;
        password: string;
      };
      payload = {
        name: this.f.fCName.value,
        email: this.f.fCEmail.value,
        age: this.f.fCAge.value,
        password: this.f.fCPassword.value,
      };
      console.log(payload);
      this.api
        .post(environment.API_URL + '/user/register', payload)
        .toPromise();

        this.nav('home');
    }
  }

  get f() {
    return this.registerForm.controls;
  }

  get password() {
    return this.registerForm.controls.fCPassword;
  }

}
