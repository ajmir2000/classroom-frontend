import { Subject } from "../types";

export const DEPARTMENTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Geography",
  "Economics",
  "Business Administration",
  "Engineering",
  "Psychology",
  "Sociology",
  "Political Science",
  "Philosophy",
  "Education",
  "Fine Arts",
  "Music",
  "Physical Education",
  "Law",
] as const;

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((dept) => ({
  value: dept,
  label: dept,
}));

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "CS",
    description:
      "This course provides an overview of computer science principles and programming.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    code: "MATH201",
    name: "Calculus I",
    department: "Math",
    description:
      "An introduction to the concepts of derivatives and integrals.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    code: "PHYS301",
    name: "Classical Mechanics",
    department: "Physics",
    description:
      "This course covers the fundamentals of mechanics, motion, and forces.",
    createdAt: new Date().toISOString(),
  },
];
