import OwnerCalendarClient from "./OwnerCalendarClient";

export const metadata = { title: "Takvim | Panobu" };
export const dynamic = "force-dynamic";

export default function CalendarPage() {
    return <OwnerCalendarClient />;
}
