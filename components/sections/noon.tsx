
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, Sparkles, Lightbulb, Laugh, Zap, Heart } from "lucide-react"
import dynamic from "next/dynamic"
import { saveQuizAnswer } from "@/lib/supabase"

// Import Confetti component with dynamic import to avoid SSR issues
const Confetti = dynamic(() => import("@/components/confetti"), {
  ssr: false,
})

export default function Noon() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [mounted, setMounted] = useState(false)

  // New fun features
  const [showFunFeatures, setShowFunFeatures] = useState(false)
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [fortuneResult, setFortuneResult] = useState<string | null>(null)
  const [storyWords, setStoryWords] = useState<{ [key: string]: string }>({})
  const [showStoryResult, setShowStoryResult] = useState(false)
  const [loveScore, setLoveScore] = useState<number | null>(null)

  const [customAnswer, setCustomAnswer] = useState("");

  const questions = [
    {
      question: "اللي هتكتبيه هيوصلي",
      type: "text" // This indicates it's a text input question
    },
  ]

  // Fortune teller predictions
  const fortunePredictions = [
    "هتقضوا أجمل سنة في حياتكم مع بعض السنة دي ❤️",
    "هتقضوا مع بعض وقت اكتر زي ما كنتو عاوزين",
    "هيحصل حاجة حلوة جدًا بينكم الشهر ده",
    "هتفتكروا اليوم ده كل سنة وتضحكوا عليه وتتبسطوا بردو",
    "هتلاقي هدية حلوة منه قريب",
    "هيفاجئك بحاجة حلوة أوي قريب",
    "هتعيشوا قصة حب جميلة طول العمر",
    "هتكونوا  أسعد اتنين مع بعض",
    "هتحققوا أحلامكم مع بعض ",
    "هيفضل يحبك أكتر وأكتر كل يوم",
  ]

  // Story template
  const storyTemplate = {
    title: "قصة حبنا",
    fields: [
      { id: "adjective1", label: "صفة جميلة عني" },
      { id: "place", label: "مكان" },
      { id: "activity", label: "نشاط نعملو يعني قولي فعل مثلا(يلعبوا) " },
      { id: "emotion", label: "شعور" },
      { id: "food", label: "أكلة" },
      { id: "future", label: "(حاجة نفسك نعملها مع بعض (فعل بردو" },
    ],
    template:
      "كان فيه مرة شاب {adjective1} قابل بنت جميلة في {place}. قرروا يروحوا {activity} مع بعض وكانوا حاسين بـ{emotion}. بعدها راحوا ياكلوا {food} وقرروا إنهم {future} قريب. وعاشوا في سعادة وحب طول العمر.",
  }

  useEffect(() => {
    // Mark component as mounted
    setMounted(true)
  }, [])

  const handleAnswer = async () => {

    let answerToSave = selectedOption;
    if (currentQuestion === 2 && selectedOption === "غيرهم" && customAnswer.trim()) {
      answerToSave = customAnswer.trim();
    }

    // Save the answer to Supabase
    await saveQuizAnswer(questions[currentQuestion].question, answerToSave || "No answer");

    if (!selectedOption) {
      // If time ran out without selection
      const newAnswers = [...answers, ""]
      setAnswers(newAnswers)
    } else {
      const newAnswers = [...answers, answerToSave]
      setAnswers(newAnswers)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption("")
      setCustomAnswer("")
    } else {
      setShowResult(true)
      setShowConfetti(true) // Always show confetti since all answers are accepted
    }
  }

  const getAnswersCount = () => {
    return answers.filter(answer => answer.trim() !== "").length;
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResult(false)
    setSelectedOption("")
    setShowConfetti(false)
  }

  // Fortune teller function
  const tellFortune = () => {
    setFortuneResult(null)

    // Animation effect
    const duration = 5000
    const interval = 500
    let count = 0

    const fortuneInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * fortunePredictions.length)
      setFortuneResult(fortunePredictions[randomIndex])
      count += interval

      if (count >= duration) {
        clearInterval(fortuneInterval)
        // Final result
        const finalIndex = Math.floor(Math.random() * fortunePredictions.length)
        setFortuneResult(fortunePredictions[finalIndex])
      }
    }, interval)
  }

  // Handle story word input
  const handleStoryWordChange = (id: string, value: string) => {
    setStoryWords((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  // Generate story
  const generateStory = () => {
    setShowStoryResult(true)
  }

  // Calculate love score
  const calculateLoveScore = () => {
    // Just a fun random score between 85-100%
    setLoveScore(Math.floor(Math.random() * 16) + 85)
  }

  // Only render after client-side hydration
  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col items-center" dir="rtl">
      {showConfetti && <Confetti />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 w-full"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 p-3 rounded-full shadow-lg mb-4">
            <div className="bg-white rounded-full p-3">
              <span className="text-3xl">😂</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-2">
            شوية اسأله حب وضحك يعني
          </h1>
          <p className="text-sm text-gray-500">شوفي تعرفيني قد اي��</p>
        </motion.div>

        <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-amber-100">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div key="question" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold">إنتي تعرفيني كويس؟</h2>
                </div>

                <div className="relative mb-8 bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-lg">
                  <div className="absolute -top-3 -right-3 bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md">
                    {currentQuestion + 1}
                  </div>
                  <p className="text-xl mb-4 pt-2">{questions[currentQuestion].question}</p>

                  <div className="mt-4">
                    <input
                      type="text"
                      value={selectedOption}
                      onChange={e => setSelectedOption(e.target.value)}
                      className="w-full p-4 text-lg border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 mt-2 bg-white shadow-sm"
                      placeholder=" "
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    سؤال {currentQuestion + 1} من {questions.length}
                  </div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleAnswer}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-full text-lg transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {currentQuestion < questions.length - 1 ? (
                        <>
                          السؤال التالي
                          <ArrowRight className="mr-2 h-5 w-5" />
                        </>
                      ) : (
                        "إنهاء الاختبار"
                      )}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-center">النتيجة!</h2>

                <div className="mb-8">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-teal-400 to-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <CheckCircle2 className="h-10 w-10 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-teal-600 mb-4">إنتي شطورههه عارفة كل حاجة عني ❤️</p>
                    <div className="p-6 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg shadow-inner">
                      <p className="text-lg" >جاوبتي على كل الاسئله يروحقلبي انتي تعرفيني اويييي🥹❤</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mb-8">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={resetQuiz}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-full text-lg transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      حاولي مرة تانية
                    </Button>
                  </motion.div>
                </div>

                {/* Fun Features Section */}
                <div className="mt-8">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-amber-700">ألعاب وتسلية</h3>
                    <p className="text-sm text-gray-500">جربي الألعاب الحلوة دي</p>
                  </div>

                  {!showFunFeatures ? (
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => setShowFunFeatures(true)}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-full text-lg transition-all duration-300 shadow-md hover:shadow-lg w-full"
                      >
                        <Laugh className="ml-2 h-5 w-5" />
                        اكتشفي الأ��عاب
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className="cursor-pointer"
                          onClick={() => setActiveFeature("fortune")}
                        >
                          <Card
                            className={`p-4 h-full border-2 transition-all ${activeFeature === "fortune" ? "border-amber-400 bg-amber-50" : "border-amber-100"}`}
                          >
                            <div className="flex flex-col items-center text-center h-full">
                              <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-3 rounded-full shadow-md mb-3">
                                <Sparkles className="h-5 w-5 text-white" />
                              </div>
                              <h4 className="font-medium text-amber-700 mb-2">قارئة الفنجان</h4>
                              <p className="text-sm text-gray-600 flex-grow">شوفي إيه اللي مخبي ليكي المستقبل</p>
                            </div>
                          </Card>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className="cursor-pointer"
                          onClick={() => setActiveFeature("story")}
                        >
                          <Card
                            className={`p-4 h-full border-2 transition-all ${activeFeature === "story" ? "border-teal-400 bg-teal-50" : "border-teal-100"}`}
                          >
                            <div className="flex flex-col items-center text-center h-full">
                              <div className="bg-gradient-to-r from-teal-400 to-green-400 p-3 rounded-full shadow-md mb-3">
                                <Lightbulb className="h-5 w-5 text-white" />
                              </div>
                              <h4 className="font-medium text-teal-700 mb-2">اكتبي قصتنا</h4>
                              <p className="text-sm text-gray-600 flex-grow">اكتبي كلمات وشوفي قصة حبنا</p>
                            </div>
                          </Card>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          className="cursor-pointer"
                          onClick={() => setActiveFeature("love")}
                        >
                          <Card
                            className={`p-4 h-full border-2 transition-all ${activeFeature === "love" ? "border-pink-400 bg-pink-50" : "border-pink-100"}`}
                          >
                            <div className="flex flex-col items-center text-center h-full">
                              <div className="bg-gradient-to-r from-pink-400 to-red-400 p-3 rounded-full shadow-md mb-3">
                                <Zap className="h-5 w-5 text-white" />
                              </div>
                              <h4 className="font-medium text-pink-700 mb-2">مقياس الحب</h4>
                              <p className="text-sm text-gray-600 flex-grow">شوفي نسبة الحب بيننا قد إيه</p>
                            </div>
                          </Card>
                        </motion.div>
                      </div>

                      <AnimatePresence mode="wait">
                        {activeFeature === "fortune" && (
                          <motion.div
                            key="fortune"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                              <div className="text-center mb-6">
                                <h4 className="text-lg font-medium text-amber-700 mb-2">قارئة الفنجان</h4>
                                <p className="text-sm text-gray-600">
                                  دوسي على الزرار وشوفي إيه اللي مخبي ليكي المستقبل
                                </p>
                              </div>

                              <div className="bg-white p-6 rounded-lg shadow-inner mb-4 min-h-[100px] flex items-center justify-center">
                                {fortuneResult ? (
                                  <p className="text-lg text-amber-700">{fortuneResult}</p>
                                ) : (
                                  <p className="text-gray-400 italic">دوسي على الزرار عشان تعرفي المستقبل...</p>
                                )}
                              </div>

                              <div className="flex justify-center">
                                <Button
                                  onClick={tellFortune}
                                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                >
                                  <Sparkles className="h-4 w-4 ml-2" />
                                  اقرأي الفنجان
                                </Button>
                              </div>
                            </Card>
                          </motion.div>
                        )}

                        {activeFeature === "story" && (
                          <motion.div
                            key="story"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card className="p-6 bg-gradient-to-r from-teal-50 to-green-50 border border-teal-200">
                              <div className="text-center mb-6">
                                <h4 className="text-lg font-medium text-teal-700 mb-2">اكتبي قصتنا</h4>
                                <p className="text-sm text-gray-600">املي الكلمات وشوفي قصة حبنا العبيطه متضحكيش بالله😂</p>
                              </div>

                              {!showStoryResult ? (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {storyTemplate.fields.map((field) => (
                                      <div key={field.id} className="space-y-2">
                                        <Label htmlFor={field.id} className="text-teal-700">
                                          {field.label}
                                        </Label>
                                        <input
                                          id={field.id}
                                          type="text"
                                          value={storyWords[field.id] || ""}
                                          onChange={(e) => handleStoryWordChange(field.id, e.target.value)}
                                          className="w-full p-2 border border-teal-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                                        />
                                      </div>
                                    ))}
                                  </div>

                                  <div className="flex justify-center mt-4">
                                    <Button
                                      onClick={generateStory}
                                      className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600"
                                      disabled={storyTemplate.fields.some((field) => !storyWords[field.id])}
                                    >
                                      <Lightbulb className="h-4 w-4 ml-2" />
                                      اكتبي القصة
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <div className="bg-white p-6 rounded-lg shadow-inner">
                                    <h5 className="text-lg font-medium text-teal-700 mb-3 text-center">
                                      {storyTemplate.title}
                                    </h5>
                                    <p className="text-gray-700 leading-relaxed">
                                      {storyTemplate.template.replace(
                                        /{(\w+)}/g,
                                        (match, field) => storyWords[field] || match,
                                      )}
                                    </p>
                                  </div>

                                  <div className="flex justify-center">
                                    <Button
                                      onClick={() => setShowStoryResult(false)}
                                      variant="outline"
                                      className="border-teal-200 text-teal-600 hover:bg-teal-50"
                                    >
                                      اكتبي قصة جديدة
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </Card>
                          </motion.div>
                        )}

                        {activeFeature === "love" && (
                          <motion.div
                            key="love"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card className="p-6 bg-gradient-to-r from-pink-50 to-red-50 border border-pink-200">
                              <div className="text-center mb-6">
                                <h4 className="text-lg font-medium text-pink-700 mb-2">مقياس الحب</h4>
                                <p className="text-sm text-gray-600">شوفي نسبة الحب بيننا قد إيه</p>
                              </div>

                              {loveScore === null ? (
                                <div className="space-y-6">
                                  <div className="bg-white p-6 rounded-lg shadow-inner text-center">
                                    <p className="text-gray-700 mb-4">اضغطي على الزر لحساب نسبة الحب بينكم</p>
                                    <div className="flex justify-center">
                                      <div className="w-32 h-32 rounded-full border-4 border-pink-200 flex items-center justify-center">
                                        <Heart className="h-16 w-16 text-pink-400" />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex justify-center">
                                    <Button
                                      onClick={calculateLoveScore}
                                      className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
                                    >
                                      <Heart className="h-4 w-4 ml-2" />
                                      احسبي نسبة الحب
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-6">
                                  <div className="bg-white p-6 rounded-lg shadow-inner text-center">
                                    <p className="text-gray-700 mb-4">نسبة الحب بيننا هي:</p>
                                    <div className="flex justify-center mb-4">
                                      <div className="w-32 h-32 rounded-full border-4 border-pink-400 flex items-center justify-center bg-gradient-to-r from-pink-100 to-red-100">
                                        <div className="text-3xl font-bold text-pink-600">{loveScore}%</div>
                                      </div>
                                    </div>
                                    <p className="text-lg text-pink-600 font-medium">
                                      {loveScore >= 95
                                        ? "حب مفيش منو تاني ❤️"
                                        : loveScore >= 90
                                          ? "حب من الجنة 💕"
                                          : "حب جميل جدًا💖"}
                                    </p>
                                  </div>

                                  <div className="flex justify-center">
                                    <Button
                                      onClick={() => setLoveScore(null)}
                                      variant="outline"
                                      className="border-pink-200 text-pink-600 hover:bg-pink-50"
                                    >
                                      حاولي مرة تانية
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </Card>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  )
}
