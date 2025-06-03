"use client"

import { FolderOpen } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"
import { useNavigate } from "@tanstack/react-router"

async function chooseContest(navigate: ReturnType<typeof useNavigate>) {
  const contest: string = await window.judge.chooseContest();
  console.log(contest);
  if(contest === undefined) {
    toast.error("Failed to open.");
  }
  navigate({to: "/problem-page", state: { contest: contest } });
}

export default function OpenContest() {
  const navigate = useNavigate();
  return (
    <Button onClick={() => chooseContest(navigate)} size="icon">
      <FolderOpen size={16} />
    </Button>
  );
}
