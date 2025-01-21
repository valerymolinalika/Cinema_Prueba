import { Injectable } from '@angular/core';
import axios from 'axios';
import { Movie } from './../models/movie.models';
import { MovieFunction } from '../models/movie_function.models';
import { parse, format } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl = 'http://localhost:3001';

  constructor() { }
  async getMovies(): Promise<Movie[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/movies`);
      return response.data;
    } catch (error) {
      console.error('Error getting the films:', error);
      throw error;
    }
  }

  async getMovieById(id: string): Promise<Movie> {
    try {
      const response = await axios.get(`${this.apiUrl}/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting the movie:', error);
      throw error;
    }
  }

  async createMovie(movie: Movie): Promise<Movie> {
    try {
      const response = await axios.post(`${this.apiUrl}/movies/add`, movie);
      return response.data;
    } catch (error) {
      console.error('Error creating the movie:', error);
      throw error;
    }
  }

  async getDatesFunctions(movieId: number): Promise<string[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/movie_function/movie/dates`, {
        params: { movie_id: movieId },
      });
      console.log('Dates retrieved:', response.data.dates);
      return response.data.dates.map((dateObj: { date_function: string }) => {
        const date = new Date(dateObj.date_function);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });  
      });
    } catch (error) {
      console.error('Error getting the dates:', error);
      throw error;
    }
  }

  async getFunctionsByDate(movieId: number, date: string): Promise<MovieFunction[]> {
    try {
      console.log('Getting functions for movie:', movieId, 'and date:', date);
      const monthMap: { [key: string]: string } = {
        'ene': '01',
        'feb': '02',
        'mar': '03',
        'abr': '04',
        'may': '05',
        'jun': '06',
        'jul': '07',
        'ago': '08',
        'sep': '09',
        'oct': '10',
        'nov': '11',
        'dic': '12'
      };

      const [day, month] = date.split(' ');

      const formattedDate = `2025-${monthMap[month]}-${day.padStart(2, '0')}`;

      const isoDate = new Date(formattedDate);
      if (isNaN(isoDate.getTime())) {
        throw new Error('Invalid date format');
      }

      console.log('ISO date:', isoDate.toISOString());

      const response = await axios.get(`${this.apiUrl}/movie_function/functions`, {
        params: { movie_id: movieId, date_function: isoDate.toISOString().split('T')[0] },
      });

      console.log('Functions retrieved:', response.data.functions);
      return response.data.functions;
    } catch (error) {
      console.error('Error getting the functions:', error);
      throw error;
    }
  }

  async updateUserAvailability(id: number, available: boolean): Promise<string> {
    try {
      const response = await axios.put(`${this.apiUrl}/movies/available`, {
        id,
        available,
      });
      console.log('Movie availability updated:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        'Error while updating user availability:',
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data || 'Error while updating user availability'
      );
    }
  }

  async createMovieFunction(movieFunction: MovieFunction): Promise<MovieFunction> {
    try {
      const response = await axios.post(`${this.apiUrl}/movie_function/add`, movieFunction);
      console.log('Movie function created:', response.data);
      return response.data.function; 
    } catch (error) {
      console.error('Error creating movie function:', error);
      throw error;
    }
  }

  async editMovie(id: number, movie: Movie): Promise<Movie> {
    try {
      const response = await axios.put(`${this.apiUrl}/movies/edit/${id}`, movie);
      return response.data;
    } catch (error) {
      console.error('Error editing movie:', error);
      throw error;
    }
  }

}