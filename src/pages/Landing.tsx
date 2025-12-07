import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Users,
  Building2,
  Shield,
  Clock,
  MessageCircle,
  FileText,
  Video,
  Pill,
  Calendar,
  ChevronRight,
  Check,
  Star,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Patient Records",
    description: "Comprehensive patient history, daily routines, and care notes all in one secure place.",
  },
  {
    icon: Pill,
    title: "Medication Tracking",
    description: "Never miss a dose with smart reminders and complete medication schedules.",
  },
  {
    icon: Video,
    title: "Video & Notes",
    description: "Upload videos and detailed notes to document care progress and share updates.",
  },
  {
    icon: MessageCircle,
    title: "Community Forum",
    description: "Connect with fellow caregivers, share experiences, and find support.",
  },
  {
    icon: Calendar,
    title: "Care Scheduling",
    description: "Plan and coordinate care schedules with easy-to-use calendar tools.",
  },
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "Your data is protected with enterprise-grade security and compliance.",
  },
];

const testimonials = [
  {
    content: "CareConnect has transformed how our team coordinates care. The dashboard is intuitive and saves us hours every week.",
    author: "Sarah Johnson",
    role: "Care Manager at Sunrise Senior Living",
    rating: 5,
  },
  {
    content: "As an independent caregiver, this platform helps me stay organized and connected with my clients' families.",
    author: "Michael Chen",
    role: "Independent Caregiver",
    rating: 5,
  },
  {
    content: "The medication tracking feature alone has been invaluable. Peace of mind for our entire family.",
    author: "Emily Rodriguez",
    role: "Family Caregiver",
    rating: 5,
  },
];

export default function Landing() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center gradient-subtle">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-up">
              <Badge variant="soft" className="text-sm">
                ✨ Trusted by 10,000+ caregivers nationwide
              </Badge>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Empowering <span className="text-primary">Caregivers</span> with Modern Tools
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                The all-in-one platform for caregiving agencies and independent professionals. 
                Manage patient care, track medications, and connect with your community.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button variant="hero" size="xl" className="w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/features">
                  <Button variant="outline" size="xl" className="w-full sm:w-auto">
                    See How It Works
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark border-2 border-background"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Rated 4.9/5 by caregivers
                  </p>
                </div>
              </div>
            </div>

            <div className="relative lg:pl-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative">
                <Card variant="elevated" className="p-6 lg:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
                      <Heart className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground">Care Dashboard</h3>
                      <p className="text-sm text-muted-foreground">Live patient overview</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {["Mrs. Johnson - 2:00 PM Medication", "Mr. Smith - 4:00 PM Exercise", "Mrs. Davis - 6:00 PM Dinner"].map((task, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg bg-accent/50"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm text-foreground">{task}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Floating elements */}
                <Card
                  variant="glass"
                  className="absolute -top-4 -right-4 p-4 animate-float"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
                      <Check className="w-4 h-4 text-success-foreground" />
                    </div>
                    <span className="text-sm font-medium">Task Complete!</span>
                  </div>
                </Card>

                <Card
                  variant="glass"
                  className="absolute -bottom-4 -left-4 p-4 animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <span className="text-sm font-medium">3 new messages</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Account Types Section */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="soft" className="mb-4">Get Started</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Account Type
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're a caregiving agency or an independent professional, we have the right solution for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card variant="feature" className="relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 gradient-hero" />
              <CardHeader className="pb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>For Companies</CardTitle>
                <CardDescription className="text-base">
                  Perfect for caregiving agencies managing multiple caregivers and patients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {[
                    "Multi-caregiver management",
                    "Team coordination tools",
                    "Administrative dashboard",
                    "Billing & reporting",
                    "Custom branding",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/register?type=company" className="block pt-4">
                  <Button variant="default" className="w-full">
                    Register as Company
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card variant="feature" className="relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 gradient-warm" />
              <CardHeader className="pb-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle>For Individuals</CardTitle>
                <CardDescription className="text-base">
                  Ideal for independent caregivers and family members providing care
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {[
                    "Personal care dashboard",
                    "Patient management",
                    "Medication tracking",
                    "Community access",
                    "Free starter plan",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-secondary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/register?type=individual" className="block pt-4">
                  <Button variant="secondary" className="w-full">
                    Register as Individual
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="soft" className="mb-4">Features</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Better Care
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed specifically for caregivers, by caregivers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card
                key={feature.title}
                variant="interactive"
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="soft" className="mb-4">Testimonials</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Loved by Caregivers Everywhere
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card
                key={i}
                variant="elevated"
                className="animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-hero" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-primary-foreground/5 blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your Caregiving?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Join thousands of caregivers who are already using CareConnect to provide better care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="hero-outline" size="xl">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" size="xl" className="text-primary-foreground hover:bg-primary-foreground/10">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
