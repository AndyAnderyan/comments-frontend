import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicFormDemoComponent } from './topic-form-demo.component';

describe('TopicFormDemoComponent', () => {
  let component: TopicFormDemoComponent;
  let fixture: ComponentFixture<TopicFormDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicFormDemoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopicFormDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle disabled state', () => {
    expect(component.isDisabled()).toBe(false);
    component.toggleDisabled();
    expect(component.isDisabled()).toBe(true);
  });

  it('should log back action', () => {
    component.onBack();
    expect(component.lastAction()?.action).toBe('back');
  });

  it('should log create action with topic', () => {
    const testTopic = 'Test Topic';
    component.onTopicCreated({ topic: testTopic });
    expect(component.lastAction()?.action).toBe('create');
    expect(component.lastAction()?.topic).toBe(testTopic);
  });
});
