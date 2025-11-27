import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Comment} from "../../models/comment.model";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-message-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.css'
})
export class MessageItemComponent {
  @Input({ required: true }) message!: Comment;
  @Input() isMine = false;

  @Output() reply = new EventEmitter<Comment>();
  @Output() pin = new EventEmitter<Comment>();
  @Output() hide = new EventEmitter<Comment>();
  @Output() edit = new EventEmitter<Comment>();
  @Output() delete = new EventEmitter<string>();
  @Output() quoteClick = new EventEmitter<string>();

  isMenuOpen = false;

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  onAction(action: 'reply' | 'pin' | 'hide' | 'edit' | 'delete') {
    this.closeMenu();
    switch (action) {
      case 'reply': this.reply.emit(this.message); break;
      case 'pin': this.pin.emit(this.message); break;
      case 'hide': this.hide.emit(this.message); break;
      case 'edit': this.edit.emit(this.message); break;
      case 'delete': this.delete.emit(this.message.id); break;
    }
  }

  onQuoteClick() {
    if (this.message.parent) {
      this.quoteClick.emit(this.message.parent.id);
    }
  }
}
