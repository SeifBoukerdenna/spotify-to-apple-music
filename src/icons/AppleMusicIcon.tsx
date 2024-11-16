import { FaApple } from "react-icons/fa";

interface AppleMusicIconProps {
    className?: string;
    size?: number;
    withBackground?: boolean;
}

export const AppleMusicIcon = ({
    className = "",
    size = 24,
    withBackground = false,
}: AppleMusicIconProps) => {
    return withBackground ? (
        <div
            className={`flex items-center justify-center rounded-md ${className}`}
            style={{
                background: "linear-gradient(180deg, #FA233B, #FB5C74)",
                width: size + 16,
                height: size + 16,
            }}
        >
            <FaApple size={size} color="white" />
        </div>
    ) : (
        <FaApple className={className} size={size} />
    );
};
