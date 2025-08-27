import { Component, HostListener, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ModernSearchComponent } from '../shared/components/modern-search/modern-search.component';
import { PlaceCardComponent } from '../shared/components/place-card/place-card.component';

// Define the place interface
export interface PlaceCardData {
  id: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  capacity: number;
  type: string;
  badges: string[];
  isFavorite: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    ModernSearchComponent,
    PlaceCardComponent
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('howItWorksSection', { static: false }) howItWorksSection!: ElementRef;

  // Make Math available in template
  Math = Math;
  
  heroContentStyle: any = {};
  searchTerm: string = '';
  suggestions: string[] = [];
  showSuggestions: boolean = false;
  howItWorksVisible: boolean = false;

  // Popular places data
  popularPlaces: PlaceCardData[] = [
    {
      id: 1,
      name: 'Villa Luxueuse',
      location: 'Marrakech, Maroc',
      price: 120,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop',
      capacity: 12,
      type: 'Villa entière',
      badges: ['Premium'],
      isFavorite: false
    },
    {
      id: 2,
      name: 'Appartement Moderne',
      location: 'Casablanca, Maroc',
      price: 85,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
      capacity: 6,
      type: 'Appartement',
      badges: ['Nouveau'],
      isFavorite: false
    },
    {
      id: 3,
      name: 'Bureau Créatif',
      location: 'Rabat, Maroc',
      price: 65,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop',
      capacity: 8,
      type: 'Bureau',
      badges: ['Tendance'],
      isFavorite: false
    }
  ];

  // Testimonials Carousel
  testimonials = [
    {
      quote: "Grâce à LocaSpace, j'ai trouvé le lieu parfait pour mon shooting photo en quelques clics. Service client au top !",
      author: "Amina K.",
      avatar: "/assets/images/avatar1.jpg"
    },
    {
      quote: "La plateforme est intuitive et la variété des lieux proposés est incroyable. Je recommande vivement.",
      author: "Youssef L.",
      avatar: "/assets/images/avatar2.jpg"
    },
    {
      quote: "Louer mon bureau inoccupé sur LocaSpace a été une excellente source de revenus supplémentaires. Simple et efficace.",
      author: "Fatima Z.",
      avatar: "/assets/images/avatar3.jpg"
    }
  ];
  
  currentTransform = 0;
  private currentIndex = 0;
  private carouselInterval: any;

  private allPossibleSuggestions = [
    'Villa à Marrakech',
    'Appartement à Casablanca',
    'Riad à Fès',
    'Bureau à Rabat',
    'Loft à Tanger',
    'Maison d\'hôte à Essaouira'
  ];

  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  startCarousel() {
    this.carouselInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
      this.currentTransform = -this.currentIndex * 100;
    }, 5000); // Change slide every 5 seconds
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollOffset = window.pageYOffset;
    // Parallax effect
    this.heroContentStyle = {
      transform: `translateY(${scrollOffset * 0.3}px)`
    };

    // Scroll-triggered animation check
    if (this.howItWorksSection && !this.howItWorksVisible) {
      const rect = this.howItWorksSection.nativeElement.getBoundingClientRect();
      const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
      if (rect.top <= viewHeight - 150) {
        this.howItWorksVisible = true;
      }
    }
  }

  onSearchChange(query: string) {
    if (query) {
      this.showSuggestions = true;
      this.suggestions = this.allPossibleSuggestions.filter(s =>
        s.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.showSuggestions = false;
      this.suggestions = [];
    }
  }

  selectSuggestion(suggestion: string) {
    this.searchTerm = suggestion;
    this.showSuggestions = false;
  }

  onSearch(searchData: {location: string, dates: string, guests: string}) {
    console.log('Search data:', searchData);
    // Redirect to search page with parameters
    // this.router.navigate(['/search'], { queryParams: searchData });
  }

  toggleFavorite(placeId: number) {
    const place = this.popularPlaces.find(p => p.id === placeId);
    if (place) {
      place.isFavorite = !place.isFavorite;
    }
    console.log(`Toggled favorite for place ${placeId}`);
  }

  // Testimonial carousel methods
  nextTestimonial() {
    if (Math.abs(this.currentTransform) < (this.testimonials.length - 1) * 100) {
      this.currentTransform -= 100;
    }
  }

  previousTestimonial() {
    if (this.currentTransform < 0) {
      this.currentTransform += 100;
    }
  }

  goToTestimonial(index: number) {
    this.currentTransform = -index * 100;
  }
}
