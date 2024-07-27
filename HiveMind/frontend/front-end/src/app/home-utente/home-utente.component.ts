import { Component, inject, OnInit ,Input, HostListener} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { AuthService } from '../_services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comment } from '../_services/rest-backend/comment-item.type';
import jwtDecode from 'jwt-decode';
import { MarkdownComponent } from 'ngx-markdown';


@Component({
  selector: 'app-home-utente',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownComponent],
  templateUrl: './home-utente.component.html',
  styleUrl: './home-utente.component.scss'
})

export class HomeUtenteComponent{

 

  toastr = inject(ToastrService);
  router = inject(Router);
  restService = inject(RestBackendService);
  authService = inject(AuthService);

  ideas: any[] = []; // Dichiarazione di un array per contenere le idee
  commentText: string = '';
  username : any = this.authService.getUser();
  offset: number = 10;
  private scrollTimeout: any;
  isLoading = false
  checkIdee: boolean = true;
  filter: number = 0;
  fixed: string ='';


  ngOnInit(): void {
    this.getIdeas();
    this.whoIsFixed();
    
  }

  whoIsFixed(){
    this.restService.getTopIdea().subscribe({
      next: (idea) => {
        console.log(idea);
        if(idea != null) {
          this.fixed = idea.title;
          console.log(this.fixed);
        }
      }
    })
  }

    sortComment(comment: any) {
     
      comment.sort((a: any, b: any) => {
        // Sposta i commenti con upVoteSpecial = true all'inizio
        if (a.upVoteSpecial === b.upVoteSpecial) {
          return 0; // Mantieni l'ordine attuale se entrambi hanno lo stesso valore
        }
        return a.upVoteSpecial ? -1 : 1; // Posiziona i commenti con upVoteSpecial = true all'inizio
      });

      return comment;

     console.log(comment);
    
  }

  formatDate(dateStr: string): string {
    if (dateStr) {
      return dateStr.substring(0, dateStr.indexOf('T'));
    }
    return dateStr;
  }

  getIdeas() {
    console.log(this.username);

     this.restService.getIdeas().subscribe({
      next: (data) => {
        this.ideas = data;
        this.ideas.forEach(idea => {
          this.restService.countComment(idea.title).subscribe({
            next: (commentCount) => {
              
              idea.commentCount = commentCount;
              //console.log(idea.commentCount);
            },
            error: (err) => {
              this.toastr.error(`Errore nel conteggio dei commenti per l'idea ${idea.title}`);
              console.error(`Errore nel conteggio dei commenti per l'idea ${idea.title}:`, err);
            }
          });

          this.restService.getCommentsForIdea(idea.title).subscribe({
            next: (comment) => {
              idea.comments = comment;
            },
            complete: () => {
              
              idea.comments = this.sortComment(idea.comments);
            },
            error: (error) => {
              console.error("Errore nel caricamento dei commenti!",error);
            }
          })
        });
        //console.log(this.ideas);
      },complete: () => {
         console.log(this.ideas)
      },
      error: (err) => {
        this.toastr.error("Si è verificato un errore nel recuperare le idee.");
        console.error('Errore durante il recupero delle idee:', err);
      }
    });
  }

 
  pubblicaCommento(title: string, text: string, username: string) {

    if (!text.trim()) {
      this.toastr.warning('Il testo del commento non può essere vuoto.');
      return;
    }

    this.restService.pubComment({
      titleIdea: title,
      text: text,
      username: username
    }).subscribe({
      next: (data) => {
        // Resetta la textarea correttamente
        this.ideas.forEach(idea => {
          if (idea.title === title) {
            idea.commentCount++;
            idea.commentText = '';
            idea.comments.push(data);
            console.log(data);
            // Apri la sezione dei commenti per questa idea
            this.toggleShowComments(idea);
            
            // Aggiungi una classe per l'animazione di highlighting
            idea.highlightedCommentId = data.commentId; // Supponendo che data.commentId contenga l'ID del commento appena pubblicato
          }
        });
      },
      error: (err) => {
        this.toastr.error("Si è verificato un errore nel pubblicare il commento.");
        console.error('Errore durante la pubblicazione del commento:', err);
      }
    });
  }
  

