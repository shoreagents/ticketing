import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Monitor, FolderOpen, Truck, DollarSign, Wrench, Grid3X3 } from "lucide-react";

// Ticketing system categories with design.md specifications
const ticketingCategories = [
  {
    title: "IT Support",
    description: "Technical issues, software problems, hardware requests",
    icon: Monitor,
    color: "#4A90A4",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    title: "Admin", 
    description: "Administrative requests, documentation, policies",
    icon: FolderOpen,
    color: "#B8860B",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  },
  {
    title: "Transport",
    description: "Company vehicle, travel arrangements, logistics",
    icon: Truck,
    color: "#228B22",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  {
    title: "Finance",
    description: "Expense reports, budget requests, financial queries",
    icon: DollarSign,
    color: "#CD853F",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  {
    title: "Maintenance",
    description: "Facility maintenance, equipment repairs, infrastructure issues",
    icon: Wrench,
    color: "#D2691E",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    title: "Others",
    description: "General requests that don't fit other categories",
    icon: Grid3X3,
    color: "#708090",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200"
  }
];

// Function to get greeting based on time
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning";
  } else if (hour < 17) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

export default function Home() {
  const greeting = getGreeting();
  const userName = "John"; // You can replace this with actual user name

  return (
    <div className="min-h-screen bg-[#F7F5F3]">
      {/* Header */}
      <header className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold text-[#2D2D2D]">🎫 HelpDesk Pro</h1>
              <p className="text-lg text-[#6B6B6B] mt-2">Your Support Hub</p>
            </div>
            <div className="flex-1 flex justify-end">
              <Button className="bg-[#4A90A4] hover:bg-[#3A7A8A] text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <span>CREATE TICKET</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Current Ticket Display */}
          <section>
            <h2 className="text-xl font-semibold text-[#2D2D2D] mb-4">📊 Current Ticket</h2>
            <Card className="bg-white border border-[#E5E5E5] rounded-xl shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-[#2D2D2D]">#TK-2024-001</span>
                      <span className="text-sm text-[#6B6B6B]">IT Server Issue</span>
                    </div>
                    <p className="text-xs text-[#6B6B6B] mt-1">Created 2 hours ago</p>
                  </div>
                  <div className="bg-[#DAA520] text-white px-3 py-1 rounded-full text-xs font-medium">
                    In Progress
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Category Selection */}
          <section>
            <h2 className="text-xl font-semibold text-[#2D2D2D] mb-4">📝 Create New Ticket</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ticketingCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card 
                    key={index} 
                    className={`bg-white border border-[#E5E5E5] rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] ${category.borderColor} hover:border-opacity-100`}
                    style={{ borderTop: `4px solid ${category.color}` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div 
                          className="w-16 h-16 mb-4 flex items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <IconComponent className="w-8 h-8" style={{ color: category.color }} />
                        </div>
                        <h3 className="text-lg font-semibold text-[#2D2D2D] mb-2">
                          {category.title}
                        </h3>
                        <p className="text-sm text-[#6B6B6B] leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
