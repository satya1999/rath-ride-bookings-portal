
import { ReactNode } from "react";
import Navbar from "@/components/common/Navbar";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

const PageLayout = ({ 
  children, 
  className,
  containerClassName
}: PageLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={cn("flex-grow", className)}>
        <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6", containerClassName)}>
          {children}
        </div>
      </main>
      <footer className="bg-gray-50 border-t py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <span className="text-rath-red font-heading font-bold text-xl">ANANDA</span>
              <span className="text-rath-gold font-heading font-bold text-xl ml-1">RATH</span>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-center md:text-right text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Ananda Rath. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;
