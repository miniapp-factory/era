"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

type AnswerOption = {
  animal: string;
  text: string;
};

type Question = {
  text: string;
  options: AnswerOption[];
};

const questions: Question[] = [
  {
    text: "What’s your favorite type of environment?",
    options: [
      { animal: "cat", text: "Quiet, cozy rooms" },
      { animal: "dog", text: "Open parks and trails" },
      { animal: "fox", text: "Wooded, mysterious places" },
      { animal: "hamster", text: "Small, contained spaces" },
      { animal: "horse", text: "Wide, open fields" },
    ],
  },
  {
    text: "How do you prefer to spend your free time?",
    options: [
      { animal: "cat", text: "Reading or napping" },
      { animal: "dog", text: "Playing fetch or going for walks" },
      { animal: "fox", text: "Exploring new places" },
      { animal: "hamster", text: "Running on a wheel or hiding in tunnels" },
      { animal: "horse", text: "Riding or training" },
    ],
  },
  {
    text: "What’s your ideal companion?",
    options: [
      { animal: "cat", text: "Someone who respects my space" },
      { animal: "dog", text: "Someone who loves to play" },
      { animal: "fox", text: "Someone curious and clever" },
      { animal: "hamster", text: "Someone who enjoys small adventures" },
      { animal: "horse", text: "Someone who loves the outdoors" },
    ],
  },
  {
    text: "How do you react to new people?",
    options: [
      { animal: "cat", text: "I observe before I engage" },
      { animal: "dog", text: "I greet them enthusiastically" },
      { animal: "fox", text: "I’m cautious but intrigued" },
      { animal: "hamster", text: "I’m shy and prefer familiar faces" },
      { animal: "horse", text: "I’m friendly but keep my distance" },
    ],
  },
  {
    text: "What’s your favorite snack?",
    options: [
      { animal: "cat", text: "Fish or dry kibble" },
      { animal: "dog", text: "Meat or crunchy treats" },
      { animal: "fox", text: "Fresh fruit or nuts" },
      { animal: "hamster", text: "Seeds or grains" },
      { animal: "horse", text: "Hay or oats" },
    ],
  },
];

const animalImages: Record<string, string> = {
  cat: "/cat.png",
  dog: "/dog.png",
  fox: "/fox.png",
  hamster: "/hamster.png",
  horse: "/horse.png",
};

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const shuffledQuestions = useMemo(() => {
    return questions.map((q) => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5),
    }));
  }, []);

  const handleAnswer = useCallback(
    (animal: string) => {
      const newAnswers = [...answers, animal];
      setAnswers(newAnswers);
      if (current + 1 < shuffledQuestions.length) {
        setCurrent(current + 1);
      } else {
        const counts: Record<string, number> = {
          cat: 0,
          dog: 0,
          fox: 0,
          hamster: 0,
          horse: 0,
        };
        newAnswers.forEach((a) => {
          counts[a] = (counts[a] ?? 0) + 1;
        });
        const max = Math.max(...Object.values(counts));
        const topAnimals = Object.entries(counts)
          .filter(([, v]) => v === max)
          .map(([k]) => k);
        setResult(topAnimals[0]); // pick first in case of tie
      }
    },
    [answers, current, shuffledQuestions.length]
  );

  const handleRetake = useCallback(() => {
    setCurrent(0);
    setAnswers([]);
    setResult(null);
  }, []);

  if (result) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-xl font-semibold">You’re a {result}!</h2>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <img
            src={animalImages[result]}
            alt={result}
            width={256}
            height={256}
            className="rounded-md"
          />
          <p className="mt-4 text-center">
            Discover more about your animal personality by sharing your result!
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Share text={`I’m a ${result}! ${url}`} />
          <Button onClick={handleRetake} variant="outline">
            Retake Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = shuffledQuestions[current];
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h2 className="text-xl font-semibold">
          Question {current + 1} of {shuffledQuestions.length}
        </h2>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{question.text}</p>
        <div className="grid gap-2">
          {question.options.map((opt) => (
            <Button
              key={opt.animal}
              onClick={() => handleAnswer(opt.animal)}
              variant="outline"
            >
              {opt.text}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
