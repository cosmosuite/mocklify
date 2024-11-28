import { cn } from '../../lib/utils';

interface Props {
  value: string;
  onChange: (background: string) => void;
}

export const paperBackgrounds = [
  {
    id: 'paper-1',
    name: 'Classic White',
    url: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6746e15cb83c394c922e1bf3.png'
  },
  {
    id: 'paper-2',
    name: 'Vintage',
    url: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6746e15cb83c3901af2e1bf1.png'
  },
  {
    id: 'paper-3',
    name: 'Textured',
    url: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6746e15c6b2c489a936d05b8.png'
  },
  {
    id: 'paper-4',
    name: 'Parchment',
    url: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6746e15cf6ba6f39091b3b30.png'
  },
  {
    id: 'paper-5',
    name: 'Natural',
    url: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6746e15c0925a844c798d4eb.png'
  },
  {
    id: 'paper-6',
    name: 'Aged',
    url: 'https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/6746e15cf6ba6f49ce1b3b2f.png'
  }
];

export function BackgroundSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {paperBackgrounds.map((paper) => (
        <button
          key={paper.id}
          type="button"
          onClick={() => onChange(paper.url)}
          className={cn(
            "relative aspect-[4/5] rounded-lg overflow-hidden border-2 transition-all",
            value === paper.url
              ? "border-[#CCFC7E] shadow-lg"
              : "border-[#2F2F2F] hover:border-[#3F3F3F]"
          )}
        >
          <img
            src={paper.url}
            alt={paper.name}
            className="w-full h-full object-cover"
          />
          <div className={cn(
            "absolute inset-x-0 bottom-0 py-1 px-2 text-xs font-medium text-white bg-black/50 backdrop-blur-sm",
            value === paper.url ? "bg-[#CCFC7E]/50 text-black" : ""
          )}>
            {paper.name}
          </div>
        </button>
      ))}
    </div>
  );
}