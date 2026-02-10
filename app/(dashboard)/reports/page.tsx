'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { MONTHS, YEAR_RANGE } from '@/lib/constants';
import { Download, FileText } from 'lucide-react';

export default function ReportsPage() {
    const [loading, setLoading] = useState(false);
    const [reportType, setReportType] = useState<'monthly' | 'payment' | 'driver'>('monthly');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const generateMonthlyReport = async () => {
        try {
            setLoading(true);
            const response = await api.post('/admin/reports/monthly-fines', {
                month,
                year
            });

            toast.success('Report generated successfully');

            // Create JSON download
            const dataStr = JSON.stringify(response.data.report, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `monthly-fines-${year}-${month}.json`;
            link.click();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const generatePaymentReport = async () => {
        try {
            setLoading(true);
            const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
            const lastDay = new Date(year, month, 0).getDate();
            const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

            const response = await api.post('/admin/reports/payments', {
                startDate,
                endDate
            });

            toast.success('Report generated successfully');

            // Create JSON download
            const dataStr = JSON.stringify(response.data.report, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `payment-report-${year}-${month}.json`;
            link.click();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = () => {
        if (reportType === 'monthly') {
            generateMonthlyReport();
        } else if (reportType === 'payment') {
            generatePaymentReport();
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Reports</h1>
                <p className="text-gray-500 mt-1">Generate and download reports</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Monthly Fines Report */}
                <Card className={reportType === 'monthly' ? 'ring-2 ring-blue-600' : ''}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Monthly Fines Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Get detailed statistics on fines issued in a specific month
                        </p>
                        <Button
                            className="w-full"
                            variant={reportType === 'monthly' ? 'default' : 'outline'}
                            onClick={() => setReportType('monthly')}
                        >
                            Select
                        </Button>
                    </CardContent>
                </Card>

                {/* Payment Report */}
                <Card className={reportType === 'payment' ? 'ring-2 ring-blue-600' : ''}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Payment Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Generate payment summary for a date range
                        </p>
                        <Button
                            className="w-full"
                            variant={reportType === 'payment' ? 'default' : 'outline'}
                            onClick={() => setReportType('payment')}
                        >
                            Select
                        </Button>
                    </CardContent>
                </Card>

                {/* Driver Violations Report */}
                <Card className={reportType === 'driver' ? 'ring-2 ring-blue-600' : ''}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Driver Violations
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Driver violation history report (Coming Soon)
                        </p>
                        <Button
                            className="w-full"
                            variant="outline"
                            disabled
                        >
                            Coming Soon
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Report Generation Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Generate Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Month
                            </label>
                            <select
                                value={month}
                                onChange={(e) => setMonth(Number(e.target.value))}
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                {MONTHS.map((m) => (
                                    <option key={m.value} value={m.value}>
                                        {m.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Year
                            </label>
                            <select
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="w-full px-3 py-2 border rounded-md"
                            >
                                {YEAR_RANGE.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleGenerateReport}
                            disabled={loading || reportType === 'driver'}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="h-4 w-4 mr-2" />
                                    Generate & Download
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="text-sm text-gray-500 bg-blue-50 p-4 rounded-md">
                        <p className="font-medium text-blue-900 mb-1">Note:</p>
                        <p>Reports will be downloaded as JSON files. You can open them in any text editor or import into Excel/Google Sheets for analysis.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
