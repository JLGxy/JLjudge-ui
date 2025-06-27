"use client"

import {
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react"

import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/utils/tailwind"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Checkbox
} from "@/components/ui/checkbox"
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger
} from "@/components/ui/multi-select"
import { Terminal } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { toast } from "sonner"

import { ProblemSelect } from "@/components/problem-select"

import React from "react"
import { useLocation, useNavigate } from "@tanstack/react-router"

import { useGlobalContext } from "@/components/template/GlobalContext"
import { updateProblems } from "@/components/problem-select"

interface problemconfig {
  probname: string
  probtype: string
  compilers: Array<string>
  use_file_input: boolean
  input_file: string
  use_file_output: boolean
  output_file: string
  checker: string
  checker_compiler: string
  interactor: string
  interactor_compiler: string
}

export interface compilerconfig {
  name: string
  path: string
  args: string[]
  suffixes: string[]
}

export const UserContext = createContext({
  config: {} as problemconfig,
  setConfig: {} as Dispatch<SetStateAction<problemconfig>>,
  compilers: {} as compilerconfig[],
  curProb: "",
  setCurProb: {} as Dispatch<SetStateAction<string>>,
  problems: {} as { value: string, label: string }[],
  setProblems: {} as Dispatch<SetStateAction<{ value: string, label: string }[]>>,
  setCompilers: {} as Dispatch<SetStateAction<compilerconfig[]>>,
});

function useProbConfig() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

const problemtype_choose = [
  {
    value: "traditional",
    label: "Traditional",
  },
  {
    value: "interactive",
    label: "Interactive",
  },
]


