// ============================================================
// AI RECOMMENDATION ENGINE
// Implements cosine similarity-based mentor matching
// This is the core AI feature of Alumni Connect AI
// ============================================================

// ─── COSINE SIMILARITY ───────────────────────────────────────
/**
 * Computes cosine similarity between two vectors
 * Used to measure how similar student profile is to alumni profile
 * Score range: 0 (no match) to 1 (perfect match)
 */
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

// ─── SKILL VOCABULARY ─────────────────────────────────────────
const SKILL_VOCABULARY = [
  "React", "Node.js", "Python", "Machine Learning", "JavaScript",
  "Java", "AWS", "Docker", "MongoDB", "SQL", "TypeScript", "C++",
  "TensorFlow", "Statistics", "Data Analysis", "Product Management",
  "Agile", "Leadership", "Vue.js", "Spring Boot", "Microservices",
  "CAD", "MATLAB", "Simulation", "Embedded Linux", "FPGA", "RTOS",
  "CSS", "UI/UX", "Android", "Data Structures", "Algorithms",
  "Signal Processing", "Arduino", "MySQL", "DevOps", "Cloud Computing",
];

const DEPARTMENT_MAP = {
  "Computer Science": 0,
  "Information Technology": 1,
  "Electronics": 2,
  "Mechanical": 3,
  "Civil": 4,
  "Chemical": 5,
};

const INTEREST_TO_SKILL = {
  "Web Development": ["React", "Node.js", "JavaScript", "CSS", "MongoDB"],
  "Machine Learning": ["Python", "Machine Learning", "TensorFlow", "Statistics"],
  "Data Science": ["Python", "SQL", "Statistics", "Data Analysis", "Machine Learning"],
  "Mobile Development": ["Android", "React", "JavaScript"],
  "Cloud Computing": ["AWS", "Docker", "Microservices"],
  "DevOps": ["Docker", "AWS", "Linux"],
  "Embedded Systems": ["C++", "RTOS", "FPGA", "Embedded Linux", "Arduino"],
  "IoT": ["Arduino", "Embedded Linux", "Python", "Signal Processing"],
  "Product Management": ["Product Management", "Agile", "Leadership", "Data Analysis"],
  "Startups": ["React", "Node.js", "Python", "Product Management"],
  "Research": ["Python", "MATLAB", "Statistics", "Machine Learning"],
};

// ─── PROFILE VECTORIZATION ────────────────────────────────────
/**
 * Converts a user profile into a numeric vector for similarity computation
 */
function profileToVector(user) {
  const skillVec = SKILL_VOCABULARY.map((skill) => {
    const userSkills = user.skills || [];
    return userSkills.includes(skill) ? 1 : 0;
  });

  const deptScore = DEPARTMENT_MAP[user.department] ?? 5;
  const expWeight = user.experience ? Math.min(user.experience / 10, 1) : 0;

  return [...skillVec, deptScore / 6, expWeight];
}

/**
 * Expand student interests into implied skills for better matching
 */
function expandStudentVector(student) {
  const expandedSkills = [...(student.skills || [])];

  if (student.interests) {
    student.interests.forEach((interest) => {
      const relatedSkills = INTEREST_TO_SKILL[interest] || [];
      relatedSkills.forEach((s) => {
        if (!expandedSkills.includes(s)) expandedSkills.push(s);
      });
    });
  }

  const expandedStudent = { ...student, skills: expandedSkills };
  return profileToVector(expandedStudent);
}

