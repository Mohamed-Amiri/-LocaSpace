import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GlassCardComponent } from '../shared/components/glass-card/glass-card.component';
import { ModernButtonComponent } from '../shared/components/modern-button/modern-button.component';
import { ModernSearchComponent } from '../shared/components/modern-search/modern-search.component';
import { PlaceCardComponent, PlaceCardData } from '../shared/components/place-card/place-card.component';


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
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  Math = Math;
  @ViewChild('howItWorksSection') howItWorksSection!: ElementRef;
  
  searchTerm = '';
  searchQuery = '';
  suggestions: string[] = [
    'Marrakech, Maroc',
    'Casablanca, Maroc', 
    'Rabat, Maroc',
    'Fès, Maroc',
    'Tanger, Maroc'
  ];
  showSuggestions = false;
  howItWorksVisible = false;

  // Popular places data
  popularPlaces: PlaceCardData[] = [
    {
      id: 1,
      name: 'Luxury Villa',
      location: 'Beverly Hills, CA',
      price: 120,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop',
      capacity: 12,
      type: 'Entire Villa',
      badges: ['Premium'],
      isFavorite: false
    },
    {
      id: 2,
      name: 'Modern Apartment',
      location: 'Manhattan, NY',
      price: 85,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
      capacity: 6,
      type: 'Apartment',
      badges: ['New'],
      isFavorite: false
    },
    {
      id: 3,
      name: 'Creative Office',
      location: 'San Francisco, CA',
      price: 65,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop',
      capacity: 8,
      type: 'Office Space',
      badges: ['Trending'],
      isFavorite: false
    }
  ];
  
  // Testimonials carousel
  testimonials = [
    {
      quote: 'LocaSpace has transformed how we organize events. Exceptional venues and impeccable service!',
      author: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      quote: 'Intuitive interface, quick booking, and spaces that always exceed our expectations. Perfect for our business meetings.',
      author: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      quote: 'Thanks to LocaSpace, I found the perfect space for my wedding. The team is responsive and professional.',
      author: 'Emma Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];
  
  currentTransform = 0;
  private testimonialInterval: any;
  private intersectionObserver!: IntersectionObserver;

  // Hero content animation style
  heroContentStyle = {
    animation: 'fadeInUp 1s ease-out'
  };

  ngOnInit() {
    this.startTestimonialCarousel();
    this.setupIntersectionObserver();
  }

  ngAfterViewInit() {
    if (this.howItWorksSection) {
      this.intersectionObserver.observe(this.howItWorksSection.nativeElement);
    }
  }

  ngOnDestroy() {
    this.stopTestimonialCarousel();
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.showSuggestions = value.length > 0;
  }

  selectSuggestion(suggestion: string) {
    this.searchTerm = suggestion;
    this.showSuggestions = false;
  }

  toggleFavorite(id: number) {
    const place = this.popularPlaces.find(p => p.id === id);
    if (place) {
      place.isFavorite = !place.isFavorite;
    }
    console.log('Toggle favorite for place:', id);
  }

  onSearch(searchData: {location: string, dates: string, guests: string}) {
    console.log('Search data:', searchData);
    // Redirect to search page with parameters
    // this.router.navigate(['/lieux'], { queryParams: searchData });
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

  private startTestimonialCarousel() {
    this.testimonialInterval = setInterval(() => {
      if (Math.abs(this.currentTransform) >= (this.testimonials.length - 1) * 100) {
        this.currentTransform = 0;
      } else {
        this.currentTransform -= 100;
      }
    }, 5000);
  }

  private stopTestimonialCarousel() {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
  }

  private setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.howItWorksVisible = true;
          }
        });
      },
      { threshold: 0.3 }
    );
  }
}
