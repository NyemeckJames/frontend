import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Ticket {
  type: "Gratuit" | "Payant"; // ✅ Ajout du type obligatoire
  price?: number;
  quantity: number;
}

interface Participant {
  id: string;
  name: string;
  email: string;
}

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  isPaidEvent: boolean;
  tickets: Ticket[];
  participants: Participant[]; // ✅ Liste des participants (obligatoire)
}

interface EventState {
  events: Event[];
}

const initialState: EventState = {
  events: [
    {
      id: "1",
      name: "Concert de Jazz",
      description: "Un concert de jazz à Bruxelles",
      date: "2025-05-12",
      location: "Bruxelles",
      isPaidEvent: true, // ✅ Ajouté pour éviter les erreurs
      tickets: [
        { type: "Payant", price: 20, quantity: 100 }, // ✅ Ajout du `type`
        { type: "Gratuit", quantity: 50 }, // ✅ Ajout du `type`
      ],
      participants: [
        { id: "101", name: "Alice Dupont", email: "alice@example.com" },
        { id: "102", name: "Bob Martin", email: "bob@example.com" },
      ],
    },
  ],
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter((event) => event.id !== action.payload);
    },
    addParticipant: (state, action: PayloadAction<{ eventId: string; participant: Participant }>) => {
      const event = state.events.find((e) => e.id === action.payload.eventId);
      if (event) {
        event.participants.push(action.payload.participant);
      }
    },
  },
});

export const { addEvent, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;
