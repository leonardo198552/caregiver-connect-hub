-- =============================================
-- CARECONNECT DATABASE SCHEMA
-- Multi-tenant Caregiving Management Platform
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUM TYPES
-- =============================================

CREATE TYPE public.user_role AS ENUM ('CAREGIVER', 'ADMIN');
CREATE TYPE public.user_status AS ENUM ('ACTIVE', 'PENDING', 'DISABLED');
CREATE TYPE public.team_member_role AS ENUM ('OWNER', 'MEMBER');
CREATE TYPE public.team_member_status AS ENUM ('ACTIVE', 'AWAY', 'PENDING');
CREATE TYPE public.clinical_status AS ENUM ('STABLE', 'MONITORING', 'ATTENTION');
CREATE TYPE public.medication_dose_status AS ENUM ('PENDING', 'COMPLETED', 'SKIPPED');
CREATE TYPE public.task_type AS ENUM ('MEDICATION', 'VISIT', 'CARE', 'CUSTOM');
CREATE TYPE public.task_status AS ENUM ('UPCOMING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE public.note_type AS ENUM ('TEXT', 'VIDEO');
CREATE TYPE public.activity_type AS ENUM ('MEDICATION_GIVEN', 'NOTE_ADDED', 'TASK_COMPLETED', 'PATIENT_ADDED', 'VISIT_LOGGED', 'TEAM_MEMBER_ADDED');
CREATE TYPE public.entity_type AS ENUM ('MEDICATION', 'NOTE', 'TASK', 'PATIENT', 'VISIT', 'TEAM');
CREATE TYPE public.frequency_type AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'AS_NEEDED');

-- =============================================
-- PROFILES TABLE (User extended data)
-- =============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  notification_email BOOLEAN DEFAULT true,
  notification_push BOOLEAN DEFAULT true,
  notification_medication_reminders BOOLEAN DEFAULT true,
  notification_community_updates BOOLEAN DEFAULT true,
  two_factor_enabled BOOLEAN DEFAULT false,
  status public.user_status DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- USER ROLES TABLE (Security - separate from profiles)
-- =============================================

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.user_role NOT NULL DEFAULT 'CAREGIVER',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- =============================================
-- TEAMS TABLE
-- =============================================

CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- TEAM MEMBERS TABLE
-- =============================================

CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.team_member_role DEFAULT 'MEMBER',
  status public.team_member_status DEFAULT 'ACTIVE',
  invited_at TIMESTAMPTZ DEFAULT now(),
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (team_id, user_id)
);

-- =============================================
-- TEAM INVITATIONS TABLE
-- =============================================

CREATE TABLE public.team_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  role public.team_member_role DEFAULT 'MEMBER',
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- PATIENTS TABLE
-- =============================================

CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  primary_condition TEXT,
  clinical_status public.clinical_status DEFAULT 'STABLE',
  notes_summary TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- VISITS TABLE
-- =============================================

CREATE TABLE public.visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  caregiver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- MEDICATIONS TABLE
-- =============================================

CREATE TABLE public.medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT,
  instructions TEXT,
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- MEDICATION SCHEDULES TABLE
-- =============================================

CREATE TABLE public.medication_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE NOT NULL,
  time_of_day TIME NOT NULL,
  frequency_type public.frequency_type DEFAULT 'DAILY',
  days_of_week TEXT[], -- e.g., ['MON', 'WED', 'FRI']
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- MEDICATION DOSES TABLE
-- =============================================

CREATE TABLE public.medication_doses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  schedule_id UUID REFERENCES public.medication_schedules(id) ON DELETE CASCADE NOT NULL,
  dose_date DATE NOT NULL,
  status public.medication_dose_status DEFAULT 'PENDING',
  administered_by_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  administered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- TASKS TABLE
-- =============================================

CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  assigned_to_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  type public.task_type DEFAULT 'CUSTOM',
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  status public.task_status DEFAULT 'UPCOMING',
  completed_at TIMESTAMPTZ,
  completed_by_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- NOTE TAGS TABLE
-- =============================================

CREATE TABLE public.note_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- NOTES TABLE
-- =============================================

CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT,
  type public.note_type DEFAULT 'TEXT',
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- NOTES_TAGS PIVOT TABLE
-- =============================================

CREATE TABLE public.notes_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.note_tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (note_id, tag_id)
);

-- =============================================
-- COMMUNITY CATEGORIES TABLE
-- =============================================

CREATE TABLE public.community_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- COMMUNITY TOPICS TABLE
-- =============================================

