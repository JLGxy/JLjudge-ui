import { useLocation } from "@tanstack/react-router";
import React from "react";

const globalContext = React.createContext<{
  contestName: string;
  setContestName: React.Dispatch<React.SetStateAction<string>>;
  contestPath: string;
  setContestPath: React.Dispatch<React.SetStateAction<string>>;
}>({
  contestName: "",
  setContestName: () => { },
  contestPath: "",
  setContestPath: () => { },
});

export function GlobalContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const { contest } = location.state;

  const [contestName, setContestName] = React.useState<string>(contest?.split("/")?.pop() || contest);
  const [contestPath, setContestPath] = React.useState<string>(contest);
  React.useEffect(() => {
    setContestName(contest?.split("/")?.pop() || contest);
    setContestPath(contest);
  }, [contest]);
  return (
    <globalContext.Provider value={{
      contestName: contestName,
      setContestName: setContestName,
      contestPath: contestPath,
      setContestPath: setContestPath,
    }}>
      {children}
    </globalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = React.useContext(globalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalContextProvider");
  }
  return context;
}