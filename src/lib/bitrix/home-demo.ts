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
  reviews: [
    {
      id: 'irina-m',
      name: 'Ирина М.',
      avatarUrl: null,
      rating: 5,
      publishedAt: '2026-03-01',
      text: 'Искала что-то необычное на день рождения и попала сюда. Дети были в восторге — инструктор отлично объяснил правила и сделал всё, чтобы никто не скучал.',
    },
    {
      id: 'petrov-family',
      name: 'Семья Петровых',
      avatarUrl: null,
      rating: 5,
      publishedAt: '2026-03-15',
      text: 'Пришли всей семьёй — двое детей и мы с мужем. Играли приблизительно полтора часа, потом ещё долго обсуждали игру. Инструктор подобрал правила так, что и малышам было интересно.',
    },
    {
      id: 'organizer-anna',
      name: 'Анна, организатор',
      avatarUrl: null,
      rating: 4,
      publishedAt: '2026-03-22',
      text: 'Организовывала праздник для класса и переживала за всё сразу. Команда помогла собрать программу, встретила детей и полностью взяла игру на себя.',
    },
    {
      id: 'alexey-k',
      name: 'Алексей К.',
      avatarUrl: null,
      rating: 5,
      publishedAt: '2026-04-02',
      text: 'Отличное место для активного отдыха. Всё организовано понятно, оборудование исправное, а сотрудники действительно следят за безопасностью.',
    },
  ],
} satisfies HomeResponse
