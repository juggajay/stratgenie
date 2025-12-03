export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
}

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export const quizCategories: QuizCategory[] = [
  {
    id: "agm",
    name: "AGM Compliance",
    description: "Annual General Meeting requirements",
    color: "blue",
  },
  {
    id: "records",
    name: "Records & Strata Hub",
    description: "Record keeping and government reporting",
    color: "emerald",
  },
  {
    id: "financial",
    name: "Financial Management",
    description: "Budgeting, levies, and financial statements",
    color: "amber",
  },
  {
    id: "insurance",
    name: "Insurance & Maintenance",
    description: "Building protection and upkeep",
    color: "purple",
  },
  {
    id: "governance",
    name: "Committee Governance",
    description: "Committee operations and bylaws",
    color: "cyan",
  },
];

export const quizQuestions: QuizQuestion[] = [
  // AGM Compliance
  {
    id: "agm-1",
    category: "agm",
    question: "When was your last Annual General Meeting (AGM) held?",
    options: [
      { value: "within-3-months", label: "Within the last 3 months", score: 10 },
      { value: "within-6-months", label: "Within the last 6 months", score: 8 },
      { value: "within-12-months", label: "Within the last 12 months", score: 5 },
      { value: "over-12-months", label: "More than 12 months ago", score: 0 },
      { value: "never", label: "Never held one / Not sure", score: 0 },
    ],
  },
  {
    id: "agm-2",
    category: "agm",
    question: "Did you send AGM notices at least 14 days before the meeting?",
    options: [
      { value: "yes", label: "Yes, always", score: 10 },
      { value: "mostly", label: "Usually, but not always", score: 6 },
      { value: "no", label: "No / Not sure", score: 0 },
    ],
  },

  // Records & Strata Hub
  {
    id: "records-1",
    category: "records",
    question: "Is your scheme registered on the NSW Strata Hub?",
    options: [
      { value: "yes-current", label: "Yes, and information is current", score: 10 },
      { value: "yes-outdated", label: "Yes, but some info may be outdated", score: 5 },
      { value: "no", label: "No / Not registered", score: 0 },
      { value: "unsure", label: "Not sure", score: 2 },
    ],
  },
  {
    id: "records-2",
    category: "records",
    question: "How are your strata records stored and maintained?",
    options: [
      { value: "digital-organized", label: "Digital system, well organized", score: 10 },
      { value: "mixed", label: "Mix of digital and paper", score: 6 },
      { value: "paper-only", label: "Paper files only", score: 4 },
      { value: "scattered", label: "Records are scattered / disorganized", score: 0 },
    ],
  },

  // Financial Management
  {
    id: "financial-1",
    category: "financial",
    question: "Do you have separate bank accounts for admin and capital works funds?",
    options: [
      { value: "yes", label: "Yes, two separate accounts", score: 10 },
      { value: "one-account", label: "No, using one combined account", score: 0 },
      { value: "unsure", label: "Not sure", score: 2 },
    ],
  },
  {
    id: "financial-2",
    category: "financial",
    question: "Do you have a 10-year capital works plan?",
    options: [
      { value: "yes-current", label: "Yes, reviewed in last 2 years", score: 10 },
      { value: "yes-old", label: "Yes, but older than 2 years", score: 5 },
      { value: "no-plan", label: "No capital works plan", score: 0 },
      { value: "unsure", label: "Not sure", score: 2 },
    ],
  },

  // Insurance & Maintenance
  {
    id: "insurance-1",
    category: "insurance",
    question: "When was your building insurance last reviewed for adequate coverage?",
    options: [
      { value: "this-year", label: "Within the last year", score: 10 },
      { value: "1-2-years", label: "1-2 years ago", score: 6 },
      { value: "over-2-years", label: "More than 2 years ago", score: 2 },
      { value: "unsure", label: "Not sure", score: 0 },
    ],
  },
  {
    id: "insurance-2",
    category: "insurance",
    question: "Does your building have a current Annual Fire Safety Statement (AFSS)?",
    options: [
      { value: "yes", label: "Yes, current certificate", score: 10 },
      { value: "pending", label: "Due for renewal soon", score: 6 },
      { value: "no", label: "No / Expired", score: 0 },
      { value: "not-required", label: "Not required for our building", score: 10 },
      { value: "unsure", label: "Not sure", score: 2 },
    ],
  },

  // Committee Governance
  {
    id: "governance-1",
    category: "governance",
    question: "Does your strata committee meet regularly?",
    options: [
      { value: "quarterly", label: "Yes, at least quarterly", score: 10 },
      { value: "twice-yearly", label: "Yes, about twice a year", score: 6 },
      { value: "annual-only", label: "Only for the AGM", score: 3 },
      { value: "rarely", label: "Rarely / When issues arise", score: 0 },
    ],
  },
  {
    id: "governance-2",
    category: "governance",
    question: "Do you keep minutes of committee meetings?",
    options: [
      { value: "always", label: "Yes, always with proper records", score: 10 },
      { value: "sometimes", label: "Sometimes / informal notes", score: 4 },
      { value: "no", label: "No meeting minutes", score: 0 },
    ],
  },
];

