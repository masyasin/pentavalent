
import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
    symbol: string;
    theme?: 'light' | 'dark';
    height?: number | string;
    autosize?: boolean;
}

export const StockSymbolOverview: React.FC<TradingViewWidgetProps> = ({
    symbol,
    theme = 'light',
    height = 400
}) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        // Clear previous widget if any
        container.current.innerHTML = '';

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = () => {
            if (typeof (window as any).TradingView !== 'undefined' && container.current) {
                new (window as any).TradingView.widget({
                    "width": "100%",
                    "height": height,
                    "symbol": `IDX:${symbol}`,
                    "interval": "D",
                    "timezone": "Asia/Jakarta",
                    "theme": theme,
                    "style": "3",
                    "locale": "en",
                    "toolbar_bg": "#f1f3f6",
                    "enable_publishing": false,
                    "hide_top_toolbar": true,
                    "save_image": false,
                    "container_id": container.current.id
                });
            }
        };
        container.current.appendChild(script);
    }, [symbol, theme, height]);

    return (
        <div
            id={`tradingview_${symbol}_${Math.random().toString(36).substr(2, 9)}`}
            className="tradingview-widget-container"
            ref={container}
            style={{ height: '100%', width: '100%' }}
        />
    );
};

export const MiniStockChart: React.FC<TradingViewWidgetProps> = ({
    symbol,
    theme = 'light'
}) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = '';

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "symbol": `IDX:${symbol}`,
            "width": "100%",
            "height": "100%",
            "locale": "en",
            "dateRange": "12M",
            "colorTheme": theme,
            "isTransparent": true,
            "autosize": true,
            "largeChartUrl": ""
        });

        container.current.appendChild(script);
    }, [symbol, theme]);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: '100%', width: '100%' }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
};

export const StockPriceTicker: React.FC<{ symbol: string; theme?: 'light' | 'dark' }> = ({
    symbol,
    theme = 'light'
}) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = '';

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "symbol": `IDX:${symbol}`,
            "width": "100%",
            "colorTheme": theme,
            "isTransparent": true,
            "locale": "en"
        });

        container.current.appendChild(script);
    }, [symbol, theme]);

    return (
        <div className="tradingview-widget-container" ref={container}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
};
export const TechnicalAnalysis: React.FC<TradingViewWidgetProps> = ({
    symbol,
    theme = 'light'
}) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = '';

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "interval": "1D",
            "width": "100%",
            "isTransparent": true,
            "height": "100%",
            "symbol": `IDX:${symbol}`,
            "showIntervalTabs": true,
            "locale": "en",
            "colorTheme": theme
        });

        container.current.appendChild(script);
    }, [symbol, theme]);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: '100%', width: '100%' }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
};

export const StockFinancials: React.FC<TradingViewWidgetProps> = ({
    symbol,
    theme = 'light'
}) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = '';

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-financials.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "isTransparent": true,
            "largeChartUrl": "",
            "displayMode": "regular",
            "width": "100%",
            "height": "100%",
            "colorTheme": theme,
            "symbol": `IDX:${symbol}`,
            "locale": "en"
        });

        container.current.appendChild(script);
    }, [symbol, theme]);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: '100%', width: '100%' }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
};

export const FundamentalData: React.FC<TradingViewWidgetProps> = ({
    symbol,
    theme = 'light'
}) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = '';

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-fundamental-data.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "isTransparent": true,
            "largeChartUrl": "",
            "displayMode": "regular",
            "width": "100%",
            "height": "100%",
            "colorTheme": theme,
            "symbol": `IDX:${symbol}`,
            "locale": "en"
        });

        container.current.appendChild(script);
    }, [symbol, theme]);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: '100%', width: '100%' }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
};

export const CompanyProfileWidget: React.FC<TradingViewWidgetProps> = ({
    symbol,
    theme = 'light'
}) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = '';

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "width": "100%",
            "height": "100%",
            "colorTheme": theme,
            "isTransparent": true,
            "symbol": `IDX:${symbol}`,
            "locale": "en"
        });

        container.current.appendChild(script);
    }, [symbol, theme]);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: '100%', width: '100%' }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
};

export const SymbolInfo: React.FC<TradingViewWidgetProps> = ({
    symbol,
    theme = 'light'
}) => {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = '';

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "symbol": `IDX:${symbol}`,
            "width": "100%",
            "locale": "en",
            "colorTheme": theme,
            "isTransparent": true
        });

        container.current.appendChild(script);
    }, [symbol, theme]);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ width: '100%' }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
};

