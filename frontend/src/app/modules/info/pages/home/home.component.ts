import { Component, effect, inject, signal } from '@angular/core';
import { Movie } from '../../../shared/models/movie.models';
import { MovieService } from '../../../shared/services/movie.service';
import { RegisterComponent } from '../../../shared/components/user/register/register.component';
import { LoginComponent } from "../../../shared/components/user/login/login.component";
import { UserService } from '../../../shared/services/user.service';
import { Carousel } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RegisterComponent, LoginComponent, Carousel, ButtonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  userService = inject(UserService);
  showLogin = false;
  showRegister = false;

  movies = signal<Movie[]>([]); // Lista completa de películas
  filteredMovies = signal<Movie[]>([]); // Películas filtradas según la búsqueda
  searchQuery: string = ''; // Query de búsqueda

  private movieService = inject(MovieService);

  ngOnInit() {
    this.getMovies();
  }

  constructor() {
    // Efecto para mostrar el modal de login
    effect(() => {
      this.showLogin = this.userService.getLoginActive();
    });

    // Efecto para mostrar el modal de registro
    effect(() => {
      this.showRegister = this.userService.getRegisterActive();
    });
  }

  private async getMovies() {
    this.movieService.getMovies()
      .then((movies) => {
        this.movies.set(movies); // Almacena las películas originales
        this.filteredMovies.set(movies); // Inicializa las películas filtradas
        console.log('Movies:', movies);
      });
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase().trim(); // Normaliza el texto de búsqueda
    if (!query) {
      this.filteredMovies.set(this.movies()); // Si el query está vacío, muestra todas las películas
    } else {
      const filtered = this.movies().filter((movie) =>
        movie.title.toLowerCase().includes(query) // Filtra por el título de la película
      );
      this.filteredMovies.set(filtered); // Actualiza las películas filtradas
    }
  }
}
