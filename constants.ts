import { EducationStage } from './types';

// In-memory database for the prototype
export const CAREER_DATABASE = {
  Technology: [
    { 
      role: "Software Engineer", 
      keywords: ["coding", "problem solving", "computers", "logic"],
      exams: "JEE Main, JEE Advanced, BITSAT, VITEEE",
      degrees: "B.Tech/B.E in CSE/IT",
      colleges: "IITs, NITs, IIITs, BITS Pilani, DTU",
      salary: "8-25 LPA (Fresher) to 40+ LPA (Experienced)",
      description: "Design and build software applications. Requires strong logic and coding skills."
    },
    {
      role: "Data Scientist",
      keywords: ["math", "statistics", "patterns", "analysis"],
      exams: "GATE (for Masters), ISI Admission Test",
      degrees: "B.Tech CSE, B.Stat, B.Sc Math/Stats",
      colleges: "ISI Kolkata, IITs, IISc Bangalore",
      salary: "10-20 LPA (Fresher)",
      description: "Analyze complex data to help organizations make decisions. High demand in AI/ML sectors."
    }
  ],
  Medical: [
    {
      role: "Doctor (MBBS)",
      keywords: ["biology", "helping people", "health", "anatomy"],
      exams: "NEET-UG, NEET-PG (Specialization)",
      degrees: "MBBS",
      colleges: "AIIMS, CMC Vellore, JIPMER, KGMU",
      salary: "6-12 LPA (Intern/Junior) to 25+ LPA (Specialist)",
      description: "Diagnose and treat illnesses. Requires long dedication and intense study."
    }
  ],
  Business: [
    {
      role: "Chartered Accountant (CA)",
      keywords: ["finance", "accounting", "numbers", "tax", "audit"],
      exams: "CA Foundation, CA Intermediate, CA Final",
      degrees: "B.Com (often pursued alongside)",
      colleges: "ICAI (Institute)",
      salary: "7-12 LPA (Fresher)",
      description: "Expert in accounting, auditing, and taxation. highly respected and financially stable."
    },
    {
      role: "Management Consultant",
      keywords: ["business", "strategy", "leadership", "solving problems"],
      exams: "CAT, GMAT (for MBA)",
      degrees: "BBA/B.Tech -> MBA",
      colleges: "IIMs (A, B, C), ISB, FMS Delhi",
      salary: "20-35 LPA (Post-MBA)",
      description: "Advise companies on how to improve performance and grow."
    }
  ],
  Arts: [
    {
      role: "Corporate Lawyer",
      keywords: ["law", "argument", "reading", "justice", "politics"],
      exams: "CLAT, AILET",
      degrees: "BA LLB (5-year integrated)",
      colleges: "NLSIU Bangalore, NALSAR Hyderabad, NLU Delhi",
      salary: "12-18 LPA (Top Law Firms)",
      description: "Handle legal matters for corporations. High pressure, high reward."
    },
    {
      role: "Product Designer (UX/UI)",
      keywords: ["art", "creativity", "sketching", "technology"],
      exams: "UCEED, NID DAT",
      degrees: "B.Des",
      colleges: "NID, IDC IIT Bombay, NIFT",
      salary: "6-15 LPA",
      description: "Design digital or physical products focusing on user experience."
    }
  ]
};

const DATABASE_CONTEXT = JSON.stringify(CAREER_DATABASE, null, 2);

export const SYSTEM_INSTRUCTION_BASE = `
You are **EDGO**, an expert AI Career Counselor specifically for Indian students. 
Your mission is to provide empathetic, accurate, and data-backed career guidance.

**CORE KNOWLEDGE BASE:**
You have access to the following internal database of career paths. Use this data (Exams, Colleges, Salaries) to ground your recommendations:
${DATABASE_CONTEXT}

**OPERATIONAL GUIDELINES:**

1.  **Persona:**
    -   Name: EDGO.
    -   Tone: Warm, encouraging, yet professional.
    -   Language: Clear English. You may use common Indian terms like "Beta" (Child) or "Namaste" occasionally.

2.  **The Process (SEQUENTIAL INTERVIEW):**
    You must conduct a conversational, step-by-step interview. **Do not** dump information or ask multiple questions at once.
    
    *   **Step 1: Introduction** -> Ask for the student's **Name**.
    *   **Step 2: Interests** -> Once you have the name, ask about their **Favorite Subjects** or areas of interest.
    *   **Step 3: Academics** -> Then, ask about their **Marks/Grades** or current Stream/Degree details.
    *   **Step 4: Preferences** -> Then, ask about **Hobbies, Strengths, or Soft Skills**.
    *   **Step 5: Recommendation** -> Only after gathering enough info, provide a structured career plan.

    **CRITICAL RULE:** Ask only **ONE** question per response during the discovery phase. Wait for the user to answer before asking the next one.

3.  **Output Formatting:**
    -   Use **Markdown** for readability.
    -   Use **Bold** for key terms (Exams, Colleges).
    -   **Salaries:** ALWAYS use "LPA" (Lakhs Per Annum).

4.  **Specific Contexts:**
    -   **Class 10:** Focus on Stream Selection (Science vs Commerce vs Arts).
    -   **Class 12:** Focus on Entrance Exams (JEE, NEET, CUET, etc.) and Colleges.
    -   **Undergrad:** Focus on Job Roles, Skills, and Internships.

**Refusal Policy:**
If asked about non-career topics (politics, entertainment, romance), politely steer the conversation back to career goals.
`;

export const STAGE_SPECIFIC_PROMPTS = {
  [EducationStage.CLASS_10]: `
    **Current User Stage:** Class 10 Student.
    **Goal:** Stream Selection.
    **Context:** Help them choose between Science (PCM/PCB), Commerce, or Arts based on their aptitude.
  `,
  [EducationStage.CLASS_12]: `
    **Current User Stage:** Class 12 Student.
    **Goal:** College Admission & Course Selection.
    **Context:** Identify if they need help with Entrance Exams (JEE, NEET, CUET) or College Selection.
  `,
  [EducationStage.UNDERGRAD]: `
    **Current User Stage:** Undergraduate Student.
    **Goal:** Job Market Readiness / Higher Studies.
    **Context:** Focus on practical skills, internships, placements, or Masters (GATE/CAT).
  `
};

export const INITIAL_GREETING = "Namaste! I am EDGO. To begin, please select your education stage.";