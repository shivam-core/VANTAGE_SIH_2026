import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { VantageReport } from '../domain/types';

export interface Settings {
  workspaceName: string;
  targetPqcDate: string;
  deepAnalysis: boolean;
  ignoreTestDirs: boolean;
}

const defaultSettings: Settings = {
  workspaceName: 'Acme Corp Infrastructure',
  targetPqcDate: '2028-12-31',
  deepAnalysis: false,
  ignoreTestDirs: true,
};

interface VantageContextType {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  reports: VantageReport[];
  addReport: (report: VantageReport) => void;
  filesScanned: number;
  setFilesScanned: React.Dispatch<React.SetStateAction<number>>;
  cryptoAssetsFound: number;
  setCryptoAssetsFound: React.Dispatch<React.SetStateAction<number>>;
}

const VantageContext = createContext<VantageContextType | undefined>(undefined);

export const VantageProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettingsState] = useState<Settings>(() => {
    const saved = localStorage.getItem('vantage-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [reports, setReportsState] = useState<VantageReport[]>(() => {
    const saved = localStorage.getItem('vantage-reports-v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [filesScanned, setFilesScanned] = useState<number>(() => {
    const saved = localStorage.getItem('vantage-files-scanned-v2');
    return saved ? JSON.parse(saved) : 0;
  });

  const [cryptoAssetsFound, setCryptoAssetsFound] = useState<number>(() => {
    const saved = localStorage.getItem('vantage-crypto-assets-found-v2');
    return saved ? JSON.parse(saved) : 0;
  });

  const setSettings = (newSettings: Settings) => {
    setSettingsState(newSettings);
    localStorage.setItem('vantage-settings', JSON.stringify(newSettings));
  };

  const addReport = (report: VantageReport) => {
    const newReports = [...reports, report];
    setReportsState(newReports);
    localStorage.setItem('vantage-reports-v2', JSON.stringify(newReports));
  };

  useEffect(() => {
    localStorage.setItem('vantage-files-scanned-v2', JSON.stringify(filesScanned));
  }, [filesScanned]);

  useEffect(() => {
    localStorage.setItem('vantage-crypto-assets-found-v2', JSON.stringify(cryptoAssetsFound));
  }, [cryptoAssetsFound]);

  return (
    <VantageContext.Provider 
      value={{ 
        settings, setSettings, 
        reports, addReport, 
        filesScanned, setFilesScanned,
        cryptoAssetsFound, setCryptoAssetsFound
      }}
    >
      {children}
    </VantageContext.Provider>
  );
};

export const useVantage = () => {
  const context = useContext(VantageContext);
  if (!context) {
    throw new Error('useVantage must be used within a VantageProvider');
  }
  return context;
};
