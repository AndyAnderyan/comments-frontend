import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { TopicFormComponent } from './topic-form.component';

describe('TopicFormComponent', () => {
  let component: TopicFormComponent;
  let fixture: ComponentFixture<TopicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicFormComponent, ReactiveFormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty topic field', () => {
    expect(component.topic?.value).toBe('');
  });

  it('should emit back event when back button is clicked', () => {
    spyOn(component.back, 'emit');
    component.onBack();
    expect(component.back.emit).toHaveBeenCalled();
  });

  it('should emit create event when form is valid and create is called', () => {
    spyOn(component.create, 'emit');
    component.topicForm.patchValue({ topic: 'Test topic' });
    component.onCreate();
    expect(component.create.emit).toHaveBeenCalledWith({ topic: 'Test topic' });
  });

  it('should not emit create event when form is invalid', () => {
    spyOn(component.create, 'emit');
    component.topicForm.patchValue({ topic: '' });
    component.onCreate();
    expect(component.create.emit).not.toHaveBeenCalled();
  });

  it('should not emit create event when topic is only whitespace', () => {
    spyOn(component.create, 'emit');
    component.topicForm.patchValue({ topic: '   ' });
    component.onCreate();
    expect(component.create.emit).not.toHaveBeenCalled();
  });

  it('should disable create button when form is invalid', () => {
    component.topicForm.patchValue({ topic: '' });
    expect(component.isCreateDisabled).toBe(true);
  });

  it('should enable create button when form is valid', () => {
    component.topicForm.patchValue({ topic: 'Valid topic' });
    expect(component.isCreateDisabled).toBe(false);
  });

  it('should reset form after successful create', () => {
    component.topicForm.patchValue({ topic: 'Test topic' });
    component.onCreate();
    expect(component.topic?.value).toBe('');
  });

  it('should respect disabled input', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(component.isCreateDisabled).toBe(true);
  });
});
