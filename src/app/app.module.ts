import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ImageCarouselComponent } from './components/image-carousel/image-carousel.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageCarouselComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
