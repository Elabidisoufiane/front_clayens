import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { label } from 'three/tsl';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-analyse',
  standalone: false,
  templateUrl: './analyse.component.html',
  styleUrl: './analyse.component.css'
})
export class AnalyseComponent {
  path:string = ''
  nameMachine: string = '';
  lineMachine: number = 0;
  idMachine: number = 0;
  unite: number = 0;

  defect: string = ''; // User input for defect
  selectedRegleurId: number | null = null; // Store Regleur ID
  regleurs: { id: number; name: string ;role:string}[] = []; // Store regleurs with ID

  apiUrl: string = 'http://192.168.43.64:8080'; // API base URL

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient,private sharedService: SharedService) {}

  ngOnInit() {
    this.path=environment.apiUrl
    this.route.params.subscribe(params => {
      this.nameMachine = params['name'];
      this.lineMachine = +params['line']; // Convert to number
      this.idMachine = +params['id'];
      this.unite= +params['unite']
    });

    this.fetchRegleurs(); // Load regleurs from API
  }

  // Fetch regleurs from backend
  fetchRegleurs() {
    this.http.get<{ id: number; name: string ;role:string}[]>(`http://${this.path}:8080/regleurs`).subscribe({
      next: (response) => {
        this.regleurs = response;
      },
      error: (error) => {
        console.error("Error fetching regleurs:", error);
      }
    });
  }

  // Validate and submit the defect form
  submitDefect() {
    if (!this.defect || !this.selectedRegleurId) {
      alert("All fields are required!");
      return;
    }

    const defectData = {
      name: this.defect,
    
    };
    console.log("defectData:",defectData)
    this.http.post(`http://${this.path}:8080/defects/${this.idMachine.toString()}/${this.selectedRegleurId.toString()}`, defectData).subscribe({
      next: () => {
        console.log(defectData);
        let path = `/causes/${this.defect}/${this.idMachine}/${this.nameMachine}/${this.lineMachine}/${this.unite}`
        this.router.navigate(path.split('/'));
      },
      error: (error) => {
        console.error("Error submitting defect:", error);
      }
    });
  }

  goBack(){
    let path = `/red/${this.idMachine}/${this.nameMachine}/${this.lineMachine}/${this.unite}`
    this.router.navigate(path.split('/'));
  }
}
