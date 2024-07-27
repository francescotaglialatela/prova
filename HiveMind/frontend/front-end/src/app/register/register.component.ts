import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);
  submitted = false;
  signupForm = new FormGroup({
    username: new FormControl('',[Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16)
    ])
  })


  handleRegistrazione() {
    this.submitted=true;
    if(this.signupForm.invalid) {
      this.toastr.error("I dati che hai inserito non sono validi!");
    }else {
      this.restService.signup({
        usr: this.signupForm.value.username as string,
        pwd: this.signupForm.value.password as string, 
      }).subscribe({
        error: (err) => {
          this.toastr.error("L'username che hai scelto è gia in uso");
        },
        complete: () => {
          console.log(this.signupForm.value.username,this.signupForm.value.password);
          this.toastr.success('Registrazione avvenuta con successo!');
          this.router.navigateByUrl("/homepage");
        }
      })
    }
  }
}
