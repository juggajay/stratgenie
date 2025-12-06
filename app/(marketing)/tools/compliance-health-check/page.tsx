"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import { useMutation, useAction } from "convex/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import {
  quizQuestions,
  quizCategories,
  calculateQuizResults,
  ratingConfig,
  type QuizResult,
} from "@/lib/quiz-data";

type Step = "intro" | "quiz" | "email" | "results";

export default function ComplianceHealthCheckPage() {
  const [step, setStep] = useState<Step>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [results, setResults] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const captureLead = useMutation(api.leads.capture);
  const sendEmail = useAction(api.actions.marketingEmail.sendHealthCheckEmail);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setStep("email");
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    const calculatedResults = calculateQuizResults(answers);

    try {
      // Capture lead and send results email in parallel
      await Promise.all([
        captureLead({
          email,
          name: name || undefined,
          source: "compliance_health_check",
          metadata: {
            score: calculatedResults.percentage,
            answers: Object.values(answers),
          },
        }),
        sendEmail({
          to: email,
          name: name || undefined,
          score: calculatedResults.percentage,
          rating: calculatedResults.rating,
          recommendations: calculatedResults.recommendations,
        }),
      ]);
    } catch (error) {
      console.error("Failed to process:", error);
      // Still show results even if email fails
    }

    setResults(calculatedResults);
    setStep("results");
    setIsLoading(false);
  };

  const question = quizQuestions[currentQuestion];
  const category = quizCategories.find((c) => c.id === question?.category);
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-[#3d3d5c] hover:text-[#FF6B35] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>

        {/* Intro Step */}
        {step === "intro" && (
          <div className="text-center">
            <div className="w-20 h-20 bg-[#FFF0EB] rounded-[20px] flex items-center justify-center mx-auto mb-6">
              <ClipboardCheck className="w-10 h-10 text-[#FF6B35]" />
            </div>
            <h1 className="text-3xl font-display font-semibold tracking-tight text-[#1a1a2e] mb-4">
              Strata Compliance Health Check
            </h1>
            <p className="text-lg text-[#3d3d5c] max-w-xl mx-auto mb-8">
              Answer 10 quick questions to assess your scheme&apos;s compliance status
              and get personalized recommendations.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {quizCategories.map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1 bg-[#F8F5F0] text-[#3d3d5c] text-sm rounded-lg"
                >
                  {cat.name}
                </span>
              ))}
            </div>
            <Button
              onClick={() => setStep("quiz")}
              className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white rounded-lg px-8 py-3 text-lg"
            >
              Start Health Check
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-[#6b6b8a] mt-4">Takes about 2 minutes</p>
          </div>
        )}

        {/* Quiz Step */}
        {step === "quiz" && question && (
          <div>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-[#6b6b8a] mb-2">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span>{category?.name}</span>
              </div>
              <div className="h-2 bg-[#E8E4DE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF6B35] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <Card className="border border-[#E8E4DE] rounded-[20px] border bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-medium">
                  {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(question.id, option.value)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        answers[question.id] === option.value
                          ? "border-[#FF6B35] bg-[#FFF0EB]"
                          : "border-[#E8E4DE] hover:border-[#E8E4DE]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            answers[question.id] === option.value
                              ? "border-[#FF6B35] bg-[#FF6B35]"
                              : "border-[#E8E4DE]"
                          }`}
                        >
                          {answers[question.id] === option.value && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-[#3d3d5c]">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="rounded-lg"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!answers[question.id]}
                    className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white rounded-lg"
                  >
                    {currentQuestion === quizQuestions.length - 1
                      ? "Get Results"
                      : "Next"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Email Step */}
        {step === "email" && (
          <Card className="border border-[#E8E4DE] rounded-[20px] border bg-white shadow-sm max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-[#FFF0EB] rounded-[20px] flex items-center justify-center mx-auto mb-4">
                <ClipboardCheck className="w-8 h-8 text-[#FF6B35]" />
              </div>
              <CardTitle className="text-xl font-medium">
                Almost there!
              </CardTitle>
              <CardDescription className="text-[#6b6b8a]">
                Enter your email to see your personalized compliance report
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-[#3d3d5c]">
                    Name (optional)
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg border-[#E8E4DE]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-[#3d3d5c]">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-lg border-[#E8E4DE]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FF6B35] hover:bg-[#E85A2A] text-white rounded-lg py-3"
                >
                  {isLoading ? "Calculating..." : "See My Results"}
                </Button>
                <p className="text-xs text-[#6b6b8a] text-center">
                  We&apos;ll send you helpful strata tips. Unsubscribe anytime.
                </p>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Results Step */}
        {step === "results" && results && (
          <div className="space-y-8">
            {/* Score Card */}
            <Card
              className={`border-2 ${ratingConfig[results.rating].borderColor} rounded-xl bg-white shadow-sm`}
            >
              <CardContent className="pt-8 text-center">
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4 ${ratingConfig[results.rating].bgColor} ${ratingConfig[results.rating].textColor}`}
                >
                  {ratingConfig[results.rating].label}
                </div>
                <div className="text-6xl font-bold text-[#1a1a2e] mb-2">
                  {results.percentage}%
                </div>
                <p className="text-[#3d3d5c] mb-6">
                  {ratingConfig[results.rating].description}
                </p>
                <div className="text-sm text-[#6b6b8a]">
                  Score: {results.totalScore} / {results.maxScore}
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="border border-[#E8E4DE] rounded-[20px] border bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.categoryScores.map(({ category, percentage }) => (
                    <div key={category.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#3d3d5c]">{category.name}</span>
                        <span
                          className={
                            percentage >= 60
                              ? "text-green-600"
                              : percentage >= 40
                              ? "text-amber-600"
                              : "text-red-600"
                          }
                        >
                          {percentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-[#E8E4DE] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            percentage >= 60
                              ? "bg-green-500"
                              : percentage >= 40
                              ? "bg-amber-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border border-[#E8E4DE] rounded-[20px] border bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#FFF0EB] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#FF6B35] text-xs font-semibold">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-[#3d3d5c]">{rec}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] rounded-[20px] p-8 text-center">
              <h2 className="text-xl font-semibold text-white mb-3">
                Want help improving your compliance?
              </h2>
              <p className="text-white/90 mb-6 max-w-md mx-auto">
                StrataGenie tracks deadlines, generates documents, and keeps your
                scheme compliant automatically.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/sign-up">
                  <Button className="bg-white text-[#FF6B35] hover:bg-[#F8F5F0] rounded-lg px-6 py-2.5">
                    Start Free Trial
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep("intro");
                    setCurrentQuestion(0);
                    setAnswers({});
                    setResults(null);
                    setEmail("");
                    setName("");
                  }}
                  className="border-white text-white hover:bg-white/10 rounded-lg px-6 py-2.5"
                >
                  Take Quiz Again
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
