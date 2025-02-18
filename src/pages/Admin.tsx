import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, RadialBarChart, RadialBar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import jsPDF from 'jspdf';
import { useNavigate } from "react-router-dom";

const studentData = [
  { month: 'Jan', physics: 85, chemistry: 78, biology: 92 },
  { month: 'Feb', physics: 88, chemistry: 82, biology: 89 },
  { month: 'Mar', physics: 92, chemistry: 85, biology: 94 },
  { month: 'Apr', physics: 86, chemistry: 90, biology: 88 },
  { month: 'May', physics: 89, chemistry: 88, biology: 91 },
  { month: 'Jun', physics: 94, chemistry: 92, biology: 93 },
];

const students = {
  "9": [
    { id: 1, name: "Alex Johnson", grade: "9th", section: "A" },
    { id: 2, name: "Emily Brown", grade: "9th", section: "B" },
  ],
  "10": [
    { id: 3, name: "John Doe", grade: "10th", section: "A" },
    { id: 4, name: "Jane Smith", grade: "10th", section: "B" },
  ],
  "11": [
    { id: 5, name: "Mike Johnson", grade: "11th", section: "A" },
    { id: 6, name: "Sarah Williams", grade: "11th", section: "B" },
  ],
  "12": [
    { id: 7, name: "Tom Wilson", grade: "12th", section: "A" },
    { id: 8, name: "Lisa Anderson", grade: "12th", section: "B" },
  ],
};

const studentDetails = {
  1: {
    attendance: 95,
    overallGrade: "A",
    subjects: {
      physics: { grade: "A", progress: 92, experiments: 15 },
      chemistry: { grade: "A-", progress: 88, experiments: 12 },
      biology: { grade: "A+", progress: 96, experiments: 14 }
    },
    recentActivity: [
      { date: "2024-02-01", experiment: "Ohm's Law", score: 95 },
      { date: "2024-02-05", experiment: "Acid Base Titration", score: 88 },
      { date: "2024-02-10", experiment: "Photosynthesis", score: 92 }
    ]
  },
};

const skillsData = [
  { subject: 'Problem Solving', A: 120, B: 110, fullMark: 150 },
  { subject: 'Lab Work', A: 98, B: 130, fullMark: 150 },
  { subject: 'Theory', A: 86, B: 130, fullMark: 150 },
  { subject: 'Projects', A: 99, B: 100, fullMark: 150 },
  { subject: 'Attendance', A: 85, B: 90, fullMark: 150 },
  { subject: 'Participation', A: 65, B: 85, fullMark: 150 },
];

