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
  featured?: boolean;
  trending?: boolean;
  newRelease?: boolean;
}

const castMembers: CastMember[] = [
  { id: 1, name: "Leonardo DiCaprio", character: "Dom Cobb", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200" },
  { id: 2, name: "Joseph Gordon-Levitt", character: "Arthur", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200" },
  { id: 3, name: "Elliot Page", character: "Ariadne", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200" },
  { id: 4, name: "Tom Hardy", character: "Eames", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200" },
  { id: 5, name: "Marion Cotillard", character: "Mal", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200" },
  { id: 6, name: "Matthew McConaughey", character: "Cooper", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200" },
  { id: 7, name: "Anne Hathaway", character: "Dr. Brand", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200" },
  { id: 8, name: "Jessica Chastain", character: "Murph", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200" },
  { id: 9, name: "Christian Bale", character: "Bruce Wayne", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200" },
  { id: 10, name: "Scarlett Johansson", character: "Black Widow", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200" },
  { id: 11, name: "Robert Downey Jr.", character: "Tony Stark", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200" },
  { id: 12, name: "Chris Evans", character: "Steve Rogers", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200" },
];

const sampleReviews: Review[] = [
  { id: 1, author: "MovieBuff42", rating: 9, content: "A masterpiece of modern cinema. The visuals and storytelling are unparalleled. This is exactly what cinema should be.", date: "2024-01-15" },
  { id: 2, author: "CinematicJourney", rating: 8, content: "Thought-provoking and beautifully crafted. A must-watch for any film enthusiast who appreciates art.", date: "2024-02-20" },
  { id: 3, author: "FilmCritic101", rating: 9, content: "Delivers another mind-bending experience that keeps you thinking long after the credits roll.", date: "2024-03-10" },
  { id: 4, author: "ScreenAddict", rating: 10, content: "Absolutely phenomenal! One of the best films I've ever watched. Pure cinematic brilliance.", date: "2024-03-25" },
  { id: 5, author: "MovieMaven", rating: 8, content: "Stunning visuals paired with an emotionally resonant story. Highly recommended!", date: "2024-04-02" },
];

// Massive movie database
export const allMovies: Movie[] = [
  // Sci-Fi Blockbusters
  {
    id: 1,
    title: "Inception",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800",
    rating: 8.8,
    year: "2010",
    duration: "2h 28m",
    genre: ["Sci-Fi", "Action", "Thriller"],
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO, leading to an incredible journey through layers of dreams.",
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
    cast: [castMembers[0], castMembers[1], castMembers[2], castMembers[3], castMembers[4]],
    reviews: sampleReviews,
    similarMovies: [2, 3, 4, 5],
    featured: true,
    trending: true
  },
  {
    id: 2,
    title: "Interstellar",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=800",
    rating: 8.6,
    year: "2014",
    duration: "2h 49m",
    genre: ["Sci-Fi", "Drama", "Adventure"],
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival in this epic space odyssey.",
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
    cast: [castMembers[5], castMembers[6], castMembers[7]],
    reviews: sampleReviews,
    similarMovies: [1, 5, 3],
    featured: true,
    trending: true
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
    similarMovies: [1, 4, 5],
    trending: true
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
    description: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset in this stunning adaptation.",
    trailerUrl: "https://www.youtube.com/embed/n9xhJrPXop4",
    cast: [castMembers[2], castMembers[6], castMembers[7]],
    reviews: sampleReviews,
    similarMovies: [2, 1, 4],
    newRelease: true,
    trending: true
  },
  {
    id: 6,
    title: "The Prestige",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800",
    rating: 8.5,
    year: "2006",
    duration: "2h 10m",
    genre: ["Drama", "Mystery", "Thriller"],
    description: "Two rival magicians engage in a battle to create the ultimate illusion while sacrificing everything they have.",
    cast: [castMembers[0], castMembers[3], castMembers[4]],
    reviews: sampleReviews,
    similarMovies: [1, 3, 10]
  },
  // Classic Dramas
  {
    id: 7,
    title: "The Shawshank Redemption",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800",
    rating: 9.3,
    year: "1994",
    duration: "2h 22m",
    genre: ["Drama"],
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    cast: [castMembers[5], castMembers[6]],
    reviews: sampleReviews,
    similarMovies: [8, 11, 9],
    featured: true
  },
  {
    id: 8,
    title: "The Godfather",
    image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?q=80&w=800",
    rating: 9.2,
    year: "1972",
    duration: "2h 55m",
    genre: ["Crime", "Drama"],
    description: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son in this cinematic masterpiece.",
    cast: [castMembers[0], castMembers[1]],
    reviews: sampleReviews,
    similarMovies: [7, 9, 12],
    featured: true
  },
  {
    id: 9,
    title: "Pulp Fiction",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800",
    rating: 8.9,
    year: "1994",
    duration: "2h 34m",
    genre: ["Crime", "Drama"],
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
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
    description: "An insomniac office worker and a soap salesman build an underground fight club that evolves into much more.",
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
    cast: [castMembers[0], castMembers[2]],
    reviews: sampleReviews,
    similarMovies: [10, 9, 6]
  },
  // New Releases & Award Winners
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
    similarMovies: [1, 2, 6],
    newRelease: true,
    featured: true,
    trending: true
  },
  {
    id: 14,
    title: "Poor Things",
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=800",
    rating: 8.1,
    year: "2023",
    duration: "2h 21m",
    genre: ["Comedy", "Drama", "Romance"],
    description: "The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by a scientist.",
    cast: [castMembers[2], castMembers[4]],
    reviews: sampleReviews,
    similarMovies: [15, 17, 11],
    newRelease: true
  },
  {
    id: 15,
    title: "The Holdovers",
    image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800",
    rating: 8.0,
    year: "2023",
    duration: "2h 13m",
    genre: ["Comedy", "Drama"],
    description: "A curmudgeonly instructor at a prep school is forced to stay on campus over the holidays with a troubled student.",
    cast: [castMembers[5], castMembers[6]],
    reviews: sampleReviews,
    similarMovies: [14, 11, 17],
    newRelease: true
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
    cast: [castMembers[0], castMembers[3]],
    reviews: sampleReviews,
    similarMovies: [13, 8, 7],
    newRelease: true,
    trending: true
  },
  {
    id: 17,
    title: "Past Lives",
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=800",
    rating: 8.3,
    year: "2023",
    duration: "1h 46m",
    genre: ["Drama", "Romance"],
    description: "Two childhood friends are separated when Nora's family emigrates from South Korea. Decades later, they reunite in New York.",
    cast: [castMembers[2], castMembers[7]],
    reviews: sampleReviews,
    similarMovies: [14, 11, 15],
    newRelease: true
  },
  {
    id: 18,
    title: "The Zone of Interest",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800",
    rating: 7.9,
    year: "2023",
    duration: "1h 45m",
    genre: ["Drama", "History", "War"],
    description: "The commandant of Auschwitz and his wife strive to build a dream life for their family in a house next to the camp.",
    cast: [castMembers[1], castMembers[4]],
    reviews: sampleReviews,
    similarMovies: [13, 16, 7],
    newRelease: true
  },
  // Action & Adventure
  {
    id: 19,
    title: "Mad Max: Fury Road",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800",
    rating: 8.1,
    year: "2015",
    duration: "2h 0m",
    genre: ["Action", "Adventure", "Sci-Fi"],
    description: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland.",
    cast: [castMembers[3], castMembers[7]],
    reviews: sampleReviews,
    similarMovies: [3, 4, 5],
    trending: true
  },
  {
    id: 20,
    title: "John Wick",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=800",
    rating: 7.4,
    year: "2014",
    duration: "1h 41m",
    genre: ["Action", "Thriller"],
    description: "An ex-hitman comes out of retirement to track down the gangsters that killed his dog and stole his car.",
    cast: [castMembers[0], castMembers[4]],
    reviews: sampleReviews,
    similarMovies: [21, 22, 19]
  },
  {
    id: 21,
    title: "Top Gun: Maverick",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800",
    rating: 8.3,
    year: "2022",
    duration: "2h 10m",
    genre: ["Action", "Drama"],
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, facing ghosts of his past.",
    cast: [castMembers[5], castMembers[6]],
    reviews: sampleReviews,
    similarMovies: [20, 19, 22],
    trending: true
  },
  {
    id: 22,
    title: "Mission: Impossible - Dead Reckoning",
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=800",
    rating: 7.8,
    year: "2023",
    duration: "2h 43m",
    genre: ["Action", "Adventure", "Thriller"],
    description: "Ethan Hunt and his IMF team must track down a dangerous weapon before it falls into the wrong hands.",
    cast: [castMembers[1], castMembers[3]],
    reviews: sampleReviews,
    similarMovies: [20, 21, 19],
    newRelease: true
  },
  // Horror & Thriller
  {
    id: 23,
    title: "Get Out",
    image: "https://images.unsplash.com/photo-1507290439931-a861b5a38b3c?q=80&w=800",
    rating: 7.7,
    year: "2017",
    duration: "1h 44m",
    genre: ["Horror", "Mystery", "Thriller"],
    description: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness escalates.",
    cast: [castMembers[2], castMembers[4]],
    reviews: sampleReviews,
    similarMovies: [24, 25, 12]
  },
  {
    id: 24,
    title: "Hereditary",
    image: "https://images.unsplash.com/photo-1509248961725-9d3c0c9b0d0d?q=80&w=800",
    rating: 7.3,
    year: "2018",
    duration: "2h 7m",
    genre: ["Horror", "Drama", "Mystery"],
    description: "A grieving family is haunted by tragic and disturbing occurrences after the death of their secretive grandmother.",
    cast: [castMembers[7], castMembers[5]],
    reviews: sampleReviews,
    similarMovies: [23, 25, 26]
  },
  {
    id: 25,
    title: "A Quiet Place",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800",
    rating: 7.5,
    year: "2018",
    duration: "1h 30m",
    genre: ["Drama", "Horror", "Sci-Fi"],
    description: "In a post-apocalyptic world, a family is forced to live in silence while hiding from monsters with ultra-sensitive hearing.",
    cast: [castMembers[6], castMembers[1]],
    reviews: sampleReviews,
    similarMovies: [24, 23, 19]
  },
  {
    id: 26,
    title: "The Conjuring",
    image: "https://images.unsplash.com/photo-1505635552518-3f679c0c5e8b?q=80&w=800",
    rating: 7.5,
    year: "2013",
    duration: "1h 52m",
    genre: ["Horror", "Mystery", "Thriller"],
    description: "Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.",
    cast: [castMembers[0], castMembers[7]],
    reviews: sampleReviews,
    similarMovies: [24, 23, 25]
  },
  // Comedy
  {
    id: 27,
    title: "The Grand Budapest Hotel",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800",
    rating: 8.1,
    year: "2014",
    duration: "1h 39m",
    genre: ["Adventure", "Comedy", "Crime"],
    description: "A writer encounters the owner of an aging high-class hotel, who tells of his early years serving as a lobby boy.",
    cast: [castMembers[3], castMembers[2]],
    reviews: sampleReviews,
    similarMovies: [28, 29, 14]
  },
  {
    id: 28,
    title: "Superbad",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800",
    rating: 7.6,
    year: "2007",
    duration: "1h 53m",
    genre: ["Comedy"],
    description: "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to party goes wrong.",
    cast: [castMembers[1], castMembers[4]],
    reviews: sampleReviews,
    similarMovies: [27, 29, 30]
  },
  {
    id: 29,
    title: "Parasite",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800",
    rating: 8.5,
    year: "2019",
    duration: "2h 12m",
    genre: ["Comedy", "Drama", "Thriller"],
    description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the poor Kim family.",
    cast: [castMembers[5], castMembers[6], castMembers[7]],
    reviews: sampleReviews,
    similarMovies: [27, 9, 10],
    featured: true
  },
  {
    id: 30,
    title: "Knives Out",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800",
    rating: 7.9,
    year: "2019",
    duration: "2h 10m",
    genre: ["Comedy", "Crime", "Drama"],
    description: "A detective investigates the death of a patriarch of an eccentric, combative family in this witty whodunit.",
    cast: [castMembers[0], castMembers[2]],
    reviews: sampleReviews,
    similarMovies: [29, 27, 6]
  },
  // Animation
  {
    id: 31,
    title: "Spider-Man: Into the Spider-Verse",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800",
    rating: 8.4,
    year: "2018",
    duration: "1h 57m",
    genre: ["Animation", "Action", "Adventure"],
    description: "Teen Miles Morales becomes Spider-Man and must join with five other Spider-People to stop a threat to the multiverse.",
    cast: [castMembers[1], castMembers[3]],
    reviews: sampleReviews,
    similarMovies: [32, 33, 34]
  },
  {
    id: 32,
    title: "Coco",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800",
    rating: 8.4,
    year: "2017",
    duration: "1h 45m",
    genre: ["Animation", "Adventure", "Drama"],
    description: "Aspiring musician Miguel enters the Land of the Dead to find his great-great-grandfather, a legendary singer.",
    cast: [castMembers[5], castMembers[7]],
    reviews: sampleReviews,
    similarMovies: [31, 33, 34]
  },
  {
    id: 33,
    title: "Spirited Away",
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=800",
    rating: 8.6,
    year: "2001",
    duration: "2h 5m",
    genre: ["Animation", "Adventure", "Fantasy"],
    description: "During her family's move, a sullen girl wanders into a world ruled by gods and witches where humans are changed into beasts.",
    cast: [castMembers[2], castMembers[6]],
    reviews: sampleReviews,
    similarMovies: [32, 31, 34],
    featured: true
  },
  {
    id: 34,
    title: "The Lion King",
    image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=800",
    rating: 8.5,
    year: "1994",
    duration: "1h 28m",
    genre: ["Animation", "Adventure", "Drama"],
    description: "Lion prince Simba flees his kingdom after his father's death only to learn the true meaning of responsibility and bravery.",
    cast: [castMembers[0], castMembers[4]],
    reviews: sampleReviews,
    similarMovies: [32, 33, 31]
  },
  // Superhero
  {
    id: 35,
    title: "The Dark Knight",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=800",
    rating: 9.0,
    year: "2008",
    duration: "2h 32m",
    genre: ["Action", "Crime", "Drama"],
    description: "When the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological and physical tests of his ability.",
    cast: [castMembers[8], castMembers[3]],
    reviews: sampleReviews,
    similarMovies: [36, 37, 38],
    featured: true,
    trending: true
  },
  {
    id: 36,
    title: "Avengers: Endgame",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=800",
    rating: 8.4,
    year: "2019",
    duration: "3h 1m",
    genre: ["Action", "Adventure", "Drama"],
    description: "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions and restore balance.",
    cast: [castMembers[10], castMembers[11], castMembers[9]],
    reviews: sampleReviews,
    similarMovies: [35, 37, 38],
    trending: true
  },
  {
    id: 37,
    title: "Black Panther",
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800",
    rating: 7.3,
    year: "2018",
    duration: "2h 14m",
    genre: ["Action", "Adventure", "Sci-Fi"],
    description: "T'Challa returns home as king of Wakanda but finds his sovereignty challenged by a new adversary with ties to his past.",
    cast: [castMembers[2], castMembers[7]],
    reviews: sampleReviews,
    similarMovies: [36, 35, 38]
  },
  {
    id: 38,
    title: "Joker",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800",
    rating: 8.4,
    year: "2019",
    duration: "2h 2m",
    genre: ["Crime", "Drama", "Thriller"],
    description: "A mentally troubled comedian embarks on a downward spiral that leads to the creation of an iconic villain.",
    cast: [castMembers[0], castMembers[4]],
    reviews: sampleReviews,
    similarMovies: [35, 10, 9],
    trending: true
  },
  // Romantic
  {
    id: 39,
    title: "La La Land",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800",
    rating: 8.0,
    year: "2016",
    duration: "2h 8m",
    genre: ["Comedy", "Drama", "Romance"],
    description: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.",
    cast: [castMembers[0], castMembers[9]],
    reviews: sampleReviews,
    similarMovies: [40, 41, 17]
  },
  {
    id: 40,
    title: "The Notebook",
    image: "https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?q=80&w=800",
    rating: 7.8,
    year: "2004",
    duration: "2h 3m",
    genre: ["Drama", "Romance"],
    description: "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom but they are soon separated.",
    cast: [castMembers[1], castMembers[6]],
    reviews: sampleReviews,
    similarMovies: [39, 41, 11]
  },
  {
    id: 41,
    title: "Titanic",
    image: "https://images.unsplash.com/photo-1505635552518-3f679c0c5e8b?q=80&w=800",
    rating: 7.9,
    year: "1997",
    duration: "3h 14m",
    genre: ["Drama", "Romance"],
    description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
    cast: [castMembers[0], castMembers[9]],
    reviews: sampleReviews,
    similarMovies: [40, 39, 11],
    featured: true
  },
  // Documentary Style
  {
    id: 42,
    title: "The Social Network",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800",
    rating: 7.8,
    year: "2010",
    duration: "2h 0m",
    genre: ["Biography", "Drama"],
    description: "The story of how Harvard student Mark Zuckerberg created the social networking site that would become known as Facebook.",
    cast: [castMembers[1], castMembers[3]],
    reviews: sampleReviews,
    similarMovies: [13, 43, 8]
  },
  {
    id: 43,
    title: "The Wolf of Wall Street",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800",
    rating: 8.2,
    year: "2013",
    duration: "3h 0m",
    genre: ["Biography", "Comedy", "Crime"],
    description: "Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker to his fall involving crime and corruption.",
    cast: [castMembers[0], castMembers[5]],
    reviews: sampleReviews,
    similarMovies: [42, 8, 9],
    trending: true
  },
  // War Films
  {
    id: 44,
    title: "1917",
    image: "https://images.unsplash.com/photo-1547496502-affa22d38842?q=80&w=800",
    rating: 8.3,
    year: "2019",
    duration: "1h 59m",
    genre: ["Drama", "War"],
    description: "Two young British soldiers during WWI are given an impossible mission: deliver a message that will stop 1,600 men from walking into a trap.",
    cast: [castMembers[1], castMembers[2]],
    reviews: sampleReviews,
    similarMovies: [45, 46, 18]
  },
  {
    id: 45,
    title: "Saving Private Ryan",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800",
    rating: 8.6,
    year: "1998",
    duration: "2h 49m",
    genre: ["Drama", "War"],
    description: "Following the Normandy Landings, a group of soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed.",
    cast: [castMembers[5], castMembers[3]],
    reviews: sampleReviews,
    similarMovies: [44, 46, 7],
    featured: true
  },
  {
    id: 46,
    title: "Dunkirk",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800",
    rating: 7.8,
    year: "2017",
    duration: "1h 46m",
    genre: ["Action", "Drama", "History"],
    description: "Allied soldiers from Belgium, the British Empire, and France are surrounded by the German Army and evacuated during WWII.",
    cast: [castMembers[3], castMembers[6]],
    reviews: sampleReviews,
    similarMovies: [44, 45, 13]
  },
  // Mystery & Suspense
  {
    id: 47,
    title: "Shutter Island",
    image: "https://images.unsplash.com/photo-1507290439931-a861b5a38b3c?q=80&w=800",
    rating: 8.2,
    year: "2010",
    duration: "2h 18m",
    genre: ["Mystery", "Thriller"],
    description: "In 1954, a U.S. Marshal investigates the disappearance of a murderer who escaped from a hospital for the criminally insane.",
    cast: [castMembers[0], castMembers[4]],
    reviews: sampleReviews,
    similarMovies: [6, 1, 48]
  },
  {
    id: 48,
    title: "Gone Girl",
    image: "https://images.unsplash.com/photo-1574267432644-f71cb5c3e1c7?q=80&w=800",
    rating: 8.1,
    year: "2014",
    duration: "2h 29m",
    genre: ["Drama", "Mystery", "Thriller"],
    description: "With his wife's disappearance, Nick Dunne becomes the prime suspect in a media circus, but all is not as it seems.",
    cast: [castMembers[1], castMembers[7]],
    reviews: sampleReviews,
    similarMovies: [47, 6, 12]
  },
  // Fantasy
  {
    id: 49,
    title: "The Lord of the Rings",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800",
    rating: 9.0,
    year: "2001",
    duration: "2h 58m",
    genre: ["Adventure", "Drama", "Fantasy"],
    description: "A meek Hobbit sets out on an epic journey to destroy an ancient ring and save Middle-earth from the Dark Lord Sauron.",
    cast: [castMembers[2], castMembers[5]],
    reviews: sampleReviews,
    similarMovies: [50, 5, 33],
    featured: true
  },
  {
    id: 50,
    title: "Harry Potter and the Deathly Hallows",
    image: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?q=80&w=800",
    rating: 8.1,
    year: "2011",
    duration: "2h 10m",
    genre: ["Adventure", "Drama", "Fantasy"],
    description: "Harry, Ron, and Hermione search for Voldemort's remaining Horcruxes in their final battle against the Dark Lord.",
    cast: [castMembers[0], castMembers[6]],
    reviews: sampleReviews,
    similarMovies: [49, 33, 34]
  }
];

// Filter functions
export const trendingMovies = allMovies.filter(m => m.trending);
export const newReleases = allMovies.filter(m => m.newRelease);
export const popularMovies = allMovies.filter(m => m.featured);
export const topRatedMovies = [...allMovies].sort((a, b) => b.rating - a.rating).slice(0, 10);

// Genre-based filters
export const actionMovies = allMovies.filter(m => m.genre?.includes("Action"));
export const dramaMovies = allMovies.filter(m => m.genre?.includes("Drama"));
export const sciFiMovies = allMovies.filter(m => m.genre?.includes("Sci-Fi"));
export const thrillerMovies = allMovies.filter(m => m.genre?.includes("Thriller"));
export const comedyMovies = allMovies.filter(m => m.genre?.includes("Comedy"));
export const horrorMovies = allMovies.filter(m => m.genre?.includes("Horror"));
export const romanceMovies = allMovies.filter(m => m.genre?.includes("Romance"));
export const animationMovies = allMovies.filter(m => m.genre?.includes("Animation"));
export const fantasyMovies = allMovies.filter(m => m.genre?.includes("Fantasy") || m.genre?.includes("Adventure"));
export const crimeMovies = allMovies.filter(m => m.genre?.includes("Crime"));
export const biographyMovies = allMovies.filter(m => m.genre?.includes("Biography") || m.genre?.includes("History"));
export const warMovies = allMovies.filter(m => m.genre?.includes("War"));
export const mysteryMovies = allMovies.filter(m => m.genre?.includes("Mystery"));

// All unique genres
export const allGenres = [...new Set(allMovies.flatMap(m => m.genre || []))].sort();

export const getMovieById = (id: number): Movie | undefined => {
  return allMovies.find(movie => movie.id === id);
};

export const getSimilarMovies = (movieIds: number[]): Movie[] => {
  return allMovies.filter(movie => movieIds.includes(movie.id));
};

export const getMoviesByGenre = (genre: string): Movie[] => {
  return allMovies.filter(movie => movie.genre?.includes(genre));
};

export const searchMovies = (query: string): Movie[] => {
  const lowerQuery = query.toLowerCase();
  return allMovies.filter(movie => 
    movie.title.toLowerCase().includes(lowerQuery) ||
    movie.genre?.some(g => g.toLowerCase().includes(lowerQuery)) ||
    movie.cast?.some(c => c.name.toLowerCase().includes(lowerQuery))
  );
};
