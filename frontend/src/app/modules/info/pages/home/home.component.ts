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
  imports: [RouterLink, Carousel, ButtonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  userService = inject(UserService);

  movies = signal<Movie[]>([]); 
  filteredMovies = signal<Movie[]>([]); 
  searchQuery: string = ''; 

  private movieService = inject(MovieService);

  ngOnInit() {
    this.getMovies();
  }


  private async getMovies() {
    try {
      const movies = await this.movieService.getMovies();
      const availableMovies = movies.filter((movie) => movie.available);
      this.movies.set(availableMovies);
      this.filteredMovies.set(availableMovies); 
      console.log('Available Movies:', availableMovies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
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
