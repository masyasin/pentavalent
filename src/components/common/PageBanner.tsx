import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Breadcrumb {
    label: string;
    link?: string;
}

interface PageBannerProps {
    title: string;
    subtitle?: string;
    backgroundImage: string;
    breadcrumb: Breadcrumb;
}

const PageBanner: React.FC<PageBannerProps> = ({
    title,
    subtitle,
    backgroundImage,
    breadcrumb
}) => {
    const { t } = useLanguage();

    return (
        <div className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <div className="absolute inset-0 z-0">
                <img
                    src={backgroundImage}
                    alt={title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/80"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center text-white">
                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 italic px-4">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8 font-medium">
                        {subtitle}
                    </p>
                )}

                {/* Breadcrumbs */}
                <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-blue-100/80">
                    <a href="/" className="hover:text-white transition-colors">
                        {t('nav.home') || 'Home'}
                    </a>
                    <ChevronRight size={14} />
                    <span className="text-white">{breadcrumb.label}</span>
                </div>
            </div>

            {/* Decorative Bottom Curve */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                <svg
                    className="relative block w-full h-[60px]"
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M985.66,92.83C906.67,72,823.78,31,432.84,2c-47.52-3.53-73.47-4.22-35.32,16C518.9,81.13,732.61,136.42,1200,91V120H0V0C23.63,20,131.54,73.47,432.84,2c118.52-28.52,242.06-25,357.56-4.14L1200,0V91Z"
                        className="fill-white"
                    ></path>
                </svg>
            </div>
        </div>
    );
};

export default PageBanner;
