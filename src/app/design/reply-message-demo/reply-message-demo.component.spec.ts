import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyMessageDemoComponent } from './reply-message-demo.component';

describe('ReplyMessageDemoComponent', () => {
  let component: ReplyMessageDemoComponent;
  let fixture: ComponentFixture<ReplyMessageDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplyMessageDemoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReplyMessageDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle actions visibility', () => {
    expect(component.showActions()).toBe(true);
    component.toggleActions();
    expect(component.showActions()).toBe(false);
    component.toggleActions();
    expect(component.showActions()).toBe(true);
  });

  it('should toggle reply visibility', () => {
    expect(component.showReply()).toBe(true);
    expect(component.messageWithReply().replyTo).toBeDefined();
    
    component.toggleReply();
    expect(component.showReply()).toBe(false);
    expect(component.messageWithReply().replyTo).toBeUndefined();
    
    component.toggleReply();
    expect(component.showReply()).toBe(true);
    expect(component.messageWithReply().replyTo).toBeDefined();
  });

  it('should update reply length', () => {
    const event = {
      target: { value: '150' }
    } as any;
    
    component.updateReplyLength(event);
    expect(component.maxReplyLength()).toBe(150);
  });

  it('should not update reply length for invalid values', () => {
    const initialLength = component.maxReplyLength();
    
    const invalidEvent = {
      target: { value: '10' } // Too small
    } as any;
    
    component.updateReplyLength(invalidEvent);
    expect(component.maxReplyLength()).toBe(initialLength);
  });

  it('should handle reply action', () => {
    const mockMessage = component.simpleMessage;
    component.onReply(mockMessage);
    
    const lastAction = component.lastAction();
    expect(lastAction.action).toBe('reply');
    expect(lastAction.messageId).toBe(mockMessage.id);
    expect(lastAction.author).toBe(mockMessage.author);
  });

  it('should handle more action', () => {
    const mockMessage = component.simpleMessage;
    component.onMore(mockMessage);
    
    const lastAction = component.lastAction();
    expect(lastAction.action).toBe('more');
    expect(lastAction.messageId).toBe(mockMessage.id);
  });

  it('should handle reply click action', () => {
    const replyId = 'test-reply-id';
    component.onReplyClick(replyId);
    
    const lastAction = component.lastAction();
    expect(lastAction.action).toBe('reply_click');
    expect(lastAction.replyId).toBe(replyId);
  });
});
