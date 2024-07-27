import { Component, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { AuthService } from '../_services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';



@Component({
  selector: 'app-nuova-idea',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nuova-idea.component.html',
  styleUrl: './nuova-idea.component.scss'
})
export class NuovaIdeaComponent {

  maxChar: number = 400
  charDisp: number = this.maxChar;
  restService = inject(RestBackendService);
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  router = inject(Router);

  username : any = this.authService.getUser();

  idea = {
    name: '',
    description: ''
  };

  addMarkdown(start: string, end: string): void {
    const textarea = document.getElementById('description') as HTMLTextAreaElement;

    if (!textarea) {
      console.error('Textarea element not found');
      return;
    }

    const { selectionStart, selectionEnd, value } = textarea;

    // Aggiungi i tag di markdown
    const before = value.substring(0, selectionStart);
    const selected = value.substring(selectionStart, selectionEnd);
    const after = value.substring(selectionEnd);

    textarea.value = `${before}${start}${selected}${end}${after}`;
    textarea.focus();

    // Posiziona il cursore dopo il tag di chiusura
    textarea.setSelectionRange(selectionEnd + start.length, selectionEnd + start.length);
    
    // Aggiorna il modello
    this.idea.description = textarea.value;
    
    
  }

  onSubmit() {
    // Invia l'idea al backend
    console.log('Idea inviata:', this.idea);

    this.restService.createIdea(this.username, this.idea.name, this.idea.description).subscribe({
      next: () => {
        this.toastr.success("Idea aggiunta con successo!");
        this.router.navigateByUrl("/home-user");
      },
      error: (err) => {
        this.toastr.error("Errore nella creazione dell'idea!");
      }
    })
    // Esempio di invio ai servizi Angular
    // this.ideaService.sendIdea(this.idea).subscribe(response => {
    //   console.log('Risposta del backend:', response);
    //   this.resetForm();
    // });

    // Reset del modulo dopo l'invio (opzionale)
    this.resetForm();
  }

  resetForm() {
    this.idea = {
      name: '',
      description: ''
    };
  }

  updateCharacterCount(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.charDisp = this.maxChar - textarea.value.length;
  }

}
