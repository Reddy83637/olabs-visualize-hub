
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, RadialBarChart, RadialBar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, Award, BookOpen, GraduationCap, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, Activity, Users } from "lucide-react";
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

    const drawRoundedRect = (x: number, y: number, width: number, height: number, radius: number, color: string) => {
      pdf.setFillColor(...hexToRGB(color));
      
      // Draw main rectangle
      pdf.rect(x + radius, y, width - 2 * radius, height, 'F');
      pdf.rect(x, y + radius, width, height - 2 * radius, 'F');
      
      // Draw corner circles
      pdf.circle(x + radius, y + radius, radius, 'F');
      pdf.circle(x + width - radius, y + radius, radius, 'F');
      pdf.circle(x + radius, y + height - radius, radius, 'F');
      pdf.circle(x + width - radius, y + height - radius, radius, 'F');
    };

    const hexToRGB = (hex: string): [number, number, number] => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };

    // Set PDF properties
    pdf.setProperties({
      title: `${student?.name} - Academic Performance Report`,
      subject: 'Student Performance Analysis',
      author: 'OLabs Analytics Platform',
      keywords: 'education, performance, analytics',
      creator: 'OLabs Reporting System'
    });

    // HEADER SECTION
    // Elegant gradient header
    const headerGradientColors = ['#4338CA', '#6366F1', '#818CF8'];
    headerGradientColors.forEach((color, index, array) => {
      const yPos = index * (10 / array.length);
      drawColoredRect(0, yPos, pageWidth, 10 / array.length, color);
    });
    
    // School logo placeholder
    drawRoundedRect(10, 15, 30, 30, 5, '#FFFFFF');
    pdf.addImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'PNG', 12, 17, 26, 26);
    
    // Header Content
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ACADEMIC PERFORMANCE REPORT', pageWidth / 2, 25, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Olabs Science Education Platform', pageWidth / 2, 35, { align: 'center' });
  
    // STUDENT INFORMATION SECTION
    let yPos = 55;
    
    // Section title with modern design
    pdf.setDrawColor(...hexToRGB('#4338CA'));
    pdf.setLineWidth(0.5);
    pdf.line(10, yPos, 30, yPos);
    
    pdf.setTextColor(67, 56, 202); // #4338CA
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('STUDENT INFORMATION', 35, yPos);
    
    pdf.line(pdf.getTextWidth('STUDENT INFORMATION') + 40, yPos, 200, yPos);
  
    // Information Box with shadow effect
    yPos += 10;
    // Shadow effect (light gray rectangle slightly offset)
    drawRoundedRect(12, yPos + 2, pageWidth - 24, 40, 5, '#E5E7EB');
    // Main container
    drawRoundedRect(10, yPos, pageWidth - 20, 40, 5, '#F9FAFB');
    
    // Student photo placeholder
    drawRoundedRect(15, yPos + 5, 30, 30, 3, '#EEF2FF');
    
    // Student details with clear typography
    pdf.setFontSize(11);
    pdf.setTextColor(17, 24, 39); // #111827
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Name: ${student?.name}`, 55, yPos + 10);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(55, 65, 81); // #374151
    pdf.setFontSize(10);
    
    const detailsColumn1 = [
      `Grade: ${student?.grade}`,
      `Section: ${student?.section}`,
    ];
    
    const detailsColumn2 = [
      `Academic Year: 2023-2024`,
      `Report Generated: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`
    ];
    
    detailsColumn1.forEach((text, index) => {
      pdf.text(text, 55, yPos + 20 + (index * 8));
    });
    
    detailsColumn2.forEach((text, index) => {
      pdf.text(text, 130, yPos + 20 + (index * 8));
    });

    // ACADEMIC OVERVIEW SECTION
    yPos += 60;
    
    // Section title
    pdf.setDrawColor(...hexToRGB('#4338CA'));
    pdf.line(10, yPos, 30, yPos);
    
    pdf.setTextColor(67, 56, 202); // #4338CA
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ACADEMIC PERFORMANCE', 35, yPos);
    
    pdf.line(pdf.getTextWidth('ACADEMIC PERFORMANCE') + 40, yPos, 200, yPos);
  
    // Key stats boxes with modern design
    yPos += 10;
    const statBoxes = [
      { label: 'Attendance', value: `${currentStudentData.attendance}%`, icon: '📊' },
      { label: 'Overall Grade', value: currentStudentData.overallGrade, icon: '🏆' },
      { label: 'Total Experiments', value: Object.values(currentStudentData.subjects).reduce((acc, subj) => acc + subj.experiments, 0), icon: '🧪' }
    ];
    
    const boxWidth = (pageWidth - 40) / 3;
    
    statBoxes.forEach((stat, index) => {
      const boxX = 10 + (index * (boxWidth + 5));
      
      // Shadow effect
      drawRoundedRect(boxX + 2, yPos + 2, boxWidth, 50, 5, '#E5E7EB');
      
      // Box with gradient background
      const gradientColors = ['#EEF2FF', '#E0E7FF'];
      gradientColors.forEach((color, gIndex) => {
        drawRoundedRect(
          boxX, 
          yPos + (gIndex * 25), 
          boxWidth, 
          25, 
          gIndex === 0 ? 5 : 0, 
          color
        );
      });
      
      // Bottom rounded corners for second rectangle
      if (gradientColors.length > 1) {
        pdf.circle(boxX + 5, yPos + 50 - 5, 5, 'F');
        pdf.circle(boxX + boxWidth - 5, yPos + 50 - 5, 5, 'F');
      }
      
      // Content
      pdf.setFontSize(9);
      pdf.setTextColor(107, 114, 128); // #6B7280
      pdf.setFont('helvetica', 'normal');
      pdf.text(stat.label, boxX + 10, yPos + 15);
      
      pdf.setFontSize(18);
      pdf.setTextColor(67, 56, 202); // #4338CA
      pdf.setFont('helvetica', 'bold');
      pdf.text(stat.value.toString(), boxX + boxWidth/2, yPos + 35, { align: 'center' });
    });

    // SUBJECTS PERFORMANCE SECTION
    yPos += 65;
    
    // Subject performance bars with modern gradient design
    const subjects = Object.entries(currentStudentData.subjects);
    const colors = ['#4F46E5', '#7C3AED', '#EC4899', '#06B6D4'];
    const lightColors = ['#EEF2FF', '#F5F3FF', '#FCE7F3', '#ECFEFF'];
    
    subjects.forEach(([subject, data], index) => {
      const barY = yPos + (index * 35);
      const progressWidth = (data.progress / 100) * 150;
      
      // Card container with shadow
      drawRoundedRect(12, barY + 2, pageWidth - 24, 30, 5, '#E5E7EB');
      drawRoundedRect(10, barY, pageWidth - 20, 30, 5, lightColors[index]);
      
      // Subject icon
      const iconSize = 20;
      pdf.setFillColor(...hexToRGB(colors[index]));
      pdf.circle(20, barY + 15, iconSize/2, 'F');
      
      // Subject label with icon
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(31, 41, 55); // #1F2937
      pdf.text(subject.charAt(0).toUpperCase() + subject.slice(1), 35, barY + 12);
      
      // Grade
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text(data.grade, 35, barY + 22);
      
      // Background bar (light gray)
      pdf.setFillColor(229, 231, 235); // #E5E7EB
      pdf.roundedRect(70, barY + 10, 150, 10, 5, 5, 'F');
      
      // Progress bar with gradient
      pdf.setFillColor(...hexToRGB(colors[index]));
      if (progressWidth > 10) { // Only use rounded rect if width is sufficient
        pdf.roundedRect(70, barY + 10, progressWidth, 10, 5, 5, 'F');
      }
      
      // Progress percentage
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.text(`${data.progress}%`, progressWidth + 75, barY + 17);
      
      // Experiments count with icon
      pdf.setFillColor(55, 65, 81); // #374151
      pdf.circle(pageWidth - 40, barY + 15, 2, 'F');
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${data.experiments} experiments`, pageWidth - 35, barY + 17);
    });

    // RECENT ACTIVITIES SECTION
    yPos += (subjects.length * 35) + 20;
    
    // Section title
    pdf.setDrawColor(...hexToRGB('#4338CA'));
    pdf.line(10, yPos, 30, yPos);
    
    pdf.setTextColor(67, 56, 202); // #4338CA
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RECENT LABORATORY ACTIVITIES', 35, yPos);
    
    pdf.line(pdf.getTextWidth('RECENT LABORATORY ACTIVITIES') + 40, yPos, 200, yPos);
  
    // Activity timeline with modern design
    yPos += 10;
    currentStudentData.recentActivity.forEach((activity, index) => {
      const activityY = yPos + (index * 30);
      
      // Timeline line
      pdf.setDrawColor(...hexToRGB(colors[index % colors.length]));
      pdf.setLineWidth(1);
      pdf.line(20, activityY, 20, activityY + 30);
      
      // Timeline dot
      pdf.setFillColor(...hexToRGB(colors[index % colors.length]));
      pdf.circle(20, activityY + 10, 4, 'F');
      
      // Activity card with shadow
      drawRoundedRect(30 + 2, activityY + 2, pageWidth - 42, 25, 5, '#E5E7EB');
      drawRoundedRect(30, activityY, pageWidth - 40, 25, 5, '#FFFFFF');
      
      // Activity title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(31, 41, 55); // #1F2937
      pdf.text(activity.experiment, 40, activityY + 10);
      
      // Activity date with icon
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128); // #6B7280
      pdf.text(`📅 ${new Date(activity.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })}`, 40, activityY + 18);
      
      // Score with badge-like design
      const scoreText = `${activity.score}%`;
      const scoreWidth = pdf.getTextWidth(scoreText) + 10;
      
      // Score background
      let scoreColor = '#10B981'; // Green for high scores
      if (activity.score < 85) scoreColor = '#3B82F6'; // Blue for medium scores
      if (activity.score < 70) scoreColor = '#EF4444'; // Red for low scores
      
      drawRoundedRect(pageWidth - 50, activityY + 5, 30, 15, 7.5, scoreColor);
      
      // Score text
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(255, 255, 255);
      pdf.text(scoreText, pageWidth - 35, activityY + 14, { align: 'center' });
    });

    // PERFORMANCE ANALYTICS SECTION
    yPos += 110;
    
    // Section title
    pdf.setDrawColor(...hexToRGB('#4338CA'));
    pdf.line(10, yPos, 30, yPos);
    
    pdf.setTextColor(67, 56, 202); // #4338CA
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PERFORMANCE ANALYTICS', 35, yPos);
    
    pdf.line(pdf.getTextWidth('PERFORMANCE ANALYTICS') + 40, yPos, 200, yPos);
    
    // Monthly trend chart
    yPos += 15;
    
    // Chart title
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(75, 85, 99); // #4B5563
    pdf.text('Monthly Performance Trend', 10, yPos);
    
    // Chart container
    drawRoundedRect(10, yPos + 5, pageWidth - 20, 50, 5, '#F9FAFB');
    
    // Chart data visualization
    const chartData = studentData.slice(-6);
    const chartWidth = pageWidth - 40;
    const chartHeight = 35;
    const barWidth = chartWidth / chartData.length - 5;
    
    // Chart axes
    pdf.setDrawColor(209, 213, 219); // #D1D5DB
    pdf.setLineWidth(0.5);
    pdf.line(20, yPos + 45, 20 + chartWidth, yPos + 45); // X-axis
    
    // Bars with gradient colors
    chartData.forEach((data, index) => {
      const value = data[selectedSubject];
      const normalizedValue = (value - 70) / 30; // Normalize values between 70-100 to 0-1 range
      const barHeight = normalizedValue * chartHeight;
      const barX = 20 + (index * (barWidth + 5));
      
      // Bar shadow
      pdf.setFillColor(229, 231, 235); // #E5E7EB
      pdf.rect(barX + 1, yPos + 45 - barHeight, barWidth, barHeight, 'F');
      
      // Actual bar
      pdf.setFillColor(...hexToRGB(colors[index % colors.length]));
      pdf.rect(barX, yPos + 44 - barHeight, barWidth, barHeight, 'F');
      
      // Month label
      pdf.setFontSize(7);
      pdf.setTextColor(107, 114, 128); // #6B7280
      pdf.text(data.month, barX + barWidth/2, yPos + 50, { align: 'center' });
      
      // Value
      if (barHeight > 10) { // Only show if bar is tall enough
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.text(value.toString(), barX + barWidth/2, yPos + 40 - barHeight, { align: 'center' });
      }
    });

    // RECOMMENDATIONS SECTION
    yPos += 70;
    
    // Section title
    pdf.setDrawColor(...hexToRGB('#4338CA'));
    pdf.line(10, yPos, 30, yPos);
    
    pdf.setTextColor(67, 56, 202); // #4338CA
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RECOMMENDATIONS & NEXT STEPS', 35, yPos);
    
    pdf.line(pdf.getTextWidth('RECOMMENDATIONS & NEXT STEPS') + 40, yPos, 200, yPos);
    
    // Recommendations with icon bullets
    yPos += 15;
    
    const recommendations = [
      'Continue focusing on laboratory experiments to maintain practical skills',
      'Review theoretical concepts in chemistry to improve understanding',
      'Participate more actively in group discussions and collaborative projects',
      'Consider taking the advanced placement test for physics given strong performance'
    ];
    
    // Recommendations container
    drawRoundedRect(10, yPos, pageWidth - 20, recommendations.length * 15 + 10, 5, '#F5F3FF');
    
    recommendations.forEach((rec, index) => {
      const recY = yPos + 15 + (index * 15);
      
      // Bullet point
      pdf.setFillColor(...hexToRGB('#7C3AED'));
      pdf.circle(20, recY - 3, 2, 'F');
      
      // Recommendation text
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(79, 70, 229); // #4F46E5
      pdf.text(rec, 25, recY);
    });

    // FOOTER
    const footerY = pageHeight - 20;
    
    // Footer background
    drawColoredRect(0, footerY, pageWidth, 20, '#F9FAFB');
    drawColoredRect(0, footerY, pageWidth, 1, '#E5E7EB');
    
    // Footer content
    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128); // #6B7280
    pdf.setFont('helvetica', 'normal');
    pdf.text('OLabs Analytics Platform | Science Education Excellence', 10, footerY + 10);
    
    // Page number
    pdf.text(`Report ID: ${Date.now()} | Page 1 of 1`, pageWidth - 10, footerY + 10, { align: 'right' });
    
    // Digital signature placeholder
    pdf.setFontSize(7);
    pdf.text('Digitally generated report - No signature required', pageWidth / 2, footerY + 15, { align: 'center' });

    // Save PDF with professional filename
    const formattedDate = new Date().toISOString().split('T')[0];
    pdf.save(`${student?.name.replace(/\s+/g, '_')}_Academic_Report_${formattedDate}.pdf`);

    toast({
      title: "Report Generated",
      description: "Professional academic performance report has been downloaded",
    });
  };

  const currentStudent = studentDetails[Number(selectedStudent) as keyof typeof studentDetails];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 p-4 md:p-8"
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8 backdrop-blur-sm bg-white/30 p-6 rounded-xl shadow-lg border border-white/50">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Student Analytics Dashboard
            </h1>
            <p className="text-gray-700 text-sm md:text-base flex items-center">
              <GraduationCap className="mr-2 h-5 w-5 text-indigo-500" />
              Track individual student performance and engagement metrics
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleDownloadReport}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300 w-full md:w-auto"
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
          className="backdrop-blur-sm bg-white/30 p-6 rounded-xl shadow-lg border border-white/50"
        >
          <Tabs defaultValue="9" value={selectedGrade} onValueChange={setSelectedGrade} className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <Users className="h-6 w-6 mr-2 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">Select Grade Level</h2>
              </div>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-[400px] bg-white/50 backdrop-blur-sm rounded-lg">
                <TabsTrigger value="9" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                  Grade 9
                </TabsTrigger>
                <TabsTrigger value="10" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                  Grade 10
                </TabsTrigger>
                <TabsTrigger value="11" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                  Grade 11
                </TabsTrigger>
                <TabsTrigger value="12" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                  Grade 12
                </TabsTrigger>
              </TabsList>
            </div>
            
            <AnimatePresence mode="wait">
              {Object.entries(students).map(([grade, gradeStudents]) => (
                <TabsContent key={grade} value={grade}>
                  <Card className="backdrop-blur-sm bg-white/50 border border-white/20 shadow-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/20">
                      <CardTitle className="text-xl text-gray-800 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-purple-600" />
                        Grade {grade} Students
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Select value={selectedStudent} onValueChange={handleStudentChange}>
                        <SelectTrigger className="w-full md:w-[280px] bg-white border border-indigo-100 hover:border-indigo-300 transition-colors">
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-indigo-100">
                          {gradeStudents.map((student) => (
                            <SelectItem key={student.id} value={student.id.toString()} className="hover:bg-indigo-50">
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
                    className="overflow-hidden"
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:shadow-xl backdrop-blur-sm border border-white/20 h-full ${
                        selectedSubject === subject 
                          ? 'ring-2 ring-purple-500 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50' 
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                      onClick={() => handleSubjectClick(subject)}
                    >
                      <CardHeader className={`pb-2 ${selectedSubject === subject ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20' : ''}`}>
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase flex items-center">
                          {subject === 'physics' && <Activity className="h-4 w-4 mr-1 text-indigo-600" />}
                          {subject === 'chemistry' && <BookOpen className="h-4 w-4 mr-1 text-indigo-600" />}
                          {subject === 'biology' && <Award className="h-4 w-4 mr-1 text-indigo-600" />}
                          {subject}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {data.grade}
                        </div>
                        <p className="text-gray-700 text-sm mt-1 flex items-center">
                          <BarChart3 className="h-3 w-3 mr-1 text-indigo-500" />
                          Progress: {data.progress}%
                        </p>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full rounded-full ${
                              subject === 'physics' 
                                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' 
                                : subject === 'chemistry' 
                                ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
                                : 'bg-gradient-to-r from-blue-500 to-blue-600'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${data.progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                        <p className="text-indigo-600 text-sm mt-2 flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          Experiments: {data.experiments}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <Card className="col-span-1 lg:col-span-2 backdrop-blur-sm bg-white/50 border border-white/20 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/20">
                    <CardTitle className="text-xl text-gray-800 flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-purple-600" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {currentStudent.recentActivity.map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/70 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 gap-2 md:gap-4 border border-indigo-50"
                        >
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                              index === 0 
                                ? 'bg-indigo-100 text-indigo-600' 
                                : index === 1 
                                ? 'bg-purple-100 text-purple-600' 
                                : 'bg-blue-100 text-blue-600'
                            }`}>
                              {index === 0 && <Activity className="h-5 w-5" />}
                              {index === 1 && <BookOpen className="h-5 w-5" />}
                              {index === 2 && <Award className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{activity.experiment}</p>
                              <p className="text-sm text-gray-500">{activity.date}</p>
                            </div>
                          </div>
                          <div className={`text-lg font-semibold px-4 py-1 rounded-full ${
                            activity.score >= 90 ? 'bg-green-100 text-green-600 border border-green-200' :
                            activity.score >= 75 ? 'bg-blue-100 text-blue-600 border border-blue-200' :
                            'bg-red-100 text-red-600 border border-red-200'
                          }`}>
                            {activity.score}%
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/50 border border-white/20 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/20">
                    <CardTitle className="text-xl text-gray-800 flex items-center">
                      <LineChartIcon className="h-5 w-5 mr-2 text-purple-600" />
                      Subject Performance Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] p-6" ref={chartRefs.performance}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={studentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                        <XAxis dataKey="month" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'rgba(255,255,255,0.9)', 
                            borderRadius: '8px', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(148,163,184,0.2)'
                          }} 
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="physics" 
                          stroke="#8b5cf6" 
                          strokeWidth={3}
                          dot={{ fill: '#8b5cf6', r: 4 }}
                          activeDot={{ r: 6, fill: '#8b5cf6', stroke: 'white', strokeWidth: 2 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="chemistry" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', r: 4 }}
                          activeDot={{ r: 6, fill: '#3b82f6', stroke: 'white', strokeWidth: 2 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="biology" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          dot={{ fill: '#10b981', r: 4 }}
                          activeDot={{ r: 6, fill: '#10b981', stroke: 'white', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/50 border border-white/20 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/20">
                    <CardTitle className="text-xl text-gray-800 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                      Monthly Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] p-6" ref={chartRefs.engagement}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={studentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                        <XAxis dataKey="month" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'rgba(255,255,255,0.9)', 
                            borderRadius: '8px', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(148,163,184,0.2)'
                          }} 
                        />
                        <Legend />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey={selectedSubject}
                          stroke="#8b5cf6"
                          strokeWidth={3}
                          fill="url(#colorGradient)"
                          activeDot={{ r: 6, fill: '#8b5cf6', stroke: 'white', strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/50 border border-white/20 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/20">
                    <CardTitle className="text-xl text-gray-800 flex items-center">
                      <PieChartIcon className="h-5 w-5 mr-2 text-purple-600" />
                      Skills Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] p-6" ref={chartRefs.skills}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} data={skillsData}>
                        <PolarGrid stroke="rgba(0,0,0,0.1)" />
                        <PolarAngleAxis dataKey="subject" stroke="#666" tick={{ fill: '#4b5563', fontSize: 12 }} />
                        <PolarRadiusAxis stroke="#666" />
                        <Radar 
                          name="Current" 
                          dataKey="A" 
                          stroke="#8b5cf6" 
                          fill="#8b5cf6" 
                          fillOpacity={0.5}
                          strokeWidth={2}
                        />
                        <Radar 
                          name="Target" 
                          dataKey="B" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.4}
                          strokeWidth={2}
                        />
                        <Legend 
                          iconType="circle"
                          wrapperStyle={{
                            paddingTop: '10px'
                          }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'rgba(255,255,255,0.9)', 
                            borderRadius: '8px', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(148,163,184,0.2)'
                          }} 
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/50 border border-white/20 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/20">
                    <CardTitle className="text-xl text-gray-800 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                      Subject-wise Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] p-6" ref={chartRefs.progress}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={studentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                        <XAxis dataKey="month" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'rgba(255,255,255,0.9)', 
                            borderRadius: '8px', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(148,163,184,0.2)'
                          }} 
                        />
                        <Legend 
                          iconType="circle"
                          wrapperStyle={{
                            paddingTop: '10px'
                          }}
                        />
                        <Bar 
                          dataKey="physics" 
                          fill="#8b5cf6"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="chemistry" 
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="biology" 
                          fill="#10b981"
                          radius={[4, 4, 0, 0]}
                        />
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
