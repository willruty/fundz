import { Skeleton } from "../ui/Skeleton";

function MenuSkeleton() {
  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="flex flex-row md:flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-[var(--black)] ${i === 0 ? "bg-[var(--primary)]" : "bg-white"}`}
          >
            <Skeleton className={`w-5 h-5 rounded-md ${i === 0 ? "opacity-30" : ""}`} />
            <Skeleton className={`h-3 w-24 ${i === 0 ? "opacity-30" : ""}`} />
          </div>
        ))}
      </div>
    </aside>
  );
}

function FormSectionSkeleton() {
  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">
      <div className="border-b-2 border-[var(--black)] px-6 py-4 flex items-center gap-3">
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="h-5 w-36" />
      </div>
      <div className="p-6 flex flex-col gap-6">
        {/* Avatar row */}
        <div className="flex items-center gap-5">
          <Skeleton className="w-20 h-20 rounded-full shrink-0" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-44" />
            <Skeleton className="h-9 w-32 rounded-lg mt-1" />
          </div>
        </div>
        {/* Fields */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}
        {/* Save button */}
        <div className="flex justify-end">
          <Skeleton className="h-11 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function TogglesSectionSkeleton() {
  return (
    <div className="bg-white border-2 border-[var(--black)] rounded-[var(--radius-card)] shadow-[var(--neo-shadow)] overflow-hidden">
      <div className="border-b-2 border-[var(--black)] px-6 py-4 flex items-center gap-3">
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="h-5 w-28" />
      </div>
      <div className="p-6 flex flex-col gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b-2 border-[var(--black)] border-dashed">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="w-12 h-6 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConfigsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto w-full p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-9 w-52 mb-2" />
        <Skeleton className="h-3 w-72" />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <MenuSkeleton />
        <div className="flex-1 flex flex-col gap-6">
          <FormSectionSkeleton />
          <TogglesSectionSkeleton />
        </div>
      </div>
    </div>
  );
}
