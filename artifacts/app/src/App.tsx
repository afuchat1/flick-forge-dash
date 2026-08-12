import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MovieDetail from "./pages/MovieDetail";
import TVDetail from "./pages/TVDetail";

import ActorDetail from "./pages/ActorDetail";
import SearchPage from "./pages/SearchPage";
import GenrePage from "./pages/GenrePage";
import MoviesPage from "./pages/MoviesPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import AiDiscoverPage from "./pages/AiDiscoverPage";
import TVShowsPage from "./pages/TVShowsPage";
import BrowseAllPage from "./pages/BrowseAllPage";
import CategoriesPage from "./pages/CategoriesPage";
import NewPopularPage from "./pages/NewPopularPage";
import MyListPage from "./pages/MyListPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import PrivacyPage from "./pages/PrivacyPage";
import HelpPage from "./pages/HelpPage";
import TermsPage from "./pages/TermsPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/tv/:id" element={<TVDetail />} />
          
          <Route path="/person/:id" element={<ActorDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/genre/:genre" element={<GenrePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
          <Route path="/ai" element={<AiDiscoverPage />} />
          <Route path="/tv-shows" element={<TVShowsPage />} />
          <Route path="/browse" element={<BrowseAllPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/new-popular" element={<NewPopularPage />} />
          <Route path="/my-list" element={<MyListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
