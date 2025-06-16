const BlurCircle = ({
  top = "auto",
  bottom = "auto",
  left = "auto",
  right = "auto",
}) => {
  return (
    <div
      className="absolute -z-50 h-58 w-58 aspect-square rounded-full bg-[#F84565]/30 blur-3xl"
      style={{ top: top, bottom: bottom, left: left, right: right }}
    ></div>
  );
};

export default BlurCircle;
