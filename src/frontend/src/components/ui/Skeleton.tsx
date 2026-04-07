type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`skeleton rounded-md border-2 border-black/10 ${className}`}
      {...props}
    />
  );
}
