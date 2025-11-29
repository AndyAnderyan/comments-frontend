import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ReplyMessageData {
  id: string;
  author: string;
  content: string;
  time: string;
  replyTo?: {
    id: string;
    author: string;
    content: string;
  };
}

@Component({
  selector: 'app-reply-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reply-message.component.html',
  styleUrls: ['./reply-message.component.css']
})
export class ReplyMessageComponent {
  @Input() message!: ReplyMessageData;
  @Input() showActions: boolean = true;
  @Input() maxReplyLength: number = 100;

  @Output() reply = new EventEmitter<ReplyMessageData>();
  @Output() more = new EventEmitter<ReplyMessageData>();
  @Output() replyClick = new EventEmitter<string>(); // Для переходу до оригінального повідомлення

  onReply() {
    this.reply.emit(this.message);
  }

  onMore() {
    this.more.emit(this.message);
  }

  onReplyToClick() {
    if (this.message.replyTo) {
      this.replyClick.emit(this.message.replyTo.id);
    }
  }

  get truncatedReplyContent(): string {
    if (!this.message.replyTo) return '';
    
    const content = this.message.replyTo.content;
    if (content.length <= this.maxReplyLength) {
      return content;
    }
    
    return content.substring(0, this.maxReplyLength) + '...';
  }

  get hasReply(): boolean {
    return !!this.message.replyTo;
  }
}
