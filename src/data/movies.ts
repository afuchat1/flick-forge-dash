export interface CastMember {
  id: number;
  name: string;
  character: string;
  image: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  content: string;
  date: string;
}

export interface Movie {
  id: number;
  title: string;
  image: string;
  rating: number;
  year: string;
  duration?: string;
  genre?: string[];
  description?: string;
  trailerUrl?: string;
  cast?: CastMember[];
  reviews?: Review[];
  similarMovies?: number[];
}

const castMembers: CastMember[] = [
  { id: 1, name: "Leonardo DiCaprio", character: "Dom Cobb", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" },
  { id: 2, name: "Joseph Gordon-Levitt", character: "Arthur", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200" },
  { id: 3, name: "Ellen Page", character: "Ariadne", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200" },
  { id: 4, name: "Tom Hardy", character: "Eames", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" },
  { id: 5, name: "Marion Cotillard", character: "Mal", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200" },
  { id: 6, name: "Matthew McConaughey", character: "Cooper", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200" },
  { id: 7, name: "Anne Hathaway", character: "Dr. Brand", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200" },
  { id: 8, name: "Jessica Chastain", character: "Murph", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200" },
];

const sampleReviews: Review[] = [
  { id: 1, author: "MovieBuff42", rating: 9, content: "A masterpiece of modern cinema. The visuals and storytelling are unparalleled.", date: "2024-01-15" },
  { id: 2, author: "CinematicJourney", rating: 8, content: "Thought-provoking and beautifully crafted. A must-watch for any film enthusiast.", date: "2024-02-20" },
  { id: 3, author: "FilmCritic101", rating: 9, content: "Christopher Nolan delivers another mind-bending experience that keeps you thinking.", date: "2024-03-10" },
];

export const trendingMovies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800",
    rating: 8.8,
    year: "2010",
    duration: "2h 28m",
    genre: ["Sci-Fi", "Action", "Thriller"],
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
    cast: [castMembers[0], castMembers[1], castMembers[2], castMembers[3], castMembers[4]],
    reviews: sampleReviews,
    similarMovies: [2, 3, 4, 5]
  },
  {
    id: 2,
    title: "Interstellar",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=800",
    rating: 8.6,
    year: "2014",
    duration: "2h 49m",
    genre: ["Sci-Fi", "Drama", "Adventure"],
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
    cast: [castMembers[5], castMembers[6], castMembers[7]],
    reviews: sampleReviews,
    similarMovies: [1, 5, 3]
  },
  {
    id: 3,
    title: "The Matrix",
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800",
    rating: 8.7,
    year: "1999",
    duration: "2h 16m",
    genre: ["Sci-Fi", "Action"],
    description: "A computer hacker learns about the true nature of reality and his role in the war against its controllers.",
    trailerUrl: "https://www.youtube.com/embed/vKQi3bBA1y8",
    cast: [castMembers[0], castMembers[3]],
    reviews: sampleReviews,
    similarMovies: [1, 4, 5]
  },
  {
    id: 4,
    title: "Blade Runner 2049",
    image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?q=80&w=800",
    rating: 8.0,
    year: "2017",
    duration: "2h 44m",
    genre: ["Sci-Fi", "Drama", "Mystery"],
    description: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.",
    trailerUrl: "https://www.youtube.com/embed/gCcx85zbxz4",
    cast: [castMembers[1], castMembers[4]],
    reviews: sampleReviews,
    similarMovies: [3, 1, 5]
  },
  {
    id: 5,
    title: "Dune",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=800",
    rating: 8.1,
    year: "2021",
    duration: "2h 35m",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset.",
    trailerUrl: "https://www.youtube.com/embed/n9xhJrPXop4",
    cast: [castMembers[2], castMembers[6], castMembers[7]],
    reviews: sampleReviews,
    similarMovies: [2, 1, 4]
  },
  {
    id: 6,
    title: "The Prestige",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
    rating: 8.5,
    year: "2006",
    duration: "2h 10m",
    genre: ["Drama", "Mystery", "Thriller"],
    description: "Two rival magicians engage in a battle to create the ultimate illusion while sacrificing everything.",
    trailerUrl: "https://www.youtube.com/embed/o4gHCmTQDVI",
    cast: [castMembers[0], castMembers[3], castMembers[4]],
    reviews: sampleReviews,
    similarMovies: [1, 3, 10]
  }
];

export const popularMovies: Movie[] = [
  {
    id: 7,
    title: "The Shawshank Redemption",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800",
    rating: 9.3,
    year: "1994",
    duration: "2h 22m",
    genre: ["Drama"],
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    trailerUrl: "https://www.youtube.com/embed/6hB3S9bIaco",
    cast: [castMembers[5], castMembers[6]],
    reviews: sampleReviews,
    similarMovies: [8, 11, 9]
  },
  {
    id: 8,
    title: "The Godfather",
    image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?q=80&w=800",
    rating: 9.2,
    year: "1972",
    duration: "2h 55m",
    genre: ["Crime", "Drama"],
    description: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
    trailerUrl: "https://www.youtube.com/embed/sY1S34973zA",
    cast: [castMembers[0], castMembers[1]],
    reviews: sampleReviews,
    similarMovies: [7, 9, 12]
  },
  {
    id: 9,
    title: "Pulp Fiction",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800",
    rating: 8.9,
    year: "1994",
    duration: "2h 34m",
    genre: ["Crime", "Drama"],
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence.",
    trailerUrl: "https://www.youtube.com/embed/s7EdQ4FqbhY",
    cast: [castMembers[2], castMembers[3]],
    reviews: sampleReviews,
    similarMovies: [8, 10, 12]
  },
  {
    id: 10,
    title: "Fight Club",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=800",
    rating: 8.8,
    year: "1999",
    duration: "2h 19m",
    genre: ["Drama", "Thriller"],
    description: "An insomniac office worker and a soap salesman build an underground fight club.",
    trailerUrl: "https://www.youtube.com/embed/qtRKdVHc-cE",
    cast: [castMembers[4], castMembers[7]],
    reviews: sampleReviews,
    similarMovies: [9, 6, 3]
  },
  {
    id: 11,
    title: "Forrest Gump",
    image: "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?q=80&w=800",
    rating: 8.8,
    year: "1994",
    duration: "2h 22m",
    genre: ["Drama", "Romance"],
    description: "The presidencies of Kennedy and Johnson through Vietnam and Watergate through the eyes of an Alabama man.",
    trailerUrl: "https://www.youtube.com/embed/bLvqoHBptjg",
    cast: [castMembers[5], castMembers[6]],
    reviews: sampleReviews,
    similarMovies: [7, 8, 9]
  },
  {
    id: 12,
    title: "The Silence of the Lambs",
    image: "https://images.unsplash.com/photo-1574267432644-f71cb5c3e1c7?q=80&w=800",
    rating: 8.6,
    year: "1991",
    duration: "1h 58m",
    genre: ["Crime", "Drama", "Thriller"],
    description: "A young FBI cadet must receive the help of an incarcerated cannibalistic killer to catch another serial killer.",
    trailerUrl: "https://www.youtube.com/embed/W6Mm8Sbe__o",
    cast: [castMembers[0], castMembers[2]],
    reviews: sampleReviews,
    similarMovies: [10, 9, 6]
  }
];

export const newReleases: Movie[] = [
  {
    id: 13,
    title: "Oppenheimer",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800",
    rating: 8.5,
    year: "2023",
    duration: "3h 0m",
    genre: ["Biography", "Drama", "History"],
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    trailerUrl: "https://www.youtube.com/embed/uYPbbksJxIg",
    cast: [castMembers[0], castMembers[1], castMembers[7]],
    reviews: sampleReviews,
    similarMovies: [1, 2, 6]
  },
  {
    id: 14,
    title: "Poor Things",
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=800",
    rating: 8.1,
    year: "2023",
    duration: "2h 21m",
    genre: ["Comedy", "Drama", "Romance"],
    description: "The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life.",
    trailerUrl: "https://www.youtube.com/embed/RlbR5N6veqw",
    cast: [castMembers[2], castMembers[4]],
    reviews: sampleReviews,
    similarMovies: [15, 17, 11]
  },
  {
    id: 15,
    title: "The Holdovers",
    image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800",
    rating: 8.0,
    year: "2023",
    duration: "2h 13m",
    genre: ["Comedy", "Drama"],
    description: "A curmudgeonly instructor at a prep school is forced to stay on campus over the holidays.",
    trailerUrl: "https://www.youtube.com/embed/AhKLpJmHhIg",
    cast: [castMembers[5], castMembers[6]],
    reviews: sampleReviews,
    similarMovies: [14, 11, 17]
  },
  {
    id: 16,
    title: "Killers of the Flower Moon",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800",
    rating: 8.2,
    year: "2023",
    duration: "3h 26m",
    genre: ["Crime", "Drama", "History"],
    description: "Members of the Osage tribe in the United States are murdered under mysterious circumstances in the 1920s.",
    trailerUrl: "https://www.youtube.com/embed/EP34Yoxs3FQ",
    cast: [castMembers[0], castMembers[3]],
    reviews: sampleReviews,
    similarMovies: [13, 8, 7]
  },
  {
    id: 17,
    title: "Past Lives",
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=800",
    rating: 8.3,
    year: "2023",
    duration: "1h 46m",
    genre: ["Drama", "Romance"],
    description: "Two childhood friends are separated when Nora's family emigrates from South Korea. Decades later, they reunite.",
    trailerUrl: "https://www.youtube.com/embed/kA244xewjcI",
    cast: [castMembers[2], castMembers[7]],
    reviews: sampleReviews,
    similarMovies: [14, 11, 15]
  },
  {
    id: 18,
    title: "The Zone of Interest",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800",
    rating: 7.9,
    year: "2023",
    duration: "1h 45m",
    genre: ["Drama", "History", "War"],
    description: "The commandant of Auschwitz and his wife strive to build a dream life for their family next to the camp.",
    trailerUrl: "https://www.youtube.com/embed/r3_-R_3Jnys",
    cast: [castMembers[1], castMembers[4]],
    reviews: sampleReviews,
    similarMovies: [13, 16, 7]
  }
];

export const allMovies: Movie[] = [...trendingMovies, ...popularMovies, ...newReleases];

export const getMovieById = (id: number): Movie | undefined => {
  return allMovies.find(movie => movie.id === id);
};

export const getSimilarMovies = (movieIds: number[]): Movie[] => {
  return allMovies.filter(movie => movieIds.includes(movie.id));
};
