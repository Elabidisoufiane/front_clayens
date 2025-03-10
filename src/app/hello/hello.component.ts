import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-hello',
  standalone: false,
  templateUrl: './hello.component.html',
  styleUrl: './hello.component.css'
})
export class HelloComponent implements AfterViewInit {
  @ViewChild('rendererContainer') rendererContainer!: ElementRef;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private model!: THREE.Object3D | null; // Store loaded model
  private triangle!: THREE.Mesh; // Store the triangle mesh
  private direction: number = 1; // To control up/down movement
  private speed: number = 0.05; // Speed of movement
  private selectedMesh: THREE.Mesh | null = null;
  private triangley: number = 10;
  nameMachine: string = '';
  lineMachine: number = 0;
  idMachine: number = 0;
  unite: number = 0;
  machines: { cause: string, solution: string, indice: number}[] = [];
  dblclick: boolean=true;
  cause: number=0;
  path:string='';



  defect: string=""
  listCauses: number[] = [];


  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {}

  comp = false;
  
  ngAfterViewInit(): void {
    this.ngOnInit();
    this.fetchDefectData();  // Fetch defect data when component is initialized
    this.initScene();
    this.loadModel();
    this.animate()
  }
  
  private fetchDefectData(): void {
    this.http.post<any[]>(this.path, { defect: this.defect }).subscribe(
      (response) => {
        console.log('Defect data received:', response);
  
        // Check if the response is an array and it's properly formatted
        if (Array.isArray(response)) {
          // Ensure all items are correctly formatted and accessible
          this.machines = response.map(machine => ({
            cause: machine.cause,
            solution: machine.solution,
            indice: machine.indice,
            
          }));
           
        } else {
          console.error('Expected an array but received:', response);
        }
      },
      (error) => {
        console.error('Error fetching defect data:', error);
      }
    );
  }
  
  ngOnInit() {
  
    this.path = `http://${environment.apiUrl}:5000/get_defect_analysis`
    this.route.params.subscribe(params => {
      this.nameMachine = params['name'];
      this.lineMachine = +params['line']; // Convert to number
      this.idMachine = +params['id'];
      this.defect = params['defect']
      this.unite = +params['unite']
      console.log("hello")
    });

  }
  private initScene(): void {
    // Scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 80);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    // Lights
    const ambientLight = new THREE.AmbientLight(0x555555);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 10, 10);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    window.addEventListener('resize', () => this.onWindowResize());
  }

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private firstMeshAssigned: number = 20;
  private loadModel(): void {
    const loader = new GLTFLoader();
    const modelUrl = new URL('injection.glb', import.meta.url).href;
  
    loader.load(
      modelUrl,
      (gltf) => {
        this.model = gltf.scene;
        console.log('Model loaded:', gltf.scene);
  
        const solidMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, flatShading: true });
        const redMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, flatShading: true });
  
        
        let n = 0;

        this.model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            if (n == this.firstMeshAssigned) {
              (child as THREE.Mesh).material = redMaterial;
              n = n + 1;
              this.selectedMesh = child as THREE.Mesh; // Store reference to selected mesh

            } else {
              (child as THREE.Mesh).material = solidMaterial;
              n = n + 1;
            }
  
            (child as THREE.Mesh).castShadow = true;
            (child as THREE.Mesh).receiveShadow = true;
          }
        });
        console.log(this.model.children);
        this.model.position.set(-5, -5, 0);
        this.scene.add(this.model);

        // Triangle Geometry and Material
        const triangleGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
          0, 1, 0,  // Vertex 1 (top)
          2, 1, 0, // Vertex 2 (bottom left)
          1, -1, 0   // Vertex 3 (bottom right)
        ]);
        
        triangleGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        
        const triangleMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xff0000,
          side: THREE.DoubleSide 
        });
        
        this.triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);
        this.scene.add(this.triangle);
        if(this.selectedMesh){
          this.triangle.position.copy(this.selectedMesh.position);
          
          this.triangle.position.y=10;
          
          this.triangle.position.x = this.selectedMesh.position.x-7;
          this.triangley=this.triangle.position.y;
          this.triangle.position.set(-5,20,0)

        }else{
          this.triangle.position.set(-5,20,0)
        }
        
      },
      undefined,
      (error) => {
        console.error('Error loading GLTF model:', error);
      }
    );
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
 
  private animate(): void {
    requestAnimationFrame(() => this.animate());
    
    

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  onCauseClick(cause: number) {
    this.firstMeshAssigned = cause;
    this.scene.remove(this.triangle)
    this.loadModel();
    console.log(this.firstMeshAssigned )
  }
  onCausedblClick(cause: number){
    console.log("dblClicked");
    this.cause=cause;
    this.dblclick= false ;
  }
  goBack1() {
    this.dblclick = true;
    
  }
  
  goBack(){
    let path = `/analyse/${this.idMachine}/${this.nameMachine}/${this.unite}/${this.lineMachine}`
    this.router.navigate(path.split('/'));
  }
  modifier(){}
  valider(){}
  newone(){}
}
