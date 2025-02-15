import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, RadarChart, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell
} from 'recharts';

const StudentPerformanceDashboard = () => {
  // Mock student data
  const studentData = {
    name: "John Doe",
    id: "ST12345",
    class: "10th Grade",
    subjects: [
      {
        name: "Mathematics",
        marks: [85, 78, 92, 68, 88],
        tests: ["Quiz 1", "Mid-term", "Quiz 2", "Project", "Final"]
      },
      {
        name: "Science",
        marks: [75, 82, 79, 90, 85],
        tests: ["Quiz 1", "Mid-term", "Quiz 2", "Project", "Final"]
      },
      {
        name: "English",
        marks: [88, 90, 85, 92, 95],
        tests: ["Quiz 1", "Mid-term", "Quiz 2", "Project", "Final"]
      },
      {
        name: "History",
        marks: [70, 75, 68, 82, 78],
        tests: ["Quiz 1", "Mid-term", "Quiz 2", "Project", "Final"]
      },
      {
        name: "Computer Science",
        marks: [95, 90, 92, 88, 96],
        tests: ["Quiz 1", "Mid-term", "Quiz 2", "Project", "Final"]
      }
    ],
    attendance: 92,
    extracurricular: ["Debate Club", "Science Olympiad", "Basketball"]
  };

  // Calculate subject statistics
  const calculateStats = (subject) => {
    const sum = subject.marks.reduce((a, b) => a + b, 0);
    const avg = sum / subject.marks.length;
    const max = Math.max(...subject.marks);
    const min = Math.min(...subject.marks);
    
    return {
      name: subject.name,
      average: parseFloat(avg.toFixed(2)),
      maximum: max,
      minimum: min,
      total: sum,
      tests: subject.tests,
      marks: subject.marks
    };
  };

  const subjectStats = studentData.subjects.map(calculateStats);

  // Calculate overall average
  const overallMarks = studentData.subjects.flatMap(subject => subject.marks);
  const overallAverage = parseFloat((overallMarks.reduce((a, b) => a + b, 0) / overallMarks.length).toFixed(2));

  // Identify strengths and weaknesses
  const strengths = subjectStats
    .filter(subject => subject.average > overallAverage)
    .sort((a, b) => b.average - a.average)
    .map(subject => subject.name);

  const weaknesses = subjectStats
    .filter(subject => subject.average < overallAverage)
    .sort((a, b) => a.average - b.average)
    .map(subject => subject.name);

  // Analysis for improvement suggestions
  const improvementSuggestions = {};
  subjectStats.forEach(subject => {
    const lowestTestIndex = subject.marks.indexOf(subject.minimum);
    improvementSuggestions[subject.name] = {
      lowestTest: subject.tests[lowestTestIndex],
      lowestMark: subject.minimum,
      improvement: `Focus on improving ${subject.tests[lowestTestIndex]} performance in ${subject.name}`
    };
  });

  // Data for charts
  const subjectAveragesData = subjectStats.map(stat => ({
    name: stat.name,
    average: stat.average,
    className: stat.average > overallAverage ? 'above-average' : 'below-average'
  }));

  const subjectRangeData = subjectStats.map(stat => ({
    name: stat.name,
    minimum: stat.minimum,
    average: stat.average,
    maximum: stat.maximum
  }));

  const testPerformanceData = studentData.subjects[0].tests.map((test, index) => {
    const testData = { name: test };
    studentData.subjects.forEach(subject => {
      testData[subject.name] = subject.marks[index];
    });
    return testData;
  });

  const radarData = subjectStats.map(stat => ({
    subject: stat.name,
    score: stat.average
  }));

  const pieData = [
    { name: 'Above Average', value: strengths.length },
    { name: 'Below Average', value: weaknesses.length }
  ];

  const COLORS = ['#00C49F', '#FF8042'];

  // Prepare test comparison data
  const prepareTestData = () => {
    return studentData.subjects.map(subject => {
      const data = subject.tests.map((test, index) => ({
        name: test,
        mark: subject.marks[index]
      }));
      return { name: subject.name, data };
    });
  };

  const testData = prepareTestData();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{studentData.name}'s Performance Dashboard</h1>
          <p className="text-gray-600 mb-4">ID: {studentData.id} | Class: {studentData.class} | Attendance: {studentData.attendance}%</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800 mb-3">Strengths</h2>
              <ul className="list-disc pl-5">
                {strengths.map(subject => (
                  <li key={subject} className="text-blue-700">{subject}</li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-amber-800 mb-3">Areas for Improvement</h2>
              <ul className="list-disc pl-5">
                {weaknesses.map(subject => (
                  <li key={subject} className="text-amber-700">{subject}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Subject Performance Overview</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={subjectAveragesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="average" name="Average Score">
                    {subjectAveragesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.average > overallAverage ? '#4CAF50' : '#FF9800'} />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="average"
                    fill="none"
                    stroke="none"
                    strokeWidth={0}
                    name={`Overall Average: ${overallAverage}%`}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Score Range by Subject</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={subjectRangeData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="minimum"
                    name="Minimum Score"
                    stroke="#F44336"
                    strokeWidth={2}
                    dot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="average"
                    name="Average Score"
                    stroke="#673AB7"
                    strokeWidth={2}
                    dot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="maximum"
                    name="Maximum Score"
                    stroke="#2196F3"
                    strokeWidth={2}
                    dot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Subject Mastery</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Performance Distribution</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} subjects`, name]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Test Performance Comparison</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={testPerformanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  {studentData.subjects.map((subject) => (
                    <Bar
                      key={subject.name}
                      dataKey={subject.name}
                      name={subject.name}
                      fill={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Personalized Improvement Suggestions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(improvementSuggestions).map(subject => (
                <div key={subject} className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
                  <h3 className="text-lg font-medium text-indigo-800 mb-2">{subject}</h3>
                  <p className="text-indigo-700 mb-1">
                    <span className="font-medium">Lowest Score:</span> {improvementSuggestions[subject].lowestMark}% in {improvementSuggestions[subject].lowestTest}
                  </p>
                  <p className="text-indigo-700">{improvementSuggestions[subject].improvement}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Subject-wise Test Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testData.map((subject) => (
                <div key={subject.name} className="bg-white border rounded-lg shadow-sm p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">{subject.name}</h3>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={subject.data}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Line
                          type="monotone"
                          dataKey="mark"
                          stroke="#3F51B5"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformanceDashboard;
