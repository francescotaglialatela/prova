import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './_guards/auth/auth.guard';
import { HomeUtenteComponent } from './home-utente/home-utente.component';
import { NuovaIdeaComponent } from './nuova-idea/nuova-idea.component';


export const routes: Routes = [
    {
        path: "homepage",
        title: "Home-Page",
        component: HomepageComponent
    },
    {
        path:"",
        redirectTo: "/homepage",
        pathMatch: 'full'
    },
    {
        path: "login",
        title: "Login",
        component: LoginComponent
    },
    {
        path: "register",
        title : "Registrazione",
        component: RegisterComponent
    },
    {
        path:"home-user",
        title:"HM | Benvenuto",
        component: HomeUtenteComponent,
        canActivate: [authGuard]
    },
    {
        path:"newIdea",
        title:"HM | Nuova Idea",
        component: NuovaIdeaComponent,
        canActivate: [authGuard]
    }
];
