import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
    className?: string;
    priority?: boolean;
}

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
    return (
        <Image
            src="/icons/pwa-icon.svg"
            alt="vexorabyte logo"
            width={512}
            height={512}
            priority={priority}
            className={cn("h-10 w-10 rounded-2xl object-cover shadow-sm", className)}
        />
    );
}
