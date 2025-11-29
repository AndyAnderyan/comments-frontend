import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {User} from "../../../core/models/user.model";
import {UserSelectorComponent} from "../user-selector/user-selector.component";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-topic-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule
  ],
  templateUrl: './topic-form.component.html',
  styleUrl: './topic-form.component.css'
})
export class TopicFormComponent {
  @Input() placeholder: string = 'Напишіть тему обговорення';
  @Input() disabled: boolean = false;

  @Output() back = new EventEmitter<void>();
  @Output() create = new EventEmitter<{ topic: string }>();

  private fb = inject(FormBuilder);
  topicForm!: FormGroup;

  ngOnInit() {
    this.topicForm = this.fb.group({
      topic: ['', [Validators.required, Validators.maxLength(2000)]]
    });
  }

  onBack() {
    this.back.emit();
  }

  onCreate() {
    if (this.topicForm.valid) {
      const topic = this.topicForm.get('topic')?.value.trim();
      if (topic) {
        this.create.emit({ topic });
        this.topicForm.reset();
      }
    }
  }

  get isCreateDisabled(): boolean {
    return this.topicForm.invalid || this.disabled || !this.topicForm.get('topic')?.value?.trim();
  }
}
