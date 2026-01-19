"use client";

import { useState, useEffect, useRef } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Copy,
  FileDown,
  Wand2,
  StopCircle,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";

export default function ResumeBuilder() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  // 1. Ref for auto-scrolling
  const bottomRef = useRef<HTMLDivElement>(null);

  const { completion, complete, isLoading, stop, error } = useCompletion({
    api: "/api/completion",
    onError: (err) => {
      console.error("AI Error:", err);
    },
  });

  // 2. Auto-scroll effect
  useEffect(() => {
    if (completion && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [completion]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
    const savedResume = localStorage.getItem("resumeText");
    const savedJD = localStorage.getItem("jobDescription");
    if (savedResume) setResumeText(savedResume);
    if (savedJD) setJobDescription(savedJD);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem("resumeText", resumeText);
      localStorage.setItem("jobDescription", jobDescription);
    }
  }, [resumeText, jobDescription, hasMounted]);

  const handleGenerate = async () => {
    if (!resumeText) return;

    const fullPrompt = `
      RESUME TEXT:
      ${resumeText}

      JOB DESCRIPTION:
      ${jobDescription || "General Software Engineering Role"}
    `;

    // On mobile, scroll to output when generation starts
    if (window.innerWidth < 768) {
      document
        .getElementById("output-pane")
        ?.scrollIntoView({ behavior: "smooth" });
    }

    await complete(fullPrompt);
  };

  const copyToClipboard = () => {
    if (!completion) return;
    navigator.clipboard.writeText(completion);
    toast.success("Copied to the clipboard");
  };

  const downloadTex = () => {
    if (!completion) return;
    const element = document.createElement("a");
    const file = new Blob([completion], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "resume.tex";
    document.body.appendChild(element);
    element.click();
  };

  const clearAll = () => {
    if (confirm("Are you sure you want to clear all inputs?")) {
      setResumeText("");
      setJobDescription("");
      localStorage.removeItem("resumeText");
      localStorage.removeItem("jobDescription");
    }
  };

  if (!hasMounted) return null;

  return (
    // Responsive: min-h-screen for mobile flow, md:h-screen for desktop app-feel
    <div className="min-h-screen md:h-screen w-full bg-background text-foreground flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="border-b px-4 md:px-6 py-3 flex items-center justify-between bg-card/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <Wand2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-bold tracking-tight truncate">
            Reverse ATS
          </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <span className="text-xs text-muted-foreground hidden sm:inline-block">
            Powered by Gemini
          </span>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row md:overflow-hidden">
        <div className="w-full md:w-1/2 p-4 md:p-6 border-b md:border-b-0 md:border-r flex flex-col gap-4 bg-muted/20 md:overflow-y-auto h-auto md:h-full">
          <Tabs defaultValue="resume" className="flex flex-col h-125 md:h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4 sm:gap-0">
              <TabsList className="grid w-full sm:w-60 grid-cols-2">
                <TabsTrigger value="resume">Resume</TabsTrigger>
                <TabsTrigger value="jd">Job Desc</TabsTrigger>
              </TabsList>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearAll}
                  title="Clear All"
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>

                {isLoading ? (
                  <Button
                    onClick={stop}
                    variant="destructive"
                    className="flex-1 sm:flex-none sm:min-w-36"
                  >
                    <StopCircle className="mr-2 h-4 w-4" /> Stop
                  </Button>
                ) : (
                  <Button
                    onClick={handleGenerate}
                    disabled={!resumeText}
                    className="flex-1 sm:flex-none sm:min-w-36"
                  >
                    <Wand2 className="mr-2 h-4 w-4" /> Generate
                  </Button>
                )}
              </div>
            </div>

            <TabsContent
              value="resume"
              className="flex-1 mt-0 data-[state=active]:flex flex-col min-h-0"
            >
              <Textarea
                placeholder="Paste your current resume text here..."
                className="flex-1 font-mono text-sm resize-none p-4 leading-relaxed focus-visible:ring-1 min-h-75 md:min-h-0"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </TabsContent>

            <TabsContent
              value="jd"
              className="flex-1 mt-0 data-[state=active]:flex flex-col min-h-0"
            >
              <Textarea
                placeholder="Paste the Job Description here (optional)..."
                className="flex-1 font-mono text-sm resize-none p-4 leading-relaxed focus-visible:ring-1 min-h-75 md:min-h-0"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT PANE: OUTPUT */}
        {/* ID added for mobile scroll anchoring */}
        <div
          id="output-pane"
          className="w-full md:w-1/2 p-4 md:p-6 flex flex-col bg-background h-[85vh] md:h-auto"
        >
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              LaTeX Output
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                disabled={!completion || isLoading}
              >
                <Copy className="h-4 w-4 mr-2" />{" "}
                <span className="hidden sm:inline">Copy</span>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={downloadTex}
                disabled={!completion || isLoading}
              >
                <FileDown className="h-4 w-4 mr-2" />{" "}
                <span className="hidden sm:inline">Download</span>
              </Button>
            </div>
          </div>

          <Card className="flex-1 border bg-zinc-950 dark:bg-zinc-950 text-zinc-50 overflow-hidden relative group shadow-inner">
            <ScrollArea className="h-full w-full">
              <CardContent className="p-4 min-h-full w-full">
                {/* 1. ERROR STATE */}
                {error && (
                  <div className="mb-4 p-4 border border-red-900/50 bg-red-950/30 rounded-lg flex items-start gap-3 text-red-400">
                    <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold">Generation Failed</p>
                      <p className="text-xs opacity-90 mt-1">
                        {error.message || "An unexpected error occurred."}
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. OUTPUT / STREAMING STATE */}
                <pre className="text-xs sm:text-sm font-mono text-green-400 whitespace-pre-wrap break-all">
                  {completion}

                  {/* Blinking Cursor */}
                  {isLoading && (
                    <span className="inline-block w-2 h-4 bg-green-500 animate-pulse align-middle ml-1" />
                  )}

                  {/* EMPTY STATE */}
                  {!completion && !isLoading && !error && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 mt-10 md:mt-20 select-none">
                      <Wand2 className="h-12 w-12 mb-4 opacity-20" />
                      <p>Ready to generate.</p>
                      <p className="text-xs mt-1 text-center px-4">
                        Paste details above/left to start.
                      </p>
                    </div>
                  )}

                  {/* Invisible element to auto-scroll to */}
                  <div ref={bottomRef} className="h-1" />
                </pre>
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      </main>
    </div>
  );
}
