import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private threeSubject = new BehaviorSubject<boolean>(true); // Default value
  three$ = this.threeSubject.asObservable(); // Observable for other components

  // Function to update the value
  setThree(value: boolean) {
    this.threeSubject.next(value);
  }
  constructor() { }
}
