import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const WEEKDAYS = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];

const PRESETS = [
    { label: "Aujourd'hui", getRange: () => {
        const d = new Date();
        return { start: d, end: new Date(d) };
    }},
    { label: 'Hier', getRange: () => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return { start: d, end: new Date(d) };
    }},
    { label: '7 derniers jours', getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 6);
        return { start, end };
    }},
    { label: '14 derniers jours', getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 13);
        return { start, end };
    }},
    { label: '30 derniers jours', getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 29);
        return { start, end };
    }},
    { label: 'Ce mois', getRange: () => {
        const now = new Date();
        return {
            start: new Date(now.getFullYear(), now.getMonth(), 1),
            end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
        };
    }},
    { label: 'Mois dernier', getRange: () => {
        const now = new Date();
        return {
            start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
            end: new Date(now.getFullYear(), now.getMonth(), 0)
        };
    }},
];

export default function DateRangePicker({ startDate, endDate, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [leftMonth, setLeftMonth] = useState(() => {
        const d = startDate ? new Date(startDate + 'T00:00:00') : new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });
    const [rightMonth, setRightMonth] = useState(() => {
        const d = endDate ? new Date(endDate + 'T00:00:00') : new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    });
    const [tempStart, setTempStart] = useState(startDate || null);
    const [tempEnd, setTempEnd] = useState(endDate || null);
    const [hoverDate, setHoverDate] = useState(null);
    const pickerRef = useRef(null);

    useEffect(() => {
        setTempStart(startDate || null);
        setTempEnd(endDate || null);
    }, [startDate, endDate]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDate = (date) => {
        if (!date) return '';
        const d = date instanceof Date ? date : new Date(date + 'T00:00:00');
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDisplay = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const handlePreset = (preset) => {
        const { start, end } = preset.getRange();
        const startStr = formatDate(start);
        const endStr = formatDate(end);
        setTempStart(startStr);
        setTempEnd(endStr);
        onChange({ start: startStr, end: endStr });
        setIsOpen(false);
    };

    const handleDateClick = (date) => {
        const dateStr = formatDate(date);

        if (!tempStart || (tempStart && tempEnd)) {
            // Start fresh selection
            setTempStart(dateStr);
            setTempEnd(null);
            setHoverDate(null);
        } else {
            const startD = new Date(tempStart + 'T00:00:00');
            const clickedD = new Date(dateStr + 'T00:00:00');

            if (clickedD.getTime() === startD.getTime()) {
                // Same day clicked = single day selection
                setTempEnd(dateStr);
            } else if (clickedD < startD) {
                // Clicked before start = new start
                setTempStart(dateStr);
                setTempEnd(tempStart);
            } else {
                // Normal range selection
                setTempEnd(dateStr);
            }
        }
    };

    const handleApply = () => {
        if (tempStart && tempEnd) {
            onChange({ start: tempStart, end: tempEnd });
            setIsOpen(false);
        } else if (tempStart && !tempEnd) {
            // Single day selected
            onChange({ start: tempStart, end: tempStart });
            setIsOpen(false);
        }
    };

    const handleCancel = () => {
        setTempStart(startDate || null);
        setTempEnd(endDate || null);
        setHoverDate(null);
        setIsOpen(false);
    };

    const isInRange = (dateStr) => {
        if (!tempStart) return false;
        const end = tempEnd || hoverDate;
        if (!end) return dateStr === tempStart;
        const s = tempStart;
        const e = end;
        return dateStr >= s && dateStr <= e;
    };

    const isRangeStart = (dateStr) => tempStart === dateStr;
    const isRangeEnd = (dateStr) => (tempEnd || tempStart) === dateStr;
    const isToday = (dateStr) => dateStr === formatDate(new Date());

    const renderMonth = (baseDate) => {
        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${year}-${month}-${i}`} className="w-8 h-8" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = formatDate(date);
            const inRange = isInRange(dateStr);
            const rangeStart = isRangeStart(dateStr);
            const rangeEnd = isRangeEnd(dateStr);
            const today = isToday(dateStr);

            let cellClass = 'w-8 h-8 rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-center cursor-pointer ';

            if (rangeStart && rangeEnd) {
                // Single day selection
                cellClass += 'bg-blue-500 text-white hover:bg-blue-600 ';
            } else if (rangeStart) {
                cellClass += 'bg-blue-500 text-white hover:bg-blue-600 rounded-r-none ';
            } else if (rangeEnd) {
                cellClass += 'bg-blue-500 text-white hover:bg-blue-600 rounded-l-none ';
            } else if (inRange) {
                cellClass += 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 ';
            } else {
                cellClass += 'text-gray-300 hover:bg-gray-800 ';
            }

            if (today && !rangeStart && !rangeEnd) {
                cellClass += 'ring-1 ring-gray-500 ';
            }

            days.push(
                <button
                    key={`${year}-${month}-${day}`}
                    onClick={() => handleDateClick(date)}
                    onMouseEnter={() => {
                        if (tempStart && !tempEnd) setHoverDate(dateStr);
                    }}
                    onMouseLeave={() => setHoverDate(null)}
                    className={cellClass}
                >
                    {day}
                </button>
            );
        }

        return (
            <div className="flex-1">
                <div className="flex items-center justify-between mb-3 px-1">
                    <button 
                        onClick={() => setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() - 1))}
                        className="p-1 rounded-lg hover:bg-gray-800 text-gray-400"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-semibold text-gray-200">
                        {MONTHS[month]} {year}
                    </span>
                    <button 
                        onClick={() => setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1))}
                        className="p-1 rounded-lg hover:bg-gray-800 text-gray-400"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {WEEKDAYS.map((day) => (
                        <div key={day} className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider py-1">
                            {day}
                        </div>
                    ))}
                    {days}
                </div>
            </div>
        );
    };

    const renderRightMonth = () => {
        const nextMonth = new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1);
        const year = nextMonth.getFullYear();
        const month = nextMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-right-${i}`} className="w-8 h-8" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = formatDate(date);
            const inRange = isInRange(dateStr);
            const rangeStart = isRangeStart(dateStr);
            const rangeEnd = isRangeEnd(dateStr);
            const today = isToday(dateStr);

            let cellClass = 'w-8 h-8 rounded-lg text-sm font-medium transition-all duration-150 flex items-center justify-center cursor-pointer ';

            if (rangeStart && rangeEnd) {
                cellClass += 'bg-blue-500 text-white hover:bg-blue-600 ';
            } else if (rangeStart) {
                cellClass += 'bg-blue-500 text-white hover:bg-blue-600 rounded-r-none ';
            } else if (rangeEnd) {
                cellClass += 'bg-blue-500 text-white hover:bg-blue-600 rounded-l-none ';
            } else if (inRange) {
                cellClass += 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 ';
            } else {
                cellClass += 'text-gray-300 hover:bg-gray-800 ';
            }

            if (today && !rangeStart && !rangeEnd) {
                cellClass += 'ring-1 ring-gray-500 ';
            }

            days.push(
                <button
                    key={`right-${year}-${month}-${day}`}
                    onClick={() => handleDateClick(date)}
                    onMouseEnter={() => {
                        if (tempStart && !tempEnd) setHoverDate(dateStr);
                    }}
                    onMouseLeave={() => setHoverDate(null)}
                    className={cellClass}
                >
                    {day}
                </button>
            );
        }

        return (
            <div className="flex-1">
                <div className="flex items-center justify-between mb-3 px-1">
                    <button 
                        onClick={() => setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() - 1))}
                        className="p-1 rounded-lg hover:bg-gray-800 text-gray-400"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-semibold text-gray-200">
                        {MONTHS[month]} {year}
                    </span>
                    <button 
                        onClick={() => setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1))}
                        className="p-1 rounded-lg hover:bg-gray-800 text-gray-400"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {WEEKDAYS.map((day) => (
                        <div key={`right-${day}`} className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider py-1">
                            {day}
                        </div>
                    ))}
                    {days}
                </div>
            </div>
        );
    };

    return (
        <div className="relative" ref={pickerRef}>
            {/* Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2.5 bg-gray-900/80 border border-gray-800 rounded-xl text-sm text-gray-300 hover:bg-gray-800 hover:text-gray-200 transition-all"
            >
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span className="whitespace-nowrap">
                    {formatDisplay(tempStart) || 'Choisir une période'}
                    {tempEnd && tempEnd !== tempStart && ` — ${formatDisplay(tempEnd)}`}
                    {tempEnd && tempEnd === tempStart && ' (1 jour)'}
                </span>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 z-50 bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden w-[640px]">
                    <div className="flex">
                        {/* Presets */}
                        <div className="w-44 border-r border-gray-800/50 p-3 space-y-0.5 flex-shrink-0">
                            {PRESETS.map((preset) => (
                                <button
                                    key={preset.label}
                                    onClick={() => handlePreset(preset)}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                                >
                                    {preset.label}
                                </button>
                            ))}
                            <div className="border-t border-gray-800/50 mt-2 pt-2">
                                <button
                                    onClick={() => {
                                        setTempStart(null);
                                        setTempEnd(null);
                                        setHoverDate(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg transition-colors"
                                >
                                    Réinitialiser
                                </button>
                            </div>
                        </div>

                        {/* Calendars */}
                        <div className="flex-1 p-4">
                            <div className="flex gap-6">
                                {renderMonth(leftMonth)}
                                {renderRightMonth()}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800/50">
                                <span className="text-xs text-gray-500">
                                    {tempStart && tempEnd && tempStart === tempEnd ? '1 jour sélectionné' : ''}
                                    {tempStart && tempEnd && tempStart !== tempEnd ? 'Période personnalisée' : ''}
                                    {!tempStart ? 'Sélectionnez une date' : ''}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleApply}
                                        disabled={!tempStart}
                                        className="px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Appliquer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}