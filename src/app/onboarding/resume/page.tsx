"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_RESUME_PROFILES } from "@/data/demo-nurses";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const IS_MOCK =
  process.env.NEXT_PUBLIC_MOCK_RESUME === undefined
    ? true
    : process.env.NEXT_PUBLIC_MOCK_RESUME === "true";

let demoIndex = 0;

function getNextMockProfile() {
  const profile = MOCK_RESUME_PROFILES[demoIndex % MOCK_RESUME_PROFILES.length];
  demoIndex++;
  return profile;
}

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "invalid-type";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "too-large";
  }
  return null;
}

export default function ResumeUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleParsed = useCallback(
    (data: (typeof MOCK_RESUME_PROFILES)[number]) => {
      localStorage.setItem("flor_resume_data", JSON.stringify(data));
      router.push("/onboarding");
    },
    [router],
  );

  const simulateMockParse = useCallback(() => {
    setState("loading");
    setTimeout(() => {
      const profile = getNextMockProfile();
      handleParsed(profile);
    }, 2000);
  }, [handleParsed]);

  const parseViaApi = useCallback(
    async (file: File) => {
      setState("loading");
      try {
        const formData = new FormData();
        formData.append("resume", file);

        const res = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Parse failed");
        }

        const data = await res.json();
        handleParsed(data);
      } catch {
        setState("error");
      }
    },
    [handleParsed],
  );

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setState("error");
        return;
      }

      setFileName(file.name);

      if (IS_MOCK) {
        simulateMockParse();
      } else {
        parseViaApi(file);
      }
    },
    [simulateMockParse, parseViaApi],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  // ---- Loading State ----
  if (state === "loading") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F8F8FA]">
        <div className="w-full max-w-lg mx-auto px-6 py-16">
          <div className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-10 sm:p-14 text-center animate-fade-in">
            {/* Shimmer bars */}
            <div className="space-y-4 mb-8">
              <div
                className="h-4 rounded-full mx-auto"
                style={{
                  width: "75%",
                  background:
                    "linear-gradient(90deg, #E4E5F4 25%, #F4F4FB 50%, #E4E5F4 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.8s ease-in-out infinite",
                }}
              />
              <div
                className="h-4 rounded-full mx-auto"
                style={{
                  width: "60%",
                  background:
                    "linear-gradient(90deg, #E4E5F4 25%, #F4F4FB 50%, #E4E5F4 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.8s ease-in-out infinite 0.2s",
                }}
              />
              <div
                className="h-4 rounded-full mx-auto"
                style={{
                  width: "45%",
                  background:
                    "linear-gradient(90deg, #E4E5F4 25%, #F4F4FB 50%, #E4E5F4 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.8s ease-in-out infinite 0.4s",
                }}
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-periwinkle font-bold text-lg">
              <svg
                className="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Reading your resume...
            </div>
            {fileName && (
              <p className="text-sm text-text-muted mt-3">{fileName}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---- Main Upload UI ----
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F8F8FA]">
      <div className="w-full max-w-lg mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl border border-periwinkle-100/40 section-shadow p-8 sm:p-10 animate-fade-in-up">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-2">
              Let&apos;s get started
            </h1>
            <p className="text-sm text-text-muted leading-relaxed">
              Upload your resume and we&apos;ll fill in your profile
              automatically.
            </p>
          </div>

          {/* Error State */}
          {state === "error" && (
            <div className="bg-danger-light border border-danger/20 rounded-xl p-4 mb-6 text-sm text-danger font-medium text-center animate-fade-in">
              We couldn&apos;t read that file &mdash; no worries, you can fill
              everything in below.
              <Link
                href="/onboarding"
                className="block mt-2 text-periwinkle hover:text-periwinkle-dark font-bold transition-colors"
              >
                Continue to profile &rarr;
              </Link>
            </div>
          )}

          {/* Drop Zone */}
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center
              transition-all duration-200
              ${
                isDragging
                  ? "border-periwinkle bg-periwinkle-50 scale-[1.01]"
                  : "border-periwinkle-200 hover:border-periwinkle hover:bg-periwinkle-50/50"
              }
            `}
          >
            {/* Upload Cloud Icon */}
            <div className="flex justify-center mb-4">
              <svg
                className={`w-12 h-12 transition-colors duration-200 ${isDragging ? "text-periwinkle" : "text-periwinkle-200"}`}
                fill="none"
                viewBox="0 0 48 48"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 32l8-8 8 8M24 24v16"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M40.78 33.22A8 8 0 0036 18h-2.08A12 12 0 1010 28.54"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 32l8-8 8 8"
                />
              </svg>
            </div>

            <p className="text-text font-semibold mb-1">
              Drop your resume here and we&apos;ll fill in your profile for you
            </p>
            <p className="text-xs text-text-muted">PDF or DOCX, up to 5MB</p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={onFileSelect}
              className="hidden"
            />

            {/* File Picker Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="mt-5 inline-flex items-center gap-2 bg-periwinkle hover:bg-periwinkle-dark text-white rounded-full px-8 py-3 font-bold text-sm transition-all duration-200 shadow-lg shadow-periwinkle/20 hover:shadow-xl hover:shadow-periwinkle/30 hover:-translate-y-0.5"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l7.07-7.07a4 4 0 00-5.656-5.657l-7.071 7.07a6 6 0 008.485 8.486L21 11"
                />
              </svg>
              Choose File
            </button>
          </div>

          {/* Demo Button */}
          {IS_MOCK && (
            <div className="mt-5 text-center animate-fade-in-up-delay-1">
              <button
                type="button"
                onClick={simulateMockParse}
                className="inline-flex items-center gap-2 border-2 border-periwinkle-200 hover:border-periwinkle text-periwinkle hover:text-periwinkle-dark rounded-full px-8 py-3 font-bold text-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Try Demo
              </button>
            </div>
          )}

          {/* Skip Link */}
          <div className="mt-8 text-center">
            <Link
              href="/onboarding"
              className="text-sm text-text-muted hover:text-periwinkle transition-colors"
            >
              Skip &mdash; I&apos;ll fill it in myself
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
