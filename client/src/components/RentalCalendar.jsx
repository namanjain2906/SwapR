import React, { useEffect, useMemo, useState } from "react";

const normalizeDate = (value) => {
	if (!value) return null;
	const date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date;
};

const isSameDay = (a, b) => {
	if (!a || !b) return false;
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
};

const getCalendarDays = (monthDate) => {
	const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
	const startDay = start.getDay();
	const gridStart = new Date(start);
	gridStart.setDate(start.getDate() - startDay);

	const days = [];
	for (let i = 0; i < 42; i += 1) {
		const day = new Date(gridStart);
		day.setDate(gridStart.getDate() + i);
		days.push(day);
	}
	return days;
};

const RentalCalendar = ({ value, onChange, minDate, highlightRange, emphasis = "range", disableSelection = false }) => {
	const normalizedMin = normalizeDate(minDate);
	const normalizedValue = normalizeDate(value);
	const [currentMonth, setCurrentMonth] = useState(
		() => normalizedValue || normalizedMin || normalizeDate(new Date())
	);

	useEffect(() => {
		if (normalizedValue) {
			setCurrentMonth(new Date(normalizedValue.getFullYear(), normalizedValue.getMonth(), 1));
		}
	}, [normalizedValue]);

	const monthDays = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);
	const currentMonthStart = useMemo(
		() => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
		[currentMonth]
	);
	const canGoPrev = !normalizedMin || new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() - 1, 1) >= new Date(normalizedMin.getFullYear(), normalizedMin.getMonth(), 1);

	const normalizedHighlight = useMemo(() => {
		if (!highlightRange?.start || !highlightRange?.end) return null;
		const start = normalizeDate(highlightRange.start);
		const end = normalizeDate(highlightRange.end);
		if (!start || !end) return null;
		return { start, end };
	}, [highlightRange]);

	const selectionLocked = disableSelection && normalizedHighlight;

	const handleSelect = (day) => {
		if (normalizedMin && day < normalizedMin) return;
		onChange?.(new Date(day));
	};

	return (
		<div className="rounded-2xl border border-gray-700 bg-[#111112] px-4 py-3 text-white">
			<div className="mb-3 flex items-center justify-between">
				<button
					type="button"
					onClick={() =>
						setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
					}
					disabled={!canGoPrev}
					className={`rounded-md px-2 py-1 text-sm transition ${
						canGoPrev ? "text-gray-300 hover:bg-gray-800" : "cursor-not-allowed text-gray-600"
					}`}
				>
					◀
				</button>
				<div className="text-sm font-medium">
					{currentMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
				</div>
				<button
					type="button"
					onClick={() =>
						setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
					}
					className="rounded-md px-2 py-1 text-sm text-gray-300 transition hover:bg-gray-800"
				>
					▶
				</button>
			</div>

			<div className="grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-wide text-gray-500">
				{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
					<div key={day}>{day}</div>
				))}
			</div>

			<div className="mt-2 grid grid-cols-7 gap-1 text-sm">
				{monthDays.map((day) => {
					const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
					const disabled = normalizedMin && day < normalizedMin;
					const selected = isSameDay(day, normalizedValue);
					const highlighted =
						normalizedHighlight &&
						day >= normalizedHighlight.start &&
						day <= normalizedHighlight.end;
					const highlightStart =
						highlighted && normalizedHighlight && isSameDay(day, normalizedHighlight.start);
					const highlightEnd =
						highlighted && normalizedHighlight && isSameDay(day, normalizedHighlight.end);

					const clickDisabled = disabled || selectionLocked;
					const baseClasses = [
						"flex h-10 w-10 items-center justify-center transition text-sm",
						clickDisabled ? "cursor-not-allowed opacity-60 text-gray-600" : "hover:bg-gray-800",
						!isCurrentMonth ? "text-gray-500" : "text-gray-200",
						selected ? "bg-[#F84565] text-white rounded-full shadow-lg shadow-[#F84565]/40" : "rounded-lg",
					];

					if (highlightStart && !selected) {
						baseClasses.push("rounded-full border border-[#F84565] bg-[#F84565] text-white shadow-md");
					}
					if (highlightEnd && !selected) {
						baseClasses.push("rounded-full border border-[#F84565] bg-[#F84565] text-white shadow-md");
					}

					return (
						<button
							type="button"
							key={day.toISOString()}
							onClick={() => {
								if (clickDisabled) return;
								handleSelect(day);
							}}
							disabled={clickDisabled}
							className={baseClasses.join(" ")}
						>
							{day.getDate()}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default RentalCalendar;
