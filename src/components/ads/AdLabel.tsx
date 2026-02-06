type AdLabelProps = {
  text?: string;
  className?: string;
};

const AdLabel = ({ text = "Iklan", className }: AdLabelProps) => {
  return <span className={`ad-label ${className ?? ""}`.trim()}>{text}</span>;
};

export default AdLabel;
