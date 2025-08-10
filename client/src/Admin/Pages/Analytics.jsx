import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Analytics() {
  const data = [
    { name: "Jan", posts: 12 },
    { name: "Feb", posts: 18 },
    { name: "Mar", posts: 9 },
    { name: "Apr", posts: 15 },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Blog Analytics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="posts" fill="#3182CE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
