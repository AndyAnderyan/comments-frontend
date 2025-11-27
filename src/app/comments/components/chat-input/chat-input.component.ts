import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import {User} from "../../../core/models/user.model";
import {CommentsApiService} from "../../services/comments-api.service";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {Comment} from "../../models/comment.model"

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css'
})
export class ChatInputComponent implements OnInit{
  @Input() replyTo: Comment | null = null;
  @Input() editingMessage: Comment | null = null;

  @Output() send = new EventEmitter<{ text: string, recipientsIds: string[] }>();
  @Output() cancelContext = new EventEmitter<void>();

  private apiService = inject(CommentsApiService);

  text = '';
  showRecipientsMenu = false;
  // Список користувачів для вибору (можна завантажити в ngOnInit)
  users = signal<Pick<User, 'id'|'name'>[]>([]);
  selectedRecipientsIds: string[] = [];

  ngOnInit() {
    this.apiService.getRecipients().subscribe(users => {
      this.users.set(users);
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editingMessage'] && this.editingMessage) {
      this.text = this.editingMessage.text;
    }
  }

  toggleRecipientsMenu(event: Event) {
    event.stopPropagation();
    this.showRecipientsMenu = !this.showRecipientsMenu;
  }

  toggleRecipient(userId: string) {
    if (this.selectedRecipientsIds.includes(userId)) {
      this.selectedRecipientsIds = this.selectedRecipientsIds.filter(id => id !== userId);
    } else {
      this.selectedRecipientsIds.push(userId);
    }
  }

  isSelected(userId: string): boolean {
    return this.selectedRecipientsIds.includes(userId);
  }

  onCancelContext() {
    this.text = '';
    this.cancelContext.emit();
  }

  onSend() {
    if (this.text.trim()) {
      this.send.emit({
        text: this.text,
        recipientsIds: this.selectedRecipientsIds
      });
      this.text = '';
      this.selectedRecipientsIds = []; // Очистити вибір після відправки
      this.showRecipientsMenu = false;
    }
  }

  closeMenu() {
    this.showRecipientsMenu = false;
  }
}
