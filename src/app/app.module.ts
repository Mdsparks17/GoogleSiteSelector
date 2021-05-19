import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule } from '@agm/core';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from "@angular/core"; 

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MarkerDirective } from './marker.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { MatSliderModule } from '@angular/material/slider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [
    AppComponent,
    MarkerDirective
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCj9Y0aFN5j8mAGmBw6aVxR0pjasMZgDGw'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    NgMultiSelectDropDownModule.forRoot(),
    AngularMultiSelectModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatNativeDateModule
  ],
  providers: [],
  schemas:[NO_ERRORS_SCHEMA], 
  bootstrap: [AppComponent]
})


export class AppModule { }