const Admin = () => {
  const { toast } = useToast();
  const [selectedGrade, setSelectedGrade] = useState("9");
  const [selectedSubject, setSelectedSubject] = useState("physics");
  const [selectedStudent, setSelectedStudent] = useState<string>("1");
  const chartRefs = {
    performance: useRef(null),
    engagement: useRef(null),
    skills: useRef(null),
    progress: useRef(null)
  };

  const { data: queryData, isLoading } = useQuery({
    queryKey: ["studentData"],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return studentData;
    },
  });

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
    toast({
      title: "Subject Updated",
      description: `Now viewing ${subject} performance data`,
    });
  };

  const handleStudentChange = (value: string) => {
    setSelectedStudent(value);
    toast({
      title: "Student Selected",
      description: `Viewing ${students[selectedGrade as keyof typeof students].find(s => s.id.toString() === value)?.name}'s analysis`,
    });
  };

  const handleDownloadReport = () => {
    const currentStudentData = studentDetails[Number(selectedStudent) as keyof typeof studentDetails];
    if (!currentStudentData) return;

    const pdf = new jsPDF();
    const student = students[selectedGrade as keyof typeof students].find(s => s.id.toString() === selectedStudent);

    // Add gradient-like background
    pdf.setFillColor(240, 248, 255); // Light blue background
    pdf.rect(0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height, 'F');

    // Header with gradient-like effect
    pdf.setFillColor(139, 87, 246); // Purple color matching webpage
    pdf.rect(0, 0, pdf.internal.pageSize.width, 45, 'F');
    
    // Add a subtle shadow effect
    pdf.setFillColor(129, 77, 236);
    pdf.rect(0, 43, pdf.internal.pageSize.width, 2, 'F');

    // Header text
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.text('Student Analytics Dashboard', pdf.internal.pageSize.width / 2, 25, { align: 'center' });
    pdf.setFontSize(14);
    pdf.text('Track individual student performance and engagement', pdf.internal.pageSize.width / 2, 35, { align: 'center' });

    // Student Card Section
    let yPos = 60;
    
    // Card-like container
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(229, 231, 235);
    pdf.roundedRect(15, yPos - 10, 180, 50, 3, 3, 'FD');

    // Student Information
    pdf.setTextColor(31, 41, 55);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text('Student Information', 20, yPos);

    // Student details with modern layout
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Name: ${student?.name}`, 25, yPos + 15);
    pdf.text(`Grade: ${student?.grade} | Section: ${student?.section}`, 25, yPos + 25);

    // Subject Cards Section
    yPos += 70;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text('Subject Performance', 20, yPos);

    // Create modern cards for each subject
    Object.entries(currentStudentData.subjects).forEach(([subject, data], index) => {
      const cardX = 20 + (index * 62);
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(cardX, yPos + 10, 55, 70, 3, 3, 'FD');
      
      // Subject title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(31, 41, 55);
      pdf.text(subject.charAt(0).toUpperCase() + subject.slice(1), cardX + 5, yPos + 25);
      
      // Grade
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text(data.grade, cardX + 5, yPos + 40);
      
      // Progress
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(`Progress: ${data.progress}%`, cardX + 5, yPos + 55);
      pdf.text(`Exp: ${data.experiments}`, cardX + 5, yPos + 65);
    });

    // Charts Section
    yPos += 100;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text('Performance Analytics', 20, yPos);

    // Add charts in a grid layout
    Object.entries(chartRefs).forEach(([chartName, ref], index) => {
      if (ref.current) {
        const chartElement = ref.current as HTMLElement;
        if (chartElement) {
          const svgData = new XMLSerializer().serializeToString(chartElement.querySelector('svg')!);
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          const img = new Image();
          const svg = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svg);

          img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const imgData = canvas.toDataURL('image/png');
            
            // Create card-like container for chart
            const chartY = yPos + 10 + (Math.floor(index / 2) * 100);
            const chartX = 20 + ((index % 2) * 95);
            
            pdf.setFillColor(255, 255, 255);
            pdf.roundedRect(chartX - 5, chartY - 5, 90, 90, 3, 3, 'FD');
            
            // Chart title
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(11);
            pdf.text(chartName.charAt(0).toUpperCase() + chartName.slice(1), chartX, chartY - 2);
            
            // Add chart
            pdf.addImage(imgData, 'PNG', chartX, chartY, 80, 80);
            URL.revokeObjectURL(url);

            if (chartName === 'progress') {
              // Recent Activity Section
              yPos = chartY + 100;
              pdf.setFont("helvetica", "bold");
              pdf.setFontSize(16);
              pdf.text('Recent Activity', 20, yPos);

              // Activity cards
              currentStudentData.recentActivity.forEach((activity, idx) => {
                const activityY = yPos + 15 + (idx * 25);
                
                // Card background
                pdf.setFillColor(255, 255, 255);
                pdf.roundedRect(20, activityY - 5, 170, 20, 3, 3, 'FD');
                
                // Activity details
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(11);
                pdf.text(activity.date, 25, activityY + 5);
                pdf.text(activity.experiment, 80, activityY + 5);
                
                // Score with color indicator
                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(activity.score >= 90 ? 34 : activity.score >= 75 ? 146 : 239, 
                               activity.score >= 90 ? 197 : activity.score >= 75 ? 146 : 68,
                               activity.score >= 90 ? 94 : activity.score >= 75 ? 0 : 68);
                pdf.text(`${activity.score}%`, 170, activityY + 5);
                pdf.setTextColor(31, 41, 55);
              });

              // Footer
              pdf.setFont("helvetica", "italic");
              pdf.setFontSize(10);
              pdf.setTextColor(107, 114, 128);
              pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, pdf.internal.pageSize.height - 10);

              pdf.save(`${student?.name}_performance_report.pdf`);

              toast({
                title: "Report Downloaded",
                description: `Enhanced performance report for ${student?.name} has been generated`,
              });
            }
          };
          img.src = url;
        }
      }
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const currentStudent = studentDetails[Number(selectedStudent) as keyof typeof studentDetails];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8"
      style={{
        backgroundImage: `
          linear-gradient(to right bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8)), 
          url('/placeholder.svg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Student Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Track individual student performance and engagement</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={handleDownloadReport}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="9" value={selectedGrade} onValueChange={setSelectedGrade} className="w-full">
          <TabsList className="grid grid-cols-4 w-[400px] bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="9">Grade 9</TabsTrigger>
            <TabsTrigger value="10">Grade 10</TabsTrigger>
            <TabsTrigger value="11">Grade 11</TabsTrigger>
            <TabsTrigger value="12">Grade 12</TabsTrigger>
          </TabsList>
          {Object.entries(students).map(([grade, gradeStudents]) => (
            <TabsContent key={grade} value={grade}>
              <Card className="backdrop-blur-sm bg-white/50 border border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Grade {grade} Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedStudent} onValueChange={handleStudentChange}>
                    <SelectTrigger className="w-[280px] bg-white">
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.name} - Section {student.section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {currentStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Object.entries(currentStudent.subjects).map(([subject, data]) => (
                <motion.div
                  key={subject}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl backdrop-blur-sm bg-white/50 border border-white/20 ${
                      selectedSubject === subject ? 'ring-2 ring-purple-500 shadow-lg bg-purple-50/50' : ''
                    }`}
                    onClick={() => handleSubjectClick(subject)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 uppercase">
                        {subject}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {data.grade}
                      </div>
                      <p className="text-gray-600 text-sm mt-1">Progress: {data.progress}%</p>
                      <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                          style={{ width: `${data.progress}%` }}
                        />
                      </div>
                      <p className="text-purple-600 text-sm mt-2">Experiments: {data.experiments}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="col-span-2 backdrop-blur-sm bg-white/50 border border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentStudent.recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white/70 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{activity.experiment}</p>
                          <p className="text-sm text-gray-500">{activity.date}</p>
                        </div>
                        <div className={`text-lg font-semibold px-4 py-1 rounded-full ${
                          activity.score >= 90 ? 'bg-green-100 text-green-600' :
                          activity.score >= 75 ? 'bg-blue-100 text-blue-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {activity.score}%
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/50 border border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Subject Performance Trends</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]" ref={chartRefs.performance}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={studentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.9)' }} />
                      <Legend />
                      <Line type="monotone" dataKey="physics" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="chemistry" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="biology" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/50 border border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Monthly Engagement</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]" ref={chartRefs.engagement}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={studentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.9)' }} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey={selectedSubject}
                        stroke="#8b5cf6"
                        fill="url(#purpleGradient)"
                        fillOpacity={0.3}
                      />
                      <defs>
                        <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/50 border border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Skills Assessment</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]" ref={chartRefs.skills}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={skillsData}>
                      <PolarGrid stroke="rgba(0,0,0,0.1)" />
                      <PolarAngleAxis dataKey="subject" stroke="#666" />
                      <PolarRadiusAxis stroke="#666" />
                      <Radar name="Current" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                      <Radar name="Target" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/50 border border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Subject-wise Progress</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]" ref={chartRefs.progress}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.9)' }} />
                      <Legend />
                      <Bar dataKey="physics" fill="#8b5cf6" />
                      <Bar dataKey="chemistry" fill="#3b82f6" />
                      <Bar dataKey="biology" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Admin;
