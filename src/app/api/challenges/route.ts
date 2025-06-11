import { supabase } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get("walletAddress");
   
  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .or(`owner.eq.${walletAddress},validators.cs.[\"${walletAddress}\"]`)

  console.log(data, error)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const challengeData = await request.json();
    console.log(challengeData)
  const { data, error } = await supabase
    .from("challenges")
    .insert(challengeData)
    .select();
    console.log(data, error)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0]);
}

export async function PATCH(request: Request) {
  const { id, approvedBy } = await request.json();
    console.log(id, approvedBy)
  const { data, error } = await supabase
    .from("challenges")
    .update({ approved_by: approvedBy })
    .eq("id", id)
    .select();
    console.log(data, error)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0]);
}
