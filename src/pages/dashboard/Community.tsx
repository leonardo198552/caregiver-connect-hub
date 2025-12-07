import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircle,
  Search,
  Plus,
  Heart,
  MessageSquare,
  Clock,
  TrendingUp,
  Users,
  ChevronRight,
  Send,
} from "lucide-react";

const categories = [
  { name: "All Topics", count: 156, active: true },
  { name: "Tips & Advice", count: 48, active: false },
  { name: "Self-Care", count: 32, active: false },
  { name: "Resources", count: 28, active: false },
  { name: "Stories", count: 24, active: false },
  { name: "Questions", count: 24, active: false },
];

const discussions = [
  {
    id: 1,
    title: "Best practices for managing sundowning in Alzheimer's patients",
    author: "Sarah Johnson",
    category: "Tips & Advice",
    replies: 24,
    likes: 56,
    timeAgo: "2 hours ago",
    preview: "I've been caring for my mother for 3 years now and wanted to share some techniques that have helped us...",
  },
  {
    id: 2,
    title: "How do you handle caregiver burnout?",
    author: "Michael Chen",
    category: "Self-Care",
    replies: 42,
    likes: 89,
    timeAgo: "5 hours ago",
    preview: "I've been feeling overwhelmed lately and would love to hear how others cope with the stress...",
  },
  {
    id: 3,
    title: "Recommended mobility aids for elderly patients",
    author: "Emily Rodriguez",
    category: "Resources",
    replies: 18,
    likes: 34,
    timeAgo: "1 day ago",
    preview: "Looking for recommendations on walkers and wheelchairs. My patient needs something lightweight...",
  },
  {
    id: 4,
    title: "Success story: Getting my dad to accept help",
    author: "David Thompson",
    category: "Stories",
    replies: 31,
    likes: 112,
    timeAgo: "2 days ago",
    preview: "It took months, but I finally found an approach that worked. Here's what I learned...",
  },
];

const trendingTopics = [
  "Medication management",
  "Home safety tips",
  "Respite care options",
  "Communication techniques",
];

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);

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
        <Button variant="default" onClick={() => setShowNewPost(!showNewPost)}>
          <Plus className="w-4 h-4 mr-2" />
          New Discussion
        </Button>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <Card variant="elevated" className="animate-fade-up">
          <CardHeader>
            <CardTitle className="text-lg">Start a New Discussion</CardTitle>
            <CardDescription>Share your thoughts, ask questions, or seek advice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Give your post a title..." />
            <Textarea placeholder="What's on your mind?" rows={4} />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Badge variant="soft" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  Tips & Advice
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  Question
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                  Story
                </Badge>
              </div>
              <Button variant="hero">
                <Send className="w-4 h-4 mr-2" />
                Post
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Categories */}
          <Card variant="elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    cat.active
                      ? "bg-primary-light text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span>{cat.name}</span>
                  <Badge variant={cat.active ? "default" : "outline"} className="text-xs">
                    {cat.count}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card variant="elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                Trending
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {trendingTopics.map((topic, i) => (
                <button
                  key={i}
                  className="w-full text-left text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  #{topic}
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
                  <p className="text-lg font-bold text-foreground">2,847</p>
                  <p className="text-xs text-muted-foreground">Active Members</p>
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
          {discussions.map((post) => (
            <Card
              key={post.id}
              variant="interactive"
              className="group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-semibold flex-shrink-0">
                    {post.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground text-sm">
                        {post.author}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{post.timeAgo}</span>
                      <Badge variant="soft" className="text-xs ml-auto">
                        {post.category}
                      </Badge>
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {post.preview}
                    </p>
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-1.5 text-muted-foreground hover:text-secondary transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">{post.replies} replies</span>
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
          ))}
        </div>
      </div>
    </div>
  );
}