 getCountComment(titleIdea: string) {
  this.restService.countComment(titleIdea).subscribe({
    next: (data) => {
      console.log(data);
    }
  })
 }


 toggleShowComments(idea: any): void {
  if (!idea.showComments) {
    idea.showComments = true;
  } else {
    idea.showComments = false;
  }
}


formatNumber(number: number): string {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 10000) {
    return (number / 1000).toFixed(1) + 'K';
  } else {
    return number.toString();
  }
}

toggleUpVoteSpecial(comment: any, Comments: any) {
  
   
  
  // Disabilita gli altri upVote
  for(let cmt  of Comments) {
    cmt.disable = true;
    console.log(cmt);
}
  
  comment.upVoteSpecial = !comment.upVoteSpecial;

  // Ordina i commenti: posiziona i commenti con upVoteSpecial = true all'inizio
  Comments.sort((a: any, b: any) => {
    // Sposta i commenti con upVoteSpecial = true all'inizio
    if (a.upVoteSpecial === b.upVoteSpecial) {
      return 0; // Mantieni l'ordine attuale se entrambi hanno lo stesso valore
    }
    return a.upVoteSpecial ? -1 : 1; // Posiziona i commenti con upVoteSpecial = true all'inizio
  });

  console.log(Comments);
  this.setUpVoteSpecial(comment.id);
}

setUpVoteSpecial(id: number) {
  this.restService.setVote(id).subscribe({
    next: () => {
      
      this.toastr.success("UpVote aggiunto con successo!");
    },
    error: (err) => {
      this.toastr.error("Si è verificato un errore.");
      console.error('Errore:', err);
    }
  });
  
}

checkDisable(comments: any[]): boolean {
  // Restituisce true se nessun commento ha upVoteSpecial = true
  return !comments.some(comment => comment.upVoteSpecial === true);
}

/*Logica per upVote e DownVote */

updateVote(titleIdea: string, vote: number) {
  // Verifica se l'utente ha già votato
  console.log(titleIdea)
  this.restService.checkVote(this.username, titleIdea).subscribe({
    next: (data) => {
      if (data === true) {
        this.toastr.error("Hai già votato questa idea!");
      } else {
        // Aggiorna il voto dell'idea
        this.restService.updateVoteIdea(titleIdea, vote, this.username).subscribe({
          next: () => {
            this.ideas.forEach(idea => {
              if (idea.title === titleIdea) {
                if (vote === 1) {
                  idea.upVote += 1;
                } else if (vote === 0) {
                  idea.downVote += 1;
                }
              }
            });
            this.toastr.success("Voto aggiunto con successo!");
          },
          error: (err) => {
            console.error(err);
            this.toastr.error("Errore nell'aggiornare il voto dell'idea.");
          }
        });

        // Registra il voto dell'utente
        this.restService.setIdeaVote(titleIdea, vote).subscribe({
          error: (err) => {
            console.error(err);
            this.toastr.error("Errore nel registrare il voto.");
          }
        });
      }
    },
    error: (err) => {
      console.error(err);
      this.toastr.error("Errore nella verifica del voto.");
    }
  });
}

checkVote(titleIdea: string) {
  console.log("asduad0",titleIdea);
  this.restService.checkVote(titleIdea, this.username).subscribe({
    next: (data) => {
      if(data) {
        this.toastr.error("Hai gia votato questa idea!");
        return true;
      }else{
        return false;
      }
    }
  })
}


