"use client";

import * as React from "react";
import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
  addMonths
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "task" | "deadline";
  meta: string;
}

export function CalendarView({ events }: { events: CalendarEvent[] }) {
  const [view, setView] = React.useState("month");
  const [cursor, setCursor] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const start = startOfWeek(monthStart, { weekStartsOn: 0 });
  const end = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const monthDays = eachDayOfInterval({ start, end });

  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: 0 }),
    end: endOfWeek(selectedDate, { weekStartsOn: 0 })
  });

  const eventsForDate = React.useCallback(
    (date: Date) => events.filter((event) => isSameDay(parseISO(event.date), date)).sort((a, b) => a.date.localeCompare(b.date)),
    [events]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" onClick={() => setCursor((value) => subMonths(value, 1))} aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={() => setCursor((value) => addMonths(value, 1))} aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">{format(cursor, "MMMM yyyy")}</h2>
        </div>

        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={view} onValueChange={setView}>
        <TabsContent value="month" className="space-y-2">
          <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="rounded-md py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((day) => {
              const dayEvents = eventsForDate(day);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "min-h-[92px] rounded-lg border border-border/70 p-2 text-left transition-colors hover:bg-muted/60",
                    !isSameMonth(day, cursor) && "opacity-45",
                    isSameDay(day, selectedDate) && "ring-2 ring-ring",
                    isToday(day) && "border-primary"
                  )}
                >
                  <p className={cn("text-xs", isToday(day) && "font-semibold text-primary")}>{format(day, "d")}</p>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <p
                        key={event.id}
                        className={cn(
                          "truncate rounded px-1.5 py-0.5 text-[11px]",
                          event.type === "task" ? "bg-chart-1/15 text-chart-1" : "bg-chart-3/15 text-chart-3"
                        )}
                      >
                        {event.title}
                      </p>
                    ))}
                    {dayEvents.length > 2 ? <p className="text-[11px] text-muted-foreground">+{dayEvents.length - 2} more</p> : null}
                  </div>
                </button>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="week">
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {weekDays.map((day) => {
              const dayEvents = eventsForDate(day);
              return (
                <div key={day.toISOString()} className="rounded-lg border border-border/70 p-3">
                  <p className={cn("text-sm font-semibold", isToday(day) && "text-primary")}>{format(day, "EEE, MMM d")}</p>
                  <div className="mt-2 space-y-2">
                    {dayEvents.length ? (
                      dayEvents.map((event) => (
                        <div key={event.id} className="rounded-md bg-muted/70 p-2 text-xs">
                          <p className="font-medium">{event.title}</p>
                          <p className="text-muted-foreground">{event.meta}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No items</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="day">
          <div className="rounded-xl border border-border/70 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-semibold">{format(selectedDate, "EEEE, MMMM d")}</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedDate((date) => addDays(date, -1))}>
                  Previous
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedDate((date) => addDays(date, 1))}>
                  Next
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {eventsForDate(selectedDate).length ? (
                eventsForDate(selectedDate).map((event) => (
                  <div key={event.id} className="rounded-md border border-border/70 p-3 text-sm">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.meta}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No tasks or deadlines on this day.</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
