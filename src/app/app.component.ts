import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from './shared.service';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  path:string = '';
  three: boolean = true;
  src: string = 'machine.png';
  machines: { label: string, hasError: boolean, line: number, id: number, unite: number }[] = [];
  groupedMachines: { [key: number]: { [line: number]: any[] } } = {};
  private refreshInterval: any;

  constructor(private http: HttpClient, private router: Router, private sharedService: SharedService) {}

  ngOnInit() {
    this.path=environment.apiUrl
    this.sharedService.three$.subscribe(value => {
      this.three = value;
    });
    this.fetchMachines();
    this.startAutoRefresh();
  }

  fetchMachines() {
    this.http.get<any[]>(`http://${this.path}:8080/machines`).subscribe((response) => {
      this.machines = response.map(machine => ({
        label: machine.name,
        hasError: machine.state,
        line: machine.line,
        id: machine.id,
        unite: machine.unite
      }));

      // Group machines by unite and line
      this.groupedMachines = this.machines.reduce((acc, machine) => {
        if (!acc[machine.unite]) acc[machine.unite] = {};
        if (!acc[machine.unite][machine.line]) acc[machine.unite][machine.line] = [];
        acc[machine.unite][machine.line].push(machine);
        return acc;
      }, {} as { [key: number]: { [line: number]: any[] } });

      // Sort each line's machines by ID
      Object.keys(this.groupedMachines).forEach(unite => {
        Object.keys(this.groupedMachines[+unite]).forEach(line => {
          this.groupedMachines[+unite][+line].sort((a, b) => a.id - b.id);
        });
      });

      console.log("Grouped Machines:", this.groupedMachines);
    });
  }

  getLines(unite: number): number[] {
    return this.groupedMachines[unite] ? Object.keys(this.groupedMachines[unite]).map(Number).sort((a, b) => a - b) : [];
  }

  startAutoRefresh() {
    this.refreshInterval = setInterval(() => {
      this.fetchMachines();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  navigateToDetail(hasError: boolean, label: string, line: number, id: number, unite: number) {
    let path = hasError ? `/red/${id}/${label}/${line}/${unite}` : `/green/${id}/${label}/${line}/${unite}`;
    this.sharedService.setThree(false);
    this.router.navigate(path.split('/'));
  }
}
