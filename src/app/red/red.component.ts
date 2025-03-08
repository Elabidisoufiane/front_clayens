import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-red',
  standalone: false,
  templateUrl: './red.component.html',
  styleUrl: './red.component.css'
})
export class RedComponent {
  
  name: string = '';
  line: number = 0;
  id: number=0;
  unite: number=0;
  apiUrl: string = 'http://localhost:8080/machines'; // Replace with your API URL

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient,private sharedService: SharedService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.name = params['label'];
      this.line = params['line']; // Convert to number
      this.id = params['id'];
      this.unite = params['unite']
    });
  }
  noDefect() {
    // Define the updated machine object
    const updatedMachine = {
      name: this.name,  // Machine label
      line: this.line,    // Machine line
      state: false ,     // Set defect to false
      unite: this.unite
    };
  
    // Send PUT request with JSON body
    this.http.put(`${this.apiUrl}/${this.id}`, updatedMachine).subscribe({
      next: (response) => {
        console.log('Machine updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating machine:', error);
      }
    });
    this.sharedService.setThree(true); // Hide the main view

    this.router.navigate(['/']);

  }
  goBack(){
    this.sharedService.setThree(true); // Hide the main view

    this.router.navigate(['/']);
  }
  analyze() {
    let path = `/analyse/${this.id}/${this.name}/${this.unite}/${this.line}`
    this.router.navigate(path.split('/'));
  }
}
