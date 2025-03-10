import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-green',
  standalone: false,
  templateUrl: './green.component.html',
  styleUrl: './green.component.css'
})
export class GreenComponent {
  path:string='';
  name: string = '';
  line: number = 0;
  id: number = 0;
  state:boolean=true;
  unite:number=0;

    constructor(private route: ActivatedRoute, private router: Router , private http: HttpClient,private sharedService: SharedService) {}
  
    ngOnInit() {
      this.path= environment.apiUrl;
      this.route.params.subscribe(params => {
        this.name = params['label'];
        this.line = params['line']; // Convert to number
        this.id = params['id'];
        this.unite = params['unite'];
      });
    }

    declareDefect() {
      // Define the updated machine object
      const updatedMachine = {
        name: this.name,  // Machine label
        line: this.line,    // Machine line
        state: true  ,    // Set defect to true
        unite: this.unite,
      };
    
      // Send PUT request with JSON body
      this.http.put(`http://${this.path}:8080/machines/${this.id}`, updatedMachine).subscribe({
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
    rgoBack(){
      this.sharedService.setThree(true); // Hide the main view

      this.router.navigate(['/']);
    }

}
