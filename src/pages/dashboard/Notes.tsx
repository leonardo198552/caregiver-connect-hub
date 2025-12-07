import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  FileText,
  Video,
  Clock,
  User,
  MoreVertical,
  Upload,
  Image,
  Mic,
} from "lucide-react";

const notes = [
  {
    id: 1,
    title: "Morning Routine Update",
    patient: "Eleanor Johnson",
    content: "Mrs. Johnson had a good morning. She ate most of her breakfast and took all medications without issues. She was in good spirits and enjoyed looking at family photos.",
    type: "text",
    date: "Today, 9:30 AM",
    tags: ["Daily Update", "Positive"],
  },
  {
    id: 2,
    title: "Physical Therapy Progress",
    patient: "William Wilson",
    content: "Completed 30 minutes of walking exercises. Mr. Wilson showed improvement in balance. Recommended continuing current routine.",
    type: "text",
    date: "Today, 11:00 AM",
    tags: ["Exercise", "Progress"],
  },
  {
    id: 3,
    title: "Blood Pressure Reading",
    patient: "Margaret Davis",
    content: "BP: 135/85 mmHg. Slightly elevated from yesterday. Will monitor closely and report to physician if trend continues.",
    type: "text",
    date: "Yesterday, 3:30 PM",
    tags: ["Vitals", "Monitoring"],
  },
  {
    id: 4,
    title: "Video: Walking Exercise",
    patient: "William Wilson",
    content: "Video documentation of walking exercise routine for physical therapist review.",
    type: "video",
    date: "Yesterday, 11:00 AM",
    tags: ["Video", "Exercise"],
  },
];

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewNote, setShowNewNote] = useState(false);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="default" onClick={() => setShowNewNote(!showNewNote)}>
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* New Note Form */}
      {showNewNote && (
        <Card variant="elevated" className="animate-fade-up">
          <CardHeader>
            <CardTitle className="text-lg">Create New Note</CardTitle>
            <CardDescription>Document patient care activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input placeholder="Note title..." />
              <Input placeholder="Select patient..." />
            </div>
            <Textarea placeholder="Write your note here..." rows={4} />
            
            {/* Media Upload */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Image className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
              <Button variant="outline" size="sm">
                <Video className="w-4 h-4 mr-2" />
                Add Video
              </Button>
              <Button variant="outline" size="sm">
                <Mic className="w-4 h-4 mr-2" />
                Voice Note
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="soft" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                Daily Update
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Vitals
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Medication
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                Exercise
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                + Add Tag
              </Badge>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewNote(false)}>
                Cancel
              </Button>
              <Button variant="hero">
                Save Note
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">24</p>
                <p className="text-sm text-muted-foreground">Total Notes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-light flex items-center justify-center">
                <Video className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Video Notes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4</p>
                <p className="text-sm text-muted-foreground">Today's Notes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id} variant="interactive" className="group">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    note.type === "video" ? "bg-secondary-light" : "bg-primary-light"
                  }`}
                >
                  {note.type === "video" ? (
                    <Video className="w-6 h-6 text-secondary" />
                  ) : (
                    <FileText className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                      {note.title}
                    </h3>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {note.patient}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {note.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {note.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag, i) => (
                      <Badge key={i} variant="soft" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
