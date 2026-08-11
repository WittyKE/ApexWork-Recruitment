import type { NextRequest } from "next/server";
import { getJobSuggestions } from "@/lib/data/jobs";

const MAX_KEYWORD_LENGTH = 80;
const SUGGESTION_LIMIT = 6;

export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get("keyword")?.trim().slice(0, MAX_KEYWORD_LENGTH) ?? "";

  if (keyword.length < 2) {
    return Response.json({ jobs: [] });
  }

  const jobs = await getJobSuggestions(keyword, SUGGESTION_LIMIT);
  return Response.json({ jobs }, { headers: { "Cache-Control": "no-store" } });
}
