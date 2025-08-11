import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from "recharts";

export default function Analytics() {
  const postsData = [
    { name: "Jan", posts: 12 },
    { name: "Feb", posts: 18 },
    { name: "Mar", posts: 9 },
    { name: "Apr", posts: 15 },
    { name: "May", posts: 20 },
    { name: "Jun", posts: 14 },
  ];

  const commentsData = [
    { month: "Jan", comments: 50 },
    { month: "Feb", comments: 80 },
    { month: "Mar", comments: 65 },
    { month: "Apr", comments: 120 },
    { month: "May", comments: 90 },
    { month: "Jun", comments: 150 },
  ];

  const categoryData = [
    { name: "Tech", value: 40 },
    { name: "Lifestyle", value: 25 },
    { name: "Sports", value: 20 },
    { name: "Other", value: 15 },
  ];

  const viewsData = [
    { month: "Jan", views: 1000 },
    { month: "Feb", views: 1500 },
    { month: "Mar", views: 1200 },
    { month: "Apr", views: 2000 },
    { month: "May", views: 1700 },
    { month: "Jun", views: 2500 },
  ];

  const COLORS = ["#4299E1", "#48BB78", "#F56565", "#ECC94B"];

  return (
    <div className="p-6 space-y-10 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-2xl font-bold mb-6">📊 Admin Dashboard Analytics</h1>

      {/* Bar Chart - Monthly Posts */}
      <div className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Monthly Posts</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={postsData}>
            <XAxis dataKey="name" stroke="#CBD5E0" />
            <YAxis stroke="#CBD5E0" />
            <Tooltip contentStyle={{ backgroundColor: "#2D3748", border: "none" }} />
            <Legend />
            <Bar dataKey="posts" fill="#4299E1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart - Comments Growth */}
      <div className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Monthly Comments</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={commentsData}>
            <XAxis dataKey="month" stroke="#CBD5E0" />
            <YAxis stroke="#CBD5E0" />
            <Tooltip contentStyle={{ backgroundColor: "#2D3748", border: "none" }} />
            <Legend />
            <Line type="monotone" dataKey="comments" stroke="#F56565" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Posts by Category */}
      <div className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Posts by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "#2D3748", border: "none" }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Area Chart - Views Trend */}
      <div className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Monthly Views</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={viewsData}>
            <XAxis dataKey="month" stroke="#CBD5E0" />
            <YAxis stroke="#CBD5E0" />
            <Tooltip contentStyle={{ backgroundColor: "#2D3748", border: "none" }} />
            <Legend />
            <Area type="monotone" dataKey="views" stroke="#48BB78" fill="#276749" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
