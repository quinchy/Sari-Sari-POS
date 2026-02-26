import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ViewIcon,
  ViewOffIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface InputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "password" | "search";
}

function Input({ className, type, variant, ...props }: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const isPasswordVariant = variant === "password" || type === "password";
  const isSearchVariant = variant === "search" || type === "search";

  const inputType = isPasswordVariant
    ? showPassword
      ? "text"
      : "password"
    : isSearchVariant
      ? "search"
      : type;

  if (isPasswordVariant) {
    return (
      <div className="relative flex items-center">
        <InputPrimitive
          type={inputType}
          data-slot="input"
          data-variant="password"
          className={cn(
            "rounded-md focus-visible:border-solid dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-10.5 border bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] file:h-7 file:text-sm file:font-medium focus-visible:ring-3 aria-invalid:ring-3 md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 pr-10",
            className,
          )}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute right-1 h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          <HugeiconsIcon
            icon={showPassword ? ViewOffIcon : ViewIcon}
            className="h-4 w-4"
            strokeWidth={1.5}
          />
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>
    );
  }

  if (isSearchVariant) {
    return (
      <div className="relative flex items-center">
        <span
          className="absolute left-2.5 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        >
          <HugeiconsIcon
            icon={Search01Icon}
            className="h-4 w-4"
            strokeWidth={1.5}
          />
        </span>

        <InputPrimitive
          type={inputType}
          data-slot="input"
          data-variant="search"
          className={cn(
            "rounded-md focus-visible:border-solid dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-10.5 border bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] file:h-7 file:text-sm file:font-medium focus-visible:ring-3 aria-invalid:ring-3 md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 pl-9",
            className,
          )}
          {...props}
        />
      </div>
    );
  }

  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "rounded-md focus-visible:border-solid dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 h-10.5 border bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] file:h-7 file:text-sm file:font-medium focus-visible:ring-3 aria-invalid:ring-3 md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
