import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, Film, Tv, Link2, Trash2, Edit, Search, 
  Plus, ChevronLeft, Loader2, ExternalLink, Filter
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoLink {
  id: string;
  tmdb_id: number;
  media_type: string;
  video_url: string;
  video_title: string | null;
  quality: string | null;
  is_full_movie: boolean | null;
  season_number: number | null;
  episode_number: number | null;
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const queryClient = useQueryClient();
  
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "movie" | "tv">("all");
  const [editingLink, setEditingLink] = useState<VideoLink | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    tmdb_id: "",
    media_type: "movie",
    video_url: "",
    video_title: "",
    quality: "HD",
    is_full_movie: true,
    season_number: "",
    episode_number: "",
  });

  // Fetch all video links
  const { data: videoLinks, isLoading } = useQuery({
    queryKey: ["admin-video-links", filterType],
    queryFn: async () => {
      let query = supabase
        .from("video_links")
        .select("*")
        .order("updated_at", { ascending: false });
      
      if (filterType !== "all") {
        query = query.eq("media_type", filterType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as VideoLink[];
    },
    enabled: isAdmin,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("video_links")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-video-links"] });
      toast.success("Video link deleted");
    },
    onError: () => {
      toast.error("Failed to delete video link");
    },
  });

  // Add/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      const payload = {
        tmdb_id: parseInt(data.tmdb_id),
        media_type: data.media_type,
        video_url: data.video_url,
        video_title: data.video_title || null,
        quality: data.quality,
        is_full_movie: data.is_full_movie,
        season_number: data.season_number ? parseInt(data.season_number) : null,
        episode_number: data.episode_number ? parseInt(data.episode_number) : null,
        added_by: user?.id,
      };

      if (data.id) {
        const { error } = await supabase
          .from("video_links")
          .update(payload)
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("video_links")
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-video-links"] });
      toast.success(editingLink ? "Video link updated" : "Video link added");
      setIsAddDialogOpen(false);
      setEditingLink(null);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to save video link");
      console.error(error);
    },
  });

  const resetForm = () => {
    setFormData({
      tmdb_id: "",
      media_type: "movie",
      video_url: "",
      video_title: "",
      quality: "HD",
      is_full_movie: true,
      season_number: "",
      episode_number: "",
    });
  };

  const handleEdit = (link: VideoLink) => {
    setEditingLink(link);
    setFormData({
      tmdb_id: String(link.tmdb_id),
      media_type: link.media_type,
      video_url: link.video_url,
      video_title: link.video_title || "",
      quality: link.quality || "HD",
      is_full_movie: link.is_full_movie ?? true,
      season_number: link.season_number ? String(link.season_number) : "",
      episode_number: link.episode_number ? String(link.episode_number) : "",
    });
    setIsAddDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ ...formData, id: editingLink?.id });
  };

  // Filter links by search
  const filteredLinks = videoLinks?.filter((link) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      link.video_title?.toLowerCase().includes(searchLower) ||
      String(link.tmdb_id).includes(searchLower) ||
      link.video_url.toLowerCase().includes(searchLower)
    );
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !roleLoading) {
      navigate("/auth");
      toast.error("Please sign in to access admin dashboard.");
    }
  }, [user, roleLoading, navigate]);

  // Redirect if not admin (after role check completes)
  useEffect(() => {
    if (user && !roleLoading && !isAdmin) {
      navigate("/");
      toast.error("Access denied. Admin privileges required.");
    }
  }, [isAdmin, roleLoading, navigate, user]);

  // Show loading while checking auth or roles
  if (roleLoading || (!user && !roleLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="pt-14 px-3">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-0 h-auto"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold">Admin Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="p-3 rounded-lg bg-card border border-border">
            <p className="text-2xl font-bold text-primary">{videoLinks?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Total Links</p>
          </div>
          <div className="p-3 rounded-lg bg-card border border-border">
            <p className="text-2xl font-bold text-primary">
              {videoLinks?.filter(l => l.media_type === "movie").length || 0}
            </p>
            <p className="text-xs text-muted-foreground">Movies</p>
          </div>
          <div className="p-3 rounded-lg bg-card border border-border">
            <p className="text-2xl font-bold text-primary">
              {videoLinks?.filter(l => l.media_type === "tv").length || 0}
            </p>
            <p className="text-xs text-muted-foreground">TV Episodes</p>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by TMDB ID or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
            <SelectTrigger className="w-24 h-9">
              <Filter className="h-3 w-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="movie">Movies</SelectItem>
              <SelectItem value="tv">TV</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              setEditingLink(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingLink ? "Edit Video Link" : "Add Video Link"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">TMDB ID</Label>
                    <Input
                      type="number"
                      value={formData.tmdb_id}
                      onChange={(e) => setFormData(f => ({ ...f, tmdb_id: e.target.value }))}
                      required
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Type</Label>
                    <Select 
                      value={formData.media_type} 
                      onValueChange={(v) => setFormData(f => ({ ...f, media_type: v }))}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="movie">Movie</SelectItem>
                        <SelectItem value="tv">TV Show</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Video URL</Label>
                  <Input
                    value={formData.video_url}
                    onChange={(e) => setFormData(f => ({ ...f, video_url: e.target.value }))}
                    placeholder="https://..."
                    required
                    className="h-9"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Title (optional)</Label>
                    <Input
                      value={formData.video_title}
                      onChange={(e) => setFormData(f => ({ ...f, video_title: e.target.value }))}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Quality</Label>
                    <Select 
                      value={formData.quality} 
                      onValueChange={(v) => setFormData(f => ({ ...f, quality: v }))}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CAM">CAM</SelectItem>
                        <SelectItem value="HD">HD</SelectItem>
                        <SelectItem value="FHD">FHD</SelectItem>
                        <SelectItem value="4K">4K</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.media_type === "tv" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Season</Label>
                      <Input
                        type="number"
                        value={formData.season_number}
                        onChange={(e) => setFormData(f => ({ ...f, season_number: e.target.value }))}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Episode</Label>
                      <Input
                        type="number"
                        value={formData.episode_number}
                        onChange={(e) => setFormData(f => ({ ...f, episode_number: e.target.value }))}
                        className="h-9"
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingLink ? "Update" : "Add"} Video Link
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-card">
                  <TableHead className="text-xs">TMDB ID</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Details</TableHead>
                  <TableHead className="text-xs">Quality</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLinks?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No video links found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLinks?.map((link) => (
                    <TableRow key={link.id} className="hover:bg-card/50">
                      <TableCell className="font-mono text-xs">
                        {link.tmdb_id}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {link.media_type === "movie" ? (
                            <><Film className="h-3 w-3 mr-1" /> Movie</>
                          ) : (
                            <><Tv className="h-3 w-3 mr-1" /> TV</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {link.video_title || "Untitled"}
                        {link.season_number && (
                          <span className="text-muted-foreground">
                            {" "}S{link.season_number}E{link.episode_number}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {link.quality}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => window.open(link.video_url, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => handleEdit(link)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={() => deleteMutation.mutate(link.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default AdminDashboard;
