interface ChipProps {
  text: string;
  width: string;
}

const Chip = ({ text, width }: ChipProps) => {
  return (
    <div
      className={`rounded-[48px] bg-white px-[14px] py-[7px] text-xs w-[${width}] h-8 flex items-center justify-center font-medium`}
    >
      <p>{text}</p>
    </div>
  );
};

export default Chip;
