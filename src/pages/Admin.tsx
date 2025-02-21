import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, RadialBarChart, RadialBar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from "lucide-react";
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
  const navigate = useNavigate();
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

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to access the dashboard",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [navigate, toast]);

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
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    
    const drawColoredRect = (x: number, y: number, width: number, height: number, color: string) => {
      pdf.setFillColor(...hexToRGB(color));
      pdf.rect(x, y, width, height, 'F');
    };

    const hexToRGB = (hex: string): [number, number, number] => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };

    // Professional Header with gradient-like effect
    drawColoredRect(0, 0, pageWidth, 25, '#4338CA');
    drawColoredRect(0, 20, pageWidth, 5, '#6366F1');
    
    // Header Content
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ACADEMIC PERFORMANCE REPORT', 10, 15);
  
    // Student Information Section
    let yPos = 40;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('STUDENT INFORMATION', 10, yPos);
  
    // Information Box
    drawColoredRect(10, yPos + 5, pageWidth - 20, 30, '#F3F4F6');
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    pdf.text([
      `Name: ${student?.name}`,
      `Grade: ${student?.grade}`,
      `Section: ${student?.section}`,
      `Academic Year: 2023-2024`,
      `Report Generated: ${new Date().toLocaleDateString()}`
    ], 15, yPos + 15);

    // Academic Performance Section
    yPos += 50;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('ACADEMIC PERFORMANCE OVERVIEW', 10, yPos);
  
    const subjects = Object.entries(currentStudentData.subjects);
    const colors = ['#4F46E5', '#7C3AED', '#EC4899', '#06B6D4'];
    
    // Subject Performance Bars
    yPos += 10;
    subjects.forEach(([subject, data], index) => {
      const barY = yPos + (index * 20);
      const barWidth = (data.progress / 100) * 150;
      
      // Subject Label
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text(subject.toUpperCase(), 15, barY + 5);
      
      // Background Bar
      pdf.setFillColor(240, 240, 240);
      pdf.rect(60, barY, 150, 8, 'F');
      
      // Progress Bar
      pdf.setFillColor(...hexToRGB(colors[index]));
      pdf.rect(60, barY, barWidth, 8, 'F');
      
      // Grade and Progress
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${data.progress}% (Grade ${data.grade})`, 220, barY + 5);
    });

    // Experiments and Activities Section
    yPos += 100;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LABORATORY EXPERIMENTS & ACTIVITIES', 10, yPos);
  
    // Activity Timeline
    yPos += 10;
    currentStudentData.recentActivity.forEach((activity, index) => {
      const activityY = yPos + (index * 25);
      
      // Activity Box
      drawColoredRect(15, activityY, pageWidth - 30, 20, '#F8FAFC');
      pdf.setDrawColor(...hexToRGB(colors[index % colors.length]));
      pdf.setLineWidth(0.5);
      pdf.line(15, activityY, 15, activityY + 20);
      
      // Activity Details
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(activity.experiment, 25, activityY + 8);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`Date: ${activity.date}`, 25, activityY + 16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Score: ${activity.score}%`, pageWidth - 45, activityY + 12);
    });

    // Analytics Section
    yPos += 120;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PERFORMANCE ANALYTICS', 10, yPos);
  
    // Monthly Performance Chart
    yPos += 20;
    const monthlyData = studentData.slice(-6);
    const chartWidth = 160;
    const chartHeight = 40;
    const barWidth = chartWidth / monthlyData.length - 5;
    
    monthlyData.forEach((data, index) => {
      const value = data[selectedSubject];
      const barHeight = (value / 100) * chartHeight;
      const barX = 20 + (index * (barWidth + 5));
      
      pdf.setFillColor(...hexToRGB(colors[index % colors.length]));
      pdf.rect(barX, yPos + (chartHeight - barHeight), barWidth, barHeight, 'F');
      
      // Month Label
      pdf.setFontSize(8);
      pdf.text(data.month, barX, yPos + chartHeight + 10);
      
      // Value
      pdf.text(value.toString(), barX, yPos + (chartHeight - barHeight) - 2);
    });

    // Key Performance Indicators
    yPos += 80;
    const kpiData = [
      { label: 'Average Performance', value: '91%' },
      { label: 'Experiments Completed', value: `${currentStudentData.subjects[selectedSubject].experiments}` },
      { label: 'Overall Grade', value: currentStudentData.subjects[selectedSubject].grade }
    ];

    kpiData.forEach((kpi, index) => {
      const kpiX = 15 + (index * ((pageWidth - 30) / 3));
      drawColoredRect(kpiX, yPos, (pageWidth - 40) / 3, 40, '#F3F4F6');
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(kpi.label, kpiX + 5, yPos + 15);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(kpi.value, kpiX + 5, yPos + 30);
    });

    // Footer
    pdf.setFillColor(243, 244, 246);
    pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Generated by OLabs Analytics Platform', 10, pageHeight - 8);
    pdf.text(`Report ID: ${Date.now()}`, pageWidth - 60, pageHeight - 8);

    // Save PDF
    pdf.save(`${student?.name}_academic_report.pdf`);

    toast({
      title: "Report Generated",
      description: "Academic performance report has been downloaded successfully",
    });
  };

  const currentStudent = studentDetails[Number(selectedStudent) as keyof typeof studentDetails];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4 md:p-8"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.5)),
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
        className="max-w-[1920px] mx-auto space-y-6 md:space-y-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Student Analytics Dashboard
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Track individual student performance and engagement metrics
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleDownloadReport}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all duration-300 w-full md:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="9" value={selectedGrade} onValueChange={setSelectedGrade} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-[400px] bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="9">Grade 9</TabsTrigger>
              <TabsTrigger value="10">Grade 10</TabsTrigger>
              <TabsTrigger value="11">Grade 11</TabsTrigger>
              <TabsTrigger value="12">Grade 12</TabsTrigger>
            </TabsList>
            
            <AnimatePresence mode="wait">
              {Object.entries(students).map(([grade, gradeStudents]) => (
                <TabsContent key={grade} value={grade}>
                  <Card className="backdrop-blur-sm bg-white/50 border border-white/20 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-800">Grade {grade} Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select value={selectedStudent} onValueChange={handleStudentChange}>
                        <SelectTrigger className="w-full md:w-[280px] bg-white">
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
            </AnimatePresence>
          </Tabs>
        </motion.div>

        {currentStudent && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 md:space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {Object.entries(currentStudent.subjects).map(([subject, data], index) => (
                  <motion.div
                    key={subject}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, translateY: -5 }}
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
                          <motion.div 
                            className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${data.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <p className="text-purple-600 text-sm mt-2">Experiments: {data.experiments}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <Card className="col-span-1 lg:col-span-2 backdrop-blur-sm bg-white/50 border border-white/20 shadow-lg">
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
                          className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/70 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 gap-2 md:gap-4"
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
                      <LineChart data={studentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                      <AreaChart data={studentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                        <XAxis dataKey="month" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.9)' }} />
                        <Legend />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey={selectedSubject}
                          stroke="#8b5cf6"
                          fill="url(#colorGradient)"
                        />
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
                      <BarChart data={studentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

export default Admin;
