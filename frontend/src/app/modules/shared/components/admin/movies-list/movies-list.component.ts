import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MovieService } from '../../../services/movie.service';
import { Movie } from '../../../models/movie.models';
import { MovieFunction } from '../../../models/movie_function.models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movies-list',
  imports: [CommonModule,FormsModule],
  templateUrl: './movies-list.component.html',
  styleUrl: './movies-list.component.css'
})
export class MoviesListComponent {
  movieService = inject(MovieService);
  movies = signal<Movie[]>([]);
  selectedMovie = signal<Movie | null>(null);
  showModal = signal(false);
  showCreateMovieFunctionModal = signal(false); 
  newMovieFunction: MovieFunction = {
    id: 0,
    movie_id: 0, 
    date_function: '',
    time_function: '',
    room_number: 0,
    available_seats: []
  };
  availableSeatsInput: string = '';

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
    const user = this.selectedMovie();
    if (user) {
      try {
        const updatedAvailability = !user.available; 
        await this.movieService.updateUserAvailability(user.id, updatedAvailability);
        this.getMovies();
        this.closeModal();
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
    this.showCreateMovieFunctionModal.set(true); 
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
      alert('Movie function created successfully');
      this.getMovies();  
      this.closeCreateFunctionModal();  
    } catch (error) {
      console.error('Error creating movie function:', error);
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
}
