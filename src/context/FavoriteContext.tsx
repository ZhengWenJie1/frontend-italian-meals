import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { loadFavoriteIds, saveFavoriteIds } from "../services/storage";

type FavoritesContextType = {
  favoriteIds: string[];
  isLoading: boolean;
  isFavorite: (idMeal: string) => boolean;
  toggleFavorite: (idMeal: string) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const ids = await loadFavoriteIds();
      if (mounted) {
        setFavoriteIds(ids);
        setIsLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const isFavorite = (idMeal: string) => favoriteIds.includes(idMeal);

  const toggleFavorite = async (idMeal: string) => {
    const updated = favoriteIds.includes(idMeal)
      ? favoriteIds.filter((id) => id !== idMeal)
      : [...favoriteIds, idMeal];

    setFavoriteIds(updated);
    await saveFavoriteIds(updated);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        isLoading,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }

  return context;
};