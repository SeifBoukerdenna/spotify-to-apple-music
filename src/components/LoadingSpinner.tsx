import { ClipLoader } from "react-spinners";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

const LoadingSpinner = ({
  size = 50,
  color = "#1db954",
}: LoadingSpinnerProps) => (
  <div style={{ textAlign: "center", marginTop: "2rem" }}>
    <ClipLoader color={color} size={size} />
  </div>
);

export default LoadingSpinner;
