"use client";

import { useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { seedJobs } from "@/data/seed-jobs";
import { seedApplications } from "@/data/seed-applications";
import { Application, PipelineStage, ApplicationStatus } from "@/data/types";

const PIPELINE_STAGES: { key: PipelineStage; label: string; statuses: ApplicationStatus[]; color: string }[] = [
  { key: "applied", label: "Applied", statuses: ["applied", "viewed"], color: "border-blue-300" },
  { key: "screening", label: "Screening", statuses: ["screening"], color: "border-amber" },
  { key: "interview", label: "Interview", statuses: ["interview_requested", "interview_scheduled", "interview_completed"], color: "border-periwinkle" },
  { key: "offer", label: "Offer", statuses: ["offer_extended", "offer_accepted", "offer_declined"], color: "border-green-400" },
  { key: "hired", label: "Hired", statuses: ["hired"], color: "border-green-600" },
];

function getStageForStatus(status: ApplicationStatus): PipelineStage {
  for (const stage of PIPELINE_STAGES) {
    if (stage.statuses.includes(status)) return stage.key;
  }
  return "applied";
}

function getDefaultStatusForStage(stage: PipelineStage): ApplicationStatus {
  const stageConfig = PIPELINE_STAGES.find((s) => s.key === stage);
  return stageConfig?.statuses[0] || "applied";
}

export default function PipelinePage() {
  const { user } = useAuth();
  const myJobs = seedJobs.filter((j) => j.facilityId === user?.facilityId);
  const [selectedJobId, setSelectedJobId] = useState<string>("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null);

  const relevantApps = useMemo(() => {
    const jobIds = myJobs.map((j) => j.id);
    return seedApplications.filter((a) => jobIds.includes(a.jobId));
  }, [myJobs]);

  const filteredApps = selectedJobId === "all"
    ? relevantApps
    : relevantApps.filter((a) => a.jobId === selectedJobId);

  const [apps, setApps] = useState<Application[]>(filteredApps);

  const stageApps = useMemo(() => {
    const map: Record<PipelineStage, Application[]> = {
      applied: [], screening: [], interview: [], offer: [], hired: [],
    };
    const appsToUse = selectedJobId === "all" ? apps : apps.filter((a) => a.jobId === selectedJobId);
    for (const app of appsToUse) {
      const stage = getStageForStatus(app.status);
      map[stage].push(app);
    }
    return map;
  }, [apps, selectedJobId]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const destStage = result.destination.droppableId as PipelineStage;
    const appId = result.draggableId;

    setApps((prev) =>
      prev.map((a) =>
        a.id === appId
          ? { ...a, status: getDefaultStatusForStage(destStage), lastUpdate: new Date().toISOString().split("T")[0] }
          : a
      )
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <div className="animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Applicant Pipeline</h1>
            <p className="text-text-light mt-1 text-sm">Drag candidates between stages to update their status</p>
          </div>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="border border-periwinkle-100 rounded-xl px-3 py-3 text-sm bg-white min-h-[44px] max-w-xs"
          >
            <option value="all">All Jobs</option>
            {myJobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
            {PIPELINE_STAGES.map((stage) => (
              <Droppable key={stage.key} droppableId={stage.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl card-shadow border-t-4 ${stage.color} ${
                      snapshot.isDraggingOver ? "bg-periwinkle-50/50" : ""
                    }`}
                  >
                    <div className="p-4 border-b border-periwinkle-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm">{stage.label}</h3>
                        <span className="bg-periwinkle-50 text-periwinkle-dark text-xs font-semibold px-2 py-0.5 rounded-full">
                          {stageApps[stage.key].length}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 space-y-3 min-h-[200px]">
                      {stageApps[stage.key].map((app, index) => (
                        <Draggable key={app.id} draggableId={app.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedCandidate(app)}
                              className={`bg-white rounded-xl border border-periwinkle-100 p-3 cursor-pointer hover:border-periwinkle transition-colors ${
                                snapshot.isDragging ? "shadow-lg rotate-2" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="font-semibold text-sm truncate">{app.nurseName}</p>
                                  <p className="text-xs text-text-light truncate">{app.nurseSpecialty}</p>
                                </div>
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-periwinkle-50 flex items-center justify-center">
                                  <span className="text-xs font-bold text-periwinkle">
                                    {app.nurseName.split(" ").map((n) => n[0]).join("")}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                <span className="text-[10px] bg-periwinkle-50 text-periwinkle-dark px-1.5 py-0.5 rounded">
                                  {app.nurseYearsExperience}yr exp
                                </span>
                                {app.nurseCertifications.slice(0, 2).map((c) => (
                                  <span key={c} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded truncate max-w-[80px]">
                                    {c.split("(")[0].trim()}
                                  </span>
                                ))}
                              </div>
                              {selectedJobId === "all" && (
                                <p className="text-[10px] text-text-light mt-1.5 truncate">{app.jobTitle}</p>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        {/* Candidate Detail Drawer */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedCandidate(null)}>
            <div className="absolute inset-0 bg-black/30" />
            <div
              className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-xl animate-fade-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Candidate Profile</h2>
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="p-2 hover:bg-periwinkle-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-periwinkle-50 flex items-center justify-center">
                    <span className="text-xl font-bold text-periwinkle">
                      {selectedCandidate.nurseName.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{selectedCandidate.nurseName}</h3>
                    <p className="text-sm text-text-light">{selectedCandidate.nurseSpecialty}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-periwinkle-50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-periwinkle-dark uppercase tracking-wider mb-2">Applied For</h4>
                    <p className="text-sm font-medium">{selectedCandidate.jobTitle}</p>
                    <p className="text-xs text-text-light">{selectedCandidate.facilityName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white border border-periwinkle-100 rounded-xl p-3">
                      <p className="text-xs text-text-light">Experience</p>
                      <p className="text-lg font-bold text-periwinkle">{selectedCandidate.nurseYearsExperience} years</p>
                    </div>
                    <div className="bg-white border border-periwinkle-100 rounded-xl p-3">
                      <p className="text-xs text-text-light">Availability</p>
                      <p className="text-sm font-medium">{selectedCandidate.nurseAvailability || "Flexible"}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.nurseCertifications.map((c) => (
                        <span key={c} className="text-xs bg-periwinkle-50 text-periwinkle-dark px-2.5 py-1 rounded-full">{c}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2">Status</h4>
                    <p className="text-sm font-medium capitalize">{selectedCandidate.status.replace(/_/g, " ")}</p>
                    <p className="text-xs text-text-light">Applied: {selectedCandidate.appliedDate} · Updated: {selectedCandidate.lastUpdate}</p>
                  </div>

                  <div className="pt-4 border-t border-periwinkle-100 space-y-3">
                    <Link
                      href="/employer/interviews"
                      className="block w-full bg-periwinkle hover:bg-periwinkle-dark text-white font-semibold py-3 rounded-full text-sm text-center transition-colors min-h-[44px]"
                    >
                      Request Interview
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
