import type { HomeResponse } from './home-schema'

export const demoHomeContent = {
  title: 'Пейнтбол в Саратове',
  description:
    'Организуем активный отдых для компании, семьи или большого праздника.',
  phone: '',
  address: 'Саратов',
  quiz: {
    total: 3,
    questions: [
      {
        id: 'audience',
        question: 'Для кого подбираем игру?',
        answers: [
          { id: 'children', label: 'Детский формат' },
          { id: 'adults', label: 'Взрослый формат' },
          { id: 'mixed', label: 'Смешанный формат' },
        ],
      },
      {
        id: 'players',
        question: 'Сколько будет участников?',
        answers: [
          { id: 'small', label: 'До 10 человек' },
          { id: 'medium', label: 'От 10 до 20 человек' },
          { id: 'large', label: 'Больше 20 человек' },
        ],
      },
      {
        id: 'occasion',
        question: 'Какой формат события планируется?',
        answers: [
          { id: 'birthday', label: 'День рождения' },
          { id: 'corporate', label: 'Корпоратив' },
          { id: 'weekend', label: 'Активный выходной' },
        ],
      },
    ],
  },
} satisfies HomeResponse
