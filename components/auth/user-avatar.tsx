import { User } from "lucide-react";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name?: string | null;
  image?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function UserAvatar({ name, image, size = "md", className }: UserAvatarProps) {
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
    "bg-slate-950 text-white dark:bg-white dark:text-slate-950",
    sizeClasses[size],
    className
  );

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name ?? "User avatar"}
        className={cn(classes, "object-cover")}
      />
    );
  }

  if (name) {
    return (
      <span className={classes} aria-label={name}>
        {getInitials(name)}
      </span>
    );
  }

  return (
    <span className={classes} aria-label="User">
      <User className="h-1/2 w-1/2" aria-hidden="true" />
    </span>
  );
}

