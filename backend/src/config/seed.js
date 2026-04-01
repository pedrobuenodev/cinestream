require('dotenv').config();
const { sequelize } = require('./database');

// Importar modelos na ordem correta das dependências
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Movie = require('../models/movie.model');
const Watchlist = require('../models/watchlist.model');

const bcrypt = require('bcryptjs');

const categories = [
  { name: 'Action', slug: 'action' },
  { name: 'Drama', slug: 'drama' },
  { name: 'Comedy', slug: 'comedy' },
  { name: 'Horror', slug: 'horror' },
  { name: 'Sci-Fi', slug: 'sci-fi' },
  { name: 'Documentary', slug: 'documentary' },
  { name: 'Animation', slug: 'animation' },
  { name: 'Thriller', slug: 'thriller' },
];

const movies = [
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a C.E.O.',
    year: 2010,
    duration: 148,
    rating: 8.8,
    poster_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    trailer_url: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    type: 'movie',
    categorySlug: 'sci-fi',
  },
  {
    title: 'The Dark Knight',
    description: 'When the Joker emerges from his mysterious past, he wreaks havoc and chaos on Gotham City.',
    year: 2008,
    duration: 152,
    rating: 9.0,
    poster_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CejMntIt.jpg',
    trailer_url: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    type: 'movie',
    categorySlug: 'action',
  },
  {
    title: 'Breaking Bad',
    description: "A chemistry teacher diagnosed with terminal cancer teams with a former student to secure his family's future by manufacturing meth.",
    year: 2008,
    duration: 47,
    rating: 9.5,
    poster_url: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    trailer_url: 'https://www.youtube.com/watch?v=HhesaQXLuRY',
    type: 'series',
    categorySlug: 'drama',
  },
  {
    title: 'Interstellar',
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    year: 2014,
    duration: 169,
    rating: 8.6,
    poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    trailer_url: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    type: 'movie',
    categorySlug: 'sci-fi',
  },
  {
    title: 'Stranger Things',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    year: 2016,
    duration: 51,
    rating: 8.7,
    poster_url: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/original/rcA17r3hfHMjBBs2a1c647Gqdrd.jpg',
    trailer_url: 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
    type: 'series',
    categorySlug: 'thriller',
  },
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    year: 1994,
    duration: 142,
    rating: 9.3,
    poster_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/original/kKSXsIoaU1gMTZeKDM0TPaGAzOE.jpg',
    trailer_url: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
    type: 'movie',
    categorySlug: 'drama',
  },
  {
    title: 'The Office',
    description: 'A mockumentary on a group of typical office workers where the workday consists of ego clashes, inappropriate behavior, and tedium.',
    year: 2005,
    duration: 22,
    rating: 9.0,
    poster_url: 'https://image.tmdb.org/t/p/w500/7DJKHzAi83BmQrWLrYYOqcoKfhR.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/original/nQOYeLLqvlnMY5YExKlaMrlg0uf.jpg',
    trailer_url: 'https://www.youtube.com/watch?v=LHOtClSmxDE',
    type: 'series',
    categorySlug: 'comedy',
  },
  {
    title: 'Get Out',
    description: "A young African-American visits his white girlfriend's parents for the weekend, where his uneasiness about their reception grows.",
    year: 2017,
    duration: 104,
    rating: 7.7,
    poster_url: 'https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/original/xPkBnHX0bMbRlhKqBFUJFLGLlIJ.jpg',
    trailer_url: 'https://www.youtube.com/watch?v=DzfpyUB60YY',
    type: 'movie',
    categorySlug: 'horror',
  },
  {
    title: 'Planet Earth II',
    description: 'David Attenborough presents a documentary series exploring how animals meet the challenges of surviving in the most iconic habitats on Earth.',
    year: 2016,
    duration: 60,
    rating: 9.5,
    poster_url: 'https://image.tmdb.org/t/p/w500/5MkZjMCOKBpF02GWbQnuXFLqeXY.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/original/kKSXsIoaU1gMTZeKDM0TPaGAzOE.jpg',
    trailer_url: 'https://www.youtube.com/watch?v=c8aFcHFu8QM',
    type: 'series',
    categorySlug: 'documentary',
  },
  {
    title: 'Spider-Man: Into the Spider-Verse',
    description: 'Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions.',
    year: 2018,
    duration: 117,
    rating: 8.4,
    poster_url: 'https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
    backdrop_url: 'https://image.tmdb.org/t/p/original/AvnfKqgRdwISSBKDmB0SpqKdWFb.jpg',
    trailer_url: 'https://www.youtube.com/watch?v=g4Hbz2jLxvQ',
    type: 'movie',
    categorySlug: 'animation',
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('📦 Connected to database');

    // Sync em ordem: sem force para não perder dados se já existir
    await sequelize.sync({ force: true });
    console.log('📦 Tables created');

    // Users
    const adminPass = await bcrypt.hash('admin123', 10);
    const userPass = await bcrypt.hash('user123', 10);

    await User.create({ name: 'Admin', email: 'admin@cinestream.com', password: adminPass, role: 'admin' });
    await User.create({ name: 'Demo User', email: 'user@cinestream.com', password: userPass, role: 'user' });
    console.log('👤 Users seeded');

    // Categories
    const createdCategories = await Category.bulkCreate(categories);
    const categoryMap = createdCategories.reduce((acc, cat) => {
      acc[cat.slug] = cat.id;
      return acc;
    }, {});
    console.log('🏷️  Categories seeded');

    // Movies
    await Movie.bulkCreate(
      movies.map(({ categorySlug, ...movie }) => ({
        ...movie,
        categoryId: categoryMap[categorySlug],
      }))
    );
    console.log('🎥 Movies seeded');

    console.log('\n✅ Seed complete!');
    console.log('   Admin: admin@cinestream.com / admin123');
    console.log('   User:  user@cinestream.com  / user123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
