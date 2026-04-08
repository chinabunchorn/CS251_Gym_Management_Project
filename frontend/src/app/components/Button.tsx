type ButtonProps = {
  text: string;
  onClick?: () => void;
  fullWidth?: boolean;
};

export default function Button({ text, onClick, fullWidth = true }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${
        fullWidth ? "w-full" : "w-auto"
      } py-3 rounded-lg bg-[#5733E1] text-white font-semibold hover:bg-[#4522b8]`}
    >
      {text}
    </button>
  );
}