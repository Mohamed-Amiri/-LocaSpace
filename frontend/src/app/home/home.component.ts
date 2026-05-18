import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModernSearchComponent } from '../shared/components/modern-search/modern-search.component';
import { PlaceCardComponent, PlaceCardData } from '../shared/components/place-card/place-card.component';
import { LieuService } from '../lieux/lieu.service';

interface Category {
  name: string;
  slug: string;
  emoji: string;
  count: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ModernSearchComponent,
    PlaceCardComponent
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  Math = Math;

  heroContentStyle: any = {};
  isScrolled = false;
  mobileNavOpen = false;
  isLoading = true;

  // Categories
  categories: Category[] = [
    { name: 'Villas', slug: 'villa', emoji: '🏠', count: 245 },
    { name: 'Bureaux', slug: 'bureau', emoji: '🏢', count: 189 },
    { name: 'Événements', slug: 'evenement', emoji: '🎉', count: 132 },
    { name: 'Studios', slug: 'studio', emoji: '🎨', count: 97 },
    { name: 'Appartements', slug: 'appartement', emoji: '🏬', count: 312 },
    { name: 'Salles', slug: 'salle', emoji: '🎪', count: 78 },
  ];

  // Popular places
  popularPlaces: PlaceCardData[] = [];

  // Testimonials
  testimonials = [
    {
      quote: "Grâce à LocaSpace, j'ai trouvé le lieu parfait pour mon shooting photo en quelques clics. Service client au top !",
      author: 'Amina K.',
      initials: 'AK'
    },
    {
      quote: "La plateforme est intuitive et la variété des lieux proposés est incroyable. Je recommande vivement.",
      author: 'Youssef L.',
      initials: 'YL'
    },
    {
      quote: "Louer mon bureau inoccupé sur LocaSpace a été une excellente source de revenus supplémentaires. Simple et efficace.",
      author: 'Fatima Z.',
      initials: 'FZ'
    }
  ];

  currentTransform = 0;
  private currentIndex = 0;
  private carouselInterval: any;

  constructor(private lieuService: LieuService) {}

  ngOnInit() {
    this.startCarousel();
    this.loadPopularPlaces();
  }

  ngOnDestroy() {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  private loadPopularPlaces() {
    this.isLoading = true;
    this.lieuService.getLieux$().subscribe({
      next: (lieux) => {
        this.popularPlaces = lieux.slice(0, 3).map(lieu => ({
          id: lieu.id,
          name: lieu.titre,
          location: lieu.ville,
          price: lieu.prix,
          rating: lieu.note || 4.5,
          image: lieu.photo || 'assets/placeholder.jpg',
          capacity: lieu.capacity || 0,
          type: lieu.type,
          badges: [],
          isFavorite: false
        }));
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private startCarousel() {
    this.carouselInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
      this.currentTransform = -this.currentIndex * 100;
    }, 5000);
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollOffset = window.pageYOffset;
    this.isScrolled = scrollOffset > 50;
  }

  toggleMobileNav() {
    this.mobileNavOpen = !this.mobileNavOpen;
  }

  onSearch(searchData: {location: string, dates: string, guests: string}) {
    console.log('Search data:', searchData);
  }

  toggleFavorite(id: number) {
    const place = this.popularPlaces.find(p => p.id === id);
    if (place) {
      place.isFavorite = !place.isFavorite;
    }
  }

  trackByPlaceId(index: number, place: PlaceCardData): number {
    return place.id;
  }

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
