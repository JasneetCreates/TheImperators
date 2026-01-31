import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';

interface TrustGaugeProps {
    score: number;
    confidenceBand: string; // GREEN, YELLOW, ORANGE, RED
}

const TrustGauge: React.FC<TrustGaugeProps> = ({ score, confidenceBand }) => {
    // Data for the semi-circle gauge
    const data = [
        { name: 'Score', value: score },
        { name: 'Remaining', value: 100 - score },
    ];

    // Map band to color
    const getColor = (band: string) => {
        switch (band) {
            case 'GREEN': return '#10b981'; // emerald-500
            case 'YELLOW': return '#f59e0b'; // amber-500
            case 'ORANGE': return '#f97316'; // orange-500
            case 'RED': return '#ef4444';    // red-500
            default: return '#cbd5e1';       // slate-300
        }
    };

    const activeColor = getColor(confidenceBand);

    return (
        <div className="relative flex flex-col items-center justify-center p-6 bg-card rounded-lg border shadow-sm">
            <h3 className="text-lg font-medium text-muted-foreground mb-4">Live Trust Score</h3>

            <div className="w-64 h-32 relative overflow-hidden">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            cy={120} // Move center down
                            innerRadius={80}
                            outerRadius={100}
                            startAngle={180}
                            endAngle={0}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                            isAnimationActive={true}
                        >
                            <Cell key="score" fill={activeColor} />
                            <Cell key="remaining" fill="#e2e8f0" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Value Overlay */}
                <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-2">
                    <span className={cn("text-5xl font-bold tracking-tighter", {
                        'text-emerald-600': confidenceBand === 'GREEN',
                        'text-amber-500': confidenceBand === 'YELLOW',
                        'text-orange-500': confidenceBand === 'ORANGE',
                        'text-red-500': confidenceBand === 'RED',
                    })}>
                        {score}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground mt-1 text-center">
                        GLOBAL TRUST
                    </span>
                </div>
            </div>

        </div>
    );
};

export default TrustGauge;
