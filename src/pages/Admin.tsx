
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, RadialBarChart, RadialBar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import jsPDF from 'jspdf';

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

    // Add background color
    pdf.setFillColor(240, 248, 255); // Light blue background
    pdf.rect(0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height, 'F');

    // Header with school logo/name
    pdf.setFillColor(51, 122, 183);
    pdf.rect(0, 0, pdf.internal.pageSize.width, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.text('Student Performance Report', pdf.internal.pageSize.width / 2, 25, { align: 'center' });

    // Student Information Section
    pdf.setTextColor(44, 62, 80);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text('Student Information', 20, 50);

    // Add decorative line
    pdf.setDrawColor(51, 122, 183);
    pdf.setLineWidth(0.5);
    pdf.line(20, 55, 190, 55);

    // Student details in a more organized layout
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    const studentInfo = [
      [`Name: ${student?.name}`, `Grade: ${student?.grade}`],
      [`Section: ${student?.section}`, `Overall Grade: ${currentStudentData.overallGrade}`],
      [`Attendance: ${currentStudentData.attendance}%`, `Academic Year: 2023-2024`]
    ];

    let yPos = 65;
    studentInfo.forEach(row => {
      pdf.text(row[0], 25, yPos);
      pdf.text(row[1], 120, yPos);
      yPos += 10;
    });

    // Subject Performance Section
    yPos += 15;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text('Subject Performance', 20, yPos);
    pdf.line(20, yPos + 5, 190, yPos + 5);

    // Create a table-like structure for subject performance
    pdf.setFontSize(11);
    yPos += 15;
    Object.entries(currentStudentData.subjects).forEach(([subject, data], index) => {
      // Alternate row colors
      pdf.setFillColor(index % 2 === 0 ? 245 : 255, 245, 245);
      pdf.rect(20, yPos - 5, 170, 10, 'F');
      
      // Subject details
      pdf.setFont("helvetica", "bold");
      pdf.text(subject.charAt(0).toUpperCase() + subject.slice(1), 25, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Grade: ${data.grade}`, 80, yPos);
      pdf.text(`Progress: ${data.progress}%`, 120, yPos);
      pdf.text(`Experiments: ${data.experiments}`, 160, yPos);
      yPos += 10;
    });

    // Charts Section
    yPos += 10;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text('Performance Analytics', 20, yPos);
    pdf.line(20, yPos + 5, 190, yPos + 5);
    yPos += 15;

    // Add charts with better positioning and sizes
    Object.entries(chartRefs).forEach(([chartName, ref]) => {
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
            
            // Add chart title
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(14);
            pdf.text(chartName.charAt(0).toUpperCase() + chartName.slice(1), 20, yPos - 5);
            
            // Add chart with border
            pdf.setDrawColor(200, 200, 200);
            pdf.rect(20, yPos, 170, 80);
            pdf.addImage(imgData, 'PNG', 20, yPos, 170, 80);
            yPos += 90;
            URL.revokeObjectURL(url);

            if (chartName === 'progress') {
              // Recent Activity Section
              yPos += 10;
              pdf.setFont("helvetica", "bold");
              pdf.setFontSize(16);
              pdf.text('Recent Activity', 20, yPos);
              pdf.line(20, yPos + 5, 190, yPos + 5);
              yPos += 15;

              // Add recent activities in a table-like format
              currentStudentData.recentActivity.forEach((activity, index) => {
                pdf.setFillColor(index % 2 === 0 ? 245 : 255, 245, 245);
                pdf.rect(20, yPos - 5, 170, 10, 'F');
                
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(11);
                pdf.text(activity.date, 25, yPos);
                pdf.text(activity.experiment, 80, yPos);
                pdf.text(`${activity.score}%`, 170, yPos);
                yPos += 10;
              });

              // Footer
              pdf.setFont("helvetica", "italic");
              pdf.setFontSize(10);
              pdf.setTextColor(128, 128, 128);
              pdf.text('Generated on: ' + new Date().toLocaleDateString(), 20, pdf.internal.pageSize.height - 10);

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

  const currentStudent = studentDetails[Number(selectedStudent) as keyof typeof studentDetails];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Student Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Track individual student performance and engagement</p>
          </div>
          <Button
            onClick={handleDownloadReport}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>

        <Tabs defaultValue="9" value={selectedGrade} onValueChange={setSelectedGrade} className="mb-8">
          <TabsList className="grid grid-cols-4 w-[400px]">
            <TabsTrigger value="9">Grade 9</TabsTrigger>
            <TabsTrigger value="10">Grade 10</TabsTrigger>
            <TabsTrigger value="11">Grade 11</TabsTrigger>
            <TabsTrigger value="12">Grade 12</TabsTrigger>
          </TabsList>
          {Object.entries(students).map(([grade, gradeStudents]) => (
            <TabsContent key={grade} value={grade}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Grade {grade} Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedStudent} onValueChange={handleStudentChange}>
                    <SelectTrigger className="w-[280px]">
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Object.entries(currentStudent.subjects).map(([subject, data]) => (
                <motion.div
                  key={subject}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-colors ${
                      selectedSubject === subject ? 'border-blue-500 bg-blue-50/50' : ''
                    }`}
                    onClick={() => handleSubjectClick(subject)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 uppercase">
                        {subject}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {data.grade}
                      </div>
                      <p className="text-gray-600 text-sm mt-1">Progress: {data.progress}%</p>
                      <p className="text-blue-600 text-sm">Experiments: {data.experiments}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="w-full col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentStudent.recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
                      >
                        <div>
                          <p className="font-medium">{activity.experiment}</p>
                          <p className="text-sm text-gray-500">{activity.date}</p>
                        </div>
                        <div className="text-lg font-semibold text-blue-600">
                          {activity.score}%
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Subject Performance Trends</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]" ref={chartRefs.performance}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={studentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="physics" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="chemistry" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="biology" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Monthly Engagement</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]" ref={chartRefs.engagement}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={studentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey={selectedSubject}
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Skills Assessment</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]" ref={chartRefs.skills}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={skillsData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis />
                      <Radar name="Current" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Radar name="Target" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Subject-wise Progress</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]" ref={chartRefs.progress}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={studentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="physics" fill="#3b82f6" />
                      <Bar dataKey="chemistry" fill="#10b981" />
                      <Bar dataKey="biology" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Admin;
