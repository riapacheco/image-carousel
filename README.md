With Angular, one developer might create a component that leans mostly on the template's logic (e.g. using the `*ngSwitch` directive), while another might create the same component leaning entirely on methods from the component itself, while another might have it dominantly rely on the structure of the data it's created for. 

This post walks through the creation of a custom/reusable image carousel to help anyone new to the framework see a few of the tool's best low-level features in action: in-template directives, lifecycle hook methods, and dynamic component-to-template data-binding.

It's also just useful, if you like its simplicity/flexibility, for future copy/paste logic (avoiding broken libraries).



[toc]

# App Creation and Dependencies

First, we'll create a new app with the `--skip-tests` flag so that anything we generate through the `@angular/cli` won't include test files. To keep this high-level, we'll also install my SCSS package for access to shorthand classes and colors.

```bash
# Command Line 

# 1️⃣ Create the app
ng new ng-carousel --skip-tests

# 2️⃣ Install yutes
npm install @riapacheco/yutes
```



#### SCSS Import

In your `styles.scss` file, add the following code:

```scss
// styles.scss

@import '~@riapacheco/yutes/main.scss';         // Reset default styles & access shorthand classes
@import '~@riapacheco/yutes/season/two.scss';   // Access colors

html {
  font-size: 10px;
  font-family: "Inter", sans-serif;
}
body {
  font-size: 1.6rem;
}
```



#### CommonModule

Don't forget to add the `CommonModule` so that we have access to directives.

```typescript
// Add this ⤵️
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [ AppComponent ],
  imports: [
    BrowserModule,
    // ⬇️ and this
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```



#### Material Icons

We'll use Google's Material Icons by adding the following snippet within the `<head>` element of the `index.html` file:

```html
<!--index.html-->

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>NgCarousel</title>

  <!-- Add Material Icons here ⤵️ -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```



# Setting Up the Component

To make this component reusable in the most effective way possible, we first take into account the **data schema** it will accept and any **properties that might drive or react to user controls**. We consider the data schema since the directives found in templates often shape themselves *around* the structure that data provides and we consider behavioral properties since they define the user's experience (and this one is pretty predictable).

### The Image Carousel Component

Generate a new component by running the following command

```bash
# Command Line
ng g c components/image-carousel
```

Replace the content found in the `app.component.html` file with the new component's selector. I've added a couple classes from `@riapacheco/yutes` to make things a bit easier on our eyes:

```html
<!--app.component.html-->
<div class="mx-auto-200px pt-5">
  <app-image-carousel></app-image-carousel>
</div>
```

* The `mx-auto-200px` is a shorthand class from the yutes package that gives the div the width of the pixels specified (before the `px`) and centers it horizontally
* The `pt-5` is a shorthand class for `padding-top: 5rem;`



When you run `$ ng serve` in your terminal, you should see the following on `http://localhost:4200`

![image-20220901162238947](/Users/riapacheco/Library/Application Support/typora-user-images/image-20220901162238947.png)



### Carousel Image Data Schema

In the component file, we'll create an exported **interface** that defines the properties of a single image and the types of data accepted for each of those properties.

```typescript
// image-carousel.component.ts
import { Component, OnInit } from '@angular/core';

// Add this interface ⤵️
export interface ICarouselImage {
  url: string;
  caption?: string;	// the `?` indicates optional data that won't return an error if missing
  alt?: string;
}

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit {
  constructor() { }
  ngOnInit(): void {}
}
```

> Note: Within the interface, the `?` indicates that the property its attached to is optional and consequently won't return an error if missing from the data

### A Property for an Active Image

Since image carousels focus and render only one image at a time, we'll create a property on our component that will tell our template which image to display based on its index. Since an array's index starts at `0` (not `1`), we'll assign `0` to the property so it knows to render the first image when the component initializes.

```typescript
// image-carousel.component.ts
// .. other code
export class ImageCarouselComponent implements OnInit {
  // ⤵️ Add this property
  activeImageIndex = 0;
  
  constructor() { }
  ngOnInit(): void {}
}
```



### Width and Height Properties

Since the component will be placed in containers controlled by a parent (which impact dimensions unpredictably), we want to add properties that enable any parent to adjust the component's container and image dimensions if required. To do this, we'll add properties to the component file that can bind to the template like this:

```typescript
// image-carousel.component.ts
// ... other code
export class ImageCarouselComponent implements OnInit {
  activeImageIndex = 0;
  // ⤵️ add this
  config = {
    height: 100,
    width: 100,
  };
  constructor() { }

  ngOnInit(): void {}
}
```



### Actual Image Data

We'll add some placeholder data that a parent component will later replace. In the component file, create an `images` property to the type of `ICarouselImage` as an array (by adding a `[]` suffix to the type):

```typescript
// image-carousel.component.ts

// ...other code

export class ImageCarouselComponent implements OnInit {
  activeImageIndex = 0;
  config = {
    height: 100,
    width: 100,
  };
  
  // Add this ⤵️
  images: ICarouselImage[] = [
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
  
  constructor() { }

  ngOnInit(): void {}
}
```

# Creating the Template

