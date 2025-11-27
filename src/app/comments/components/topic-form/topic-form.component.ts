import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-topic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './topic-form.component.html',
  styleUrls: ['./topic-form.component.css']
})
export class TopicFormComponent implements OnInit {
  @Input() placeholder: string = 'Напишіть тему обговорення';
  @Input() disabled: boolean = false;

  @Output() back = new EventEmitter<void>();
  @Output() create = new EventEmitter<{ topic: string }>();

  private fb = inject(FormBuilder);
  topicForm!: FormGroup;

  ngOnInit() {
    this.topicForm = this.fb.group({
      topic: ['', [Validators.required, Validators.maxLength(200)]]
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

  get topic() {
    return this.topicForm.get('topic');
  }

  get isCreateDisabled(): boolean {
    return this.disabled || !this.topicForm.valid || !this.topic?.value?.trim();
  }
}
