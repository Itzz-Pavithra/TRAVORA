// ===================================================
// TRAVORA — Trip Service
// ===================================================
import { storage } from './storage';
import type {
  Trip, TripMember, ItineraryDay, ItineraryItem,
  Expense, Settlement, Message, Poll, PollOption
} from '$lib/types';

const TRIPS_KEY      = 'trips';
const MEMBERS_KEY    = 'trip_members';
const ITINERARY_KEY  = 'itinerary_days';
const EXPENSES_KEY   = 'expenses';
const MESSAGES_KEY   = 'messages';
const POLLS_KEY      = 'polls';

// ---- TRIPS ----
export const tripService = {
  // Trips
  getAll(): Trip[] {
    return storage.getAll<Trip>(TRIPS_KEY);
  },

  getById(id: string): Trip | null {
    return storage.findOne<Trip>(TRIPS_KEY, t => t.id === id);
  },

  getByUser(userId: string): Trip[] {
    return storage.findMany<Trip>(TRIPS_KEY, t =>
      t.ownerId === userId || t.memberIds.includes(userId)
    );
  },

  create(trip: Omit<Trip, 'id' | 'createdAt'>): Trip {
    const newTrip: Trip = {
      ...trip,
      id: storage.genId(),
      createdAt: new Date().toISOString()
    };
    return storage.create(TRIPS_KEY, newTrip);
  },

  update(id: string, updates: Partial<Trip>): Trip | null {
    return storage.update<Trip>(TRIPS_KEY, id, updates);
  },

  delete(id: string): boolean {
    return storage.remove<Trip>(TRIPS_KEY, id);
  },

  // Members
  getMembers(tripId: string): TripMember[] {
    return storage.findMany<TripMember>(MEMBERS_KEY, m => m.tripId === tripId);
  },

  addMember(member: Omit<TripMember, 'id'>): TripMember {
    const newMember: TripMember = { ...member, id: storage.genId() };
    return storage.create(MEMBERS_KEY, newMember);
  },

  removeMember(memberId: string): boolean {
    return storage.remove<TripMember>(MEMBERS_KEY, memberId);
  },

  // Itinerary
  getItinerary(tripId: string): ItineraryDay[] {
    return storage.findMany<ItineraryDay>(ITINERARY_KEY, d => d.tripId === tripId)
      .sort((a, b) => a.dayNumber - b.dayNumber);
  },

  createDay(day: Omit<ItineraryDay, 'id'>): ItineraryDay {
    const newDay: ItineraryDay = { ...day, id: storage.genId() };
    return storage.create(ITINERARY_KEY, newDay);
  },

  updateDay(dayId: string, updates: Partial<ItineraryDay>): ItineraryDay | null {
    return storage.update<ItineraryDay>(ITINERARY_KEY, dayId, updates);
  },

  addItem(dayId: string, tripId: string, item: Omit<ItineraryItem, 'id' | 'dayId' | 'tripId'>): ItineraryItem | null {
    const day = storage.findOne<ItineraryDay>(ITINERARY_KEY, d => d.id === dayId);
    if (!day) return null;
    const newItem: ItineraryItem = {
      ...item,
      id: storage.genId(),
      dayId,
      tripId
    };
    const items = [...day.items, newItem];
    storage.update<ItineraryDay>(ITINERARY_KEY, dayId, { items });
    return newItem;
  },

  updateItem(dayId: string, itemId: string, updates: Partial<ItineraryItem>): boolean {
    const day = storage.findOne<ItineraryDay>(ITINERARY_KEY, d => d.id === dayId);
    if (!day) return false;
    const items = day.items.map(i => i.id === itemId ? { ...i, ...updates } : i);
    storage.update<ItineraryDay>(ITINERARY_KEY, dayId, { items });
    return true;
  },

  deleteItem(dayId: string, itemId: string): boolean {
    const day = storage.findOne<ItineraryDay>(ITINERARY_KEY, d => d.id === dayId);
    if (!day) return false;
    const items = day.items.filter(i => i.id !== itemId);
    storage.update<ItineraryDay>(ITINERARY_KEY, dayId, { items });
    return true;
  },

  // Expenses
  getExpenses(tripId: string): Expense[] {
    return storage.findMany<Expense>(EXPENSES_KEY, e => e.tripId === tripId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  addExpense(expense: Omit<Expense, 'id' | 'createdAt'>): Expense {
    const newExpense: Expense = {
      ...expense,
      id: storage.genId(),
      createdAt: new Date().toISOString()
    };
    return storage.create(EXPENSES_KEY, newExpense);
  },

  deleteExpense(id: string): boolean {
    return storage.remove<Expense>(EXPENSES_KEY, id);
  },

  calculateSettlement(tripId: string): Settlement[] {
    const expenses = this.getExpenses(tripId);
    const members = this.getMembers(tripId);

    // Map: userId → net balance (positive = owed money, negative = owes money)
    const balance: Record<string, number> = {};
    members.forEach(m => { balance[m.userId] = 0; });

    expenses.forEach(exp => {
      const share = exp.amount / exp.participants.length;
      // Payer gets credit
      balance[exp.paidBy] = (balance[exp.paidBy] || 0) + exp.amount;
      // Each participant owes their share
      exp.participants.forEach(pid => {
        balance[pid] = (balance[pid] || 0) - share;
      });
    });

    // Simplify debts
    const settlements: Settlement[] = [];
    const creditors = members.filter(m => (balance[m.userId] || 0) > 0.01);
    const debtors = members.filter(m => (balance[m.userId] || 0) < -0.01);

    creditors.forEach(creditor => {
      let credit = balance[creditor.userId];
      debtors.forEach(debtor => {
        let debt = -balance[debtor.userId];
        if (credit > 0.01 && debt > 0.01) {
          const amount = Math.min(credit, debt);
          settlements.push({
            from: debtor.userId,
            fromName: debtor.name,
            to: creditor.userId,
            toName: creditor.name,
            amount: Math.round(amount * 100) / 100
          });
          credit -= amount;
          balance[debtor.userId] += amount;
        }
      });
    });

    return settlements;
  },

  // Messages
  getMessages(tripId: string): Message[] {
    return storage.findMany<Message>(MESSAGES_KEY, m => m.tripId === tripId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  sendMessage(message: Omit<Message, 'id'>): Message {
    const newMsg: Message = { ...message, id: storage.genId() };
    return storage.create(MESSAGES_KEY, newMsg);
  },

  // Polls
  getPolls(tripId: string): Poll[] {
    return storage.findMany<Poll>(POLLS_KEY, p => p.tripId === tripId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createPoll(poll: Omit<Poll, 'id'>): Poll {
    const newPoll: Poll = { ...poll, id: storage.genId() };
    return storage.create(POLLS_KEY, newPoll);
  },

  vote(pollId: string, optionId: string, userId: string): Poll | null {
    const poll = storage.findOne<Poll>(POLLS_KEY, p => p.id === pollId);
    if (!poll || poll.votedBy.includes(userId)) return null;
    const options = poll.options.map((o: PollOption) =>
      o.id === optionId ? { ...o, votes: [...o.votes, userId] } : o
    );
    const votedBy = [...poll.votedBy, userId];
    return storage.update<Poll>(POLLS_KEY, pollId, { options, votedBy });
  },

  closePoll(pollId: string): Poll | null {
    return storage.update<Poll>(POLLS_KEY, pollId, { status: 'closed' });
  }
};
