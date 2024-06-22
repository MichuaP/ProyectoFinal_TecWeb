import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  Logueado:boolean;

  constructor(private router:Router) {
    this.Logueado = false;
  }

  buscarUnaEspecialidad(nombre:string) {
    this.router.navigate(['/buscador',nombre]);
  }
}
