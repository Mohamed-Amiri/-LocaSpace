import { Injectable } from '@angular/core';
import { Lieu, Review, Host } from './lieu.model';

@Injectable({
  providedIn: 'root'
})
export class LieuService {
  private lieux: Lieu[] = [
    {
      id: 1,
      titre: 'Villa Spacieuse avec Piscine',
      ville: 'Nice',
      prix: 350,
      type: 'Villa',
      description: 'Une magnifique villa offrant une vue imprenable sur la mer. Profitez de la tranquillité et du luxe avec une piscine privée, un grand jardin et un intérieur moderne.',
      photo: 'https://images.unsplash.com/photo-1613977257363-31b5a15e3a2b?q=80&w=2070&auto=format&fit=crop',
      photos: [
        'https://images.unsplash.com/photo-1613977257363-31b5a15e3a2b?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop'
      ],
      lat: 43.7102,
      lng: 7.2620,
      reviews: [
        { user: 'Alice', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', rating: 5, comment: 'Absolument parfait ! La vue est encore plus belle en vrai.' },
        { user: 'Marc', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', rating: 4, comment: 'Super séjour, la villa est très confortable. Un petit bémol pour le wifi un peu lent.' }
      ],
      note: 4.5,
      equipements: ['Piscine', 'WiFi', 'Parking', 'Cuisine', 'Climatisation', 'TV', 'Lave-linge', 'Sèche-linge', 'Chauffage', 'Jardin', 'Vue'],
      host: { 
        name: 'Jean', 
        avatar: 'https://i.pravatar.cc/150?u=host1',
        isSuperHost: true,
        isIdentityVerified: true,
        guestCount: 245,
        rating: '4.9',
        reviewCount: '124',
        memberSince: 'janvier 2020',
        description: 'Passionné par l\'accueil et le partage, je serai ravi de vous faire découvrir ma villa et de vous aider à passer un séjour inoubliable.'
      },
      capacity: 8,
      bedrooms: 4,
      bathrooms: 3,
      locationDescription: 'Quartier calme et résidentiel, proche des transports en commun et des commerces. À 15 minutes à pied du centre-ville.'
    },
    {
      id: 2,
      titre: 'Appartement Moderne Centre-Ville',
      ville: 'Paris',
      prix: 120,
      type: 'Appartement',
      description: 'Un appartement chic et moderne au cœur de Paris. À quelques pas des principales attractions, des boutiques et des restaurants. Parfait pour un séjour en ville.',
      photo: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop',
      photos: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2057&auto=format&fit=crop'
      ],
      lat: 48.8566,
      lng: 2.3522,
      reviews: [
        { user: 'Chloé', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', rating: 5, comment: 'Emplacement idéal, appartement très propre et bien équipé. Je recommande !' }
      ],
      note: 4.8,
      equipements: ['Ascenseur', 'WiFi', 'Cuisine', 'TV', 'Chauffage', 'Vue'],
      host: { 
        name: 'Marie', 
        avatar: 'https://i.pravatar.cc/150?u=host2',
        isSuperHost: false,
        isIdentityVerified: true,
        guestCount: 87,
        rating: '4.7',
        reviewCount: '56',
        memberSince: 'mars 2021',
        description: 'Bonjour ! Je suis ravie de vous accueillir dans mon appartement parisien. N\'hésitez pas à me contacter pour toute question.'
      },
      capacity: 4,
      bedrooms: 2,
      bathrooms: 1,
      locationDescription: 'En plein cœur de Paris, à deux pas des Champs-Élysées et à 5 minutes à pied du métro.'
    },
    {
      id: 3,
      titre: 'Maison de Campagne Charmante',
      ville: 'Bordeaux',
      prix: 210,
      type: 'Maison',
      description: 'Évadez-vous dans cette charmante maison de campagne entourée de vignobles. Un havre de paix avec tout le confort moderne. Idéal pour les amateurs de vin et de nature.',
      photo: 'https://images.unsplash.com/photo-1559949339-724155133a83?q=80&w=1974&auto=format&fit=crop',
      photos: [
        'https://images.unsplash.com/photo-1559949339-724155133a83?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070&auto=format&fit=crop'
      ],
      lat: 44.8378,
      lng: -0.5792,
      reviews: [
        { user: 'Julien', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a', rating: 5, comment: 'Un véritable havre de paix. La maison est encore plus charmante que sur les photos.' },
        { user: 'Sophie', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b', rating: 4, comment: 'Très agréable, parfait pour se déconnecter.' }
      ],
      note: 4.6,
      equipements: ['Jardin', 'Cheminée', 'WiFi', 'Cuisine', 'Parking', 'Barbecue', 'Terrasse'],
      host: { 
        name: 'Luc', 
        avatar: 'https://i.pravatar.cc/150?u=host3',
        isSuperHost: true,
        isIdentityVerified: true,
        guestCount: 156,
        rating: '4.8',
        reviewCount: '78',
        memberSince: 'juin 2019',
        description: 'Amoureux de la nature et du vin, je serai heureux de vous accueillir dans ma maison de campagne et de vous faire découvrir les meilleurs vignobles de la région.'
      },
      capacity: 6,
      bedrooms: 3,
      bathrooms: 2,
      locationDescription: 'Située au cœur des vignobles bordelais, à 20 minutes en voiture du centre-ville de Bordeaux et à 10 minutes des premiers châteaux.'
    }
  ];

  constructor() { }

  getLieux() {
    return this.lieux;
  }

  getLieuById(id: number) {
    return this.lieux.find(lieu => lieu.id === id);
  }
}