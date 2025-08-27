-- Insert sample users (passwords are 'Password123!' encoded with BCrypt)
-- Password123! meets the new requirements: uppercase, lowercase, digit, special character
INSERT INTO users (nom, email, mot_de_passe, role) VALUES 
('Admin User', 'admin@locaspace.com', '$2a$10$N.zmdr9k7uOCQb97.AnbeOm7vL3N3.H7/8GJnZMKrhuuNjHiXq9Xa', 'ADMIN'),
('Jean Dupont', 'jean@example.com', '$2a$10$N.zmdr9k7uOCQb97.AnbeOm7vL3N3.H7/8GJnZMKrhuuNjHiXq9Xa', 'PROPRIETAIRE'),
('Marie Martin', 'marie@example.com', '$2a$10$N.zmdr9k7uOCQb97.AnbeOm7vL3N3.H7/8GJnZMKrhuuNjHiXq9Xa', 'LOCATAIRE'),
('Test Tenant', 'tenant@test.com', '$2a$10$N.zmdr9k7uOCQb97.AnbeOm7vL3N3.H7/8GJnZMKrhuuNjHiXq9Xa', 'LOCATAIRE'),
('Test Owner', 'owner@test.com', '$2a$10$N.zmdr9k7uOCQb97.AnbeOm7vL3N3.H7/8GJnZMKrhuuNjHiXq9Xa', 'PROPRIETAIRE'),
('Test Admin', 'admin@test.com', '$2a$10$N.zmdr9k7uOCQb97.AnbeOm7vL3N3.H7/8GJnZMKrhuuNjHiXq9Xa', 'ADMIN');

-- Insert sample lieux
INSERT INTO lieux (titre, description, type, prix, adresse, valide, owner_id) VALUES 
('Villa Spacieuse avec Piscine', 'Une magnifique villa offrant une vue imprenable sur la mer. Profitez de la tranquillité et du luxe avec une piscine privée, un grand jardin et un intérieur moderne.', 'Villa', 350.00, 'Nice, France', true, 2),
('Appartement Moderne Centre-Ville', 'Un appartement chic et moderne au cœur de Paris. À quelques pas des principales attractions, des boutiques et des restaurants. Parfait pour un séjour en ville.', 'Appartement', 120.00, 'Paris, France', true, 2),
('Maison de Campagne Charmante', 'Évadez-vous dans cette charmante maison de campagne entourée de vignobles. Un havre de paix avec tout le confort moderne. Idéal pour les amateurs de vin et de nature.', 'Maison', 210.00, 'Bordeaux, France', false, 2);

-- Insert sample photos
INSERT INTO lieu_photos (lieu_id, photo_url) VALUES 
(1, 'https://images.unsplash.com/photo-1613977257363-31b5a15e3a2b?q=80&w=2070&auto=format&fit=crop'),
(1, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop'),
(2, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop'),
(2, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'),
(3, 'https://images.unsplash.com/photo-1559949339-724155133a83?q=80&w=1974&auto=format&fit=crop');

-- Insert sample reservations
INSERT INTO reservations (date_debut, date_fin, statut, user_id, lieu_id) VALUES 
('2024-03-15', '2024-03-17', 'CONFIRMEE', 3, 1),
('2024-04-01', '2024-04-05', 'EN_ATTENTE', 3, 2);

-- Insert sample reviews
INSERT INTO avis (note, commentaire, user_id, lieu_id) VALUES 
(5, 'Absolument parfait ! La vue est encore plus belle en vrai.', 3, 1),
(4, 'Super séjour, la villa est très confortable. Un petit bémol pour le wifi un peu lent.', 3, 1),
(5, 'Emplacement idéal, appartement très propre et bien équipé. Je recommande !', 3, 2);