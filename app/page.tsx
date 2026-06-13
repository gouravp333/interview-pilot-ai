"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [skills, setSkills] = useState("");
  const [questions, setQuestions] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [score, setScore] = useState("N/A");
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    if (!skills.trim()) {
      alert("Please enter your skills");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/generate",
        {
          skills,
        }
      );

      setQuestions(response.data.questions);
    } catch (error) {
      console.error(error);
      alert("Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  const evaluateAnswer = async () => {
    if (!answer.trim()) {
      alert("Please enter your answer");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/evaluate",
        {
          answer,
        }
      );

      const result = response.data.evaluation;

      setEvaluation(result);

      const scoreMatch = result.match(/(\d+)\/10/);

      if (scoreMatch) {
        setScore(scoreMatch[1]);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to evaluate answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto p-6">

        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-6">

          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            InterviewPilot
          </h1>

          <p className="text-slate-400 mt-3 text-lg">
            AI Powered Interview Preparation Platform
          </p>

        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">
              Questions Generated
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {questions ? "10+" : "0"}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">
              Evaluations
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {evaluation ? "1" : "0"}
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">
              AI Model
            </p>

            <h2 className="text-3xl font-bold mt-2 text-cyan-400">
              Gemini
            </h2>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <p className="text-slate-400 text-sm">
              Latest Score
            </p>

            <h2 className="text-3xl font-bold mt-2 text-emerald-400">
              {score}/10
            </h2>
          </div>

        </div>

        {/* Skills Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">

          <h2 className="text-2xl font-semibold mb-4">
            Enter Your Skills
          </h2>

          <textarea
            rows={5}
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Python, React, SQL, Machine Learning..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
          />

          <button
            onClick={generateQuestions}
            disabled={loading}
            className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-6 py-3 rounded-xl transition"
          >
            {loading ? "Generating..." : "Generate Questions"}
          </button>

        </div>

        {/* Questions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">

          <h2 className="text-2xl font-semibold mb-4">
            Generated Interview Questions
          </h2>

          <pre className="whitespace-pre-wrap bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200">
            {questions || "Questions will appear here..."}
          </pre>

        </div>

        {/* Answer Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">

          <h2 className="text-2xl font-semibold mb-4">
            Submit Your Answer
          </h2>

          <textarea
            rows={6}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your answer here..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
          />

          <button
            onClick={evaluateAnswer}
            disabled={loading}
            className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 py-3 rounded-xl transition"
          >
            {loading ? "Evaluating..." : "Evaluate Answer"}
          </button>

        </div>

        {/* Evaluation */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">

          <h2 className="text-2xl font-semibold mb-4">
            Evaluation Report
          </h2>

          <pre className="whitespace-pre-wrap bg-slate-800 border border-slate-700 rounded-xl p-4 min-h-[250px] text-slate-200">
            {evaluation || "Evaluation results will appear here..."}
          </pre>

        </div>

      </div>
    </div>
  );
}