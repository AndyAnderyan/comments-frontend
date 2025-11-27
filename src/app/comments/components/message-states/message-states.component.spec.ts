import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageStatesComponent, MessageStateData } from './message-states.component';

describe('MessageStatesComponent', () => {
  let component: MessageStatesComponent;
  let fixture: ComponentFixture<MessageStatesComponent>;

  const mockDefaultMessage: MessageStateData = {
    id: '1',
    title: 'Ремонт сантехніки в спортзалі',
    content: 'В спортзалі протікає кран у роздягальні, що створює незручності для відвідувачів.',
    date: '10.11.2025',
    readStatus: 'default',
    isSelected: false
  };

  const mockUnreadMessage: MessageStateData = {
    id: '2',
    title: 'Нове повідомлення',
    content: 'Це непрочитане повідомлення.',
    date: '11.11.2025',
    readStatus: 'unread',
    isSelected: false
  };

  const mockNotificationMessage: MessageStateData = {
    id: '3',
    title: 'Повідомлення зі сповіщенням',
    content: 'Це повідомлення зі сповіщенням.',
    date: '12.11.2025',
    readStatus: 'unread-notification',
    isSelected: false
  };

  const mockSelectedMessage: MessageStateData = {
    ...mockDefaultMessage,
    isSelected: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageStatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageStatesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.message = mockDefaultMessage;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display message content correctly', () => {
    component.message = mockDefaultMessage;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.message-title').textContent).toContain(mockDefaultMessage.title);
    expect(compiled.querySelector('.message-content').textContent).toContain(mockDefaultMessage.content);
    expect(compiled.querySelector('.message-date').textContent).toContain(mockDefaultMessage.date);
  });

  it('should apply correct classes for default message', () => {
    component.message = mockDefaultMessage;
    fixture.detectChanges();
    
    expect(component.messageClasses).toContain('message-item');
    expect(component.messageClasses).toContain('message-default');
    expect(component.messageClasses).not.toContain('message-selected');
  });

  it('should apply correct classes for unread message', () => {
    component.message = mockUnreadMessage;
    fixture.detectChanges();
    
    expect(component.messageClasses).toContain('message-unread');
  });

  it('should apply correct classes for notification message', () => {
    component.message = mockNotificationMessage;
    fixture.detectChanges();
    
    expect(component.messageClasses).toContain('message-unread-notification');
  });

  it('should apply selected class when message is selected', () => {
    component.message = mockSelectedMessage;
    fixture.detectChanges();
    
    expect(component.messageClasses).toContain('message-selected');
  });

  it('should show notification icon for unread-notification messages', () => {
    component.message = mockNotificationMessage;
    fixture.detectChanges();
    
    expect(component.hasNotificationIcon).toBe(true);
    
    const compiled = fixture.nativeElement;
    const notificationIcon = compiled.querySelector('.notification-icon');
    expect(notificationIcon).toBeTruthy();
  });

  it('should not show notification icon for other message types', () => {
    component.message = mockDefaultMessage;
    fixture.detectChanges();
    
    expect(component.hasNotificationIcon).toBe(false);
    
    const compiled = fixture.nativeElement;
    const notificationIcon = compiled.querySelector('.notification-icon');
    expect(notificationIcon).toBeFalsy();
  });

  it('should emit messageClick when clicked', () => {
    spyOn(component.messageClick, 'emit');
    component.message = mockDefaultMessage;
    fixture.detectChanges();
    
    component.onClick();
    expect(component.messageClick.emit).toHaveBeenCalledWith(mockDefaultMessage);
  });

  it('should emit toggleSelection when toggle is called', () => {
    spyOn(component.toggleSelection, 'emit');
    component.message = mockDefaultMessage;
    fixture.detectChanges();
    
    const mockEvent = new Event('click');
    spyOn(mockEvent, 'stopPropagation');
    
    component.onToggleSelection(mockEvent);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(component.toggleSelection.emit).toHaveBeenCalledWith(mockDefaultMessage);
  });

  it('should correctly identify unread messages', () => {
    component.message = mockUnreadMessage;
    expect(component.isUnread).toBe(true);
    
    component.message = mockNotificationMessage;
    expect(component.isUnread).toBe(true);
    
    component.message = mockDefaultMessage;
    expect(component.isUnread).toBe(false);
  });

  it('should return correct background color class', () => {
    component.message = mockUnreadMessage;
    expect(component.backgroundColorClass).toBe('bg-unread');
    
    component.message = mockDefaultMessage;
    expect(component.backgroundColorClass).toBe('bg-default');
  });

  it('should handle keyboard events', () => {
    spyOn(component.messageClick, 'emit');
    component.message = mockDefaultMessage;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const messageElement = compiled.querySelector('.message-item');
    
    // Test Enter key
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    messageElement.dispatchEvent(enterEvent);
    
    // Test Space key
    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    messageElement.dispatchEvent(spaceEvent);
    
    expect(component.messageClick.emit).toHaveBeenCalledTimes(2);
  });

  it('should have proper accessibility attributes', () => {
    component.message = mockSelectedMessage;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const messageElement = compiled.querySelector('.message-item');
    
    expect(messageElement.getAttribute('aria-selected')).toBe('true');
    expect(messageElement.getAttribute('role')).toBe('button');
    expect(messageElement.getAttribute('tabindex')).toBe('0');
    expect(messageElement.getAttribute('aria-label')).toContain(mockSelectedMessage.title);
  });
});
