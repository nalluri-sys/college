export interface Material {
  id: string;
  title: string;
  subject: string;
  type: 'notes' | 'textbook' | 'paper' | 'assignment' | 'lab' | 'ppt';
  format: 'PDF' | 'DOC' | 'PPT';
  downloads: number;
  uploadedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  materials: Material[];
}

export interface Semester {
  id: number;
  title: string;
  description: string;
  subjects: Subject[];
  totalMaterials: number;
  color: string;
}

export const semesters: Semester[] = [
  {
    id: 1,
    title: "1-1",
    description: "Foundation courses covering Mathematics, Physics, Chemistry, and basic Engineering concepts",
    subjects: [
      {
        id: "m1",
        name: "Mathematics I",
        code: "MA101",
        materials: [
          { id: "m1-1", title: "Differential Calculus Notes", subject: "Mathematics I", type: "notes", format: "PDF", downloads: 1250, uploadedAt: "2024-01-15" },
          { id: "m1-2", title: "Integration Techniques", subject: "Mathematics I", type: "notes", format: "PDF", downloads: 980, uploadedAt: "2024-01-20" },
          { id: "m1-3", title: "Previous Year Papers 2023", subject: "Mathematics I", type: "paper", format: "PDF", downloads: 2100, uploadedAt: "2024-02-01" },
        ]
      },
      {
        id: "p1",
        name: "Engineering Physics",
        code: "PH101",
        materials: [
          { id: "p1-1", title: "Wave Optics Complete Notes", subject: "Engineering Physics", type: "notes", format: "PDF", downloads: 890, uploadedAt: "2024-01-10" },
          { id: "p1-2", title: "Lab Manual - Physics", subject: "Engineering Physics", type: "lab", format: "PDF", downloads: 1450, uploadedAt: "2024-01-05" },
        ]
      },
      {
        id: "c1",
        name: "Engineering Chemistry",
        code: "CH101",
        materials: [
          { id: "c1-1", title: "Electrochemistry Notes", subject: "Engineering Chemistry", type: "notes", format: "PDF", downloads: 670, uploadedAt: "2024-01-18" },
          { id: "c1-2", title: "Chemistry Lab Manual", subject: "Engineering Chemistry", type: "lab", format: "PDF", downloads: 1200, uploadedAt: "2024-01-12" },
        ]
      },
      {
        id: "eg1",
        name: "Engineering Graphics",
        code: "ME101",
        materials: [
          { id: "eg1-1", title: "Projections of Points & Lines", subject: "Engineering Graphics", type: "notes", format: "PDF", downloads: 1100, uploadedAt: "2024-01-22" },
          { id: "eg1-2", title: "Isometric Projections PPT", subject: "Engineering Graphics", type: "ppt", format: "PPT", downloads: 780, uploadedAt: "2024-01-25" },
        ]
      },
    ],
    totalMaterials: 45,
    color: "168 76% 36%"
  },
  {
    id: 2,
    title: "1-2",
    description: "Advanced Mathematics, Programming fundamentals, and core engineering subjects",
    subjects: [
      {
        id: "m2",
        name: "Mathematics II",
        code: "MA102",
        materials: [
          { id: "m2-1", title: "Linear Algebra Notes", subject: "Mathematics II", type: "notes", format: "PDF", downloads: 1380, uploadedAt: "2024-02-15" },
          { id: "m2-2", title: "Differential Equations", subject: "Mathematics II", type: "notes", format: "PDF", downloads: 1120, uploadedAt: "2024-02-20" },
        ]
      },
      {
        id: "cp",
        name: "C Programming",
        code: "CS101",
        materials: [
          { id: "cp-1", title: "Complete C Programming Notes", subject: "C Programming", type: "notes", format: "PDF", downloads: 2500, uploadedAt: "2024-02-10" },
          { id: "cp-2", title: "Programming Assignments", subject: "C Programming", type: "assignment", format: "PDF", downloads: 1800, uploadedAt: "2024-02-25" },
        ]
      },
      {
        id: "bee",
        name: "Basic Electrical Engineering",
        code: "EE101",
        materials: [
          { id: "bee-1", title: "Circuit Analysis Notes", subject: "Basic Electrical Engineering", type: "notes", format: "PDF", downloads: 950, uploadedAt: "2024-02-12" },
        ]
      },
    ],
    totalMaterials: 52,
    color: "222 60% 45%"
  },
  {
    id: 3,
    title: "2-1",
    description: "Data Structures, Digital Electronics, and specialized engineering courses",
    subjects: [
      {
        id: "ds",
        name: "Data Structures",
        code: "CS201",
        materials: [
          { id: "ds-1", title: "Arrays & Linked Lists", subject: "Data Structures", type: "notes", format: "PDF", downloads: 2800, uploadedAt: "2024-03-15" },
          { id: "ds-2", title: "Trees & Graphs Notes", subject: "Data Structures", type: "notes", format: "PDF", downloads: 2400, uploadedAt: "2024-03-20" },
          { id: "ds-3", title: "Sorting Algorithms PPT", subject: "Data Structures", type: "ppt", format: "PPT", downloads: 1900, uploadedAt: "2024-03-22" },
        ]
      },
      {
        id: "de",
        name: "Digital Electronics",
        code: "EC201",
        materials: [
          { id: "de-1", title: "Boolean Algebra & Logic Gates", subject: "Digital Electronics", type: "notes", format: "PDF", downloads: 1650, uploadedAt: "2024-03-10" },
          { id: "de-2", title: "Combinational Circuits", subject: "Digital Electronics", type: "notes", format: "PDF", downloads: 1400, uploadedAt: "2024-03-18" },
        ]
      },
      {
        id: "coa",
        name: "Computer Organization",
        code: "CS202",
        materials: [
          { id: "coa-1", title: "CPU Architecture Notes", subject: "Computer Organization", type: "notes", format: "PDF", downloads: 1200, uploadedAt: "2024-03-25" },
        ]
      },
    ],
    totalMaterials: 48,
    color: "280 60% 50%"
  },
  {
    id: 4,
    title: "2-2",
    description: "Operating Systems, Database Management, and advanced programming concepts",
    subjects: [
      {
        id: "os",
        name: "Operating Systems",
        code: "CS301",
        materials: [
          { id: "os-1", title: "Process Management Notes", subject: "Operating Systems", type: "notes", format: "PDF", downloads: 2200, uploadedAt: "2024-04-15" },
          { id: "os-2", title: "Memory Management", subject: "Operating Systems", type: "notes", format: "PDF", downloads: 1950, uploadedAt: "2024-04-20" },
          { id: "os-3", title: "OS Lab Manual", subject: "Operating Systems", type: "lab", format: "PDF", downloads: 1600, uploadedAt: "2024-04-10" },
        ]
      },
      {
        id: "dbms",
        name: "Database Management",
        code: "CS302",
        materials: [
          { id: "dbms-1", title: "SQL Complete Guide", subject: "Database Management", type: "notes", format: "PDF", downloads: 2800, uploadedAt: "2024-04-12" },
          { id: "dbms-2", title: "Normalization Notes", subject: "Database Management", type: "notes", format: "PDF", downloads: 2100, uploadedAt: "2024-04-18" },
        ]
      },
      {
        id: "java",
        name: "Object Oriented Programming",
        code: "CS303",
        materials: [
          { id: "java-1", title: "Java Programming Notes", subject: "Object Oriented Programming", type: "notes", format: "PDF", downloads: 2650, uploadedAt: "2024-04-22" },
        ]
      },
    ],
    totalMaterials: 55,
    color: "340 70% 50%"
  },
  {
    id: 5,
    title: "3-1",
    description: "Software Engineering, Computer Networks, and Theory of Computation",
    subjects: [
      {
        id: "se",
        name: "Software Engineering",
        code: "CS401",
        materials: [
          { id: "se-1", title: "SDLC Models Notes", subject: "Software Engineering", type: "notes", format: "PDF", downloads: 1800, uploadedAt: "2024-05-15" },
          { id: "se-2", title: "Agile Methodology PPT", subject: "Software Engineering", type: "ppt", format: "PPT", downloads: 1500, uploadedAt: "2024-05-20" },
        ]
      },
      {
        id: "cn",
        name: "Computer Networks",
        code: "CS402",
        materials: [
          { id: "cn-1", title: "OSI Model Complete Notes", subject: "Computer Networks", type: "notes", format: "PDF", downloads: 2400, uploadedAt: "2024-05-10" },
          { id: "cn-2", title: "TCP/IP Protocol Suite", subject: "Computer Networks", type: "notes", format: "PDF", downloads: 2100, uploadedAt: "2024-05-18" },
        ]
      },
      {
        id: "toc",
        name: "Theory of Computation",
        code: "CS403",
        materials: [
          { id: "toc-1", title: "Finite Automata Notes", subject: "Theory of Computation", type: "notes", format: "PDF", downloads: 1650, uploadedAt: "2024-05-25" },
        ]
      },
    ],
    totalMaterials: 42,
    color: "200 70% 45%"
  },
  {
    id: 6,
    title: "3-2",
    description: "Compiler Design, Machine Learning basics, and Web Technologies",
    subjects: [
      {
        id: "cd",
        name: "Compiler Design",
        code: "CS501",
        materials: [
          { id: "cd-1", title: "Lexical Analysis Notes", subject: "Compiler Design", type: "notes", format: "PDF", downloads: 1400, uploadedAt: "2024-06-15" },
          { id: "cd-2", title: "Parsing Techniques", subject: "Compiler Design", type: "notes", format: "PDF", downloads: 1250, uploadedAt: "2024-06-20" },
        ]
      },
      {
        id: "ml",
        name: "Machine Learning",
        code: "CS502",
        materials: [
          { id: "ml-1", title: "ML Algorithms Overview", subject: "Machine Learning", type: "notes", format: "PDF", downloads: 3200, uploadedAt: "2024-06-10" },
          { id: "ml-2", title: "Neural Networks PPT", subject: "Machine Learning", type: "ppt", format: "PPT", downloads: 2800, uploadedAt: "2024-06-18" },
        ]
      },
      {
        id: "wt",
        name: "Web Technologies",
        code: "CS503",
        materials: [
          { id: "wt-1", title: "HTML/CSS/JS Complete Guide", subject: "Web Technologies", type: "notes", format: "PDF", downloads: 2900, uploadedAt: "2024-06-22" },
        ]
      },
    ],
    totalMaterials: 38,
    color: "30 80% 50%"
  },
  {
    id: 7,
    title: "4-1",
    description: "Advanced electives, Project work, and Industry-ready skills",
    subjects: [
      {
        id: "ai",
        name: "Artificial Intelligence",
        code: "CS601",
        materials: [
          { id: "ai-1", title: "AI Fundamentals Notes", subject: "Artificial Intelligence", type: "notes", format: "PDF", downloads: 2600, uploadedAt: "2024-07-15" },
          { id: "ai-2", title: "Search Algorithms", subject: "Artificial Intelligence", type: "notes", format: "PDF", downloads: 2200, uploadedAt: "2024-07-20" },
        ]
      },
      {
        id: "cc",
        name: "Cloud Computing",
        code: "CS602",
        materials: [
          { id: "cc-1", title: "Cloud Architecture Notes", subject: "Cloud Computing", type: "notes", format: "PDF", downloads: 1800, uploadedAt: "2024-07-10" },
          { id: "cc-2", title: "AWS Services Overview", subject: "Cloud Computing", type: "ppt", format: "PPT", downloads: 2100, uploadedAt: "2024-07-18" },
        ]
      },
      {
        id: "is",
        name: "Information Security",
        code: "CS603",
        materials: [
          { id: "is-1", title: "Cryptography Notes", subject: "Information Security", type: "notes", format: "PDF", downloads: 1950, uploadedAt: "2024-07-25" },
        ]
      },
    ],
    totalMaterials: 35,
    color: "150 60% 40%"
  },
];

export const getMaterialTypeIcon = (type: Material['type']): string => {
  switch (type) {
    case 'notes': return '📝';
    case 'textbook': return '📚';
    case 'paper': return '📄';
    case 'assignment': return '✏️';
    case 'lab': return '🔬';
    case 'ppt': return '📊';
    default: return '📁';
  }
};

export const getMaterialTypeName = (type: Material['type']): string => {
  switch (type) {
    case 'notes': return 'Lecture Notes';
    case 'textbook': return 'Textbook';
    case 'paper': return 'Question Paper';
    case 'assignment': return 'Assignment';
    case 'lab': return 'Lab Manual';
    case 'ppt': return 'Presentation';
    default: return 'Document';
  }
};
