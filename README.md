# 📄 Reverse ATS Resume Builder

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Gemini AI](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blue) ![Tailwind](https://img.shields.io/badge/Style-Tailwind-38B2AC) ![Shadcn](https://img.shields.io/badge/UI-Shadcn-000000)

> **"Don't let an algorithm reject your hard work."**

An intelligent, AI-powered tool that transforms unstructured resume text and job descriptions into **ATS-optimized LaTeX code**. Built with Next.js 15, Vercel AI SDK, and Google's Gemini 3 Flash model.

## 🚀 The Problem

Modern Applicant Tracking Systems (ATS) often reject qualified candidates because of poor formatting or missing keywords. PDF parsing is notoriously difficult, and standard Word docs often break layout when parsed.

## 💡 The Solution

Instead of fighting the parser, we feed it exactly what it wants: **Structured LaTeX**.
This tool takes your raw experience and the target Job Description (JD), then uses Generative AI to:

1. Analyze the JD for keywords.
2. Rewrite your bullet points to highlight matching skills.
3. Inject the content into a strict, compile-ready LaTeX template.

## ✨ Features

- **⚡ Real-Time AI Streaming:** Watch your resume being written line-by-line (powered by Vercel AI SDK).
- **🔒 Privacy First:** **No Database.** All data is stored in your browser's `LocalStorage`. Your personal data never rests on our servers.
- **🌗 Dark Mode:** Fully responsive UI with seamless dark/light mode switching.
- **📝 Split-Pane Editor:** VS Code-style layout with Input on the left and Live Code on the right.
- **💾 Auto-Save:** Never lose your progress on refresh.
- **📥 Export Options:** One-click "Copy Code" or "Download .tex" for instant use in Overleaf.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + Shadcn UI (Radix Primitives)
- **AI Engine:** Google Gemini (via Google AI Studio)
- **Streaming:** Vercel AI SDK (`useCompletion` hook)
- **Icons:** Lucide React

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone [https://github.com/Shahid0324-GIT/ats-reverse.git](https://github.com/Shahid0324-GIT/ats-reverse.git)
cd reverse-ats-resume
```
