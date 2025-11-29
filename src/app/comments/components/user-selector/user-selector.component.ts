import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {User} from "../../../core/models/user.model";

@Component({
  selector: 'app-user-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-selector.component.html',
  styleUrl: './user-selector.component.css'
})
export class UserSelectorComponent {
  @Input() users: User[] = [];
  @Input() selectedIds: string[] = [];
  @Output() selectionChange = new EventEmitter<string[]>();

  isOpen = false;

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  closeMenu() {
    this.isOpen = false;
  }

  toggleUser(userId: string) {
    const newSelection = this.selectedIds.includes(userId)
    ? this.selectedIds.filter(id => id !== userId)
      : [...this.selectedIds, userId];

    this.selectionChange.emit(newSelection);
  }

  isSelected(userId: string): boolean {
    return this.selectedIds.includes(userId);
  }
}
