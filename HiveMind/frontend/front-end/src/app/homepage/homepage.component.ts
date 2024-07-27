import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {

  constructor(private toastr: ToastrService) { }
  restService = inject(RestBackendService);
  idea: any = [];

  ngOnInit(): void {
    
    this.whoIsFixed();
  }

  whoIsFixed(){
    this.restService.getTopIdea().subscribe({
      next: (data) => {
        
        if(data != null) {
          this.idea = data;
          this.idea.data = this.formatDate(this.idea.data);
          this.restService.countComment(this.idea.title).subscribe({
            next: (count) => {
              this.idea.countComment = count;
            },
            error: (err) => {
              console.error(err);
            }
          });
          console.log(data);
        }
      }
    })
  }

  formatDate(dateStr: string): string {
    if (dateStr) {
      return dateStr.substring(0, dateStr.indexOf('T'));
    }
    return dateStr;
  }

  handleUpVoteClick() {
    this.toastr.warning('Effettua il login per votare le idee.');
  }

  handleDownVoteClick() {
    this.toastr.warning('Effettua il login per votare le idee.');
  }
}
