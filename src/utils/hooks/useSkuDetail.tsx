import { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';

type SkuDetailContextProps = {
  selectedSku: PendingSku | null;
  setSelectedSku: Dispatch<SetStateAction<PendingSku | null>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const SkuDetailContext = createContext<SkuDetailContextProps>({
  selectedSku: null,
  setSelectedSku: () => {
    return null;
  },
  open: false,
  setOpen: () => {
    return null;
  },
});

type SkuDetailProviderProps = {
  children: React.ReactElement;
};

export const SkuDetailProvider = ({ children }: SkuDetailProviderProps) => {
  const [selectedSku, setSelectedSku] = useState<PendingSku | null>(null);
  const [open, setOpen] = useState(false);

  const value = useMemo(
    () => ({
      selectedSku,
      setSelectedSku,
      open,
      setOpen,
    }),
    [selectedSku, setSelectedSku, open, setOpen],
  );

  return <SkuDetailContext.Provider value={value}>{children}</SkuDetailContext.Provider>;
};

export const useSkuDetail = () => {
  return useContext(SkuDetailContext);
};
