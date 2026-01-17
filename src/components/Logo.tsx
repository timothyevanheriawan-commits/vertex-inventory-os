interface LogoProps {
    className?: string
    light?: boolean
}

export default function Logo({ className = "h-8 w-8", light = false }: LogoProps) {
    // If 'light' is true (for dark sidebar), use White/Pastels.
    // If false (for light backgrounds), use standard Indigo brand colors.
    const colorPrimary = light ? "#ffffff" : "#4f46e5"; // Indigo-600
    const colorSecondary = light ? "#a5b4fc" : "#6366f1"; // Indigo-500
    const colorTertiary = light ? "#818cf8" : "#818cf8"; // Indigo-400

    return (
        <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Vertex Logo"
        >
            {/* Base Shape */}
            <path
                d="M10 28V14.5L20 9L30 14.5V28L20 33.5L10 28Z"
                fill={colorTertiary}
                fillOpacity={light ? "0.15" : "0.1"}
            />

            {/* Left Facet */}
            <path
                d="M10 28L20 33.5V20.5L10 15V28Z"
                fill={colorPrimary}
            />

            {/* Right Facet */}
            <path
                d="M30 28L20 33.5V20.5L30 15V28Z"
                fill={colorSecondary}
            />

            {/* Top Facet */}
            <path
                d="M20 9L30 14.5L20 20L10 14.5L20 9Z"
                fill={colorTertiary}
                fillOpacity={light ? "0.9" : "1"}
            />
        </svg>
    );
}