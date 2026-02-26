interface AppHeaderProps {
  title: string;
  description: string;
}

export default function FormHeader({ title, description }: AppHeaderProps) {
  return (
    <div>
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
