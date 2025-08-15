export default function Headlines({ posts }) {
  return (
    <div>
      <h4 className="font-bold mb-2">HEADLINES</h4>
      <ul className="list-disc pl-5 space-y-2">
        {posts?.slice(5, 12).map(p => (
          <li key={p.id} className="cursor-pointer hover:underline">{p.title}</li>
        ))}
      </ul>
    </div>
  );
}
