import React, { useState } from 'react';
import { 
  Users, 
  Utensils, 
  MapPin, 
  Search, 
  Check, 
  ArrowRightLeft, 
  GripVertical,
  LayoutGrid,
  ListFilter,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  UserCheck,
  ShieldCheck,
  X
} from 'lucide-react';
import { Guest, UserRole } from '../types/wedding';
import { TABLES, calculateTableStats, TableConfig } from '../utils/seating';

interface GuestSeatingPlanProps {
  guests: Guest[];
  userRole: UserRole;
  onUpdateTableNumber: (guestId: string, newTable: number) => void;
}

export const GuestSeatingPlan: React.FC<GuestSeatingPlanProps> = ({
  guests,
  userRole,
  onUpdateTableNumber,
}) => {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [selectedTableId, setSelectedTableId] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reassignGuestId, setReassignGuestId] = useState<string | null>(null);
  const [targetTable, setTargetTable] = useState<number>(1);

  // Drag and drop states
  const [draggedGuestId, setDraggedGuestId] = useState<string | null>(null);
  const [dragOverTableId, setDragOverTableId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    id: number;
    guestName: string;
    tableName: string;
    tableId: number;
  } | null>(null);

  const isCouple = userRole === 'Couple';

  const showToast = (guestName: string, tableConfig: TableConfig) => {
    setToastMessage({
      id: Date.now(),
      guestName,
      tableName: tableConfig.name,
      tableId: tableConfig.id,
    });
    setTimeout(() => {
      setToastMessage((prev) => (prev && Date.now() - prev.id >= 3800 ? null : prev));
    }, 4000);
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, guest: Guest) => {
    if (!isCouple) return;
    setDraggedGuestId(guest.id);
    e.dataTransfer.setData('text/plain', guest.id);
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ guestId: guest.id, guestName: guest.name, currentTable: guest.tableNumber || 1 })
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedGuestId(null);
    setDragOverTableId(null);
  };

  const handleDragOver = (e: React.DragEvent, tableId: number) => {
    if (!isCouple) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverTableId !== tableId) {
      setDragOverTableId(tableId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, tableId: number) => {
    // Only clear if leaving the table container itself
    if (e.currentTarget === e.target && dragOverTableId === tableId) {
      setDragOverTableId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetTableId: number) => {
    if (!isCouple) return;
    e.preventDefault();
    const guestId = e.dataTransfer.getData('text/plain') || draggedGuestId;
    if (!guestId) {
      setDraggedGuestId(null);
      setDragOverTableId(null);
      return;
    }

    const guest = guests.find((g) => g.id === guestId);
    const targetTableConfig = TABLES.find((t) => t.id === targetTableId) || TABLES[0];

    if (guest) {
      if ((guest.tableNumber || 1) === targetTableId) {
        // Already seated at this table
        setDraggedGuestId(null);
        setDragOverTableId(null);
        return;
      }
      onUpdateTableNumber(guestId, targetTableId);
      showToast(guest.name, targetTableConfig);
    }

    setDraggedGuestId(null);
    setDragOverTableId(null);
  };

  // Quick fallback reassign click handler
  const handleSelectReassign = (guestId: string) => {
    const guest = guests.find((g) => g.id === guestId);
    const tbl = TABLES.find((t) => t.id === targetTable) || TABLES[0];
    onUpdateTableNumber(guestId, targetTable);
    if (guest) {
      showToast(guest.name, tbl);
    }
    setReassignGuestId(null);
  };

  // Filter guests for directory view
  const filteredGuests = guests.filter((g) => {
    const matchesSearch = 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.plusOneName && g.plusOneName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (g.dietary && g.dietary.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedTableId === 'all') return matchesSearch;
    return matchesSearch && (g.tableNumber || 1) === selectedTableId;
  });

  const draggedGuest = guests.find((g) => g.id === draggedGuestId);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle flex items-center gap-3 bg-stone-900 text-stone-50 px-4 py-3 rounded-2xl shadow-xl border border-rose-500/30 max-w-md">
          <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-white">Guest Reassigned Successfully</p>
            <p className="text-stone-300">
              <span className="font-semibold text-rose-300">{toastMessage.guestName}</span> is now seated at{' '}
              <span className="font-mono text-emerald-300">Table 0{toastMessage.tableId}</span> ({toastMessage.tableName}).
            </p>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white p-1 ml-auto"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-rose-800 font-semibold font-mono">
              Banquet Architecture
            </span>
            {isCouple ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-rose-100 text-rose-800 border border-rose-200">
                <ShieldCheck className="w-3 h-3 text-rose-600" />
                Drag & Drop Reassign Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-stone-100 text-stone-600 border border-stone-200">
                <UserCheck className="w-3 h-3 text-stone-500" />
                Guest View Only
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1">
            Guest Seating Plan & Banquet Tables
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            {isCouple 
              ? 'Drag guest cards between tables to easily balance table capacities, plus-ones, and dietary logistics across Villa La Selva.'
              : 'Browse assigned banquet tables, seating configurations, and Courtyard locations for all wedding attendees.'}
          </p>
        </div>

        {/* View Switcher and Total Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                viewMode === 'board'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Table Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Directory List</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-600 font-mono bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
            <Users className="w-3.5 h-3.5 text-rose-600" />
            <span>{guests.length} Guests</span>
          </div>
        </div>
      </div>

      {/* Drag & Drop Instruction Callout for Couple */}
      {isCouple && (
        <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border border-rose-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs text-rose-950">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-rose-200/70 text-rose-800 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-4 h-4 text-rose-700" />
            </div>
            <div>
              <p className="font-semibold text-rose-900">
                Interactive Drag-and-Drop Seating Editor
              </p>
              <p className="text-stone-600 text-[11px]">
                Click and drag any guest card (by the grip handle) and drop onto any table column or card to instantly update seating and seat counters.
              </p>
            </div>
          </div>
          {draggedGuest && (
            <div className="shrink-0 bg-white/90 border border-rose-300 px-2.5 py-1 rounded-lg font-mono text-[11px] text-rose-800 animate-pulse">
              Dragging: <strong>{draggedGuest.name}</strong>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 1: INTERACTIVE BANQUET BOARD (COLUMNS AS DROP ZONES) */}
      {viewMode === 'board' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {TABLES.map((tbl) => {
              const stats = calculateTableStats(tbl.id, tbl.capacity, guests);
              const tableGuests = guests.filter((g) => (g.tableNumber || 1) === tbl.id);
              const isDragOver = dragOverTableId === tbl.id;
              const isSourceTable = draggedGuest && (draggedGuest.tableNumber || 1) === tbl.id;

              return (
                <div
                  key={tbl.id}
                  data-testid={`table-dropzone-${tbl.id}`}
                  onDragOver={(e) => handleDragOver(e, tbl.id)}
                  onDragLeave={(e) => handleDragLeave(e, tbl.id)}
                  onDrop={(e) => handleDrop(e, tbl.id)}
                  className={`flex flex-col rounded-3xl border transition-all duration-200 min-h-[460px] ${
                    isDragOver
                      ? 'border-rose-500 bg-rose-50/90 ring-4 ring-rose-500/30 scale-[1.01] shadow-lg border-dashed'
                      : isSourceTable
                      ? 'border-stone-200 bg-stone-50/50'
                      : 'border-stone-200/90 bg-white shadow-xs hover:border-stone-300'
                  }`}
                >
                  {/* Table Column Header */}
                  <div className="p-4 border-b border-stone-100 bg-stone-50/70 rounded-t-3xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-rose-800 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                        Table 0{tbl.id}
                      </span>
                      <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                        stats.isOverCapacity 
                          ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                          : stats.isFull
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        {stats.totalSeatsOccupied}/{tbl.capacity} Seats
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-serif font-bold text-stone-900 truncate" title={tbl.name}>
                        {tbl.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1" title={tbl.theme}>
                        {tbl.theme}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-1">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="truncate">{tbl.location}</span>
                      </div>
                    </div>

                    {/* Progress Bar of Capacity */}
                    <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          stats.isOverCapacity
                            ? 'bg-rose-600'
                            : stats.isFull
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, (stats.totalSeatsOccupied / tbl.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Drop Indicator Banner when active */}
                  {isDragOver && (
                    <div className="bg-rose-500 text-white text-[11px] font-semibold text-center py-2 px-3 border-y border-rose-600 animate-pulse flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Release to seat {draggedGuest?.name || 'guest'} here</span>
                    </div>
                  )}

                  {/* Table Dietary Summary Pills (if any) */}
                  {Object.keys(stats.dietaryCounts).length > 0 && (
                    <div className="px-3 pt-2 flex flex-wrap gap-1">
                      {Object.entries(stats.dietaryCounts).map(([diet, count]) => (
                        <span 
                          key={diet} 
                          className="inline-flex items-center gap-0.5 text-[9px] font-mono px-1.5 py-0.5 bg-amber-50 text-amber-800 rounded border border-amber-200"
                        >
                          <Utensils className="w-2.5 h-2.5 text-amber-600" />
                          {count} {diet}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Guests Cards List inside Table Column */}
                  <div className="p-3 space-y-2 flex-1 overflow-y-auto max-h-[480px]">
                    {tableGuests.length === 0 ? (
                      <div className={`h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center p-4 transition-colors ${
                        isDragOver ? 'border-rose-400 bg-rose-100/40 text-rose-800' : 'border-stone-200 text-stone-400'
                      }`}>
                        <Users className="w-5 h-5 mb-1 opacity-50" />
                        <p className="text-xs font-medium">Empty Table</p>
                        <p className="text-[10px] mt-0.5">
                          {isCouple ? 'Drag and drop guests here' : 'No guests currently seated'}
                        </p>
                      </div>
                    ) : (
                      tableGuests.map((guest) => {
                        const isBeingDragged = draggedGuestId === guest.id;
                        const isReassigning = reassignGuestId === guest.id;

                        return (
                          <div
                            key={guest.id}
                            data-testid={`guest-card-${guest.id}`}
                            draggable={isCouple}
                            onDragStart={(e) => handleDragStart(e, guest)}
                            onDragEnd={handleDragEnd}
                            className={`p-2.5 rounded-xl border transition-all select-none ${
                              isBeingDragged
                                ? 'opacity-40 border-stone-300 bg-stone-100 scale-95'
                                : 'bg-white border-stone-200/90 hover:border-stone-300 shadow-2xs hover:shadow-xs'
                            } ${isCouple ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <div className="flex items-center gap-2 min-w-0">
                                {isCouple && (
                                  <div className="text-stone-300 hover:text-stone-600 shrink-0" title="Drag to reassign">
                                    <GripVertical className="w-3.5 h-3.5" />
                                  </div>
                                )}
                                <div className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                                  {guest.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-stone-900 text-xs truncate">
                                    {guest.name}
                                  </p>
                                  <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-semibold ${
                                    guest.status === 'Confirmed' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                                  }`}>
                                    {guest.status}
                                  </span>
                                </div>
                              </div>

                              {/* Click Reassign button for mobile/touch fallback */}
                              {isCouple && (
                                <button
                                  onClick={() => {
                                    setReassignGuestId(isReassigning ? null : guest.id);
                                    setTargetTable(tbl.id);
                                  }}
                                  className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
                                  title="Change Table via Menu"
                                >
                                  <ArrowRightLeft className="w-3 h-3" />
                                </button>
                              )}
                            </div>

                            {/* Plus-one display */}
                            {guest.hasPlusOne && guest.plusOneName && (
                              <div className="mt-1.5 pt-1.5 border-t border-stone-100 text-[10px] text-stone-600 flex items-center gap-1">
                                <span className="font-semibold text-rose-800">+1:</span>
                                <span className="truncate">{guest.plusOneName}</span>
                              </div>
                            )}

                            {/* Dietary badge */}
                            {guest.dietary && guest.dietary !== 'None' && (
                              <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-800">
                                <Utensils className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                                <span className="truncate">{guest.dietary}</span>
                              </div>
                            )}

                            {/* Inline click reassign popover */}
                            {isReassigning && (
                              <div className="mt-2 pt-2 border-t border-stone-200 space-y-1.5">
                                <div className="text-[10px] font-semibold text-stone-700">
                                  Move to another table:
                                </div>
                                <div className="flex items-center gap-1">
                                  <select
                                    value={targetTable}
                                    onChange={(e) => setTargetTable(Number(e.target.value))}
                                    className="text-[11px] bg-stone-50 border border-stone-300 rounded px-1.5 py-1 flex-1"
                                  >
                                    {TABLES.map((t) => (
                                      <option key={t.id} value={t.id}>
                                        T0{t.id}: {t.name}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={() => handleSelectReassign(guest.id)}
                                    className="px-2 py-1 bg-stone-900 text-white rounded text-[10px] font-semibold hover:bg-stone-800"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setReassignGuestId(null)}
                                    className="px-1 text-stone-400 hover:text-stone-700 text-xs"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: DIRECTORY LIST & TOP TABLE TARGETS */
        <div className="space-y-6">
          {/* Top Table Drop Targets & Filters */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-700 font-serif">
                Banquet Tables & Drop Zones
              </span>
              <span className="text-[11px] text-stone-500">
                Click a table to filter, or drag guest rows onto cards below
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {TABLES.map((tbl) => {
                const stats = calculateTableStats(tbl.id, tbl.capacity, guests);
                const isSelected = selectedTableId === tbl.id;
                const isDragOver = dragOverTableId === tbl.id;

                return (
                  <div
                    key={tbl.id}
                    data-testid={`list-table-target-${tbl.id}`}
                    onDragOver={(e) => handleDragOver(e, tbl.id)}
                    onDragLeave={(e) => handleDragLeave(e, tbl.id)}
                    onDrop={(e) => handleDrop(e, tbl.id)}
                    onClick={() => setSelectedTableId(isSelected ? 'all' : tbl.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isDragOver
                        ? 'border-rose-500 bg-rose-50 ring-4 ring-rose-500/20 scale-[1.02] shadow-md border-dashed'
                        : isSelected
                        ? 'border-rose-600 bg-rose-50/80 ring-2 ring-rose-600/20 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-rose-800">
                        Table 0{tbl.id}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        stats.isOverCapacity 
                          ? 'bg-rose-100 text-rose-800' 
                          : stats.isFull 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {stats.totalSeatsOccupied}/{tbl.capacity} Seats
                      </span>
                    </div>

                    <h4 className="text-sm font-serif font-bold text-stone-900 mt-1 truncate">
                      {tbl.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {tbl.theme}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-2 flex items-center gap-1 truncate">
                      <MapPin className="w-2.5 h-2.5 text-rose-500 shrink-0" />
                      <span>{tbl.location}</span>
                    </p>

                    {isDragOver && (
                      <div className="mt-2 text-[10px] font-semibold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded text-center">
                        Drop to assign to Table 0{tbl.id}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Directory Search & Guest Table */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif text-stone-900">
                  Seated Guests Directory
                </h3>
                <span className="text-xs text-stone-500 font-mono">
                  ({filteredGuests.length} displayed)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search guest or dietary..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>

                {selectedTableId !== 'all' && (
                  <button
                    onClick={() => setSelectedTableId('all')}
                    className="px-3 py-2 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl whitespace-nowrap transition-colors"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {/* Guest Table List with Drag Rows */}
            <div className="divide-y divide-stone-100 border border-stone-100 rounded-2xl overflow-hidden">
              {filteredGuests.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500">
                  No guests found matching this filter criteria.
                </div>
              ) : (
                filteredGuests.map((guest) => {
                  const currentTbl = TABLES.find((t) => t.id === (guest.tableNumber || 1)) || TABLES[0];
                  const isBeingDragged = draggedGuestId === guest.id;
                  const isReassigning = reassignGuestId === guest.id;

                  return (
                    <div
                      key={guest.id}
                      draggable={isCouple}
                      onDragStart={(e) => handleDragStart(e, guest)}
                      onDragEnd={handleDragEnd}
                      className={`p-3.5 sm:p-4 hover:bg-stone-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                        isBeingDragged ? 'opacity-40 bg-rose-50/40' : ''
                      } ${isCouple ? 'cursor-grab active:cursor-grabbing' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        {isCouple && (
                          <div className="text-stone-300 hover:text-stone-600 shrink-0" title="Drag to any table card above">
                            <GripVertical className="w-4 h-4" />
                          </div>
                        )}
                        <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-800 font-bold flex items-center justify-center shrink-0">
                          {guest.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-stone-900">{guest.name}</p>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              guest.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {guest.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500">
                            {guest.email}
                          </p>
                          {guest.hasPlusOne && guest.plusOneName && (
                            <p className="text-[11px] text-rose-800 mt-0.5">
                              +1 Guest: {guest.plusOneName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                        {/* Dietary badge */}
                        {guest.dietary && guest.dietary !== 'None' && (
                          <span className="flex items-center gap-1 text-[11px] px-2 py-1 bg-amber-50 border border-amber-200/80 rounded-lg text-amber-900 font-medium">
                            <Utensils className="w-3 h-3 text-amber-600" />
                            <span>{guest.dietary}</span>
                          </span>
                        )}

                        {/* Table Assignment info */}
                        <div className="text-right">
                          <span className="font-mono font-bold text-stone-900 block">
                            Table 0{guest.tableNumber || 1}
                          </span>
                          <span className="text-[10px] text-stone-500 block truncate max-w-36">
                            {currentTbl.name}
                          </span>
                        </div>

                        {/* Couple Reassign Affordance */}
                        {isCouple && (
                          <div>
                            {isReassigning ? (
                              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
                                <select
                                  value={targetTable}
                                  onChange={(e) => setTargetTable(Number(e.target.value))}
                                  className="text-xs bg-white border border-stone-300 rounded-lg px-2 py-1"
                                >
                                  {TABLES.map((t) => (
                                    <option key={t.id} value={t.id}>
                                      T0{t.id}: {t.name}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => handleSelectReassign(guest.id)}
                                  className="px-2 py-1 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-[11px] font-semibold"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setReassignGuestId(null)}
                                  className="px-1.5 py-1 text-stone-500 hover:text-stone-800 text-[11px]"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setReassignGuestId(guest.id);
                                  setTargetTable(guest.tableNumber || 1);
                                }}
                                className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                                title="Reassign Table"
                              >
                                <ArrowRightLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
