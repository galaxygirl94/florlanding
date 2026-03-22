import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Verify admin password
  const body = await request.json().catch(() => ({}));
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || body.password !== adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Trigger GitHub Actions workflow via repository_dispatch
  const githubToken = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY || 'galaxygirl94/florlanding';

  if (!githubToken) {
    return NextResponse.json(
      { error: 'GITHUB_TOKEN not configured — cannot trigger workflow' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/actions/workflows/scrape-jobs.yml/dispatches`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ref: 'main' }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `GitHub API error: ${response.status} ${text}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Scraper workflow triggered' });
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to trigger workflow: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
