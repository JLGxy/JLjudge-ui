import React from "react";

export default function BottomStatusBar() {
  return (
    <div className="absolute bottom-0 left-0 flex w-screen items-center justify-between border-t border-gray-200 bg-white p-2 text-xs text-gray-500 z-5 h-[32px]">
      <span className="flex items-center gap-2">
        <span>© {new Date().getFullYear()} JLJudge</span>
      </span>
      <span className="flex items-center gap-2">
        <span>node version: {window.versions.node()}</span>
      </span>
    </div>
  );
}