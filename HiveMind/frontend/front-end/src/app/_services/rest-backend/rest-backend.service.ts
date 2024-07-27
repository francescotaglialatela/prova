import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Idea } from './idea-item.type';
import { AuthRequest } from './auth-request.type';
import { Comment } from './comment-item.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestBackendService {

  url = "http://localhost:3000" 
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  login(loginRequest: AuthRequest){
    const url = `${this.url}/log-in`; 
    return this.http.post<string>(url, loginRequest, this.httpOptions);
  }

  signup(signupRequest: AuthRequest){
    const url = `${this.url}/register`; 
    console.log(signupRequest);
    return this.http.post(url, signupRequest, this.httpOptions);
  }

  getIdeas(): Observable<any[]> {
    const url = `${this.url}/getIdeas`; 
    return this.http.get<Idea[]>(url, this.httpOptions);
  }

  loadMoreIdeas(offset: number) {
    const url = `${this.url}/getMoreIdeas/${offset}`;
    return this.http.get<Idea[]>(url,this.httpOptions);
  }

  getUnpopularIdeas(): Observable<any[]> {
    const url = `${this.url}/getUnpopularIdeas`; 
    return this.http.get<Idea[]>(url, this.httpOptions);
  }

  loadMoreUnpopular(offset: number) {
    const url = `${this.url}/getMoreUnpopular/${offset}`;
    return this.http.get<Idea[]>(url,this.httpOptions);
  }

  getMainstreamIdeas(): Observable<any[]> {
    const url = `${this.url}/getMainstreamIdeas`; 
    return this.http.get<Idea[]>(url, this.httpOptions);
  }

  loadMoreMainstream(offset: number) {
    const url = `${this.url}/getMoreMainstream/${offset}`;
    return this.http.get<Idea[]>(url,this.httpOptions);
  }

  countComment(titleIdea: string): Observable<number> {
    const url = `${this.url}/countComment/${titleIdea}`;
    return this.http.get<number>(url,this.httpOptions);
  }

  pubComment(commentRequest: Comment): Observable<any> {
    const url = `${this.url}/comments`;
    return this.http.post<any>(url,commentRequest,this.httpOptions);
  }

  getCommentsForIdea(titleIdea: string) {
    const url = `${this.url}/getComments/${titleIdea}`;
    return this.http.get<any>(url,this.httpOptions);
  }

  setVote(id: number) {
    const url = `${this.url}/setUpComment/${id}`;
    return this.http.put<any>(url,this.httpOptions);
  }

  //Questa carica in VOTE
  updateVoteIdea(titleIdea: string, vote: number, username: string) {
    const url = `${this.url}/updateVote/${titleIdea}/${vote}/${username}`;
    return this.http.put<any>(url,this.httpOptions);
  }

  setIdeaVote(titleIdea: string, vote: number){
    const url = `${this.url}/setVote/${titleIdea}/${vote}`;
    return this.http.put<any>(url,this.httpOptions);
  }

  checkVote(username: string,titleIdea: string){
    const url = `${this.url}/getVotes/${username}/${titleIdea}`;
    return this.http.get<boolean>(url,this.httpOptions);
  }

 
  getTopIdea(){
    const url = `${this.url}/topIdea`;
    return this.http.get<Idea>(url,this.httpOptions);
  }
  

  createIdea(username: string, title: string, text: string){
    const url = `${this.url}/saveIdea`;
    return this.http.post<any>(url,{title: title,
      text: text,
      username: username
    },this.httpOptions)
  }

}
