import { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import axios from "axios";

const COLORS = ["#0088FE", "#FF8042"];

export default function Analytics() {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const token = localStorage.getItem("token");


  const [roleData, setRoleData] = useState([]);

  useEffect(() => {
    axios.get(`${apiUrl}/api/User/analytics/roles`,
        {
          headers: { Authorization: `Bearer ${token}` },
        })
    .then((res) => {
      setRoleData(res.data.data);
      console.log(res.data.data);
    });
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Users by Role</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={roleData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {roleData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: "#c3cbd8ff", border: "none" }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
