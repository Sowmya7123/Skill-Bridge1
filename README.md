# SkillBridge Connect

Create a complete full-stack prototype for "SkillBridge: Connecting Academia, Industry & Talent" with a clean, modern SaaS interface using React, Tailwind CSS, Lucide icons, and shadcn/ui.

### 1. User Architecture & Landing (Default Screen)

- Start with a clean Welcome / Auth Screen: "Welcome to SkillBridge".

- Subtitle: "Smart automation portal connecting students, academia, and industry for personalized skill mapping and placement."

- 4 Role Selection Cards with distinct icons:

  1. Student ("Assess skills, bridge gaps & get placed")

  2. Recruiter ("Post roles & hire verified talent")

  3. Academician ("Track cohort readiness & update curriculum")

  4. Mentor ("Guide students & review industry projects")

- Clicking Recruiter, Academician, or Mentor takes them to their respective dedicated dashboards.

- Clicking "Student" initiates the guided Student Onboarding Flow below.

---

### 2. Student Guided Flow (Step-by-Step)

#### Step A: Career Path Selection

- Headline: "What is your target career path?"

- Role selector cards with badges:

  - Full Stack Developer (React, Node.js, SQL)

  - AI / ML Engineer (Python, Scikit-learn, Transformers)

  - Cloud / DevOps Engineer (Docker, CI/CD, AWS)

  - Data Analyst (Python, PowerBI, SQL)

- Include a selection indicator and a "Continue to Skill Assessment" button.

#### Step B: Interactive AI Skill Assessment

- Quiz interface customized to the selected career path (e.g., if Full Stack is selected, show 3 questions covering React Hooks, REST API status codes, and SQL queries).

- Progress indicator: "Question X of 3".

- "Submit & Analyze" CTA with a 1.5-second simulated AI scanning animation ("Running Sentence-Transformers & Skill Gap Mapping...").

#### Step C: Personalized Student Dashboard

- Rendered only after quiz submission:

  - Header: Shows selected target path (e.g., "Target: Full Stack Developer") and a "Retake Assessment" option.

  - KPI Metrics: Skill Readiness Score (calculated from quiz, e.g., 68%), Gaps Identified (e.g., 2 critical), Match Index (e.g., 84%).

  - AI Skill Gap Analysis: Visual comparison side-by-side:

    - Mastered Skills: Green progress bars (e.g., React Basics, JavaScript, HTML/CSS).

    - Missing/Gap Skills: Amber/Red progress bars (e.g., FastAPI, Docker, Advanced SQL).

  - Personalized Learning Roadmap: Interactive step-by-step path with checkable milestones and estimated hours.

  - Recommended Internships & Mentors: Dynamic cards showing verified matching scores (e.g., "92% Fit") with an "Apply" modal.

---

### 3. Other Stakeholder Views (Accessible via top nav or role switcher)

#### Recruiter Dashboard:

- Pipeline metrics: Active Openings, Verified Candidates, Shortlisted, Placed.

- Candidate Talent Pool: Filterable data table with candidate avatars, verified skill scores, AI match %, and a "View Verified Portfolio" sheet.

- "Post New Opening" modal with required skill tag selectors.

#### Academician Dashboard:

- College analytics: Cohort Readiness Score, Most Common Skill Gaps across students (e.g., Cloud & System Design).

- Curriculum Alignment Widget: AI recommendations to adjust semester coursework based on hiring trends with an "Approve Curriculum Update" button.

#### Mentor Dashboard:

- Mentorship requests queue from students with "Accept" / "Decline".

- Project submission feed: Student capstone projects awaiting code review and feedback ratings.

---

### 4. Design & State Details

- Visual Theme: Professional enterprise design, subtle slate background, deep blue/indigo brand accents, and clean card borders.

- Top Bar: SkillBridge logo, role switcher pills, and user profile avatar.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c81f266e-201d-4ab0-a2c4-dc0148147405).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