export function SelectProblemType() {
  const [open, setOpen] = useState(false)
  const { config, setConfig } = useProbConfig()
  const value = config.probtype;
  const setValue = (e: string) => { setConfig({ ...config, probtype: e }) }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? problemtype_choose.find((framework) => framework.value === value)?.label
            : "Select type..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="popover-content-width-full p-0">
        <Command>
          <CommandInput placeholder="Search problem type..." className="h-9" />
          <CommandList>
            <CommandEmpty>No problem type found.</CommandEmpty>
            <CommandGroup>
              {problemtype_choose.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function SelectCompilers() {
  const { config, setConfig, compilers } = useProbConfig()
  const value = config.compilers;
  const setValue = (e: Array<string>) => { setConfig({ ...config, compilers: e }) }

  return (

    <MultiSelector
      values={value}
      onValuesChange={setValue}
      loop
      // className="max-w-xs"
      className="flex flex-1 flex-col gap-2 pt-0"
    >
      <MultiSelectorTrigger>
        <MultiSelectorInput placeholder="Select compilers" />
      </MultiSelectorTrigger>
      <MultiSelectorContent>
        <MultiSelectorList>
          {compilers.map((c) => {
            return (
              <MultiSelectorItem key={c.name} value={c.name}>{c.name}</MultiSelectorItem>
            )
          })}
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  );
}

function SelectCheckerCompiler() {
  const [open, setOpen] = useState(false)
  const { config, setConfig, compilers } = useProbConfig()
  const value = config.checker_compiler;
  const setValue = (e: string) => { setConfig({ ...config, checker_compiler: e }) }

  const compiler_choose: { value: string, label: string }[] = [];
  compilers.forEach((c) => { compiler_choose.push({ value: c.name, label: c.name }) });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? compiler_choose.find((framework) => framework.value === value)?.label
            : "Select compiler..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="popover-content-width-full p-0">
        <Command>
          <CommandInput placeholder="Search compiler..." className="h-9" />
          <CommandList>
            <CommandEmpty>No compiler found.</CommandEmpty>
            <CommandGroup>
              {compiler_choose.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
function SelectInteractorCompiler() {
  const [open, setOpen] = useState(false)
  const { config, setConfig, compilers } = useProbConfig()
  const value = config.interactor_compiler;
  const setValue = (e: string) => { setConfig({ ...config, interactor_compiler: e }) }

  const compiler_choose: { value: string, label: string }[] = [];
  compilers.forEach((c) => { compiler_choose.push({ value: c.name, label: c.name }) });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? compiler_choose.find((framework) => framework.value === value)?.label
            : "Select compiler..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="popover-content-width-full p-0">
        <Command>
          <CommandInput placeholder="Search compiler..." className="h-9" />
          <CommandList>
            <CommandEmpty>No compiler found.</CommandEmpty>
            <CommandGroup>
              {compiler_choose.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function ProblemConfig() {
  const { config, setConfig } = useProbConfig();
  return (
    <>
      <div className="flex flex-1 flex-col gap-2 p-4 pt-0">
        <Label htmlFor="probname">Problem Name</Label>
        <Input disabled type="text" id="probname" value={config?.probname} onChange={e => {
          setConfig({ ...config, probname: e.target.value })
        }} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 pt-0">
        <Label htmlFor="probtype">Problem Type</Label>
        <SelectProblemType />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 pt-0">
        <Label>Compilers</Label>
        <SelectCompilers />
      </div>
      <div className="items-top flex space-x-2 p-4 pt-0">
        <div className="w-full rounded-md border p-4 shadow md:flex">
          <div className="md:grow flex flex-row items-start space-x-2 space-y-0">
            <Checkbox
              id="usefileinput"
              checked={config.use_file_input}
              onCheckedChange={e => {
                setConfig({ ...config, use_file_input: e as boolean })
              }}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="usefileinput">Use file input</Label>
              <p className="text-sm text-muted-foreground">if not selected, stdin will be used.</p>
            </div>
          </div>
          <div className="mt-2"></div>
          <div className="md:grow flex flex-row items-start space-x-2 space-y-0">
            <Checkbox
              id="usefileoutput"
              checked={config.use_file_output}
              onCheckedChange={e => {
                setConfig({ ...config, use_file_output: e as boolean })
              }}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="usefileoutput">Use file output</Label>
              <p className="text-sm text-muted-foreground">if not selected, stdout will be used.</p>
            </div>
          </div>
        </div>
      </div>
      {config.use_file_input &&
        <div className="flex flex-1 flex-col gap-2 p-4 pt-0">
          <Label htmlFor="inputfile">Input File</Label>
          <Input type="text" id="inputfile" value={config?.input_file} onChange={e => {
            setConfig({ ...config, input_file: e.target.value })
          }} />
        </div>}
      {config.use_file_output &&
        <div className="flex flex-1 flex-col gap-2 p-4 pt-0">
          <Label htmlFor="outputfile">Output File</Label>
          <Input type="text" id="outputfile" value={config?.output_file} onChange={e => {
            setConfig({ ...config, output_file: e.target.value })
          }} />
        </div>}
      <div className="flex flex-1 flex-col gap-2 p-4 pt-0">
        <Label htmlFor="checker">Checker</Label>
        <Input type="text" id="checker" value={config?.checker} onChange={e => {
          setConfig({ ...config, checker: e.target.value })
        }} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 pt-0">
        <Label>Checker Compiler</Label>
        <SelectCheckerCompiler />
      </div>

      {config.probtype == "interactive" &&
        <div className="flex flex-1 flex-col gap-2 p-4 pt-0">
          <Label htmlFor="interactor">Interactor</Label>
          <Input type="text" id="interactor" value={config?.interactor} onChange={e => {
            setConfig({ ...config, interactor: e.target.value })
          }} />
        </div>}

      {config.probtype == "interactive" &&
        <div className="flex flex-1 flex-col gap-2 p-4 pt-0">
          <Label>Interactor Compiler</Label>
          <SelectInteractorCompiler />
        </div>}
    </>
  );
}

export function AlertDemo() {
  return (
    <div className="p-4 pt-0">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          Select a problem to continue.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export function ProblemConfigPage() {
  const [config, setConfig] = useState<problemconfig>({
    probname: 'aa',
    probtype: '',
    compilers: [],
    use_file_input: false,
    input_file: '',
    use_file_output: false,
    output_file: '',
    checker: '',
    checker_compiler: '',
    interactor: '',
    interactor_compiler: '',
  });

  const [compilers, setCompilers] = useState<compilerconfig[]>([
    { name: "gcc", path: "/bin/gcc", args: [], suffixes: [] }
  ]);

  const [curProb, setCurProb] = useState("");
  const { contestPath } = useGlobalContext();

  useEffect(() => {
    window.judge.updateProblemConfig(contestPath, curProb, config).then((saved: boolean) => {
      if (!saved) {
        toast.error("Failed to save");
      }
    });
  }, [config]);

  // const problemChoice = window.judge.getProblemList(contestPath);

  const [problems, setProblems] = useState<{ value: string, label: string }[]>([]);

  useEffect(() => {updateProblems(contestPath, setProblems, setCompilers)}, []);
  useEffect(() => {
    if (curProb) {
      window.judge.getProblemConfig(contestPath, curProb).then((config: problemconfig) => {
        console.log("Problem config:", config);
        setConfig(config);
      });
    }
  }, [curProb]);

  console.log(compilers);
  // setProblems(problemtype_choose);

  return (
    <UserContext.Provider value={{ config, setConfig, compilers, curProb, setCurProb, problems, setProblems, setCompilers }}>
      <div className="flex flex-1 flex-col gap-2 p-4 pt-0">
        <p className="text-gray-700 text-sm">contest: {contestPath}</p>
        <ProblemSelect />
      </div>
      {curProb ? <ProblemConfig /> : <AlertDemo />}
    </UserContext.Provider>
  );
}