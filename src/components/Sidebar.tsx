import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MessageSquare, Video, BarChart3, ListChecks } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()

  const routes = [
    {
      icon: Video,
      label: "Editor Mode",
      href: "/editor",
    },
    {
      icon: MessageSquare,
      label: "Chat Mode",
      href: "/chat",
    },
    {
      icon: BarChart3,
      label: "Analysis Mode",
      href: "/analysis",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      href: "/analytics",
    },
    {
      icon: ListChecks,
      label: "Results",
      href: "/results",
    },
  ]

  return (
    <div className={cn("pb-12 min-h-screen", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">
            Framestorm
          </h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link key={route.href} to={route.href}>
                <Button
                  variant={location.pathname === route.href ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