### The Dynamic Template

First, add the following the component's `scss` file so that we have a simple outline showing us where the images should appear:

```scss
// image-carousel.component.scss
.carousel-container {
  padding: 5px;
  border: 1px solid black;
  border-radius: 3px;
}
```



In the template, add the following (explained below snippet):

```html
<!--1️⃣: div wrapper -->
<div class="carousel-container"
  [style.height.%]="config.height"
  [style.width.%]="config.width">
  
  <!-- ---------------------------- 2️⃣: Buttons ----------------------------- -->
  <a class="carousel-btn previous">
    <i class="material-icons">chevron_left</i>
  </a>
  <a class="carousel-btn next">
    <i class="material-icons">chevron_right</i>
  </a>

  <!-- ---------------------------- 3️⃣: Wrapper ----------------------------- -->
  <div *ngFor="let image of images; let i = index;" class="carousel-wrapper">
    <!--4️⃣: ng-container -->
    <ng-container *ngIf="i == activeImageIndex">
      <!--5️⃣: image-->
      <img
        [src]="image.url" 
        [alt]="image.alt"
        [style.height.%]="config.height"
        [style.width.%]="config.width">
    </ng-container>
  </div>
</div>

```

#### What's Happening Here?

| **Element #**     | **Summary**                                                  |
| ----------------- | ------------------------------------------------------------ |
| (1) `div wrapper` | - Containing `div` that applies styles we added earlier<br />- Uses Angular's `[style]` directive to access the div's `width` and `height`<br />- Assigns the component's `config` values to their associated properties as percentages |
| (2) buttons       | - Add 2 buttons (utilizing `Material Icons`) to act as user controls |
| (3) wrapper       | - The actual carousel wrapper that binds the `images` array data from the component; and<br />- Instantiates any actions contained with `let i = index` |
| (4) ng-container  | - Uses Angular's `ng-container`, which ensures the div is not present in the DOM unless the expression following `*ngIf` returns true<br />- Allows only the `active` image to render by only allowing an index position equal to the position specified by the component's `activeImageIndex` property |
| (5) img element   | - Binds the image url which was initially bounded by the `*ngFor` wrapper but narrowed down by the enclosing `ng-container`'s expression<br />- Utilizes the same `width` and `height` properties as the component's wrapping div |



Now if you serve the app locally, it should look similar to this:

![image-20220901180028330](/Users/riapacheco/Library/Application Support/typora-user-images/image-20220901180028330.png)



### Next and Previous Buttons

Though the buttons don't look too bad here, we'd like for the buttons to hover over the image so that the component is as tight (and predictable) as possible, for any parent component styles to influence.

In our component's `scss` file, we'll create some basic styling and some structural properties to control how the buttons are positioned in the container:

```scss
.carousel-container {
  padding: 5px;
  border: 1px solid black;
  border-radius: 3px;

  // enables and contains nested `absolute` elements
  position: relative;

  /* ------------------------- Style for BOTH buttons ------------------------- */
  a.carousel-btn {
    // Some quick styles
    color: white;
    background-color: black;
    border-radius: 2px;

    // enables control of position within the relative container
    position: absolute;

    // General width and height of buttons
    width: 3rem;
    height: 3rem;

    // Ensures the icon is centered within the button
    display: inline-flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;

    // Ensures the buttons are centered vertically with math
    top: calc(50% - (3rem / 2)); // calc({half of container height} - ({half of button height})) 

    /* ------------------------- Styles for Each Button ------------------------- */
    &.previous { left: 0; }
    &.next { right: 0; }
  }
}
```



If you view the served app, the buttons look pretty abnoxious.

![image-20220901181614386](/Users/riapacheco/Library/Application Support/typora-user-images/image-20220901181614386.png)

However, first we'll make sure the buttons do as we want them to [UX] before addressing design issues [UI].



### Show Next Image

Since our reusable component accepts dynamic data, in that we can have as many images as we want in the `images` array, we need to identify the array's length (count of images) when the component initializes so that any user control logic we implement (for "next" or "previous" buttons) have min / max thresholds to work with when it's time to reset the carousel back to the first image.

To do this, we'll declare a new property in the component called `lastIndexPosition` to the type of `number` and assign value to it when the component initializes. Don't forget to assign the length of the `images` array **minus 1**, since array data starts with `0` instead of `1`.

```typescript
// image-carousel.component.ts
// ... other code

export class ImageCarouselComponent implements OnInit {
  
  activeImageIndex = 0;
  // ⤵️ Add this property
  lastIndexPosition!: number;
  config = {
    height: 100,
    width: 100,
  };
  images: ICarouselImage[] = [
    //... other code
  ];
  
  ngOnInit(): void {
    // ⤵️ And this
    this.lastIndexPosition = this.images.length - 1;
  }
}
```



Now we can create an `onNext()` method that knows to update the `activeImageIndex` property with the next available index position, but will reset it to `0` if it's currently on the last image:

