import * as React from "react";
import { cn } from "~/lib/utils";

export interface HeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const Header = React.forwardRef<HTMLHeadingElement, HeaderProps>(
  ({ className, children, ...props }, ref) => (
    <header
      className={cn(
        "w-full py-5 px-8 sticky top-0 z-50 bg-[#F0D080]",
        className
      )}
    >
      <h1
        className="text-center text-[#7A532A]"
        style={{ fontFamily: "var(--font-pacifico)", fontSize: "5rem" }}
        ref={ref}
        {...props}
      >
        {children}
      </h1>
    </header>
  )
);
Header.displayName = "Header"; 