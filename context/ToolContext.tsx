"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ToolContextType = {
  tool: string;
  setTool: (tool: string) => void;
  dark: boolean;
  setDark: (arg0: boolean) => void;
};

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export const ToolProvider = ({ children }: { children: ReactNode }) => {
  const [tool, setTool] = useState<string>("");
  const [dark, setDark] = useState<boolean>(false)

  return (
    <ToolContext.Provider value={{ tool, setTool, dark, setDark }}>
      {children}
    </ToolContext.Provider>
  );
};

export const useTool = () => {
  const context = useContext(ToolContext);
  if (!context) {
    throw new Error('useTool must be used within a ToolProvider');
  }
  return context;
};