```typescript
export class ImageCarouselComponent implements OnInit {
  activeImageIndex = 0;
  lastIndexPosition!: number;
  config = {...};
  images: ICarouselImage[] = [...];
  
  ngOnInit(): void {
    this.lastIndexPosition = this.images.length - 1;
  }

	// IF the current image is the last one in the array, reset to the first
	// ELSE add (and self-assign) 1 to the current position ⤵️
	onNext() {
    if (this.activeImageIndex >= this.lastIndexPosition) { this.activeImageIndex = 0; }
    else { this.activeImageIndex += 1; }
  }
}
```



For our `onPrevious()` control, we'll first identify if the current image is the first one in the array. If it is, it will reset to the last image in the array. Below the `onNext()` method, add the following:

```typescript
// IF the current image is the first in the array, show the last image
// ELSE subtract (and self-assign) 1 to the current position
onPrevious() {
  if (this.activeImageIndex == 0) { this.activeImageIndex = this.lastIndexPosition; }
  else { this.activeImageIndex -= 1; }
}
```



Now if you add the methods to the template, you'll see that the buttons enable you to cycle through the images as you'd expect!

![Next and previous buttons](https://zwkbcfekyorurkjubugn.supabase.co/storage/v1/object/public/bucks/watchy_faces/clickWatchFaces.gif?t=2022-09-02T01%3A03%3A06.437Z)

### Finishing Styling

#### Remove Highlighting on Buttons

Notice how the icons themselves sometimes highlight from the click. This is because the icons are rendered as text and typically we like highlighting text so that we can copy it or select it for print. However, in cases like these, we can remove this with the following code added to the buttons:

```scss
a.carousel-btn {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

#### Appear Only on Hover

As we said earlier, though the buttons themselves are useful, they get in the way of the actual image we're trying to view. To fix this (I'm sure you already know this), just add an `opacity` property to the buttons with a value of `0` and when the overall wrapper experiences the `:hover` event, set the `opacity` to `1`:

```scss
a.carousel-btn {
  opacity: 0;
}

// HOVER state
.carousel-container:hover {
  a.carousel-btn {
    opacity: 1;
    transition: 180ms ease-in-out; // threw this in for funsies
  }
}
```



# Make It Reusable

### What Does "Reusable" Mean?

In this MVVM world, there are _smart_ components and there are _dumb_ components. Smart component (also known as _Parent_ components) should have all the data, talk to services if they need that data, and should gain access to any _dumb_ component controls. Though dumb (or *child*) components will use decorators and emitters to be able to communicate with their parent, when generally looking at a Smart component's `TypeScript` file, there shouldn't be any traces of that child component's logic (with some exceptions).

For this example, our `ImageCarouselComponent` is the child component and our `AppComponent` is the parent. Though, any other component, where the `<app-image-carousel></app-image-carousel>` selector is placed inside, would also be considered a parent component. We're using the `AppComponent` here to limit the work.

Since the carousel's selector is already inside the `AppComponent`'s template file, we can 

## Prepare the Parent with Switchover Controls

### Parent Data

Since the parent `AppComponent` will use the same data structure, we'll add the same data from the child component to the parent (named `parentImages` for differentiation). In the `app.component.ts` file, add the following:

```typescript
import { Component } from '@angular/core';
// Import interface ⤵️
import { ICarouselImage } from './components/image-carousel/image-carousel.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // Add the data ⤵️ the same as we did to the 
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

```

### Make Child Data Open to all Parent Components

To signal to the app that parent components can access and provide data for the `images` property in the child component, we import the `Input` decorator from `@angular/core` and add it to the property as a prefix.

```typescript
// image-carousel.component.ts
// Import decorator ⤵️
import { Component, Input, OnInit } from '@angular/core';

// other code

export class ImageCarouselComponent implements OnInit {
  // ⬇️ Prefix it here
  @Input() images: ICarouselImage[] = [ ... ];
}
```

### Complete the Connection

To completely switchover control of this property, we bind the data from one component to the other through the selector itself. In the `app.component.html` file, add the following to the child component's selector:

```html
<!--app.component.html-->
<div class="mx-auto-200px pt-5">
  <app-image-carousel
    [images]="parentImages">
  </app-image-carousel>
</div>
```

* Any references added to an element using `[]` indicate a binding of data (as opposed to `()` which binds events)
* This shows that the data from the child component (on the left side of the `=`) is now bound to the data in the parent component which has the same structure

Now you can remove the data inside the child component like this:

```typescript
// image-carousel.component.ts
export class ImageCarouselComponent implements OnInit {
  @Input() images!: ICarouselImage[];
}
```

### Provide the Other Inputs

Now we can do the same for the other properties like `config` and `activeImageIndex` (if you wanted to start at a different position). 

```typescript
// image-carousel.component.ts
export class ImageCarouselComponent implements OnInit {
  @Input() images!: ICarouselImage[];  
  @Input() activeImageIndex = 0;
  @Input() lastIndexPosition!: number;
  @Input() config = {
    height: 100,
    width: 100,
  };
}
```



# Result

![Hover Controls](https://zwkbcfekyorurkjubugn.supabase.co/storage/v1/object/public/bucks/watchy_faces/HoverControlsWatchy.gif?t=2022-09-02T01%3A12%3A46.265Z)