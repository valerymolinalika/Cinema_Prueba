import { Routes } from '@angular/router';
import { HomeComponent } from '@info/pages/home/home.component';
import { LayoutComponent } from '@user/layout/layout.component';
import { InfoMovieComponent } from '@info/pages/info-movie/info-movie.component';
import { CineComponent } from '@user/cine/cine.component';

export const routes: Routes = [

    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            }
        ]
        
    }, 
    {
        path: 'info-movie/:id',
        component: LayoutComponent,
        children:[
            {
                path: '',
                component: InfoMovieComponent
            },
            
        ]
    }

];
