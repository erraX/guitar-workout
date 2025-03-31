export default function Date({ date }: { date: Date }) {
  return <span>{date.toLocaleDateString()}</span>;
}
