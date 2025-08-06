import StatCard from "../Components/Statcard";

export default function Dashboard() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Total Blogs" value="123" />
      <StatCard title="Active Users" value="45" />
      <StatCard title="Pending Comments" value="8" />
    </div>
  );
}