CREATE TABLE public.community_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.community_categories(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- COMMUNITY REPLIES TABLE
-- =============================================

CREATE TABLE public.community_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES public.community_topics(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- COMMUNITY LIKES TABLE
-- =============================================

CREATE TABLE public.community_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID REFERENCES public.community_topics(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (topic_id, user_id)
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- ACTIVITY LOGS TABLE
-- =============================================

CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type public.activity_type NOT NULL,
  entity_type public.entity_type NOT NULL,
  entity_id UUID,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_patients_team_id ON public.patients(team_id);
CREATE INDEX idx_medications_patient_id ON public.medications(patient_id);
CREATE INDEX idx_medication_doses_schedule_id ON public.medication_doses(schedule_id);
CREATE INDEX idx_medication_doses_date ON public.medication_doses(dose_date);
CREATE INDEX idx_tasks_team_id ON public.tasks(team_id);
CREATE INDEX idx_tasks_date ON public.tasks(scheduled_date);
CREATE INDEX idx_notes_patient_id ON public.notes(patient_id);
CREATE INDEX idx_community_topics_category_id ON public.community_topics(category_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_activity_logs_team_id ON public.activity_logs(team_id);

-- =============================================
-- SECURITY DEFINER FUNCTION FOR ROLE CHECK
-- =============================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- =============================================
-- FUNCTION TO GET USER'S TEAM
-- =============================================

CREATE OR REPLACE FUNCTION public.get_user_team_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT team_id FROM public.team_members 
  WHERE user_id = _user_id 
  AND status = 'ACTIVE'
  LIMIT 1
$$;

-- =============================================
-- FUNCTION TO CHECK TEAM MEMBERSHIP
-- =============================================

CREATE OR REPLACE FUNCTION public.is_team_member(_user_id UUID, _team_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.team_members
    WHERE user_id = _user_id
      AND team_id = _team_id
      AND status = 'ACTIVE'
  )
$$;

-- =============================================
-- TRIGGER FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON public.medications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_community_topics_updated_at BEFORE UPDATE ON public.community_topics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_community_replies_updated_at BEFORE UPDATE ON public.community_replies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TRIGGER TO CREATE PROFILE ON USER SIGNUP
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email
  );
  
  -- Create default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'CAREGIVER');
  
  -- Create personal team
  INSERT INTO public.teams (name, owner_id)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'My') || '''s Team',
    NEW.id
  );
  
  -- Add user as owner of their team
  INSERT INTO public.team_members (team_id, user_id, role, status, joined_at)
  SELECT id, NEW.id, 'OWNER', 'ACTIVE', now()
  FROM public.teams
  WHERE owner_id = NEW.id
  LIMIT 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_doses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- USER ROLES POLICIES
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- TEAMS POLICIES
CREATE POLICY "Team members can view their teams" ON public.teams FOR SELECT USING (public.is_team_member(auth.uid(), id));
CREATE POLICY "Owners can update teams" ON public.teams FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Users can create teams" ON public.teams FOR INSERT WITH CHECK (owner_id = auth.uid());

-- TEAM MEMBERS POLICIES
CREATE POLICY "Team members can view team members" ON public.team_members FOR SELECT USING (public.is_team_member(auth.uid(), team_id));
CREATE POLICY "Team owners can manage members" ON public.team_members FOR ALL USING (
  EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND owner_id = auth.uid())
);
CREATE POLICY "Users can view own membership" ON public.team_members FOR SELECT USING (user_id = auth.uid());

-- TEAM INVITATIONS POLICIES
CREATE POLICY "Team owners can manage invitations" ON public.team_invitations FOR ALL USING (
  EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND owner_id = auth.uid())
);

-- PATIENTS POLICIES
CREATE POLICY "Team members can view patients" ON public.patients FOR SELECT USING (public.is_team_member(auth.uid(), team_id));
CREATE POLICY "Team members can create patients" ON public.patients FOR INSERT WITH CHECK (public.is_team_member(auth.uid(), team_id));
CREATE POLICY "Team members can update patients" ON public.patients FOR UPDATE USING (public.is_team_member(auth.uid(), team_id));
CREATE POLICY "Team members can delete patients" ON public.patients FOR DELETE USING (public.is_team_member(auth.uid(), team_id));

-- VISITS POLICIES
CREATE POLICY "Team members can view visits" ON public.visits FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND public.is_team_member(auth.uid(), team_id))
);
CREATE POLICY "Team members can create visits" ON public.visits FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND public.is_team_member(auth.uid(), team_id))
);

-- MEDICATIONS POLICIES
CREATE POLICY "Team members can view medications" ON public.medications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND public.is_team_member(auth.uid(), team_id))
);
CREATE POLICY "Team members can manage medications" ON public.medications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND public.is_team_member(auth.uid(), team_id))
);

-- MEDICATION SCHEDULES POLICIES
CREATE POLICY "Team members can view schedules" ON public.medication_schedules FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.medications m
    JOIN public.patients p ON m.patient_id = p.id
    WHERE m.id = medication_id AND public.is_team_member(auth.uid(), p.team_id)
  )
);
CREATE POLICY "Team members can manage schedules" ON public.medication_schedules FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.medications m
    JOIN public.patients p ON m.patient_id = p.id
    WHERE m.id = medication_id AND public.is_team_member(auth.uid(), p.team_id)
  )
);

-- MEDICATION DOSES POLICIES
CREATE POLICY "Team members can view doses" ON public.medication_doses FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.medication_schedules ms
    JOIN public.medications m ON ms.medication_id = m.id
    JOIN public.patients p ON m.patient_id = p.id
    WHERE ms.id = schedule_id AND public.is_team_member(auth.uid(), p.team_id)
  )
);
CREATE POLICY "Team members can manage doses" ON public.medication_doses FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.medication_schedules ms
    JOIN public.medications m ON ms.medication_id = m.id
    JOIN public.patients p ON m.patient_id = p.id
    WHERE ms.id = schedule_id AND public.is_team_member(auth.uid(), p.team_id)
  )
);

-- TASKS POLICIES
CREATE POLICY "Team members can view tasks" ON public.tasks FOR SELECT USING (public.is_team_member(auth.uid(), team_id));
CREATE POLICY "Team members can manage tasks" ON public.tasks FOR ALL USING (public.is_team_member(auth.uid(), team_id));

-- NOTE TAGS POLICIES
CREATE POLICY "Team members can view tags" ON public.note_tags FOR SELECT USING (public.is_team_member(auth.uid(), team_id));
CREATE POLICY "Team members can manage tags" ON public.note_tags FOR ALL USING (public.is_team_member(auth.uid(), team_id));

-- NOTES POLICIES
CREATE POLICY "Team members can view notes" ON public.notes FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND public.is_team_member(auth.uid(), team_id))
);
CREATE POLICY "Team members can manage notes" ON public.notes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.patients WHERE id = patient_id AND public.is_team_member(auth.uid(), team_id))
);

-- NOTES_TAGS POLICIES
CREATE POLICY "Team members can view note tags" ON public.notes_tags FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.notes n
    JOIN public.patients p ON n.patient_id = p.id
    WHERE n.id = note_id AND public.is_team_member(auth.uid(), p.team_id)
  )
);
CREATE POLICY "Team members can manage note tags" ON public.notes_tags FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.notes n
    JOIN public.patients p ON n.patient_id = p.id
    WHERE n.id = note_id AND public.is_team_member(auth.uid(), p.team_id)
  )
);

-- COMMUNITY POLICIES (accessible to all authenticated users)
CREATE POLICY "Anyone can view categories" ON public.community_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view topics" ON public.community_topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authors can manage own topics" ON public.community_topics FOR ALL USING (author_id = auth.uid());
CREATE POLICY "Authenticated can create topics" ON public.community_topics FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "Anyone can view replies" ON public.community_replies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authors can manage own replies" ON public.community_replies FOR ALL USING (author_id = auth.uid());
CREATE POLICY "Authenticated can create replies" ON public.community_replies FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "Anyone can view likes" ON public.community_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own likes" ON public.community_likes FOR ALL USING (user_id = auth.uid());

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- ACTIVITY LOGS POLICIES
CREATE POLICY "Team members can view activity" ON public.activity_logs FOR SELECT USING (public.is_team_member(auth.uid(), team_id));
CREATE POLICY "Team members can create activity" ON public.activity_logs FOR INSERT WITH CHECK (public.is_team_member(auth.uid(), team_id));

-- =============================================
-- SEED DATA: COMMUNITY CATEGORIES
-- =============================================

INSERT INTO public.community_categories (name, slug, description, icon) VALUES
  ('General Discussion', 'general', 'General topics about caregiving', 'MessageCircle'),
  ('Tips & Advice', 'tips', 'Share your caregiving tips and advice', 'Lightbulb'),
  ('Support', 'support', 'Get support from fellow caregivers', 'Heart'),
  ('Resources', 'resources', 'Share helpful resources and links', 'BookOpen'),
  ('Questions', 'questions', 'Ask questions to the community', 'HelpCircle');