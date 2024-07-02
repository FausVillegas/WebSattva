import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent{

  constructor(private authService: AuthService, private router: Router) { }
  
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }

  EventFilterButton():void{
    const filterBtn = document.getElementById('filter-button')
    const filters = document.getElementById('filters')
    if (filters)
          if (filters.hasAttribute('hidden')) {
              // Si el atributo hidden está presente, quítalo para mostrar el elemento
              filters.removeAttribute('hidden');
          } else {
              // Si el atributo hidden no está presente, agrégalo para ocultar el elemento
              filters.setAttribute('hidden','true');
          }
  }

  EventCategoriesBtn():void{
    const btnCategorias = document.getElementById('btn-categorias')
    const categoriasMenu = document.getElementById('categorias-menu')
    if(categoriasMenu){
      if (categoriasMenu.hasAttribute('hidden')) {
        categoriasMenu.removeAttribute('hidden');
      } else {
        categoriasMenu.setAttribute('hidden','true');
      }
    }
  }

  EventPrieceBtn():void{
    const btnPrecios = document.getElementById('btn-precios');
    const preciosMenu = document.getElementById('precios-menu');
    if(preciosMenu){
      if (preciosMenu.hasAttribute('hidden')) {
        preciosMenu.removeAttribute('hidden');
      } else {
        preciosMenu.setAttribute('hidden','true');
      }
    }
  }
}
