import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../interfaces/producto.interface';
import { resolve } from 'url';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  cargando = true;
  productos: Producto[] = [];
  productoFiltrado: Producto[] = [];


  constructor( private http: HttpClient ) {
    this.cargarProductos();
  }

  private cargarProductos() {
    return new Promise((resolve, reject) => {
      this.http.get('https://eddportafolio.firebaseio.com/productos_idx.json')
        .subscribe( (resp: Producto[]) => {
          // console.log(resp);
          this.productos = resp;
          setTimeout(() => {
            this.cargando = false;
          }, 1000);
          resolve();
        });
    });

  }

  getProducto(id: string) {
    return this.http.get(`https://eddportafolio.firebaseio.com/productos/${id}.json`);
  }

  buscarProducto( termino: string ) {
    if (this.productos.length === 0) {
      // cargar productos
      this.cargarProductos().then(() => {
      // ejecutar despues de tener los productos
      // aplicar filtro
      this.filtrarProductos( termino );
      });
    } else {
      // aplicar filtro
      this.filtrarProductos( termino );
    }
  }

  private filtrarProductos(termino: string) {
    this.productoFiltrado = [];
    termino = termino.toLocaleLowerCase();

    this.productos.forEach( prod => {
      const tituloLower = prod.titulo.toLocaleLowerCase();
      const categoriaLower = prod.categoria.toLocaleLowerCase();

      if (categoriaLower.indexOf(termino) >= 0 || tituloLower.indexOf(termino) >= 0) {
        this.productoFiltrado.push( prod );
      }
    });
  }
}
