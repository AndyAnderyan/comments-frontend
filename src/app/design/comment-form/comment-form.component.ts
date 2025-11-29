import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Comment} from "../../comments/models/comment.model"
import {NotificationRecipient} from "../../core/models/notification-recipient.model";

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.css'
})
export class CommentFormComponent implements OnInit{
  @Input() initialValue?: Comment

  @Input() submitLabel: string = 'Надіслати';

  @Output() cancel = new EventEmitter<void>();

  @Output() save = new EventEmitter<{ text: string; recipientsIds: string[] }>();

  form!: FormGroup;
  private fb = inject(FormBuilder);

  get text() {
    return this.form.get('text')
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      text: [
        this.initialValue?.text || '',
        [Validators.required, Validators.maxLength(2000)]
      ],

      notifyUserIds: [[]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { text, recipientIds } = this.form.value;
      this.save.emit({ text, recipientsIds: recipientIds })

      if (!this.initialValue) {
        this.form.reset();
      }
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
