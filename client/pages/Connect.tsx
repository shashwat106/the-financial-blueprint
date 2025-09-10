import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth/AuthContext";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { 
  Users, 
  Briefcase, 
  GraduationCap, 
  MapPin, 
  Clock, 
  DollarSign,
  Plus,
  Search,
  Star,
  MessageCircle,
  ArrowRight,
  Building,
  Calendar
} from "lucide-react";

export default function ConnectPage() {
  const { user, token } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Sample data - in real app this would come from API
  const jobPostings = [
    {
      id: 1,
      title: "Financial Analyst",
      company: "TechCorp",
      location: "New York, NY",
      type: "Full-time",
      salary: "$65,000 - $80,000",
      posted: "2 days ago",
      category: "finance",
      description: "Analyze financial data, create reports, and support budgeting processes.",
      requirements: ["Bachelor's in Finance", "Excel proficiency", "2+ years experience"]
    },
    {
      id: 2,
      title: "Marketing Intern",
      company: "StartupXYZ",
      location: "Remote",
      type: "Internship",
      salary: "$15/hour",
      posted: "1 day ago",
      category: "marketing",
      description: "Support marketing campaigns and social media management.",
      requirements: ["Currently enrolled", "Social media skills", "Creative mindset"]
    },
    {
      id: 3,
      title: "Data Entry Clerk",
      company: "Local Business",
      location: "Chicago, IL",
      type: "Part-time",
      salary: "$12-15/hour",
      posted: "5 days ago",
      category: "admin",
      description: "Accurate data entry and filing for growing business.",
      requirements: ["High school diploma", "Attention to detail", "Computer skills"]
    }
  ];

  const mentorshipOpportunities = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Senior Financial Planner",
      company: "WealthCorp",
      expertise: ["Personal Finance", "Investment Planning", "Tax Strategy"],
      rating: 4.9,
      sessions: 127,
      description: "15+ years helping people achieve financial goals. Specializes in young professionals.",
      price: "Free for students"
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      title: "Small Business Owner",
      company: "Rodriguez Consulting",
      expertise: ["Entrepreneurship", "Business Finance", "Marketing"],
      rating: 4.7,
      sessions: 89,
      description: "Founded 3 successful businesses. Passionate about helping students start their journey.",
      price: "$25/session"
    },
    {
      id: 3,
      name: "Dr. Emily Chen",
      title: "Economics Professor",
      company: "State University",
      expertise: ["Economic Theory", "Research Methods", "Academic Writing"],
      rating: 4.8,
      sessions: 203,
      description: "PhD in Economics. Helps students with career paths in economics and research.",
      price: "Free for students"
    }
  ];

  const studyGroups = [
    {
      id: 1,
      name: "Personal Finance Fundamentals",
      members: 34,
      type: "Beginner",
      schedule: "Tuesdays 7pm EST",
      topic: "Budgeting, saving, and basic investing",
      organizer: "Alex P."
    },
    {
      id: 2,
      name: "Investment Club",
      members: 18,
      type: "Intermediate",
      schedule: "Saturdays 2pm EST",
      topic: "Stock analysis and portfolio management",
      organizer: "Jamie L."
    },
    {
      id: 3,
      name: "Entrepreneurship Workshop",
      members: 12,
      type: "Advanced",
      schedule: "Thursdays 6pm EST",
      topic: "Business planning and startup finance",
      organizer: "Taylor M."
    }
  ];

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "finance", name: "Finance" },
    { id: "marketing", name: "Marketing" },
    { id: "tech", name: "Technology" },
    { id: "admin", name: "Administration" },
    { id: "retail", name: "Retail" },
    { id: "education", name: "Education" }
  ];

  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!user) {
    return (
      <section className="container py-12">
        <div className="text-center max-w-md mx-auto">
          <Users className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold mb-4">Career Connect</h1>
          <p className="text-muted-foreground mb-6">
            Connect with job opportunities, mentors, and study groups to advance your career and education.
          </p>
          <Button onClick={() => setLoginOpen(true)}>
            Join Our Community
          </Button>
        </div>
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      </section>
    );
  }

  return (
    <section className="container py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Career Connect</h1>
          <p className="text-muted-foreground mb-6">
            Find job opportunities, connect with mentors, and join study groups to grow your career.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Job Board</TabsTrigger>
            <TabsTrigger value="mentors">Mentors</TabsTrigger>
            <TabsTrigger value="study">Study Groups</TabsTrigger>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs or companies..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="px-4 py-2 border rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-4">
              {filteredJobs.map(job => (
                <Card key={job.id} className="rounded-xl hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building className="h-4 w-4" />
                          <span>{job.company}</span>
                          <span>•</span>
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{job.type}</Badge>
                        <p className="text-sm text-muted-foreground mt-1">{job.posted}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{job.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-600">{job.salary}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{job.category}</Badge>
                      </div>
                      <Button size="sm">
                        Apply Now <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Requirements:</p>
                      <div className="flex gap-1 flex-wrap">
                        {job.requirements.map((req, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mentors" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {mentorshipOpportunities.map(mentor => (
                <Card key={mentor.id} className="rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{mentor.name}</h3>
                        <p className="text-sm text-muted-foreground">{mentor.title}</p>
                        <p className="text-sm text-muted-foreground">{mentor.company}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{mentor.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{mentor.sessions} sessions</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{mentor.description}</p>
                    
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">Expertise:</p>
                      <div className="flex gap-1 flex-wrap">
                        {mentor.expertise.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-600">{mentor.price}</span>
                      <Button size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="study" className="space-y-6">
            <div className="grid gap-4">
              {studyGroups.map(group => (
                <Card key={group.id} className="rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">{group.topic}</p>
                      </div>
                      <Badge variant={group.type === "Beginner" ? "secondary" : 
                                   group.type === "Intermediate" ? "default" : "destructive"}>
                        {group.type}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{group.members} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{group.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span>Led by {group.organizer}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Join Group
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="rounded-xl">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Build Your Profile</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="profile-name">Full Name</Label>
                    <Input id="profile-name" value={user?.name || ""} />
                  </div>
                  <div>
                    <Label htmlFor="profile-title">Professional Title</Label>
                    <Input id="profile-title" placeholder="e.g. Finance Student" />
                  </div>
                  <div>
                    <Label htmlFor="profile-location">Location</Label>
                    <Input id="profile-location" placeholder="City, State" />
                  </div>
                  <div>
                    <Label htmlFor="profile-experience">Experience Level</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>Student</option>
                      <option>Entry Level</option>
                      <option>Mid Level</option>
                      <option>Senior Level</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="profile-bio">Bio</Label>
                  <textarea 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                    rows={3}
                    placeholder="Tell us about yourself, your goals, and interests..."
                  />
                </div>
                
                <div className="mt-4">
                  <Label>Skills & Interests</Label>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {["Finance", "Budgeting", "Excel", "Python", "Marketing"].map((skill, i) => (
                      <Badge key={i} variant="outline" className="cursor-pointer hover:bg-primary hover:text-white">
                        {skill} <span className="ml-1">+</span>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button className="mt-6">
                  Save Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}