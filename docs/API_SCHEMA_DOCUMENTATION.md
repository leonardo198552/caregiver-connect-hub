# CareConnect - API & Database Documentation

## For Future Node.js + Prisma Migration

This document provides the complete schema and API contract for migrating CareConnect to a Node.js backend.

---

## Database Schema (Prisma Format)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  CAREGIVER
  ADMIN
}

enum UserStatus {
  ACTIVE
  PENDING
  DISABLED
}

enum TeamMemberRole {
  OWNER
  MEMBER
}

enum TeamMemberStatus {
  ACTIVE
  AWAY
  PENDING
}

enum ClinicalStatus {
  STABLE
  MONITORING
  ATTENTION
}

enum MedicationDoseStatus {
  PENDING
  COMPLETED
  SKIPPED
}

enum TaskType {
  MEDICATION
  VISIT
  CARE
  CUSTOM
}

enum TaskStatus {
  UPCOMING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum NoteType {
  TEXT
  VIDEO
}

enum FrequencyType {
  DAILY
  WEEKLY
  MONTHLY
  AS_NEEDED
}

enum ActivityType {
  MEDICATION_GIVEN
  NOTE_ADDED
  TASK_COMPLETED
  PATIENT_ADDED
  VISIT_LOGGED
  TEAM_MEMBER_ADDED
}

enum EntityType {
  MEDICATION
  NOTE
  TASK
  PATIENT
  VISIT
  TEAM
}

model Profile {
  id                            String     @id @default(uuid())
  userId                        String     @unique @map("user_id")
  firstName                     String     @map("first_name")
  lastName                      String     @map("last_name")
  email                         String
  phone                         String?
  avatarUrl                     String?    @map("avatar_url")
  notificationEmail             Boolean    @default(true) @map("notification_email")
  notificationPush              Boolean    @default(true) @map("notification_push")
  notificationMedicationReminders Boolean  @default(true) @map("notification_medication_reminders")
  notificationCommunityUpdates  Boolean    @default(true) @map("notification_community_updates")
  twoFactorEnabled              Boolean    @default(false) @map("two_factor_enabled")
  status                        UserStatus @default(ACTIVE)
  createdAt                     DateTime   @default(now()) @map("created_at")
  updatedAt                     DateTime   @updatedAt @map("updated_at")

  @@map("profiles")
}

model UserRole {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  role      UserRole @default(CAREGIVER)
  createdAt DateTime @default(now()) @map("created_at")

  @@unique([userId, role])
  @@map("user_roles")
}

model Team {
  id        String   @id @default(uuid())
  name      String
  ownerId   String   @map("owner_id")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  members     TeamMember[]
  invitations TeamInvitation[]
  patients    Patient[]
  tasks       Task[]
  noteTags    NoteTag[]
  activityLogs ActivityLog[]

  @@map("teams")
}

model TeamMember {
  id        String           @id @default(uuid())
  teamId    String           @map("team_id")
  userId    String           @map("user_id")
  role      TeamMemberRole   @default(MEMBER)
  status    TeamMemberStatus @default(ACTIVE)
  invitedAt DateTime?        @map("invited_at")
  joinedAt  DateTime?        @map("joined_at")
  createdAt DateTime         @default(now()) @map("created_at")

  team Team @relation(fields: [teamId], references: [id], onDelete: Cascade)

  @@unique([teamId, userId])
  @@map("team_members")
}

model Patient {
  id              String         @id @default(uuid())
  teamId          String         @map("team_id")
  firstName       String         @map("first_name")
  lastName        String         @map("last_name")
  dateOfBirth     DateTime?      @map("date_of_birth")
  gender          String?
  primaryCondition String?       @map("primary_condition")
  clinicalStatus  ClinicalStatus @default(STABLE) @map("clinical_status")
  notesSummary    String?        @map("notes_summary")
  avatarUrl       String?        @map("avatar_url")
  createdAt       DateTime       @default(now()) @map("created_at")
  updatedAt       DateTime       @updatedAt @map("updated_at")

  team        Team         @relation(fields: [teamId], references: [id], onDelete: Cascade)
  visits      Visit[]
  medications Medication[]
  tasks       Task[]
  notes       Note[]

  @@map("patients")
}

model Medication {
  id                String   @id @default(uuid())
  patientId         String   @map("patient_id")
  name              String
  dosage            String?
  instructions      String?
  stockQuantity     Int      @default(0) @map("stock_quantity")
  lowStockThreshold Int      @default(10) @map("low_stock_threshold")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  patient   Patient              @relation(fields: [patientId], references: [id], onDelete: Cascade)
  schedules MedicationSchedule[]

  @@map("medications")
}

model Task {
  id            String     @id @default(uuid())
  teamId        String     @map("team_id")
  patientId     String?    @map("patient_id")
  assignedToId  String?    @map("assigned_to_id")
  title         String
  description   String?
  type          TaskType   @default(CUSTOM)
  scheduledDate DateTime   @map("scheduled_date")
  scheduledTime DateTime?  @map("scheduled_time")
  status        TaskStatus @default(UPCOMING)
  completedAt   DateTime?  @map("completed_at")
  completedById String?    @map("completed_by_id")
  createdAt     DateTime   @default(now()) @map("created_at")
  updatedAt     DateTime   @updatedAt @map("updated_at")

  team    Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  patient Patient? @relation(fields: [patientId], references: [id], onDelete: SetNull)

  @@map("tasks")
}

model CommunityCategory {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?
  icon        String?
  createdAt   DateTime @default(now()) @map("created_at")

  topics CommunityTopic[]

  @@map("community_categories")
}

model CommunityTopic {
  id         String   @id @default(uuid())
  categoryId String   @map("category_id")
  authorId   String?  @map("author_id")
  title      String
  content    String
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  category CommunityCategory  @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  replies  CommunityReply[]
  likes    CommunityLike[]

  @@map("community_topics")
}
```

---

## REST API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login with email/password |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |
| GET | `/auth/me` | Get current user |
| POST | `/auth/logout` | Logout |

### Patients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patients` | List team patients |
| GET | `/patients/:id` | Get patient details |
| POST | `/patients` | Create patient |
| PUT | `/patients/:id` | Update patient |
| DELETE | `/patients/:id` | Delete patient |

### Medications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/medications` | List medications |
| GET | `/medications/today` | Today's doses |
| POST | `/medications` | Create medication |
| POST | `/medications/doses/:id/complete` | Mark dose complete |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List tasks (filter by date) |
| POST | `/tasks` | Create task |
| PUT | `/tasks/:id` | Update task |
| POST | `/tasks/:id/complete` | Mark task complete |

### Community
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/community/categories` | List categories |
| GET | `/community/topics` | List topics |
| POST | `/community/topics` | Create topic |
| POST | `/community/topics/:id/replies` | Add reply |
| POST | `/community/topics/:id/like` | Toggle like |

### Team
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/team/members` | List team members |
| POST | `/team/invitations` | Send invitation |
| POST | `/team/invitations/:id/cancel` | Cancel invitation |

---

## Environment Variables

```env
# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/careconnect
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
PORT=3333

# Frontend (.env)
VITE_API_URL=http://localhost:3333
```

---

## Current Implementation

The app is now fully functional with Lovable Cloud backend:
- ✅ PostgreSQL database with all tables
- ✅ JWT authentication (login/register/reset password)
- ✅ Protected routes
- ✅ Real-time data for all pages
- ✅ RLS policies for multi-tenancy
