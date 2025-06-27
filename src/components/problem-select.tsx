"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/utils/tailwind"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { UserContext } from "@/pages/comp"
import { useGlobalContext } from "@/components/template/GlobalContext"

import {
  RotateCcw
} from "lucide-react"
import { Dispatch, SetStateAction } from "react"
import { compilerconfig } from "@/pages/comp"

export function updateProblems(contestPath: string, setProblems: Dispatch<SetStateAction<{ value: string, label: string }[]>>, setCompilers: Dispatch<SetStateAction<compilerconfig[]>>) {
  window.judge.getContestConfig(contestPath).then((config: {
    problems: string[],
    compilers: {
      name: string,
      path: string,
      args: string[],
      suffixes: string[],
    }[],
  }) => {
    const problemList = config.problems;
    console.log("Problem list:", problemList);
    setProblems(problemList.map((problem) => {
      return { value: problem, label: problem };
    }));
    setCompilers(config.compilers);
  });
}

export function ProblemSelect() {
  const { contestPath } = useGlobalContext();
  const { problems, curProb, setCurProb, setProblems, setCompilers } = React.useContext(UserContext);

  // setProblems();
  const [open, setOpen] = React.useState(false)
  // const [value, setValue] = React.useState("")

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {curProb
              ? problems.find((problem) => problem.value === curProb)?.label
              : "Select problem..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search problem..." />
            <CommandList>
              <CommandEmpty>No problem found.</CommandEmpty>
              <CommandGroup>
                {problems.map((problem) => (
                  <CommandItem
                    key={problem.value}
                    value={problem.value}
                    onSelect={(currentValue) => {
                      // setCurProb(problem.value)
                      setCurProb(currentValue === curProb ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        curProb === problem.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {problem.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button variant="secondary" className="ml-2 w-9" onClick={() => { updateProblems(contestPath, setProblems, setCompilers) }}>
        <RotateCcw />
      </Button>
    </div>
  )
}
