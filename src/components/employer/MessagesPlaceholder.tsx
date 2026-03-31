"use client";

export default function MessagesPlaceholder() {
  return (
    <div>
      <div className="mb-6">
        <h1
          className="text-2xl sm:text-3xl font-extrabold mb-1"
          style={{ color: "#1E1E2E" }}
        >
          Messages
        </h1>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Communicate with candidates directly.
        </p>
      </div>

      <div
        className="rounded-2xl border p-12 text-center"
        style={{ background: "white", borderColor: "#E4E4EC" }}
      >
        <div className="text-4xl mb-4">💬</div>
        <h2
          className="text-lg font-extrabold mb-2"
          style={{ color: "#1E1E2E" }}
        >
          Messaging coming soon
        </h2>
        <p
          className="text-sm max-w-md mx-auto leading-relaxed"
          style={{ color: "#6B7280" }}
        >
          You&apos;ll be able to message candidates directly from Flor. For now,
          use the interview request feature in the Candidate Queue to connect
          with applicants.
        </p>
        <div
          className="mt-6 inline-block px-5 py-2.5 rounded-full text-xs font-bold"
          style={{ background: "#EEEEF9", color: "#6C70B8" }}
        >
          Coming in Q2 2026
        </div>
      </div>
    </div>
  );
}
