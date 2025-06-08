import React, { useState } from 'react';
import { format, addDays, isSameDay, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Slot } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface BookingCalendarProps {
  slots: Slot[];
  onSelectSlot: (slot: Slot) => void;
  selectedSlot: Slot | null;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  slots,
  onSelectSlot,
  selectedSlot,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [visibleDays, setVisibleDays] = useState(getVisibleDays(currentDate));

  function getVisibleDays(date: Date) {
    const days = [];
    if (viewMode === 'week') {
      const start = startOfWeek(date, { weekStartsOn: 1 }); // Start from Monday
      const end = endOfWeek(date, { weekStartsOn: 1 });
      let current = start;
      while (current <= end) {
        days.push(new Date(current));
        current = addDays(current, 1);
      }
    } else {
      // Month view - show next 30 days
      for (let i = 0; i < 30; i++) {
        days.push(addDays(date, i));
      }
    }
    return days;
  }

  const navigateDays = (direction: 'prev' | 'next') => {
    const newDate = direction === 'next' 
      ? viewMode === 'week' ? addWeeks(currentDate, 1) : addDays(currentDate, 30)
      : viewMode === 'week' ? subWeeks(currentDate, 1) : addDays(currentDate, -30);
    
    setCurrentDate(newDate);
    setVisibleDays(getVisibleDays(newDate));
  };

  const getSlotsByDate = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return slots.filter(slot => slot.date === formattedDate);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // If there are slots available for this date, select the first available one
    const availableSlots = getSlotsByDate(date).filter(slot => !slot.isBooked);
    if (availableSlots.length > 0) {
      onSelectSlot(availableSlots[0]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100">
      {/* Date Navigation */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <h3 className="font-semibold">Select Date & Time</h3>
          <div className="flex space-x-2">
            <Button 
              variant={viewMode === 'week' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => {
                setViewMode('week');
                setVisibleDays(getVisibleDays(currentDate));
              }}
            >
              Week
            </Button>
            <Button 
              variant={viewMode === 'month' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => {
                setViewMode('month');
                setVisibleDays(getVisibleDays(currentDate));
              }}
            >
              Month
            </Button>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigateDays('prev')}
            leftIcon={<ChevronLeft className="h-4 w-4" />}
          >
            Previous
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigateDays('next')}
            rightIcon={<ChevronRight className="h-4 w-4" />}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Date Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-100">
        {visibleDays.map((day) => {
          const formattedDay = format(day, 'E');
          const formattedDate = format(day, 'd');
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const hasAvailableSlots = getSlotsByDate(day).some(slot => !slot.isBooked);
          
          return (
            <div 
              key={format(day, 'yyyy-MM-dd')}
              className={`flex-1 min-w-[80px] flex flex-col items-center justify-center p-3 cursor-pointer transition-colors ${
                isSelected 
                  ? 'bg-primary-100 border-b-2 border-primary-600' 
                  : isToday 
                    ? 'bg-primary-50' 
                    : 'hover:bg-gray-50'
              } ${!hasAvailableSlots ? 'opacity-50' : ''}`}
              onClick={() => hasAvailableSlots && handleDateClick(day)}
            >
              <span className="text-xs font-medium text-gray-500">{formattedDay}</span>
              <span className={`text-lg font-bold ${
                isSelected 
                  ? 'text-primary-600' 
                  : isToday 
                    ? 'text-primary-600' 
                    : 'text-gray-900'
              }`}>
                {formattedDate}
              </span>
              <span className="text-xs text-gray-500">{format(day, 'MMM')}</span>
            </div>
          );
        })}
      </div>

      {/* Time Slots */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {visibleDays.map((day) => {
            const daySlots = getSlotsByDate(day);
            const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
            
            if (daySlots.length === 0) return null;
            
            return (
              <div 
                key={format(day, 'yyyy-MM-dd')} 
                className={`border rounded-md border-gray-200 overflow-hidden ${
                  isSelected ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="bg-gray-50 p-2 border-b border-gray-200">
                  <h4 className="font-medium text-gray-700 text-sm">
                    {format(day, 'EEE, MMM d')}
                  </h4>
                </div>
                <div className="p-2 space-y-2 max-h-[200px] overflow-y-auto">
                  {daySlots.length > 0 ? (
                    daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`flex items-center justify-between p-2 rounded text-sm transition-colors ${
                          slot.isBooked 
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                            : selectedSlot?.id === slot.id
                              ? 'bg-primary-100 border border-primary-300'
                              : 'bg-white border border-gray-200 hover:border-primary-300 cursor-pointer'
                        }`}
                        onClick={() => !slot.isBooked && onSelectSlot(slot)}
                      >
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <div>
                          {slot.isBooked ? (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                              Booked
                            </span>
                          ) : (
                            <span className="font-medium text-primary-700">
                              {formatCurrency(slot.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4 text-sm text-gray-500">
                      No slots available
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};