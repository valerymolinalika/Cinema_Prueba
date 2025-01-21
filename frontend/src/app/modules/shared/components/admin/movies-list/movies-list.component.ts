import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MovieService } from '../../../services/movie.service';
import { Movie } from '../../../models/movie.models';
import { MovieFunction } from '../../../models/movie_function.models';
import { FormsModule } from '@angular/forms';
import { get } from 'http';

@Component({
  selector: 'app-movies-list',
  imports: [CommonModule,FormsModule],
  templateUrl: './movies-list.component.html',
  styleUrl: './movies-list.component.css'
})
export class MoviesListComponent {
  movieService = inject(MovieService);
  movies = signal<Movie[]>([]);
  availableMovies: Movie[] =[];
  selectedMovie = signal<Movie | null>(null);
  showModal = signal(false);
  showCreateMovieFunctionModal = signal(false); 
  showCreateMovieModal = signal(false); 
  showEditMovieModalSignal = signal(false); // Signal to control Edit Movie Modal visibility
  newMovieFunction: MovieFunction = {
    id: 0,
    movie_id: 0, 
    date_function: '',
    time_function: '',
    room_number: 0,
    available_seats: []
  };
  availableSeatsInput: string = '';
  newMovie: Movie = {
    title: '',
    synopsis: '',
    rating: '',
    image_url: '',
    available: true,
    genre: '',
    administrator_id: 123456789
  }

  ngOnInit() {
    this.getMovies();
  }

  private async getMovies() {
    this.movieService.getMovies()
      .then((movies) => {
        this.movies.set(movies); 
      });
  }

  async toggleAvailability(movie: Movie) {
    this.selectedMovie.set(movie);
    this.showModal.set(true); 
  }

  async confirmChangeAvailability() {
    const movie = this.selectedMovie();
    if (movie) {
      try {
        const updatedAvailability = !movie.available; 
        if(movie.id) {
          await this.movieService.updateUserAvailability(movie.id, updatedAvailability);
          this.getMovies();
          this.closeModal();
        }
      } catch (error) {
        console.error('Error updating availability:', error);
      }
    }
  }

  closeModal() {
    this.showModal.set(false); 
    this.selectedMovie.set(null); 
  }

  showFunctionModal() {
    this.availableMovies = this.movies().filter((movie:Movie) => movie.available);
    this.showCreateMovieFunctionModal.set(true); 
  }

  showMovieModal() {
    this.showCreateMovieModal.set(true);
  }

  async confirmCreateMovieFunction() {
    try {
      const availableSeatsArray = this.availableSeatsInput
        .split(',')  
        .map(seat => seat.trim());  

      this.newMovieFunction.available_seats = availableSeatsArray; 
      if (this.newMovieFunction.movie_id === 0) {
        alert('Please enter a valid Movie ID');
        return;
      }
      await this.movieService.createMovieFunction(this.newMovieFunction);  
      this.getMovies();  
      this.closeCreateFunctionModal();  
    } catch (error) {
      console.error('Error creating movie function:', error);
    }
  }

  async confirmCreateMovie() {
    try {
      await this.movieService.createMovie(this.newMovie);
      this.getMovies();  
      this.closeCreateMovieModal()
    }catch (error){
      console.error('Error creating movie:', error);
    }
  }

  closeCreateFunctionModal() {
    this.showCreateMovieFunctionModal.set(false);
    this.newMovieFunction = {
      id: 0,
      movie_id: 0,  
      date_function: '',
      time_function: '',
      room_number: 0,
      available_seats: []
    };
    this.availableSeatsInput = '';
  }

  closeCreateMovieModal() {
    this.showCreateMovieModal.set(false);
    this.newMovie = {
      title: '',
      synopsis: '',
      rating: '',
      image_url: '',
      available: true,
      genre: '',
      administrator_id: 0
    };
  }


  // Open the Edit Movie Modal and set the selected movie
  showEditMovieModal(movie: Movie) {
    this.showEditMovieModalSignal.set(true);
    this.selectedMovie.set({ ...movie }); // Clone to avoid immediate changes
  }

  // Close the Edit Movie Modal
  closeEditMovieModal() {
    this.showEditMovieModalSignal.set(false);
    this.selectedMovie.set(null);
  }

  // Confirm edits and save the updated movie
  async confirmEditMovie() {
    const movie = this.selectedMovie();
    if (movie && movie.id) {
      try {
        //await this.movieService.updateMovie(movie.id, movie); // Ensure `updateMovie` is implemented in your service
        this.getMovies(); // Refresh the movies list
        this.closeEditMovieModal(); // Close modal after successful edit
      } catch (error) {
        console.error('Error updating movie:', error);
      }
    }
  }


}
