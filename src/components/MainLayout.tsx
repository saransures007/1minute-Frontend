import { ReactNode } from "react";
import Header from "./Header";

const MainLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 pt-16">{children}
    </main>
  </div>
);

export default MainLayout;
