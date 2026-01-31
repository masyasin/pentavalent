
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
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "symbols": [
                [
                    "IDX",
                    symbol
                ]
            ],
            "chartOnly": false,
            "width": "100%",
            "height": height,
            "locale": "en",
            "colorTheme": theme,
            "autosize": true,
            "showVolume": false,
            "showMA": false,
            "hideDateRanges": false,
            "hideMarketStatus": false,
            "hideSymbolLogo": false,
            "scalePosition": "right",
            "scaleMode": "Normal",
            "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
            "fontSize": "10",
            "noTimeScale": false,
            "valuesTracking": "1",
            "changeMode": "price-and-percent",
            "chartType": "area",
            "maLineColor": "#2962FF",
            "maLineWidth": 1,
            "maLength": 9,
            "lineWidth": 2,
            "lineColor": "#2962FF",
            "topColor": "rgba(41, 98, 255, 0.3)",
            "bottomColor": "rgba(41, 98, 255, 0)",
            "dateFormat": "MMM dd, yyyy",
            "timeHoursFormat": "12-hour"
        });

        container.current.appendChild(script);
    }, [symbol, theme, height]);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: '100%', width: '100%' }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
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
