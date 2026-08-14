import { CategoriesSection } from "../sections/CategoriesSection";

interface HomeViewProps {
  categoryId?: string;
}

export const HomeView = ({ categoryId }: HomeViewProps) => {
  return <CategoriesSection />;
};
