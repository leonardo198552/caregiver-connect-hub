import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  MessageCircle,
  Search,
  Plus,
  Heart,
  MessageSquare,
  TrendingUp,
  Users,
  ChevronRight,
  Send,
  Loader2,
} from "lucide-react";
import { useCommunityCategories, useCommunityTopics, useCreateTopic, useToggleLike } from "@/hooks/useCommunity";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", categoryId: "" });

  const { data: categories, isLoading: categoriesLoading } = useCommunityCategories();
  const { data: topics, isLoading: topicsLoading } = useCommunityTopics(selectedCategory || undefined);
  const createTopic = useCreateTopic();
  const toggleLike = useToggleLike();
  const { user } = useAuth();

  const filteredTopics = topics?.filter((topic: any) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content || !newPost.categoryId) return;

    await createTopic.mutateAsync({
      title: newPost.title,
      content: newPost.content,
      categoryId: newPost.categoryId,
    });

    setIsNewPostOpen(false);
    setNewPost({ title: "", content: "", categoryId: "" });
  };

  const handleToggleLike = async (topicId: string, isLiked: boolean) => {
    await toggleLike.mutateAsync({ topicId, isLiked });
  };

  const getRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return format(date, "MMM d");
  };

  const isLoading = categoriesLoading || topicsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-up">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="lg:col-span-3 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              New Discussion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Start a New Discussion</DialogTitle>
              <DialogDescription>
                Share your thoughts, ask questions, or seek advice from the community.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Give your post a title..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newPost.categoryId}
                  onValueChange={(value) => setNewPost({ ...newPost, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="What's on your mind?"
                  rows={4}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewPostOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="hero"
                onClick={handleCreatePost}
                disabled={!newPost.title || !newPost.content || !newPost.categoryId || createTopic.isPending}
              >
                {createTopic.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Categories */}
          <Card variant="elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  !selectedCategory
                    ? "bg-primary-light text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <span>All Topics</span>
                <Badge variant={!selectedCategory ? "default" : "outline"} className="text-xs">
                  {topics?.length || 0}
                </Badge>
              </button>
              {categories?.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-primary-light text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card variant="gradient">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{topics?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Discussions</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Join our supportive community of caregivers
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((post: any) => {
              const isLiked = post.community_likes?.some((like: any) => like.user_id === user?.id);

              return (
                <Card
                  key={post.id}
                  variant="interactive"
                  className="group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
                        {post.author?.first_name?.[0]}{post.author?.last_name?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground text-sm">
                            {post.author?.first_name} {post.author?.last_name}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {getRelativeTime(post.created_at)}
                          </span>
                          <Badge variant="soft" className="text-xs ml-auto">
                            {post.category?.name}
                          </Badge>
                        </div>
                        <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => handleToggleLike(post.id, isLiked)}
                            className={`flex items-center gap-1.5 transition-colors ${
                              isLiked ? "text-secondary" : "text-muted-foreground hover:text-secondary"
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                            <span className="text-sm">{post.likes_count}</span>
                          </button>
                          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-sm">{post.replies_count} replies</span>
                          </button>
                          <button className="ml-auto flex items-center gap-1 text-sm text-primary hover:underline">
                            Read more
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card variant="elevated" className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                No discussions yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Be the first to start a discussion!
              </p>
              <Button variant="default" onClick={() => setIsNewPostOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Start Discussion
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
