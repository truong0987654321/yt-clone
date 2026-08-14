import { HomeView } from "@/modules/home/ui/views/HomeView";

interface PageProps {
  searchParams: Promise<{ categoryId?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { categoryId } = await searchParams;
  return <HomeView categoryId={categoryId} />;
}

const EmptyFeed = () => {
  return (
    <div className="m-[0_8px] max-w-533 relative">
      <div className="flex items-center justify-center w-full">
        <div className="shadow-lg rounded-2xl w-full max-w-3xl mt-6">
          <div className="px-8 py-6">
            <div className="text-center flex flex-col items-center">
              <h2 className="text-3xl font-semibold">
                Try searching to get started
              </h2>

              <div className="mt-2 text-sm font-normal text-foreground text-balance">
                Start watching videos to help us build a feed of videos that
                you&apos;ll love.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
