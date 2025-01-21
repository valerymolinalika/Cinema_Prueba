import { Component, inject, signal } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MovieService } from '../../../shared/services/movie.service';
import { Movie } from '../../../shared/models/movie.models';
import { CineComponent } from "../../../shared/components/user/cine/cine.component";
import { UserService } from '../../../shared/services/user.service'; // Para acceder a las fechas de las funciones
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-movie',
  imports: [CommonModule, RouterModule, CineComponent],
  templateUrl: './info-movie.component.html',
  styleUrls: ['./info-movie.component.css']
})
export class InfoMovieComponent {

  numRow = 2;
  numCol = 6;

  infoMovie: Movie = {
    id: 0,
    title: '',
    synopsis: '',
    rating: '',
    image_url: '',
    genre: '',
    available: true,
    administrator_id: 0
  };
  
  movieService = inject(MovieService);
  userService = inject(UserService);  // Usar el servicio de usuario para obtener las fechas
  movie = signal<Movie>(this.infoMovie);

  dates: string[] = [];  // Aquí se almacenarán las fechas de las funciones
  functions: any[] = []; // Aquí se almacenarán las funciones para la fecha seleccionada
  selectedDate: string = ''; // Fecha seleccionada
  selectedHour: string=''; //Hora seleccionada

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getMovieById(id);
      this.getDatesForMovie(id);  // Obtener fechas de funciones
    });
  }

  private async getMovieById(id: string) {
    this.movieService.getMovieById(id)
      .then((movie) => {
        this.movie.set(movie);
        console.log('Movie:', movie);
      });
  }

  private async getDatesForMovie(id: string) {
    try {
      const dates = await this.movieService.getDatesFunctions(Number(id)); 
      this.dates = dates;
    } catch (error) {
      console.error('Error fetching movie dates:', error);
    }
  }

  async onDateSelected(date: string) {
    this.selectedDate = date; // Actualizamos la fecha seleccionada
    try {
      const functions = await this.movieService.getFunctionsByDate(Number(this.movie().id), date);
      // Formatear las horas de las funciones
      this.functions = functions.map(func => ({
        ...func,
        time_function: func.time_function.substring(0, 5) // Tomar solo "HH:mm"
      }));
      console.log('Functions for selected date:', this.functions);
    } catch (error) {
      console.error('Error fetching functions for selected date:', error);
    }
  }
  async onHourSelected(hour: string) {
    this.selectedHour= hour; // Actualizamos la hora seleccionada
    // try {
    //   const functions = await this.movieService.getFunctionsByDate(Number(this.movie().id), date);
    //   // Formatear las horas de las funciones
    //   this.functions = functions.map(func => ({
    //     ...func,
    //     time_function: func.time_function.substring(0, 5) // Tomar solo "HH:mm"
    //   }));
    //   console.log('Functions for selected date:', this.functions);
    // } catch (error) {
    //   console.error('Error fetching functions for selected date:', error);
    // }
  }
  
}
