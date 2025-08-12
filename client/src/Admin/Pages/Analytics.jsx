import { useEffect, useState } from "react";
import {  
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import axios from "axios";

const COLORS = ["#0088FE", "#FF8042"];

// Sample data with 12 months to demonstrate
// const sampleBlogData = [
//   { name: "Jan", posts: 25 },
//   { name: "Feb", posts: 30 },
//   { name: "Mar", posts: 45 },
//   { name: "Apr", posts: 35 },
//   { name: "May", posts: 55 },
//   { name: "Jun", posts: 40 },
//   { name: "Jul", posts: 65 },
//   { name: "Aug", posts: 50 },
//   { name: "Sep", posts: 42 },
//   { name: "Oct", posts: 38 },
//   { name: "Nov", posts: 48 },
//   { name: "Dec", posts: 52 }
// ];
// const sampleBlogData1 = [
//   { name: "Jan", posts: 25 },
//   { name: "Feb", posts: 30 },
//   { name: "Mar", posts: 45 },
//   { name: "Apr", posts: 35 },
//   { name: "May", posts: 55 },
//   { name: "Jun", posts: 40 }
// ];

export default function Analytics() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [roleData, setRoleData] = useState([]);
  // const [BlogData, setBlogData] = useState(sampleBlogData); // Using sample data
  const [BlogData, setBlogData] = useState([]); // Using real data
  const [viewType, setViewType] = useState('bar'); // 'bar' or 'line'

  useEffect(() => {
    axios.get(`${apiUrl}/api/User/analytics/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setRoleData(res.data.data);
    })
    .catch(err => console.log("Error loading role data"));

    // Uncomment this when you want to use real data
     axios.get(`${apiUrl}/api/Blog/analytics/blogs`, {
       headers: { Authorization: `Bearer ${token}` },
     })
     .then((res) => {
       setBlogData(res.data.data);
     })
     .catch(err => console.log("Error loading blog data"));
  }, []);

  // Function to format month names based on data length
  const formatXAxisLabel = (tickItem) => {
    if (BlogData.length > 8) {
      // Show abbreviated month names for many months
      return tickItem.substring(0, 3);
    }
    return tickItem;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-gray-400">Overview of users and blog statistics</p>
      </div>

      {/* Charts Container */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Pie Chart Container */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Users by Role</h2>
            <p className="text-gray-400 text-sm">Distribution of user roles in the system</p>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={roleData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#aeb5c2ff", 
                  border: "1px solid #4B5563",
                  borderRadius: "6px",
                  color: "#F3F4F6"
                }} 
              />
              <Legend wrapperStyle={{ color: "#D1D5DB" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Blog Chart Container - Now Adaptive */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Monthly Posts</h2>
              <p className="text-gray-400 text-sm">
                {BlogData.length} months of blog posting activity
              </p>
            </div>
            
            {/* Chart Type Toggle */}
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewType('bar')}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  viewType === 'bar' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Bar
              </button>
              <button
                onClick={() => setViewType('line')}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  viewType === 'line' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Line
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            {viewType === 'bar' ? (
              <BarChart 
                data={BlogData} 
                margin={{ 
                  top: 20, 
                  right: 30, 
                  left: 20, 
                  bottom: BlogData.length > 6 ? 45 : 25 
                }}
              >
                <XAxis 
                  dataKey="name" 
                  stroke="#D1D5DB" 
                  fontSize={BlogData.length > 8 ? 10 : 12}
                  tick={{ fill: '#D1D5DB' }}
                  angle={BlogData.length > 6 ? -45 : 0}
                  textAnchor={BlogData.length > 6 ? 'end' : 'middle'}
                  height={BlogData.length > 6 ? 60 : 30}
                  interval={0} // Show all labels
                  tickFormatter={formatXAxisLabel}
                />
                <YAxis 
                  stroke="#D1D5DB" 
                  fontSize={12}
                  tick={{ fill: '#D1D5DB' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#374151", 
                    border: "1px solid #4B5563",
                    borderRadius: "6px",
                    color: "#F3F4F6"
                  }}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend wrapperStyle={{ color: "#D1D5DB" }} />
                <Bar 
                  dataKey="posts" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  minPointSize={2}
                />
              </BarChart>
            ) : (
              <LineChart 
                data={BlogData}
                margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
              >
                <XAxis 
                  dataKey="name" 
                  stroke="#D1D5DB" 
                  fontSize={12}
                  tick={{ fill: '#D1D5DB' }}
                />
                <YAxis 
                  stroke="#D1D5DB" 
                  fontSize={12}
                  tick={{ fill: '#D1D5DB' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#374151", 
                    border: "1px solid #4B5563",
                    borderRadius: "6px",
                    color: "#F3F4F6"
                  }}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend wrapperStyle={{ color: "#D1D5DB" }} />
                <Line 
                  type="monotone" 
                  dataKey="posts" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>

          {/* Data Summary */}
          <div className="mt-4 flex justify-between text-sm text-gray-400">
            <span>Total Posts: {BlogData.reduce((sum, item) => sum + item.posts, 0)}</span>
            <span>Avg per Month: {Math.round(BlogData.reduce((sum, item) => sum + item.posts, 0) / BlogData.length)}</span>
            <span>Peak: {Math.max(...BlogData.map(item => item.posts))}</span>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white">Total Users</h3>
          <p className="text-2xl font-bold text-blue-400">
            {roleData.reduce((sum, item) => sum + item.value, 0)}
          </p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibent text-white">Total Posts</h3>
          <p className="text-2xl font-bold text-green-400">
            {BlogData.reduce((sum, item) => sum + item.posts, 0)}
          </p>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white">Best Month</h3>
          <p className="text-2xl font-bold text-purple-400">
            {BlogData.find(item => item.posts === Math.max(...BlogData.map(i => i.posts)))?.name || 'N/A'}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white">Growth Trend</h3>
          <p className="text-2xl font-bold text-yellow-400">
            {BlogData.length > 1 && BlogData[BlogData.length - 1].posts > BlogData[0].posts ? '↗️' : '↘️'}
          </p>
        </div>
      </div>
    </div>
  );
}