import {ChangeDetectionStrategy, Component} from '@angular/core';

type ChatTopic = {
  id: string;
  title: string;
  date: string;
  preview: string;
  active?: boolean;
};

type ChatMessage = {
  id: string;
  author: string;
  time: string;
  text: string;
  reply?: {
    author: string;
    text: string;
  };
  align?: 'start' | 'end';
};

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent {
  readonly topics: ChatTopic[] = [
    {
      id: '1',
      title: 'Ремонт сантехніки в спортзалі',
      date: '10.11.2025',
      preview:
        'Система опалення в бібліотеці не працює: температура в приміщенні нижча за норму. Заявка на ремонт подана 01.11, статус — “в обробці”. Потрібно терміново вирішити.',
      active: true
    }
  ];

  readonly messages: ChatMessage[] = [
    {
      id: 'm-1',
      author: 'Романенко Роман Романович',
      time: '14:10',
      text:
        'Дякую за повідомлення. Питання взяте на контроль — уточнюємо терміни виконання заявки у технічної служби. Про результати повідомимо додатково.'
    },
    {
      id: 'm-2',
      author: 'Владислав Вікторович Ткачук',
      time: '14:10',
      text:
        'Система опалення в бібліотеці не працює: температура в приміщенні нижча за норму. Заявка на ремонт подана 01.11, статус — “в обробці”. Потрібно терміново вирішити.',
      reply: {
        author: 'Романенко Роман Романович',
        text:
          'Система опалення в бібліотеці не працює: температура в приміщенні нижча за норму. Заявка на ремонт подана 01.11, статус — “в обробці”. Потрібно терміново вирішити.'
      },
      align: 'end'
    }
  ];
}

