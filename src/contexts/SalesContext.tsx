import React, { createContext, useContext, useState, useCallback } from 'react';

interface SalesContextType {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedRegion: string;
  setSelectedRegion: (reg: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  dataVersion: number;
  refreshData: () => void;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [dataVersion, setDataVersion] = useState<number>(1);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const refreshData = useCallback(() => {
    setDataVersion(v => v + 1);
  }, []);

  return (
    <SalesContext.Provider
      value={{
        selectedCategory,
        setSelectedCategory,
        selectedRegion,
        setSelectedRegion,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        dataVersion,
        refreshData,
        isUploadModalOpen,
        setIsUploadModalOpen,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const ctx = useContext(SalesContext);
  if (!ctx) throw new Error('useSales must be used within SalesProvider');
  return ctx;
};
