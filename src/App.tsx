import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import EditorMode from "./pages/EditorMode";
import ChatMode from "./pages/ChatMode";
import AnalysisMode from "./pages/AnalysisMode";
import AnalyticsPage from "./pages/AnalyticsPage";
import ResultsPage from "./pages/ResultsPage";
import { Sidebar } from "./components/Sidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex">
          <Sidebar className="w-64 border-r" />
          <main className="flex-1 min-h-screen">
            <Routes>
              <Route path="/" element={<EditorMode />} />
              <Route path="/editor" element={<EditorMode />} />
              <Route path="/chat" element={<ChatMode />} />
              <Route path="/analysis" element={<AnalysisMode />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
