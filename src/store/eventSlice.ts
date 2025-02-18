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
  participants: Participant[]; 
}



interface EventState {
  events: Event[];
}
const initialState: EventState = {
  events: [],
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
