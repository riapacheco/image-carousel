import { Component } from '@angular/core';
import { ICarouselImage } from './components/image-carousel/image-carousel.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  parentImages: ICarouselImage[] = [
    {
      url: 'https://zwkbcfekyorurkjubugn.supabase.co/storage/v1/object/public/bucks/watchy_faces/watchy1.png?t=2022-09-01T22%3A04%3A27.297Z',
      caption: 'Standard digital clock',
      alt: ''
    },
    {
      url: 'https://zwkbcfekyorurkjubugn.supabase.co/storage/v1/object/public/bucks/watchy_faces/watchy2.png?t=2022-09-01T22%3A06%3A12.323Z',
      caption: 'Digital clock with date, weather, and steps',
      alt: ''
    },
    {
      url: 'https://zwkbcfekyorurkjubugn.supabase.co/storage/v1/object/public/bucks/watchy_faces/watchy3.png',
      caption: 'Pokemon themed watch face',
      alt: '',
    },
    {
      url: 'https://zwkbcfekyorurkjubugn.supabase.co/storage/v1/object/public/bucks/watchy_faces/watchy5.png',
      caption: 'Tetris themed watch face',
      alt: '',
    },
    {
      url: 'https://zwkbcfekyorurkjubugn.supabase.co/storage/v1/object/public/bucks/watchy_faces/watchy6.png',
      caption: 'Paint program themed watch face',
      alt: '',
    },
    {
      url: 'https://zwkbcfekyorurkjubugn.supabase.co/storage/v1/object/public/bucks/watchy_faces/watchy7.png',
      caption: 'Sports watch themed face',
      alt: '',
    },
    {
      url: 'https://zwkbcfekyorurkjubugn.supabase.co/storage/v1/object/public/bucks/watchy_faces/watchy8.png',
      caption: 'Binary watch face',
      alt: '',
    },
    {
      url: 'https://zwkbcfekyorurkjubugn.supabase.co/storage/v1/object/public/bucks/watchy_faces/watchy9.png',
      caption: 'Fancy watch face',
      alt: '',
    },
    {
      url: 'https://zwkbcfekyorurkjubugn.supabase.co/storage/v1/object/public/bucks/watchy_faces/watchy12.jpg',
      caption: 'Cat face watch face',
      alt: '',
    },
    {
      url: 'https://zwkbcfekyorurkjubugn.supabase.co/storage/v1/object/public/bucks/watchy_faces/watchy14.png',
      caption: 'PowerShell themed watch face',
      alt: '',
    }
  ];
}
