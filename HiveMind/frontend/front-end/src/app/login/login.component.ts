import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../_services/auth/auth.service';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);
  authService = inject(AuthService);
  submitted = false;
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16)
    ])
  })

  handleLogin() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.toastr.error("L'username o password che hai inseriti sono incorretti, riprova!");
    }else{
    this.restService.login({
      usr: this.loginForm.value.username as string,
      pwd: this.loginForm.value.password as string,
    }).subscribe({
      next: (token) => {
        console.log('Token ricevuto: ',token);
        this.authService.updateToken(token);
        this.toastr.success(`Benvenuto ${this.loginForm.value.username}`);
        this.router.navigateByUrl('/home-user');
      },
      error: (err) => {
        console.error("E sbagliat fratm riprova", err);
        this.toastr.error("Riprova!");
      }
    });
  }

}
  
  /*
  handleLogin() {
    this.submitted = true;
    if(this.loginForm.invalid){
      this.toastr.error("L'username o password che hai inseriti sono incorretti, riprova!");
    }else {
      this.restService.login({
        usr: this.loginForm.value.username as string,
        pwd: this.loginForm.value.password as string,
      }).subscribe({
        next: (token) => {
          this.authService.updateToken(token);
        },
        error: (err) => {
          this.toastr.error("Credenziali errate, inserisci username o password validi")
        },
        complete: () => {
          this.toastr.success("Login effettuato con successo, verrai reinderizzato alla tua pagina home");
          console.log("provaaaa");
          this.router.navigateByUrl("/home-user");
        }
      })
      
    }
  }
   

  /*
  handleLogin() {
    this.submitted = true;
    if(this.loginForm.invalid) {
      this.toastr.error("Dati invalidi");
    } else {
      this.restService.login({
        usr: this.loginForm.value.username as string,
        pwd: this.loginForm.value.password as string,
      }).subscribe({
        next: (token) => {
          this.authService.updateToken(token);
        },
        error: (err) => {
          this.toastr.error("errore invalidi usr e psw");
        },
        complete: () => {
          this.toastr.success("T appost fratm e loggat si nu mostr");
          this.router.navigateByUrl("/home-user");
        }
      })
    }
      */
  
    
}
