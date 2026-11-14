import DemoCard from '@/components/posts/DemoCard';

interface ColorSwatchProps {
  color: string;
  label: string;
}

export default function ColorSwatch({ color, label }: ColorSwatchProps) {
  return (
    <DemoCard className="p-3 pb-5">
      <div className="aspect-[5/4] border-2 border-ink" style={{ backgroundColor: `var(--${color})` }} />
      <div className="mt-3 text-center font-heading font-bold">{label}</div>
    </DemoCard>
  );
}
