"use client";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

interface Props {
    selectedDate: Date;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}

export default function Calendar({
    selectedDate,
    setSelectedDate,
}: Props) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
                value={dayjs(selectedDate)}
                onChange={(newValue: Dayjs | null) => {
                    if (newValue) {
                        setSelectedDate(newValue.toDate());
                    }
                }}
                //customize
                sx={{
                    backgroundColor: "#ffffff",

                    "& .Mui-selected": {
                        backgroundColor: "#5F33E1 !important",
                        color: "white",
                    },

                    "& .MuiPickersCalendarHeader-label": {
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        color: "#202022",
                    },

                    "& .MuiYearCalendar-button": {
                        color: "#202022 !important",
                    },

                    "& .MuiYearCalendar-button.Mui-selected": {
                        backgroundColor: "#5F33E1 !important",
                        color: "#ffffff !important",
                    },
                }}
            />
        </LocalizationProvider>
    );
}