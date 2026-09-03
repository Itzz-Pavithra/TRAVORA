// ===================================================
// TRAVORA — Trip Service (JavaScript Data Layer)
// ===================================================
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '$lib/firebase/client.js';

export const tripService = {
  // TRIPS
  async getById(id) {
    if (!db || !id) return null;
    const snap = await getDoc(doc(db, 'trips', id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },

  async getByUser(userId) {
    if (!db || !userId) return [];
    const q1 = query(collection(db, 'trips'), where('ownerId', '==', userId));
    const q2 = query(collection(db, 'trips'), where('memberIds', 'array-contains', userId));
    
    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    const map = new Map();

    snap1.docs.forEach(d => map.set(d.id, { id: d.id, ...d.data() }));
    snap2.docs.forEach(d => map.set(d.id, { id: d.id, ...d.data() }));

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  },

  subscribeToTrips(userId, callback) {
    if (!db || !userId) {
      callback([]);
      return () => {};
    }
    const q = query(collection(db, 'trips'), where('memberIds', 'array-contains', userId));
    return onSnapshot(q, (snapshot) => {
      const tripsList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(tripsList);
    });
  },

  async create(trip) {
    if (!db) throw new Error('Firestore not initialized');
    const tripRef = doc(collection(db, 'trips'));
    const createdAt = new Date().toISOString();
    
    const memberIds = Array.from(new Set([trip.ownerId, ...(trip.memberIds || [])]));
    const newTrip = {
      ...trip,
      id: tripRef.id,
      memberIds,
      createdAt
    };

    await setDoc(tripRef, {
      ...newTrip,
      createdAtTimestamp: serverTimestamp()
    });

    // Create owner member document in subcollection
    const ownerMemberRef = doc(collection(db, `trips/${tripRef.id}/members`));
    await setDoc(ownerMemberRef, {
      id: ownerMemberRef.id,
      tripId: tripRef.id,
      userId: trip.ownerId,
      name: 'Trip Owner',
      email: '',
      role: 'owner',
      avatarColor: '#173F35',
      joinedAt: createdAt,
      status: 'active'
    });

    // Create default Day 1 itinerary
    const dayRef = doc(collection(db, `trips/${tripRef.id}/itinerary`));
    await setDoc(dayRef, {
      id: dayRef.id,
      tripId: tripRef.id,
      dayNumber: 1,
      date: trip.startDate,
      title: `Day 1 — Arrival & Exploration`,
      items: []
    });

    return newTrip;
  },

  async update(id, updates) {
    if (!db || !id) return null;
    const ref = doc(db, 'trips', id);
    await updateDoc(ref, updates);
    return this.getById(id);
  },

  async delete(id) {
    if (!db || !id) return false;
    await deleteDoc(doc(db, 'trips', id));
    return true;
  },

  // MEMBERS
  async getMembers(tripId) {
    if (!db || !tripId) return [];
    const snap = await getDocs(collection(db, `trips/${tripId}/members`));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  subscribeToMembers(tripId, callback) {
    if (!db || !tripId) { callback([]); return () => {}; }
    return onSnapshot(collection(db, `trips/${tripId}/members`), (snapshot) => {
      const members = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(members);
    });
  },

  async addMember(tripId, member) {
    if (!db) throw new Error('Firestore not initialized');
    const ref = doc(collection(db, `trips/${tripId}/members`));
    const newMember = {
      ...member,
      id: ref.id,
      tripId
    };
    await setDoc(ref, newMember);

    const trip = await this.getById(tripId);
    if (trip && member.userId) {
      const updatedMemberIds = Array.from(new Set([...trip.memberIds, member.userId]));
      await updateDoc(doc(db, 'trips', tripId), { memberIds: updatedMemberIds });
    }

    return newMember;
  },

  async removeMember(tripId, memberId, userId) {
    if (!db) return false;
    await deleteDoc(doc(db, `trips/${tripId}/members`, memberId));
    if (userId) {
      const trip = await this.getById(tripId);
      if (trip) {
        const updated = trip.memberIds.filter(id => id !== userId);
        await updateDoc(doc(db, 'trips', tripId), { memberIds: updated });
      }
    }
    return true;
  },

  // ITINERARY
  async getItinerary(tripId) {
    if (!db || !tripId) return [];
    const snap = await getDocs(collection(db, `trips/${tripId}/itinerary`));
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => a.dayNumber - b.dayNumber);
  },

  subscribeToItinerary(tripId, callback) {
    if (!db || !tripId) { callback([]); return () => {}; }
    return onSnapshot(collection(db, `trips/${tripId}/itinerary`), (snapshot) => {
      const days = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => a.dayNumber - b.dayNumber);
      callback(days);
    });
  },

  async createDay(tripId, day) {
    if (!db) throw new Error('Firestore not initialized');
    const ref = doc(collection(db, `trips/${tripId}/itinerary`));
    const newDay = {
      ...day,
      id: ref.id,
      tripId,
      items: day.items || []
    };
    await setDoc(ref, newDay);
    return newDay;
  },

  async updateDay(tripId, dayId, updates) {
    if (!db) return;
    await updateDoc(doc(db, `trips/${tripId}/itinerary`, dayId), updates);
  },

  async addItem(tripId, dayId, item) {
    if (!db) throw new Error('Firestore not initialized');
    const dayRef = doc(db, `trips/${tripId}/itinerary`, dayId);
    const snap = await getDoc(dayRef);
    const day = snap.data();

    const newItem = {
      ...item,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      dayId,
      tripId
    };

    const items = [...(day?.items || []), newItem];
    await updateDoc(dayRef, { items });
    return newItem;
  },

  async updateItem(tripId, dayId, itemId, updates) {
    if (!db) return;
    const dayRef = doc(db, `trips/${tripId}/itinerary`, dayId);
    const snap = await getDoc(dayRef);
    const day = snap.data();
    if (!day) return;
    const items = day.items.map(i => i.id === itemId ? { ...i, ...updates } : i);
    await updateDoc(dayRef, { items });
  },

  async deleteItem(tripId, dayId, itemId) {
    if (!db) return;
    const dayRef = doc(db, `trips/${tripId}/itinerary`, dayId);
    const snap = await getDoc(dayRef);
    const day = snap.data();
    if (!day) return;
    const items = day.items.filter(i => i.id !== itemId);
    await updateDoc(dayRef, { items });
  },

  // TRANSPORT & ACCOMMODATION & ACTIVITIES
  async getTransportation(tripId) {
    if (!db || !tripId) return [];
    const snap = await getDocs(collection(db, `trips/${tripId}/transportation`));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  async addTransportation(tripId, transport) {
    const ref = doc(collection(db, `trips/${tripId}/transportation`));
    const item = { ...transport, id: ref.id, tripId };
    await setDoc(ref, item);
    return item;
  },

  async deleteTransportation(tripId, id) {
    await deleteDoc(doc(db, `trips/${tripId}/transportation`, id));
  },

  async getAccommodations(tripId) {
    if (!db || !tripId) return [];
    const snap = await getDocs(collection(db, `trips/${tripId}/accommodations`));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  async addAccommodation(tripId, accom) {
    const ref = doc(collection(db, `trips/${tripId}/accommodations`));
    const item = { ...accom, id: ref.id, tripId };
    await setDoc(ref, item);
    return item;
  },

  async deleteAccommodation(tripId, id) {
    await deleteDoc(doc(db, `trips/${tripId}/accommodations`, id));
  },

  async getActivities(tripId) {
    if (!db || !tripId) return [];
    const snap = await getDocs(collection(db, `trips/${tripId}/activities`));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  async addActivity(tripId, act) {
    const ref = doc(collection(db, `trips/${tripId}/activities`));
    const item = { ...act, id: ref.id, tripId };
    await setDoc(ref, item);
    return item;
  },

  async deleteActivity(tripId, id) {
    await deleteDoc(doc(db, `trips/${tripId}/activities`, id));
  },

  // EXPENSES & TRAVORA SPLIT
  async getExpenses(tripId) {
    if (!db || !tripId) return [];
    const snap = await getDocs(collection(db, `trips/${tripId}/expenses`));
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  },

  subscribeToExpenses(tripId, callback) {
    if (!db || !tripId) { callback([]); return () => {}; }
    return onSnapshot(collection(db, `trips/${tripId}/expenses`), (snapshot) => {
      const expenses = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      callback(expenses);
    });
  },

  async addExpense(tripId, expense) {
    if (!db) throw new Error('Firestore not initialized');
    const ref = doc(collection(db, `trips/${tripId}/expenses`));
    const newExpense = {
      ...expense,
      id: ref.id,
      tripId,
      createdAt: new Date().toISOString()
    };
    await setDoc(ref, newExpense);

    const expenses = await this.getExpenses(tripId);
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    await updateDoc(doc(db, 'trips', tripId), { budgetSpent: totalSpent });

    return newExpense;
  },

  async deleteExpense(tripId, expenseId) {
    if (!db) return false;
    await deleteDoc(doc(db, `trips/${tripId}/expenses`, expenseId));
    
    const expenses = await this.getExpenses(tripId);
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    await updateDoc(doc(db, 'trips', tripId), { budgetSpent: totalSpent });
    return true;
  },

  calculateSettlement(expenses, members) {
    if (!expenses.length || !members.length) return [];

    const balance = {};
    members.forEach(m => { balance[m.userId] = 0; });

    expenses.forEach(exp => {
      const participants = exp.participants?.length ? exp.participants : members.map(m => m.userId);
      const share = exp.amount / participants.length;

      balance[exp.paidBy] = (balance[exp.paidBy] || 0) + exp.amount;
      participants.forEach(pid => {
        balance[pid] = (balance[pid] || 0) - share;
      });
    });

    const settlements = [];
    const memberNameMap = new Map(members.map(m => [m.userId, m.name]));

    const creditors = Object.keys(balance).filter(id => balance[id] > 0.01);
    const debtors = Object.keys(balance).filter(id => balance[id] < -0.01);

    creditors.forEach(creditorId => {
      let credit = balance[creditorId];
      debtors.forEach(debtorId => {
        let debt = -balance[debtorId];
        if (credit > 0.01 && debt > 0.01) {
          const amount = Math.min(credit, debt);
          settlements.push({
            from: debtorId,
            fromName: memberNameMap.get(debtorId) || debtorId,
            to: creditorId,
            toName: memberNameMap.get(creditorId) || creditorId,
            amount: Math.round(amount * 100) / 100
          });
          credit -= amount;
          balance[debtorId] += amount;
        }
      });
    });

    return settlements;
  },

  // CHAT MESSAGES
  async getMessages(tripId) {
    if (!db || !tripId) return [];
    const snap = await getDocs(collection(db, `trips/${tripId}/messages`));
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());
  },

  subscribeToMessages(tripId, callback) {
    if (!db || !tripId) { callback([]); return () => {}; }
    return onSnapshot(collection(db, `trips/${tripId}/messages`), (snapshot) => {
      const messages = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime());
      callback(messages);
    });
  },

  async sendMessage(tripId, message) {
    if (!db) throw new Error('Firestore not initialized');
    const ref = doc(collection(db, `trips/${tripId}/messages`));
    const newMsg = {
      ...message,
      id: ref.id,
      tripId,
      timestamp: new Date().toISOString()
    };
    await setDoc(ref, newMsg);
    return newMsg;
  },

  // GROUP POLLS
  async getPolls(tripId) {
    if (!db || !tripId) return [];
    const snap = await getDocs(collection(db, `trips/${tripId}/polls`));
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  },

  subscribeToPolls(tripId, callback) {
    if (!db || !tripId) { callback([]); return () => {}; }
    return onSnapshot(collection(db, `trips/${tripId}/polls`), (snapshot) => {
      const polls = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      callback(polls);
    });
  },

  async createPoll(tripId, poll) {
    if (!db) throw new Error('Firestore not initialized');
    const ref = doc(collection(db, `trips/${tripId}/polls`));
    const newPoll = {
      ...poll,
      id: ref.id,
      tripId,
      createdAt: new Date().toISOString(),
      status: 'active',
      votedBy: []
    };
    await setDoc(ref, newPoll);
    return newPoll;
  },

  async votePoll(tripId, pollId, optionId, userId) {
    if (!db) return;
    const pollRef = doc(db, `trips/${tripId}/polls`, pollId);
    const snap = await getDoc(pollRef);
    if (!snap.exists()) return;

    const poll = snap.data();
    if (poll.votedBy?.includes(userId)) return;

    const updatedOptions = poll.options.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, votes: Array.from(new Set([...(opt.votes || []), userId])) };
      }
      return opt;
    });

    const updatedVotedBy = Array.from(new Set([...(poll.votedBy || []), userId]));
    await updateDoc(pollRef, { options: updatedOptions, votedBy: updatedVotedBy });
  },

  async closePoll(tripId, pollId) {
    if (!db) return;
    await updateDoc(doc(db, `trips/${tripId}/polls`, pollId), { status: 'closed' });
  },

  // TRAVEL FUN
  async getChallenges(tripId) {
    if (!db || !tripId) return [];
    const snap = await getDocs(collection(db, `trips/${tripId}/challenges`));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  async toggleChallenge(tripId, challengeId, text, userId) {
    if (!db) return;
    const ref = doc(db, `trips/${tripId}/challenges`, challengeId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const challenge = snap.data();
      const completedBy = challenge.completedBy?.includes(userId)
        ? challenge.completedBy.filter(id => id !== userId)
        : [...(challenge.completedBy || []), userId];
      await updateDoc(ref, { completedBy });
    } else {
      await setDoc(ref, { id: challengeId, tripId, text, completedBy: [userId] });
    }
  }
};
