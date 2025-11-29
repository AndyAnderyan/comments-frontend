import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageStatesDemoComponent } from './message-states-demo.component';

describe('MessageStatesDemoComponent', () => {
  let component: MessageStatesDemoComponent;
  let fixture: ComponentFixture<MessageStatesDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageStatesDemoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageStatesDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle notification icon visibility', () => {
    expect(component.showNotificationIcon()).toBe(true);
    component.toggleNotificationIcon();
    expect(component.showNotificationIcon()).toBe(false);
  });

  it('should return correct message by state', () => {
    const message = component.getMessageByState('default', false);
    expect(message.readStatus).toBe('default');
    expect(message.isSelected).toBe(false);
    
    const selectedMessage = component.getMessageByState('unread', true);
    expect(selectedMessage.readStatus).toBe('unread');
    expect(selectedMessage.isSelected).toBe(true);
  });

  it('should detect if all messages are selected', () => {
    expect(component.allSelected()).toBe(false);
    
    // Select all messages manually
    const currentMessages = component.messages();
    const allSelectedMessages = Object.keys(currentMessages).reduce((acc, key) => {
      acc[key] = { ...currentMessages[key], isSelected: true };
      return acc;
    }, {} as any);
    
    component.messages.set(allSelectedMessages);
    expect(component.allSelected()).toBe(true);
  });

  it('should toggle all selection', () => {
    const initiallyAllSelected = component.allSelected();
    component.toggleAllSelection();
    expect(component.allSelected()).toBe(!initiallyAllSelected);
    expect(component.lastAction()?.action).toBe(initiallyAllSelected ? 'deselect_all' : 'select_all');
  });

  it('should mark all messages as read', () => {
    component.markAllAsRead();
    
    const messages = Object.values(component.messages());
    messages.forEach(message => {
      expect(message.readStatus).toBe('default');
    });
    
    expect(component.lastAction()?.action).toBe('mark_all_read');
  });

  it('should reset messages to initial state', () => {
    // First modify some messages
    component.markAllAsRead();
    
    // Then reset
    component.resetMessages();
    
    const messages = component.messages();
    expect(messages['unread-false'].readStatus).toBe('unread');
    expect(messages['unread-notification-true'].readStatus).toBe('unread-notification');
    expect(component.lastAction()?.action).toBe('reset');
  });

  it('should handle message click', () => {
    const mockMessage = component.getMessageByState('default', false);
    component.onMessageClick(mockMessage);
    
    const lastAction = component.lastAction();
    expect(lastAction.action).toBe('message_click');
    expect(lastAction.messageId).toBe(mockMessage.id);
  });

  it('should handle toggle selection', () => {
    const mockMessage = component.getMessageByState('default', false);
    const initialSelection = mockMessage.isSelected;
    
    component.onToggleSelection(mockMessage);
    
    const updatedMessage = component.messages()[mockMessage.id];
    expect(updatedMessage.isSelected).toBe(!initialSelection);
    
    const lastAction = component.lastAction();
    expect(lastAction.action).toBe('toggle_selection');
    expect(lastAction.newSelectionState).toBe(!initialSelection);
  });
});
