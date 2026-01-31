import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"; // Removed unused import

import { AlertCircle, CheckCircle } from "lucide-react";


interface ExplainabilityCardProps {
    explanation: string;
    riskFactors: string[];
}

const ExplainabilityCard: React.FC<ExplainabilityCardProps> = ({ explanation, riskFactors }) => {
    return (
        <div className="bg-card rounded-lg border shadow-sm p-6 w-full">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Trust Analysis
                </h3>
            </div>

            <p className="text-xl font-medium text-foreground mb-6 leading-relaxed">
                {explanation}
            </p>

            {riskFactors.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase opacity-70">Active Risk Factors</h4>
                    <div className="grid grid-cols-1 gap-2">
                        {riskFactors.map((risk, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-red-50/50 rounded-md border border-red-100 text-sm text-red-900">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                <span>{risk}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {riskFactors.length === 0 && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50/50 p-3 rounded-md border border-emerald-100">
                    <CheckCircle className="w-4 h-4" />
                    <span>System behavior is within nominal parameters.</span>
                </div>
            )}
        </div>
    );
};

export default ExplainabilityCard;