// ─── SCORING BREAKDOWN ────────────────────────────────────────
function computeMatchScore(student, alumni) {
  const studentSkills = student.skills || [];
  const alumniSkills = alumni.skills || [];

  const studentSkillSet = new Set(studentSkills.map((s) => s.toLowerCase()));
  const alumniSkillSet = new Set(alumniSkills.map((s) => s.toLowerCase()));
  const sharedSkills = [...studentSkillSet].filter((s) => alumniSkillSet.has(s));
  const skillMatch = studentSkillSet.size > 0 ? sharedSkills.length / studentSkillSet.size : 0;

  const sameDept = student.department === alumni.department;
  const relatedDepts = {
    "Computer Science": ["Information Technology"],
    "Information Technology": ["Computer Science"],
    "Electronics": ["Computer Science", "Information Technology"],
  };
  const related = relatedDepts[student.department]?.includes(alumni.department) || false;
  const departmentMatch = sameDept ? 1 : related ? 0.5 : 0.1;

  let interestMatch = 0;
  if (student.interests) {
    student.interests.forEach((interest) => {
      const relatedSkills = INTEREST_TO_SKILL[interest] || [];
      const hasMatch = relatedSkills.some((s) =>
        (alumni.skills || []).some((as) => as.toLowerCase() === s.toLowerCase())
      );
      if (hasMatch) interestMatch += 1;
    });
    interestMatch = student.interests.length > 0
      ? interestMatch / student.interests.length
      : 0;
  }

  const experienceScore = Math.min((alumni.experience || 0) / 8, 1);

  const studentVec = expandStudentVector(student);
  const alumniVec = profileToVector(alumni);
  const cosineScore = cosineSimilarity(studentVec, alumniVec);

  const overallScore = Math.round(
    (cosineScore * 0.35 +
      skillMatch * 0.25 +
      departmentMatch * 0.20 +
      interestMatch * 0.15 +
      experienceScore * 0.05) *
    100
  );

  return {
    skillMatch: Math.round(skillMatch * 100),
    departmentMatch: Math.round(departmentMatch * 100),
    interestMatch: Math.round(interestMatch * 100),
    experienceScore: Math.round(experienceScore * 100),
    overallScore: Math.min(overallScore + 5, 99),
  };
}

// ─── MAIN RECOMMENDATION FUNCTION ────────────────────────────
/**
 * Main AI function: Given a student, returns top N mentor recommendations
 */
export function getTopMentors(student, allAlumni, topN = 3) {
  const verifiedAlumni = allAlumni.filter(
    (u) => u.role === "alumni" && u.verified
  );

  const recommendations = verifiedAlumni.map((alumni) => {
    const matchScore = computeMatchScore(student, alumni);
    const studentSkillSet = new Set((student.skills || []).map((s) => s.toLowerCase()));
    const sharedSkills = (alumni.skills || []).filter((s) =>
      studentSkillSet.has(s.toLowerCase())
    );
    const reason = generateReason(student, alumni, matchScore, sharedSkills);

    return { alumni, matchScore, sharedSkills, reason };
  });

  return recommendations
    .sort((a, b) => b.matchScore.overallScore - a.matchScore.overallScore)
    .slice(0, topN);
}

/**
 * Generate a natural language explanation for why this mentor was recommended
 */
function generateReason(student, alumni, score, sharedSkills) {
  const reasons = [];

  if (score.departmentMatch >= 100) {
    reasons.push(`Same ${student.department} department`);
  }
  if (sharedSkills.length > 0) {
    reasons.push(`Shares skills: ${sharedSkills.slice(0, 2).join(", ")}`);
  }
  if (alumni.experience && alumni.experience >= 5) {
    reasons.push(`${alumni.experience} years of experience`);
  }
  if (score.interestMatch >= 50) {
    reasons.push(`Aligns with your career interests`);
  }
  if (alumni.company) {
    reasons.push(`Currently at ${alumni.company}`);
  }

  return reasons.slice(0, 3).join(" • ") || "Strong overall profile match";
}

export function getPlacementInsights(alumni, studentDept) {
  const verifiedAlumni = alumni.filter((a) => a.role === "alumni" && a.verified);

  const skillCount = {};
  verifiedAlumni.forEach((a) => {
    (a.skills || []).forEach((s) => {
      skillCount[s] = (skillCount[s] || 0) + 1;
    });
  });
  const topSkills = Object.entries(skillCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([skill]) => skill);

  const avgExperience =
    verifiedAlumni.reduce((sum, a) => sum + (a.experience || 0), 0) /
    (verifiedAlumni.length || 1);

  const companyCount = {};
  verifiedAlumni.forEach((a) => {
    if (a.company) {
      companyCount[a.company] = (companyCount[a.company] || 0) + 1;
    }
  });
  const topCompanies = Object.entries(companyCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([company]) => company);

  const deptAlumni = verifiedAlumni.filter((a) => a.department === studentDept);
  const departmentSuccessRate =
    verifiedAlumni.length > 0
      ? Math.round((deptAlumni.length / verifiedAlumni.length) * 100)
      : 0;

  return {
    topSkills,
    avgExperience: Math.round(avgExperience * 10) / 10,
    topCompanies,
    departmentSuccessRate,
  };
}
