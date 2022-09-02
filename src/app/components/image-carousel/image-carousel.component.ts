import { Component, Input, OnInit } from '@angular/core';

export interface ICarouselImage {
  url: string;
  caption?: string;
  alt?: string;
}

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit {
  @Input() images!: ICarouselImage[];  
  @Input() activeImageIndex = 0;
  @Input() lastIndexPosition!: number;
  @Input() config = {
    height: 100,
    width: 100,
  };

  constructor() { }

  ngOnInit(): void { this.lastIndexPosition = this.images.length - 1; }

  /* ------------------------------ USER CONTROLS ----------------------------- */
  onNext() {
    if (this.activeImageIndex >= this.lastIndexPosition) { this.activeImageIndex = 0; }
    else { this.activeImageIndex += 1; }
  }
  onPrevious() {
    if (this.activeImageIndex == 0) { this.activeImageIndex = this.lastIndexPosition; }
    else { this.activeImageIndex -= 1; }
  }
}
