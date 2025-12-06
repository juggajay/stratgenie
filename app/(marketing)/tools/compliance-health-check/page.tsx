"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  Shield,
  Sparkles,
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
import { Logo } from "@/components/marketing/logo";
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
    <div className="min-h-screen bg-background">
      {/* Intro Step - Hero style like landing page */}
      {step === "intro" && (
        <section className="pt-12 pb-20 px-6 relative overflow-hidden">
          {/* Decorative blurs like landing page */}
          <div className="absolute top-20 right-10 w-64 h-64 bg-[#FFF0EB] rounded-full blur-3xl opacity-40"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#FFF0EB] rounded-full blur-3xl opacity-40"></div>

          <div className="max-w-4xl mx-auto relative">
            {/* Back Link */}
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-sm text-[#3d3d5c] hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tools
            </Link>

            <div className="text-center">
              {/* Trust badge like landing page */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E8E4DE] shadow-sm text-[#3d3d5c] text-sm font-medium mb-8">
                <Shield className="w-4 h-4 text-[#FF6B35]" />
                Free NSW Compliance Assessment
              </div>

              {/* Large icon with brand styling */}
              <div className="w-24 h-24 bg-gradient-to-br from-[#FFF0EB] to-[#FFF0EB] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <ClipboardCheck className="w-12 h-12 text-[#FF6B35]" />
              </div>

              {/* Headline - matching landing page typography */}
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6 leading-[1.1]">
                Strata Compliance
                <br />
                <span className="text-[#FF6B35]">Health Check</span>
              </h1>

              <p className="text-lg md:text-xl text-[#3d3d5c] mb-10 max-w-2xl mx-auto leading-relaxed">
                Answer 10 quick questions to assess your scheme&apos;s compliance status
                and get personalized recommendations based on NSW SSMA 2015.
              </p>

              {/* Category pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {quizCategories.map((cat) => (
                  <span
                    key={cat.id}
                    className="px-4 py-2 bg-white border border-[#E8E4DE] text-[#3d3d5c] text-sm rounded-full shadow-sm"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>

              {/* CTA Button - landing page style */}
              <Button
                onClick={() => setStep("quiz")}
                size="lg"
                className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white text-lg px-10 py-6 rounded-full shadow-lg shadow-[#FF6B35]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Start Health Check
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Value props like landing page */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#3d3d5c] mt-8">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Takes 2 minutes
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  100% Free
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Instant Results
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quiz Step */}
      {step === "quiz" && question && (
        <div className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            {/* Progress section with branding */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <Link
                  href="/tools"
                  className="inline-flex items-center gap-2 text-sm text-[#3d3d5c] hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFF0EB] text-[#FF6B35] text-sm font-medium">
                  <Sparkles className="w-4 h-4" />
                  {category?.name}
                </div>
              </div>

              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <div className="h-2 bg-[#E8E4DE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF6B35] to-[#E85A2A] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card with enhanced styling */}
            <Card className="border border-[#E8E4DE] rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-all">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl md:text-2xl font-semibold text-foreground">
                  {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(question.id, option.value)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all hover:-translate-y-0.5 ${
                        answers[question.id] === option.value
                          ? "border-[#FF6B35] bg-[#FFF0EB] shadow-md"
                          : "border-[#E8E4DE] hover:border-[#FF6B35]/30 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            answers[question.id] === option.value
                              ? "border-[#FF6B35] bg-[#FF6B35]"
                              : "border-[#E8E4DE]"
                          }`}
                        >
                          {answers[question.id] === option.value && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-[#3d3d5c] font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-[#E8E4DE]">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="rounded-full px-6"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!answers[question.id]}
                    className="bg-[#FF6B35] hover:bg-[#E85A2A] text-white rounded-full px-6 shadow-sm"
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
        </div>
      )}

      {/* Email Step */}
      {step === "email" && (
        <div className="py-12 px-6 relative overflow-hidden">
          {/* Decorative blurs */}
          <div className="absolute top-10 right-20 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-40"></div>
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-[#FFF0EB] rounded-full blur-3xl opacity-30"></div>

          <Card className="border border-[#E8E4DE] rounded-2xl bg-white shadow-elevated max-w-md mx-auto relative">
            <CardHeader className="text-center pb-2">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-50 to-[#FFF0EB] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <ClipboardCheck className="w-10 h-10 text-[#FF6B35]" />
              </div>
              <CardTitle className="text-2xl font-semibold text-foreground">
                Almost there!
              </CardTitle>
              <CardDescription className="text-[#3d3d5c] text-base">
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
                    className="rounded-xl border-[#E8E4DE] h-12"
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
                    className="rounded-xl border-[#E8E4DE] h-12"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#FF6B35] hover:bg-[#E85A2A] text-white rounded-full py-6 text-lg shadow-lg shadow-[#FF6B35]/25"
                >
                  {isLoading ? "Calculating..." : "See My Results"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  We&apos;ll send you helpful strata tips. Unsubscribe anytime.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Step */}
      {step === "results" && results && (
        <div className="py-12 px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Score Card with enhanced styling */}
            <Card
              className={`border-2 ${ratingConfig[results.rating].borderColor} rounded-2xl bg-white shadow-elevated`}
            >
              <CardContent className="pt-8 pb-8 text-center">
                <div
                  className={`inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold mb-6 ${ratingConfig[results.rating].bgColor} ${ratingConfig[results.rating].textColor}`}
                >
                  {ratingConfig[results.rating].label}
                </div>
                <div className="text-7xl font-bold text-foreground mb-3">
                  {results.percentage}%
                </div>
                <p className="text-lg text-[#3d3d5c] mb-6 max-w-md mx-auto">
                  {ratingConfig[results.rating].description}
                </p>
                <div className="text-sm text-muted-foreground">
                  Score: {results.totalScore} / {results.maxScore}
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="border border-[#E8E4DE] rounded-2xl bg-white shadow-card">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {results.categoryScores.map(({ category, percentage }) => (
                    <div key={category.id}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-[#3d3d5c]">{category.name}</span>
                        <span
                          className={`font-semibold ${
                            percentage >= 60
                              ? "text-emerald-600"
                              : percentage >= 40
                              ? "text-amber-600"
                              : "text-red-600"
                          }`}
                        >
                          {percentage}%
                        </span>
                      </div>
                      <div className="h-3 bg-[#F8F5F0] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            percentage >= 60
                              ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                              : percentage >= 40
                              ? "bg-gradient-to-r from-amber-400 to-amber-500"
                              : "bg-gradient-to-r from-red-400 to-red-500"
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
            <Card className="border border-[#E8E4DE] rounded-2xl bg-white shadow-card">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <div className="w-7 h-7 bg-gradient-to-br from-[#FFF0EB] to-[#FFF0EB] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        <span className="text-[#FF6B35] text-xs font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <p className="text-[#3d3d5c] leading-relaxed">{rec}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* CTA - Dark card style like landing page pricing */}
            <div className="bg-foreground rounded-3xl p-10 text-center relative overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/10 to-[#E85A2A]/10"></div>

              <div className="relative">
                <div className="mb-6">
                  <Logo className="h-8 w-auto mx-auto" inverted />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-3">
                  Want help improving your compliance?
                </h2>
                <p className="text-[#F8F5F0]/80 mb-8 max-w-md mx-auto">
                  StrataGenie tracks deadlines, generates documents, and keeps your
                  scheme compliant automatically.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      className="bg-white hover:bg-[#F8F5F0] text-foreground rounded-full px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
                    >
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2" />
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
                    className="border-[#3d3d5c] text-[#F8F5F0] hover:bg-[#3d3d5c] rounded-full px-8 py-6"
                  >
                    Take Quiz Again
                  </Button>
                </div>
                <p className="mt-4 text-[#6b6b8a] text-sm">
                  No credit card required
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