/**FUNZIONE CHE CARICA ALTRE 10 IDEE ALLA VOLTA */

  loadMoreIdeas() {

    this.offset += 10;

    this.restService.loadMoreIdeas(this.offset).subscribe({
      next: (data) => {
        this.ideas = data;
        this.ideas.forEach(idea => {

          this.restService.countComment(idea.title).subscribe({
            next: (commentCount) => {
              
              idea.commentCount = commentCount;
              //console.log(idea.commentCount);
            },
            error: (err) => {
              this.toastr.error(`Errore nel conteggio dei commenti per l'idea ${idea.title}`);
              console.error(`Errore nel conteggio dei commenti per l'idea ${idea.title}:`, err);
            }
          });

          this.restService.getCommentsForIdea(idea.title).subscribe({
            next: (comment) => {
              idea.comments = comment;
            },
            complete: () => {
              
              idea.comments = this.sortComment(idea.comments);

            },
            error: (error) => {
              console.error("Errore nel caricamento dei commenti!",error);
            }
          })
        });
        //console.log(this.ideas);
      },complete: () => {
         console.log(this.ideas)
         /**Contiamo quannte idee sono state caricate */
         let scarto = this.offset - this.ideas.length;

         this.offset = this.offset - scarto;

         console.log(this.offset);
      },
      error: (err) => {
        this.toastr.error("Si è verificato un errore nel recuperare le idee.");
        console.error('Errore durante il recupero delle idee:', err);
      }
    });
  }



  /*scroll della pagina */
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if(this.offset === 10 || this.offset !== this.ideas.length){
      this.checkIdee = true;
    // Verifica se lo scroll ha raggiunto la fine
    if (scrollTop + clientHeight >= scrollHeight) {
      // Cancella il timeout precedente, se esiste
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }

      // Mostra la GIF di caricamento
      this.isLoading = true;

      // Imposta un nuovo timeout per chiamare loadMoreIdeas dopo 3 secondi
      this.scrollTimeout = setTimeout(() => {
        if(this.filter === 0){ //Controversial
        this.loadMoreIdeas();
        }else if(this.filter === 1){ //Unpopular
          this.loadMoreUnpopularIdeas();
        }else if (this.filter === 2) { // Mainstream
          this.loadMoreMainstreamIdeas();
        } 
        // Nascondi la GIF di caricamento dopo aver chiamato loadMoreIdeas
        this.isLoading = false;
      }, 2000); // 3000 millisecondi = 3 secondi
    }
  }else{
    
    if(this.checkIdee && (scrollTop + clientHeight >= scrollHeight)){
    this.toastr.warning("Non ci sono altre idee da caricare!");
    this.checkIdee = false;
    }
  }

  }

  /**Get unpopular ideas */
  getUnpopularIdeas() {
     this.restService.getUnpopularIdeas().subscribe({
      next: (data) => {
        this.ideas = data;
        this.ideas.forEach(idea => {
          this.restService.countComment(idea.title).subscribe({
            next: (commentCount) => {
              
              idea.commentCount = commentCount;
              //console.log(idea.commentCount);
            },
            error: (err) => {
              this.toastr.error(`Errore nel conteggio dei commenti per l'idea ${idea.title}`);
              console.error(`Errore nel conteggio dei commenti per l'idea ${idea.title}:`, err);
            }
          });

          this.restService.getCommentsForIdea(idea.title).subscribe({
            next: (comment) => {
              idea.comments = comment;
            },
            complete: () => {
              
              idea.comments = this.sortComment(idea.comments);
            },
            error: (error) => {
              console.error("Errore nel caricamento dei commenti!",error);
            }
          })
        });
        //console.log(this.ideas);
      },complete: () => {
         console.log(this.ideas)
      },
      error: (err) => {
        this.toastr.error("Si è verificato un errore nel recuperare le idee.");
        console.error('Errore durante il recupero delle idee:', err);
      }
    });
  }

  /**Get More unpopular ideas */
  
  loadMoreUnpopularIdeas() {

    this.offset += 10;

    this.restService.loadMoreUnpopular(this.offset).subscribe({
      next: (data) => {
        this.ideas = data;
        this.ideas.forEach(idea => {

          this.restService.countComment(idea.title).subscribe({
            next: (commentCount) => {
              
              idea.commentCount = commentCount;
              //console.log(idea.commentCount);
            },
            error: (err) => {
              this.toastr.error(`Errore nel conteggio dei commenti per l'idea ${idea.title}`);
              console.error(`Errore nel conteggio dei commenti per l'idea ${idea.title}:`, err);
            }
          });

          this.restService.getCommentsForIdea(idea.title).subscribe({
            next: (comment) => {
              idea.comments = comment;
            },
            complete: () => {
              
              idea.comments = this.sortComment(idea.comments);

            },
            error: (error) => {
              console.error("Errore nel caricamento dei commenti!",error);
            }
          })
        });
        //console.log(this.ideas);
      },complete: () => {
         console.log(this.ideas)
         /**Contiamo quannte idee sono state caricate */
         let scarto = this.offset - this.ideas.length;

         this.offset = this.offset - scarto;

         console.log(this.offset);
      },
      error: (err) => {
        this.toastr.error("Si è verificato un errore nel recuperare le idee.");
        console.error('Errore durante il recupero delle idee:', err);
      }
    });
  }


  /**Get mainstream ideas */
  getMainstreamIdeas() {
    this.restService.getMainstreamIdeas().subscribe({
     next: (data) => {
       this.ideas = data;
       this.ideas.forEach(idea => {
         this.restService.countComment(idea.title).subscribe({
           next: (commentCount) => {
             
             idea.commentCount = commentCount;
             //console.log(idea.commentCount);
           },
           error: (err) => {
             this.toastr.error(`Errore nel conteggio dei commenti per l'idea ${idea.title}`);
             console.error(`Errore nel conteggio dei commenti per l'idea ${idea.title}:`, err);
           }
         });

         this.restService.getCommentsForIdea(idea.title).subscribe({
           next: (comment) => {
             idea.comments = comment;
           },
           complete: () => {
             
             idea.comments = this.sortComment(idea.comments);
           },
           error: (error) => {
             console.error("Errore nel caricamento dei commenti!",error);
           }
         })
       });
       //console.log(this.ideas);
     },complete: () => {
        console.log(this.ideas)
     },
     error: (err) => {
       this.toastr.error("Si è verificato un errore nel recuperare le idee.");
       console.error('Errore durante il recupero delle idee:', err);
     }
   });
 }


  /**Get More mainstream ideas */
  
  loadMoreMainstreamIdeas() {

    this.offset += 10;

    this.restService.loadMoreMainstream(this.offset).subscribe({
      next: (data) => {
        this.ideas = data;
        this.ideas.forEach(idea => {

          this.restService.countComment(idea.title).subscribe({
            next: (commentCount) => {
              
              idea.commentCount = commentCount;
              //console.log(idea.commentCount);
            },
            error: (err) => {
              this.toastr.error(`Errore nel conteggio dei commenti per l'idea ${idea.title}`);
              console.error(`Errore nel conteggio dei commenti per l'idea ${idea.title}:`, err);
            }
          });

          this.restService.getCommentsForIdea(idea.title).subscribe({
            next: (comment) => {
              idea.comments = comment;
            },
            complete: () => {
              
              idea.comments = this.sortComment(idea.comments);

            },
            error: (error) => {
              console.error("Errore nel caricamento dei commenti!",error);
            }
          })
        });
        //console.log(this.ideas);
      },complete: () => {
         console.log(this.ideas)
         /**Contiamo quannte idee sono state caricate */
         let scarto = this.offset - this.ideas.length;

         this.offset = this.offset - scarto;

         console.log(this.offset);
      },
      error: (err) => {
        this.toastr.error("Si è verificato un errore nel recuperare le idee.");
        console.error('Errore durante il recupero delle idee:', err);
      }
    });
  }

  
  handleVote() {
    this.toastr.info("Non puoi votare la tua stessa idea!");
  }

}
