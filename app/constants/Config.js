export default {
  HomePage: {
    carausel: { categoryId: 536, name: 'Latest', per_page: 6 },
    firstRow: { categoryId: 684, name: 'Featured', per_page: 6 },
    secondRow: { categoryId: 687, name: 'Top Sellings', per_page: 6 },
    categories: [
      {
        id: 262,
        name: 'Breakfast',
        image: require('../assets/images/kahvaltilik.png'),
        // image: 'https://source.unsplash.com/otyxnXPBtOQ',
        //image: 'https://source.unsplash.com/ohnRXPYXDEE'
      },
      {
        id: 682,
        name: 'Produces',
        image: require('../assets/images/produces.png'),
        //image: 'https://source.unsplash.com/Zvha13RXnZY',
      },
      {
        id: 684,
        name: 'Tea&amp;Coffee',
        image: require('../assets/images/coffee.png'),
        //image: { uri: 'https://source.unsplash.com/rDY7R_shA6E' },
      },
      {
        id: 536,
        name: 'Snacks&amp;Desserts',
        image: require('../assets/images/desserts.png'),
        // image: { uri: 'https://source.unsplash.com/df106IZ5Hck' },
      },
      {
        id: 684,
        name: 'Bakery',
        image: require('../assets/images/bakery.png'),
        //image: 'https://source.unsplash.com/t4HtpuZQqpA',
        // image: 'https://source.unsplash.com/1Fa_71wJh38'
      },

      {
        id: 687,
        name: 'Dairy&amp;Eggs',
        image: require('../assets/images/dairy.png'),
        //image: 'https://source.unsplash.com/VwjfgujB42c',
      },

      {
        id: 680,
        name: 'Legumes',
        image: require('../assets/images/legumes.png'),
        //image: { uri: 'https://source.unsplash.com/owkrXxo5vdA' },
      },
      {
        id: 689,
        name: 'Deli',
        image: require('../assets/images/ettavukhindi.png'),
        //image: { uri: 'https://source.unsplash.com/oBwnHsjCx9A' },
      },
      {
        id: 116,
        name: 'Beverages',
        image: require('../assets/images/icecek.png'),
        //image: 'https://source.unsplash.com/oQBmkXFgSIg',
      },

      {
        id: 357,
        name: 'Frozen',
        image: require('../assets/images/dondurulmus.png'),
        // image: 'https://source.unsplash.com/atzWFItRHy8',
        //rotate: '180deg',
      },
      {
        id: 686,
        name: 'Household',
        image: require('../assets/images/evyasam.png'),
        // image: 'https://source.unsplash.com/atzWFItRHy8',
        //rotate: '180deg',
      },

      {
        id: 357,
        name: 'Personal Care',
        image: require('../assets/images/bebekurunleri.png'),
        // image: 'https://source.unsplash.com/atzWFItRHy8',
        //rotate: '180deg',
      },
    ],
  },

  images: {
    payment: {
      cod: require('../assets/images/error.png'),
      discover: require('../assets/images/error.png'),
      visa: require('../assets/images/error.png'),
      mastercart: require('../assets/images/error.png'),
      googlePay: require('../assets/images/error.png'),
      applePay: require('../assets/images/error.png'),
    },
    error: require('../assets/images/error.png'),
    headerLogo: require('../assets/images/error.png'),
    emthyCartBackground: require('../assets/images/error.png'),
  },

  chatButtonUrl: 'https://wa.me/+16474939303',
};
