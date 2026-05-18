import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-messaging-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messaging-panel.component.html',
  styleUrls: ['./messaging-panel.component.scss']
})
export class MessagingPanelComponent {
  @Input() isOpen = false;
  @Output() closePanel = new EventEmitter<void>();

  // UI State
  activeConversation: any = null;

  // Mock Data
  conversations = [
    {
      id: 1,
      name: 'Sophie Martin',
      avatar: 'SM',
      lastMessage: 'Bonjour, l\'appartement est-il toujours disponible pour le 15 ?',
      time: '14:30',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Jean Dupont',
      avatar: 'JD',
      lastMessage: 'Parfait, merci beaucoup !',
      time: 'Hier',
      unread: 0,
      online: false
    },
    {
      id: 3,
      name: 'Marie Leroy',
      avatar: 'ML',
      lastMessage: 'À quelle heure pouvons-nous faire la remise des clés ?',
      time: 'Lun',
      unread: 0,
      online: true
    }
  ];

  messages = [
    { id: 1, sender: 'them', text: 'Bonjour, je suis très intéressée par votre espace.', time: '14:20' },
    { id: 2, sender: 'me', text: 'Bonjour Sophie ! Oui, il est toujours disponible.', time: '14:25' },
    { id: 3, sender: 'them', text: 'Super ! Est-il possible de le visiter ce vendredi ?', time: '14:30' }
  ];

  onClose() {
    this.closePanel.emit();
  }

  openConversation(conv: any) {
    this.activeConversation = conv;
  }

  closeConversation() {
    this.activeConversation = null;
  }
}
