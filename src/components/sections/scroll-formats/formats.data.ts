export const planets = [
  {
    title: 'Нептун',
    navLabel: 'Нептун',
    image: '/images/neptune.jpg',
    description:
      'Нептун — восьмая и самая удалённая от Солнца планета Солнечной системы. Это ледяной гигант с насыщенными синими оттенками.',
  },
  {
    title: 'Уран',
    navLabel: 'Уран',
    image: '/images/uranus.jpg',
    description:
      'Уран — ледяной гигант, который вращается на боку и отличается холодной голубой атмосферой.',
  },
  {
    title: 'Сатурн',
    navLabel: 'Сатурн',
    image: '/images/saturn.jpg',
    description:
      'Сатурн известен своей выразительной системой колец и большим количеством спутников.',
  },
  {
    title: 'Юпитер',
    navLabel: 'Юпитер',
    image: '/images/jupiter.jpg',
    description:
      'Юпитер — крупнейшая планета Солнечной системы с мощными облачными поясами и знаменитыми штормами.',
  },
  {
    title: 'Марс',
    navLabel: 'Марс',
    image: '/images/mars.jpg',
    description:
      'Марс — каменистая планета с разреженной атмосферой, древними долинами и характерной красной поверхностью.',
  },
  {
    title: 'Земля',
    navLabel: 'Земля',
    image: '/images/earth.jpg',
    description:
      'Земля — планета с океанами, атмосферой и условиями, которые поддерживают многообразие жизни.',
  },
] as const

export type Planet = (typeof planets)[number]
