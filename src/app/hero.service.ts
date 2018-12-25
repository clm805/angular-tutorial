import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';

import { Hero } from './hero';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  // searchHeroes(term: string): Observable<Hero[]> {
  //   if (!term.trim()) {
  //     // if not search term, return empty hero array.
  //     return of([]);
  //   }
    
  //   return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
  //     tap(_ => this.log(`found heroes matching "${term}"`)),
  //     catchError(this.handleError<Hero[]>('searchHeroes', []))
  //   );
  // }
  
  deleteHero (hero: Hero | string): Observable<void> {
    const id = typeof hero === 'string' ? hero : hero.id;
    return from(this.heroes.doc(id).delete());
  }
  
  addHero (hero: Hero): Observable<void> {
    const id = this.db.createId();
    return from(this.heroes.doc(id).set(Object.assign({ id: id }, hero)));
  }

  updateHero(hero: Hero): Observable<any> {
    return from(this.heroes.doc<Hero>(hero.id).set(hero));
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: string): Observable<Hero> {
    return this.heroes.doc<Hero>(id).valueChanges();
  }

  getHeroes(): Observable<Hero[]> {
    return this.heroes.valueChanges();
  }

  heroes : AngularFirestoreCollection<Hero>;

  constructor(
    private db: AngularFirestore
  ) {
    this.heroes = db.collection<Hero>('/heroes');
  }
}
