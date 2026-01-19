import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

// Ensure your API Key is loaded
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // 1. Validate Input
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response("Prompt is required", { status: 400 });
    }

    // 2. Define System Instructions
    const systemInstruction = `
      You are an expert ATS Resume Writer and LaTeX Engineer.
      Your task is to take unstructured resume text and a Job Description, and output a fully formatted, ATS-optimized LaTeX resume.

      RULES:
      1. Use the provided LaTeX template EXACTLY. Do not change packages or document class.
      2. Analyze the "Job Description" to identify key skills and buzzwords.
      3. Rewrite bullet points from the "User Resume" to highlight those specific skills. Use strong action verbs.
      4. If the user lacks a skill mentioned in the JD, do NOT lie. Focus on transferrable skills instead.
      5. RETURN ONLY THE RAW LATEX CODE. Do not include markdown formatting like "\`\`\`latex". Do not include conversational filler.
      6. IMPORTANT: Adjust the length such that the resume is always single page length.
      
      TEMPLATE TO USE:
      \\documentclass[letterpaper,11pt]{article}
      \\usepackage{latexsym}
      \\usepackage[empty]{fullpage}
      \\usepackage{titlesec}
      \\usepackage{marvosym}
      \\usepackage[usenames,dvipsnames]{color}
      \\usepackage{verbatim}
      \\usepackage{enumitem}
      \\usepackage[hidelinks]{hyperref}
      \\usepackage{fancyhdr}
      \\usepackage[english]{babel}
      \\usepackage{tabularx}
      \\input{glyphtounicode}
      \\pagestyle{fancy}
      \\fancyhf{} 
      \\fancyfoot{}
      \\renewcommand{\\headrulewidth}{0pt}
      \\renewcommand{\\footrulewidth}{0pt}
      \\addtolength{\\oddsidemargin}{-0.5in}
      \\addtolength{\\evensidemargin}{-0.5in}
      \\addtolength{\\textwidth}{1in}
      \\addtolength{\\topmargin}{-.5in}
      \\addtolength{\\textheight}{1.0in}
      \\urlstyle{same}
      \\raggedbottom
      \\raggedright
      \\setlength{\\tabcolsep}{0in}
      \\titleformat{\\section}{\\Large \\bfseries \\scshape}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]
      \\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-2pt}}}}
      \\newcommand{\\resumeSubheading}[4]{\\vspace{-2pt}\\item\\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}\\textbf{#1} & #2 \\\\ \\textit{\\small#3} & \\textit{\\small #4} \\\\ \\end{tabular*}\\vspace{-7pt}}
      \\newcommand{\\resumeProjectHeading}[2]{\\item\\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}\\small#1 & #2 \\\\ \\end{tabular*}\\vspace{-7pt}}
      \\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}
      \\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
      \\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
      \\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
      \\newcommand{\\resumeItemListStart}{\\begin{itemize}}
      \\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

      \\begin{document}
      % FILL IN USER DETAILS HERE. IF MISSING, LEAVE BLANK OR REMOVE SECTION.
      \\begin{center}
          \\textbf{\\Huge \\scshape {NAME_PLACEHOLDER}} \\\\ \\vspace{1pt}
          \\small {PHONE_PLACEHOLDER} $|$ \\href{mailto:{EMAIL_PLACEHOLDER}}{\\underline{{EMAIL_PLACEHOLDER}}} $|$ 
          \\href{{LINKEDIN_URL}}{\\underline{linkedin.com/in/user}} $|$
          \\href{{GITHUB_URL}}{\\underline{github.com/user}}
      \\end{center}

      % EDUCATION
      \\section{Education}
      \\resumeSubHeadingListStart
        % REPEAT FOR EACH SCHOOL
        \\resumeSubheading
          {University Name}{Location}
          {Degree Name}{Dates}
      \\resumeSubHeadingListEnd

      % SKILLS
      \\section{Technical Skills}
      \\begin{itemize}[leftmargin=0.15in, label={}]
        \\small{\\item{
         \\textbf{Languages}{: ...} \\\\
         \\textbf{Frameworks}{: ...} \\\\
         \\textbf{Developer Tools}{: ...} \\\\
         \\textbf{Libraries}{: ...}
        }}
      \\end{itemize}

      % EXPERIENCE
      \\section{Experience}
      \\resumeSubHeadingListStart
        % REPEAT FOR EACH JOB
        \\resumeSubheading
          {Role Title}{Dates}
          {Company Name}{Location}
          \\resumeItemListStart
            \\resumeItem{Action verb statement 1...}
          \\resumeItemListEnd
      \\resumeSubHeadingListEnd

      % PROJECTS
      \\section{Projects}
      \\resumeSubHeadingListStart
        \\resumeProjectHeading
          {\\textbf{Project Name} $|$ \\emph{Tech Stack}}{Date}
          \\resumeItemListStart
            \\resumeItem{Action verb statement...}
          \\resumeItemListEnd
      \\resumeSubHeadingListEnd

      \\end{document}
    `;

    // 3. Initiate Stream
    const result = streamText({
      model: google("gemini-3-flash-preview"),
      prompt: `${systemInstruction}\n\nUSER DATA:\n${prompt}`,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("API Route Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