export interface QuizResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  rating: "excellent" | "good" | "needs-attention" | "at-risk";
  categoryScores: {
    category: QuizCategory;
    score: number;
    maxScore: number;
    percentage: number;
  }[];
  recommendations: string[];
}

export function calculateQuizResults(answers: Record<string, string>): QuizResult {
  const maxScorePerQuestion = 10;
  const totalQuestions = quizQuestions.length;
  const maxScore = totalQuestions * maxScorePerQuestion;

  let totalScore = 0;
  const categoryScoresMap: Record<string, { score: number; count: number }> = {};

  // Initialize category scores
  quizCategories.forEach((cat) => {
    categoryScoresMap[cat.id] = { score: 0, count: 0 };
  });

  // Calculate scores
  quizQuestions.forEach((question) => {
    const answer = answers[question.id];
    if (answer) {
      const option = question.options.find((o) => o.value === answer);
      if (option) {
        totalScore += option.score;
        categoryScoresMap[question.category].score += option.score;
        categoryScoresMap[question.category].count += 1;
      }
    }
  });

  const percentage = Math.round((totalScore / maxScore) * 100);

  // Determine rating
  let rating: QuizResult["rating"];
  if (percentage >= 80) {
    rating = "excellent";
  } else if (percentage >= 60) {
    rating = "good";
  } else if (percentage >= 40) {
    rating = "needs-attention";
  } else {
    rating = "at-risk";
  }

  // Calculate category scores
  const categoryScores = quizCategories.map((category) => {
    const data = categoryScoresMap[category.id];
    const catMaxScore = data.count * maxScorePerQuestion;
    return {
      category,
      score: data.score,
      maxScore: catMaxScore,
      percentage: catMaxScore > 0 ? Math.round((data.score / catMaxScore) * 100) : 0,
    };
  });

  // Generate recommendations based on weak areas
  const recommendations: string[] = [];

  categoryScores.forEach(({ category, percentage }) => {
    if (percentage < 60) {
      switch (category.id) {
        case "agm":
          recommendations.push(
            "Schedule your AGM within 3 months of your financial year end. Send notices at least 14 days in advance."
          );
          break;
        case "records":
          recommendations.push(
            "Register your scheme on the NSW Strata Hub and ensure all information is current. Consider digitalizing your records."
          );
          break;
        case "financial":
          recommendations.push(
            "Ensure you have separate bank accounts for admin and capital works funds. Prepare or update your 10-year capital works plan."
          );
          break;
        case "insurance":
          recommendations.push(
            "Review your building insurance for adequate replacement value. Ensure fire safety certificates are current."
          );
          break;
        case "governance":
          recommendations.push(
            "Hold regular committee meetings (at least quarterly) and keep proper minutes of all decisions."
          );
          break;
      }
    }
  });

  if (recommendations.length === 0) {
    recommendations.push(
      "Your scheme appears to be in good compliance shape. Keep up the regular reviews and stay on top of deadlines."
    );
  }

  return {
    totalScore,
    maxScore,
    percentage,
    rating,
    categoryScores,
    recommendations,
  };
}

export const ratingConfig = {
  excellent: {
    label: "Excellent",
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    borderColor: "border-green-200",
    description: "Your scheme has strong compliance practices in place.",
  },
  good: {
    label: "Good",
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    description: "Good foundation with some areas for improvement.",
  },
  "needs-attention": {
    label: "Needs Attention",
    color: "amber",
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    description: "Several compliance areas need your attention soon.",
  },
  "at-risk": {
    label: "At Risk",
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    description: "Urgent action needed to address compliance gaps.",
  },
};
