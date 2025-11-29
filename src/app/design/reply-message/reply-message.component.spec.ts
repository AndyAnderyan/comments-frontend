import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyMessageComponent, ReplyMessageData } from './reply-message.component';

describe('ReplyMessageComponent', () => {
  let component: ReplyMessageComponent;
  let fixture: ComponentFixture<ReplyMessageComponent>;

  const mockMessage: ReplyMessageData = {
    id: '1',
    author: 'Владислав Вікторович Ткачук',
    content: 'Система опалення в бібліотеці не працює: температура в приміщенні нижча за норму. Заявка на ремонт подана 01.11, статус — "в обробці". Потрібно терміново вирішити.',
    time: '14:10',
    replyTo: {
      id: '2',
      author: 'Романенко Роман Романович',
      content: 'Система опалення в бібліотеці не працює: температура в приміщенні нижча за норму. Заявка на ремонт подана 01.11, статус — "в обробці". Потрібно терміново вирішити.'
    }
  };

  const mockMessageWithoutReply: ReplyMessageData = {
    id: '3',
    author: 'Іван Іванович Іванов',
    content: 'Звичайне повідомлення без відповіді.',
    time: '15:30'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplyMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReplyMessageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.message = mockMessage;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display message author and content', () => {
    component.message = mockMessage;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.author-name').textContent).toContain(mockMessage.author);
    expect(compiled.querySelector('.message-text').textContent).toContain(mockMessage.content);
    expect(compiled.querySelector('.message-time').textContent).toContain(mockMessage.time);
  });

  it('should display reply quote when message has reply', () => {
    component.message = mockMessage;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const replyQuote = compiled.querySelector('.reply-quote');
    expect(replyQuote).toBeTruthy();
    expect(compiled.querySelector('.reply-author').textContent).toContain(mockMessage.replyTo!.author);
  });

  it('should not display reply quote when message has no reply', () => {
    component.message = mockMessageWithoutReply;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const replyQuote = compiled.querySelector('.reply-quote');
    expect(replyQuote).toBeFalsy();
  });

  it('should emit reply event when reply button is clicked', () => {
    spyOn(component.reply, 'emit');
    component.message = mockMessage;
    fixture.detectChanges();
    
    component.onReply();
    expect(component.reply.emit).toHaveBeenCalledWith(mockMessage);
  });

  it('should emit more event when more button is clicked', () => {
    spyOn(component.more, 'emit');
    component.message = mockMessage;
    fixture.detectChanges();
    
    component.onMore();
    expect(component.more.emit).toHaveBeenCalledWith(mockMessage);
  });

  it('should emit replyClick event when reply quote is clicked', () => {
    spyOn(component.replyClick, 'emit');
    component.message = mockMessage;
    fixture.detectChanges();
    
    component.onReplyToClick();
    expect(component.replyClick.emit).toHaveBeenCalledWith(mockMessage.replyTo!.id);
  });

  it('should truncate long reply content', () => {
    const longReplyMessage = { ...mockMessage };
    longReplyMessage.replyTo!.content = 'A'.repeat(200);
    component.message = longReplyMessage;
    component.maxReplyLength = 50;
    
    const truncated = component.truncatedReplyContent;
    expect(truncated.length).toBeLessThanOrEqual(53); // 50 + '...'
    expect(truncated.endsWith('...')).toBe(true);
  });

  it('should not truncate short reply content', () => {
    component.message = mockMessage;
    component.maxReplyLength = 500;
    
    const truncated = component.truncatedReplyContent;
    expect(truncated).toBe(mockMessage.replyTo!.content);
    expect(truncated.endsWith('...')).toBe(false);
  });

  it('should correctly detect if message has reply', () => {
    component.message = mockMessage;
    expect(component.hasReply).toBe(true);
    
    component.message = mockMessageWithoutReply;
    expect(component.hasReply).toBe(false);
  });

  it('should hide actions when showActions is false', () => {
    component.message = mockMessage;
    component.showActions = false;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.more-button')).toBeFalsy();
    expect(compiled.querySelector('.reply-button')).toBeFalsy();
  });

  it('should show actions when showActions is true', () => {
    component.message = mockMessage;
    component.showActions = true;
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.more-button')).toBeTruthy();
    expect(compiled.querySelector('.reply-button')).toBeTruthy();
  });
});
