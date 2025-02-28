
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

    const student = students[selectedGrade as keyof typeof students].find(s => s.id.toString() === selectedStudent);
    if (!student) return;
    
    // Initialize the PDF document with professional settings
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Set document properties for metadata
    pdf.setProperties({
      title: `OLabs Scientific Performance Report - ${student.name}`,
      subject: 'Student Performance Analysis and Scientific Proficiency Assessment',
      author: 'OLabs Educational Platform',
      keywords: 'education, science, performance, analytics, laboratory, experiments',
      creator: 'OLabs Analytics System v2.1'
    });
    
    // Get document dimensions for responsive layouts
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Helper functions for advanced PDF generation
    const drawRect = (x: number, y: number, w: number, h: number, color: string, radius = 0) => {
      pdf.setFillColor(hexToRgb(color).r, hexToRgb(color).g, hexToRgb(color).b);
      if (radius > 0) {
        // Draw rounded rectangle
        pdf.roundedRect(x, y, w, h, radius, 'F');
      } else {
        pdf.rect(x, y, w, h, 'F');
      }
    };
    
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };
    
    // Define professional color schemes based on OLabs branding
    const colors = {
      primary: '#0747A6',         // Deep blue for headers - OLabs primary
      secondary: '#0065FF',       // Bright blue for highlights
      tertiary: '#00B8D9',        // Teal for accents
      quaternary: '#6554C0',      // Purple for scientific elements
      background: '#FFFFFF',      // White for background
      lightBg: '#F4F5F7',         // Light gray for alternate sections
      text: '#172B4D',            // Dark blue-gray for main text
      subtext: '#5E6C84',         // Medium gray for secondary text
      success: '#36B37E',         // Green for positive indicators
      warning: '#FFAB00',         // Amber for moderate indicators
      danger: '#FF5630',          // Red for negative indicators
      border: '#DFE1E6',          // Light gray for borders
      physics: '#6554C0',         // Purple for physics
      chemistry: '#00B8D9',       // Teal for chemistry
      biology: '#36B37E',         // Green for biology
    };
    
    // Define typography system for consistent text styling
    const fonts = {
      heading: {
        size: 16,
        style: 'bold',
        font: 'helvetica',
      },
      subheading: {
        size: 12,
        style: 'bold',
        font: 'helvetica',
      },
      normal: {
        size: 10,
        style: 'normal',
        font: 'helvetica',
      },
      small: {
        size: 8,
        style: 'normal',
        font: 'helvetica',
      },
      tiny: {
        size: 6,
        style: 'normal',
        font: 'helvetica',
      }
    };
    
    // Set text styling function for typography consistency
    const setTextStyle = (style: any) => {
      pdf.setFont(style.font, style.style);
      pdf.setFontSize(style.size);
    };
    
    // Create professional header with OLabs branding
    // Draw blue gradient header
    const headerHeight = 35;
    
    // Create a smoother gradient with more steps
    const gradientColors = [
      colors.primary, 
      '#1755B4', 
      '#2864C2', 
      '#3973D0', 
      '#4A82DE', 
      colors.secondary
    ];
    
    gradientColors.forEach((color, index, array) => {
      const segmentHeight = headerHeight / array.length;
      const y = index * segmentHeight;
      drawRect(0, y, pageWidth, segmentHeight, color);
    });
    
    // Add OLabs logo placeholder in a white circle
    const logoSize = 20;
    const logoX = 10;
    const logoY = 7.5;
    
    // White circle background for logo
    drawRect(logoX, logoY, logoSize, logoSize, '#FFFFFF', 10);
    
    // Add "OL" text as logo placeholder - in production this would be an actual logo
    setTextStyle({...fonts.heading, size: 12});
    pdf.setTextColor(hexToRgb(colors.primary).r, hexToRgb(colors.primary).g, hexToRgb(colors.primary).b);
    pdf.text('OL', logoX + 5, logoY + 13, { align: 'center' });
    
    // Add report title with professional styling
    setTextStyle(fonts.heading);
    pdf.setTextColor(255, 255, 255);
    pdf.text('OLABS SCIENTIFIC PERFORMANCE REPORT', pageWidth / 2, 15, { align: 'center' });
    
    // Add professional tagline
    setTextStyle(fonts.normal);
    pdf.text('Advancing Science Education Through Interactive Experimentation', pageWidth / 2, 22, { align: 'center' });
    
    // Add document timestamp with ISO format
    setTextStyle(fonts.small);
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    pdf.text(`Generated: ${currentDate}`, pageWidth - 15, 30, { align: 'right' });
    
    // STUDENT PROFILE SECTION
    let yPos = headerHeight + 10;
    
    // Section heading with professional styling
    setTextStyle(fonts.subheading);
    pdf.setTextColor(hexToRgb(colors.primary).r, hexToRgb(colors.primary).g, hexToRgb(colors.primary).b);
    pdf.text('STUDENT PROFILE', 10, yPos);
    
    // Professional separator line
    pdf.setDrawColor(hexToRgb(colors.tertiary).r, hexToRgb(colors.tertiary).g, hexToRgb(colors.tertiary).b);
    pdf.setLineWidth(0.5);
    pdf.line(10, yPos + 2, pageWidth - 10, yPos + 2);
    
    yPos += 10;
    
    // Student info card with professional styling
    drawRect(10, yPos, pageWidth - 20, 25, colors.lightBg, 5);
    
    // Student information with consistent layout
    setTextStyle(fonts.normal);
    pdf.setTextColor(hexToRgb(colors.text).r, hexToRgb(colors.text).g, hexToRgb(colors.text).b);
    
    // First column
    pdf.text(`Name: ${student.name}`, 15, yPos + 8);
    pdf.text(`Grade: ${student.grade}`, 15, yPos + 16);
    
    // Second column
    pdf.text(`Section: ${student.section}`, 75, yPos + 8);
    pdf.text(`Academic Year: 2023-2024`, 75, yPos + 16);
    
    // Third column - with highlight badges
    pdf.text(`Overall Grade:`, 150, yPos + 8);
    // Grade badge
    drawRect(178, yPos + 4, 12, 7, colors.success, 3);
    pdf.setTextColor(255, 255, 255);
    pdf.text(currentStudentData.overallGrade, 184, yPos + 8, { align: 'center' });
    
    // Attendance with visual indicator
    pdf.setTextColor(hexToRgb(colors.text).r, hexToRgb(colors.text).g, hexToRgb(colors.text).b);
    pdf.text(`Attendance:`, 150, yPos + 16);
    
    // Attendance indicator
    const attendanceColor = currentStudentData.attendance > 90 ? colors.success : 
                           currentStudentData.attendance > 75 ? colors.warning : colors.danger;
    drawRect(178, yPos + 12, 17, 7, attendanceColor, 3);
    pdf.setTextColor(255, 255, 255);
    pdf.text(`${currentStudentData.attendance}%`, 187, yPos + 16, { align: 'center' });
    
    yPos += 35;
    
    // PERFORMANCE SUMMARY
    setTextStyle(fonts.subheading);
    pdf.setTextColor(hexToRgb(colors.primary).r, hexToRgb(colors.primary).g, hexToRgb(colors.primary).b);
    pdf.text('PERFORMANCE SUMMARY', 10, yPos);
    
    // Professional separator
    pdf.setDrawColor(hexToRgb(colors.tertiary).r, hexToRgb(colors.tertiary).g, hexToRgb(colors.tertiary).b);
    pdf.line(10, yPos + 2, pageWidth - 10, yPos + 2);
    
    yPos += 10;
    
    // Summary text with professional formatting
    setTextStyle(fonts.normal);
    pdf.setTextColor(hexToRgb(colors.text).r, hexToRgb(colors.text).g, hexToRgb(colors.text).b);
    
    const overallProgress = Object.values(currentStudentData.subjects).reduce(
      (sum, subject) => sum + subject.progress, 0
    ) / Object.values(currentStudentData.subjects).length;
    
    const totalExperiments = Object.values(currentStudentData.subjects).reduce(
      (sum, subject) => sum + subject.experiments, 0
    );
    
    // Professional summary paragraph
    pdf.text(`${student.name} demonstrates ${overallProgress >= 90 ? 'excellent' : overallProgress >= 80 ? 'strong' : 'satisfactory'} proficiency across all scientific disciplines with an overall performance level of ${overallProgress.toFixed(1)}%. The student has successfully completed ${totalExperiments} laboratory experiments this academic year, showing particular strength in ${getStrongestSubject(currentStudentData.subjects)}.`, 15, yPos, {
      maxWidth: pageWidth - 30,
      align: 'justify'
    });
    
    yPos += 15;
    
    // Helper function to find strongest subject
    function getStrongestSubject(subjects: any) {
      return Object.entries(subjects).reduce((max, [subject, data]) => {
        return (data as any).progress > (subjects[max] as any).progress ? subject : max;
      }, Object.keys(subjects)[0]);
    }
    
    // KEY PERFORMANCE INDICATORS
    setTextStyle(fonts.subheading);
    pdf.setTextColor(hexToRgb(colors.primary).r, hexToRgb(colors.primary).g, hexToRgb(colors.primary).b);
    pdf.text('KEY PERFORMANCE INDICATORS', 10, yPos);
    
    // Professional separator
    pdf.setDrawColor(hexToRgb(colors.tertiary).r, hexToRgb(colors.tertiary).g, hexToRgb(colors.tertiary).b);
    pdf.line(10, yPos + 2, pageWidth - 10, yPos + 2);
    
    yPos += 10;
    
    // Subject performance indicators with professional styling
    const subjects = Object.entries(currentStudentData.subjects);
    const subjectColors = {
      physics: colors.physics,
      chemistry: colors.chemistry,
      biology: colors.biology
    };
    
    subjects.forEach(([subject, data], index) => {
      const barHeight = 12;
      const barWidth = (pageWidth - 70) * 0.8;
      const barY = yPos + (index * 20);
      
      // Subject label with icons
      setTextStyle(fonts.normal);
      pdf.setTextColor(hexToRgb(colors.text).r, hexToRgb(colors.text).g, hexToRgb(colors.text).b);
      
      // Draw subject icon placeholder
      const iconSize = 7;
      drawRect(15, barY + 0.5, iconSize, iconSize, subjectColors[subject as keyof typeof subjectColors], 2);
      pdf.text(subject.charAt(0).toUpperCase() + subject.slice(1), 25, barY + 5);
      
      // Background bar (light gray)
      drawRect(50, barY, barWidth, barHeight, colors.border, 3);
      
      // Progress bar with professional styling
      const progressWidth = (data.progress / 100) * barWidth;
      drawRect(50, barY, progressWidth, barHeight, subjectColors[subject as keyof typeof subjectColors], 3);
      
      // Percentage text
      setTextStyle(fonts.small);
      pdf.setTextColor(255, 255, 255);
      if (progressWidth > 20) {
        pdf.text(`${data.progress}%`, 55, barY + 8);
      }
      
      // Grade badge with professional styling
      const gradeX = 50 + barWidth + 10;
      drawRect(gradeX, barY, 15, barHeight, subjectColors[subject as keyof typeof subjectColors], 3);
      pdf.text(data.grade, gradeX + 7.5, barY + 8, { align: 'center' });
      
      // Experiments count with icon
      pdf.setTextColor(hexToRgb(colors.subtext).r, hexToRgb(colors.subtext).g, hexToRgb(colors.subtext).b);
      
      // Draw beaker icon placeholder
      const beakerX = gradeX + 20;
      const beakerSize = 5;
      drawRect(beakerX, barY + 3.5, beakerSize, beakerSize, colors.subtext, 1);
      
      pdf.text(`${data.experiments} experiments completed`, beakerX + 7, barY + 8);
    });
    
    yPos += subjects.length * 20 + 10;
    
    // MONTHLY PERFORMANCE TRENDS
    setTextStyle(fonts.subheading);
    pdf.setTextColor(hexToRgb(colors.primary).r, hexToRgb(colors.primary).g, hexToRgb(colors.primary).b);
    pdf.text('MONTHLY PERFORMANCE TRENDS', 10, yPos);
    
    // Professional separator
    pdf.setDrawColor(hexToRgb(colors.tertiary).r, hexToRgb(colors.tertiary).g, hexToRgb(colors.tertiary).b);
    pdf.line(10, yPos + 2, pageWidth - 10, yPos + 2);
    
    yPos += 10;
    
    // Chart container with professional styling
    drawRect(10, yPos, pageWidth - 20, 60, colors.lightBg, 5);
    
    // Manually create a simple chart visualization
    const chartData = studentData.slice(-6);
    const chartWidth = pageWidth - 40;
    const chartHeight = 40;
    const barWidth = chartWidth / (chartData.length * 3 + 2);
    
    // Chart axes with professional styling
    pdf.setDrawColor(hexToRgb(colors.subtext).r, hexToRgb(colors.subtext).g, hexToRgb(colors.subtext).b);
    pdf.setLineWidth(0.5);
    
    // X and Y axes
    pdf.line(20, yPos + 50, 20 + chartWidth, yPos + 50); // X-axis
    pdf.line(20, yPos + 10, 20, yPos + 50); // Y-axis
    
    // Chart title and legend with professional styling
    setTextStyle(fonts.small);
    pdf.setTextColor(hexToRgb(colors.text).r, hexToRgb(colors.text).g, hexToRgb(colors.text).b);
    
    // Draw professional legend
    const legendColors = [colors.physics, colors.chemistry, colors.biology];
    const legendLabels = ['Physics', 'Chemistry', 'Biology'];
    
    // Add horizontal gridlines for better readability
    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.2);
    for (let i = 0; i <= 4; i++) {
      const yLevel = yPos + 50 - (i * 10);
      pdf.setLineDashPattern([1, 1], 0);
      pdf.line(20, yLevel, 20 + chartWidth, yLevel);
      
      // Add value labels on Y-axis
      pdf.setTextColor(hexToRgb(colors.subtext).r, hexToRgb(colors.subtext).g, hexToRgb(colors.subtext).b);
      pdf.text(`${70 + i*10}`, 15, yLevel, { align: 'right' });
    }
    pdf.setLineDashPattern([], 0);
    
    // Professional legend with colored boxes
    legendLabels.forEach((label, index) => {
      const legendX = 30 + (index * 50);
      const colorBoxSize = 5;
      drawRect(legendX, yPos + 5, colorBoxSize, colorBoxSize, legendColors[index]);
      pdf.text(label, legendX + colorBoxSize + 3, yPos + 9);
    });
    
    // Draw bars with professional styling
    chartData.forEach((data, monthIndex) => {
      const monthX = 20 + (monthIndex * ((chartWidth) / chartData.length));
      
      // Month label below X-axis with professional styling
      pdf.setTextColor(hexToRgb(colors.text).r, hexToRgb(colors.text).g, hexToRgb(colors.text).b);
      pdf.text(data.month, monthX + (chartWidth / chartData.length / 2), yPos + 55, { align: 'center' });
      
      // Subject bars
      const subjectKeys = ['physics', 'chemistry', 'biology'];
      
      subjectKeys.forEach((subject, subjectIndex) => {
        const value = data[subject as keyof typeof data] as number; // Fixed error TS2362 - explicit cast to number
        const normalizedValue = (value - 70) / 30 * chartHeight; // Scale values between 70-100
        const barX = monthX + (subjectIndex * barWidth) + 5;
        
        // Draw professional styled bars
        drawRect(barX, yPos + 50 - normalizedValue, barWidth - 2, normalizedValue, legendColors[subjectIndex], 2);
        
        // Add data point values above bars
        setTextStyle(fonts.tiny);
        pdf.setTextColor(hexToRgb(colors.text).r, hexToRgb(colors.text).g, hexToRgb(colors.text).b);
        pdf.text(value.toString(), barX + (barWidth-2)/2, yPos + 47 - normalizedValue, { align: 'center' });
      });
    });
    
    yPos += 70;
    
    // RECENT LABORATORY ACTIVITIES - Professional section
    setTextStyle(fonts.subheading);
    pdf.setTextColor(hexToRgb(colors.primary).r, hexToRgb(colors.primary).g, hexToRgb(colors.primary).b);
    pdf.text('RECENT LABORATORY ACTIVITIES', 10, yPos);
    
    // Professional separator
    pdf.setDrawColor(hexToRgb(colors.tertiary).r, hexToRgb(colors.tertiary).g, hexToRgb(colors.tertiary).b);
    pdf.line(10, yPos + 2, pageWidth - 10, yPos + 2);
    
    yPos += 10;
    
    // Activities table with professional styling
    const activities = currentStudentData.recentActivity;
    
    // Table headers with professional styling
    const colWidths = [40, pageWidth - 90, 30];
    const rowHeight = 10;
    
    // Header row with professional gradient
    pdf.setFillColor(hexToRgb(colors.primary).r, hexToRgb(colors.primary).g, hexToRgb(colors.primary).b);
    pdf.rect(10, yPos, pageWidth - 20, rowHeight, 'F');
    
    setTextStyle(fonts.small);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Date', 15, yPos + 7);
    pdf.text('Experiment', 55, yPos + 7);
    pdf.text('Score', pageWidth - 25, yPos + 7, { align: 'center' });
    
    yPos += rowHeight;
    
    // Activity rows with alternating colors for readability
    activities.forEach((activity, index) => {
      const isAlternate = index % 2 === 0;
      drawRect(10, yPos, pageWidth - 20, rowHeight, isAlternate ? colors.lightBg : colors.background);
      
      pdf.setTextColor(hexToRgb(colors.text).r, hexToRgb(colors.text).g, hexToRgb(colors.text).b);
      
      // Format date in professional style
      const formattedDate = new Date(activity.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      pdf.text(formattedDate, 15, yPos + 7);
      
      // Add experiment icons next to names
      const experimentType = activity.experiment.toLowerCase();
      let iconColor = colors.primary;
      
      if (experimentType.includes("acid") || experimentType.includes("titration") || experimentType.includes("chemical"))
        iconColor = colors.chemistry;
      else if (experimentType.includes("photo") || experimentType.includes("cell") || experimentType.includes("plant"))
        iconColor = colors.biology;
      else if (experimentType.includes("ohm") || experimentType.includes("force") || experimentType.includes("motion"))
        iconColor = colors.physics;
      
      // Draw small experiment icon placeholder
      const iconSize = 5;
      drawRect(55, yPos + 2, iconSize, iconSize, iconColor, 1);
      
      pdf.text(activity.experiment, 62, yPos + 7);
      
      // Score with color-coded badge
      let scoreColor = colors.success;
      if (activity.score < 85) scoreColor = colors.warning;
      if (activity.score < 70) scoreColor = colors.danger;
      
      drawRect(pageWidth - 35, yPos + 1, 20, rowHeight - 2, scoreColor, 3);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`${activity.score}%`, pageWidth - 25, yPos + 7, { align: 'center' });
      
      yPos += rowHeight;
    });
    
    yPos += 10;
    
    // RECOMMENDATIONS SECTION
    setTextStyle(fonts.subheading);
    pdf.setTextColor(hexToRgb(colors.primary).r, hexToRgb(colors.primary).g, hexToRgb(colors.primary).b);
    pdf.text('RECOMMENDATIONS & NEXT STEPS', 10, yPos);
    
    // Professional separator
    pdf.setDrawColor(hexToRgb(colors.tertiary).r, hexToRgb(colors.tertiary).g, hexToRgb(colors.tertiary).b);
    pdf.line(10, yPos + 2, pageWidth - 10, yPos + 2);
    
    yPos += 10;
    
    // Recommendations box with professional styling
    drawRect(10, yPos, pageWidth - 20, 40, colors.lightBg, 5);
    
    setTextStyle(fonts.normal);
    pdf.setTextColor(hexToRgb(colors.text).r, hexToRgb(colors.text).g, hexToRgb(colors.text).b);
    
    // Personalized recommendations based on student data
    const strongestSubject = getStrongestSubject(currentStudentData.subjects);
    const weakestSubject = Object.entries(currentStudentData.subjects).reduce((min, [subject, data]) => {
      return (data as any).progress < (currentStudentData.subjects[min] as any).progress ? subject : min;
    }, Object.keys(currentStudentData.subjects)[0]);
    
    const recommendations = [
      `Continue excellent work in ${strongestSubject} with advanced experiments`,
      `Focus additional time on ${weakestSubject} concepts and laboratory work`,
      `Complete the remaining experiments in all scientific modules`,
      `Consider joining the upcoming science competition to showcase skills`
    ];
    
    recommendations.forEach((rec, index) => {
      // Draw bullet points with colored circles
      const bulletX = 15;
      const bulletY = yPos + 10 + (index * 8);
      const bulletSize = 3;
      
      // Alternating colors for bullet points
      const bulletColors = [colors.physics, colors.chemistry, colors.biology, colors.quaternary];
      drawRect(bulletX, bulletY - 2, bulletSize, bulletSize, bulletColors[index % bulletColors.length], 1.5);
      
      pdf.text(`${rec}`, bulletX + 5, bulletY);
    });
    
    yPos += 50;
    
    // SKILLS ASSESSMENT SUMMARY
    setTextStyle(fonts.subheading);
    pdf.setTextColor(hexToRgb(colors.primary).r, hexToRgb(colors.primary).g, hexToRgb(colors.primary).b);
    pdf.text('SKILLS ASSESSMENT', 10, yPos);
    
    // Professional separator
    pdf.setDrawColor(hexToRgb(colors.tertiary).r, hexToRgb(colors.tertiary).g, hexToRgb(colors.tertiary).b);
    pdf.line(10, yPos + 2, pageWidth - 10, yPos + 2);
    
    yPos += 10;
    
    // Simple skills visualization
    const skills = [
      { name: "Theoretical Knowledge", value: 85 },
      { name: "Practical Application", value: 92 },
      { name: "Laboratory Safety", value: 98 },
      { name: "Scientific Communication", value: 88 },
      { name: "Data Analysis", value: 90 }
    ];
    
    // Skills visualization with horizontal bars
    skills.forEach((skill, index) => {
      const skillY = yPos + (index * 12);
      
      // Skill name
      setTextStyle(fonts.small);
      pdf.setTextColor(hexToRgb(colors.text).r, hexToRgb(colors.text).g, hexToRgb(colors.text).b);
      pdf.text(skill.name, 15, skillY + 5);
      
      // Skill bar background
      const barX = 80;
      const barWidth = 80;
      const barHeight = 6;
      drawRect(barX, skillY, barWidth, barHeight, colors.border, 3);
      
      // Skill progress with gradient
      const progressWidth = (skill.value / 100) * barWidth;
      
      // Create gradient effect for skill bars
      const gradientSteps = 5;
      const stepWidth = progressWidth / gradientSteps;
      const baseColor = index % 2 === 0 ? colors.secondary : colors.quaternary;
      const endColor = index % 2 === 0 ? colors.tertiary : colors.physics;
      
      for (let step = 0; step < gradientSteps; step++) {
        // Calculate color for this segment of the gradient
        const ratio = step / (gradientSteps - 1);
        const r1 = hexToRgb(baseColor).r;
        const g1 = hexToRgb(baseColor).g;
        const b1 = hexToRgb(baseColor).b;
        const r2 = hexToRgb(endColor).r;
        const g2 = hexToRgb(endColor).g;
        const b2 = hexToRgb(endColor).b;
        
        const r = Math.round(r1 + (r2 - r1) * ratio);
        const g = Math.round(g1 + (g2 - g1) * ratio);
        const b = Math.round(b1 + (b2 - b1) * ratio);
        
        const gradientColor = `rgb(${r},${g},${b})`;
        
        // Draw this segment of the gradient bar
        pdf.setFillColor(r, g, b);
        
        if (step === gradientSteps - 1) {
          // Last segment gets rounded corners on right side
          // Fix error TS2345 - Convert string radius to number
          const rightRadius = 3; // Already a number, no conversion needed
          pdf.roundedRect(barX + (step * stepWidth), skillY, stepWidth, barHeight, rightRadius, 'F');
        } else if (step === 0) {
          // First segment gets rounded corners on left side
          // Fix error TS2345 - Convert string radius to number
          const leftRadius = 3; // Already a number, no conversion needed
          pdf.roundedRect(barX + (step * stepWidth), skillY, stepWidth, barHeight, leftRadius, 'F');
        } else {
          // Middle segments get no rounded corners
          pdf.rect(barX + (step * stepWidth), skillY, stepWidth, barHeight, 'F');
        }
      }
      
      // Skill percentage
      setTextStyle(fonts.small);
      pdf.setTextColor(hexToRgb(colors.text).r, hexToRgb(colors.text).g, hexToRgb(colors.text).b);
      pdf.text(`${skill.value}%`, barX + barWidth + 5, skillY + 5);
    });
    
    yPos += skills.length * 12 + 10;
    
    // FUTURE LEARNING PATHWAY
    setTextStyle(fonts.subheading);
    pdf.setTextColor(hexToRgb(colors.primary).r, hexToRgb(colors.primary).g, hexToRgb(colors.primary).b);
    pdf.text('FUTURE LEARNING PATHWAY', 10, yPos);
    
    // Professional separator
    pdf.setDrawColor(hexToRgb(colors.tertiary).r, hexToRgb(colors.tertiary).g, hexToRgb(colors.tertiary).b);
    pdf.line(10, yPos + 2, pageWidth - 10, yPos + 2);
    
    yPos += 10;
    
    // Learning pathway visualization
    const pathwayBoxWidth = (pageWidth - 40) / 3;
    const pathwayBoxHeight = 35;
    
    const pathways = [
      { title: "Core Concepts", content: "Complete remaining fundamental experiments in all science subjects", color: colors.physics },
      { title: "Advanced Applications", content: "Focus on cross-disciplinary experiments combining multiple science fields", color: colors.chemistry },
      { title: "Research Projects", content: "Design and execute original scientific investigations", color: colors.biology }
    ];
    
    pathways.forEach((pathway, index) => {
      const boxX = 10 + (index * (pathwayBoxWidth + 10));
      
      // Pathway box with gradient background
      drawRect(boxX, yPos, pathwayBoxWidth, pathwayBoxHeight, pathway.color, 5);
      
      // White transparent overlay for text area - Fix error TS2345 by using number
      // Original: pdf.roundedRect(boxX + 2, yPos + 2, pathwayBoxWidth - 4, pathwayBoxHeight - 4, 3, 'F');
      const cornerRadius = 3; // Explicitly define as number
      pdf.roundedRect(boxX + 2, yPos + 2, pathwayBoxWidth - 4, pathwayBoxHeight - 4, cornerRadius, 'F');
      
      // Pathway title
      setTextStyle(fonts.normal);
      pdf.setTextColor(hexToRgb(pathway.color).r, hexToRgb(pathway.color).g, hexToRgb(pathway.color).b);
      pdf.text(pathway.title, boxX + pathwayBoxWidth/2, yPos + 10, { align: 'center' });
      
      // Pathway content
      setTextStyle(fonts.small);
      pdf.setTextColor(hexToRgb(colors.text).r, hexToRgb(colors.text).g, hexToRgb(colors.text).b);
      pdf.text(pathway.content, boxX + 5, yPos + 18, { maxWidth: pathwayBoxWidth - 10, align: 'center' });
      
      // Connection arrows between boxes (if not the last box)
      if (index < pathways.length - 1) {
        // Draw arrow
        const arrowX = boxX + pathwayBoxWidth;
        const arrowY = yPos + pathwayBoxHeight/2;
        
        pdf.setDrawColor(hexToRgb(colors.tertiary).r, hexToRgb(colors.tertiary).g, hexToRgb(colors.tertiary).b);
        pdf.setLineWidth(0.7);
        
        // Arrow line
        pdf.line(arrowX + 2, arrowY, arrowX + 8, arrowY);
        
        // Arrow head
        pdf.line(arrowX + 6, arrowY - 2, arrowX + 8, arrowY);
        pdf.line(arrowX + 6, arrowY + 2, arrowX + 8, arrowY);
      }
    });
    
    yPos += pathwayBoxHeight + 15;
    
    // Add professional footer
    const footerHeight = 18;
    
    // Footer gradient
    const footerGradientColors = gradientColors.slice().reverse();
    footerGradientColors.forEach((color, index, array) => {
      const segmentHeight = footerHeight / array.length;
      const y = pageHeight - footerHeight + (index * segmentHeight);
      drawRect(0, y, pageWidth, segmentHeight, color);
    });
    
    // Footer content
    setTextStyle(fonts.small);
    pdf.setTextColor(255, 255, 255);
    pdf.text('OLabs Educational Platform | Advancing Science Through Virtual Experimentation', pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Add page number and report ID
    const reportId = `OL-${Date.now().toString().slice(-8)}`;
    pdf.text(`Page 1 of 1 | Report ID: ${reportId}`, pageWidth - 15, pageHeight - 5, { align: 'right' });
    
    // Legal disclaimer
    setTextStyle(fonts.tiny);
    pdf.text('This report is generated based on student activity data in OLabs virtual experiments. © 2024 OLabs Educational Technologies', 15, pageHeight - 5);
    
    // QR code placeholder for digital verification
    const qrSize = 10;
    drawRect(10, pageHeight - footerHeight + 4, qrSize, qrSize, '#FFFFFF', 0);
    
    // Save the PDF with professionally named file
    const academicYear = '2023-2024';
    const fileName = `OLabs_${student.name.replace(/\s+/g, '_')}_Scientific_Report_${academicYear}.pdf`;
    pdf.save(fileName);
    
    toast({
      title: "Professional Report Generated",
      description: "Scientific performance report has been downloaded",
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

