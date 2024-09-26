// lib/redux/visitSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchVisits = createAsyncThunk(
  'visits/fetchVisits',
  async () => {
    const response = await fetch('/api/visits');
    if (!response.ok) {
      throw new Error('Failed to fetch visits');
    }
    return response.json();
  }
);

export const addVisitAsync = createAsyncThunk(
  'visits/addVisit',
  async (visitData) => {
    const response = await fetch('/api/visits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitData),
    });
    if (!response.ok) {
      throw new Error('Failed to add visit');
    }
    return response.json();
  }
);

export const updateVisitStatusAsync = createAsyncThunk(
  'visits/updateVisitStatus',
  async ({ id, status }) => {
    const response = await fetch(`/api/visits/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update visit status');
    }
    return response.json();
  }
);



export const hideVisitAsync = createAsyncThunk(
  'visits/hideVisit',
  async (id) => {
    const response = await fetch(`/api/visits/${id}/hide`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to hide visit');
    }
    return response.json();
  }
);


export const deleteVisitAsync = createAsyncThunk(
  'visits/deleteVisit',
  async (id) => {
    const response = await fetch(`/api/visits/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete visit');
    }
    return id;
  }
);

const initialState = {
  visits: [],
  status: 'idle',
  error: null,
};


const visitSlice = createSlice({
  name: 'visits',
  initialState,
  reducers: {
    addVisitToStore: (state, action) => {
      const newVisit = action.payload;
      const existingVisit = state.visits.find(visit => visit._id === newVisit._id);
      if (!existingVisit) {
        state.visits.unshift(newVisit); // إضافة الزيارة الجديدة في بداية المصفوفة
      }
    },
    hideVisitInStore: (state, action) => {
      const index = state.visits.findIndex(visit => visit._id === action.payload);
      if (index !== -1) {
        state.visits[index].isHidden = true;
      }
    },
    updateVisitInStore: (state, action) => {
      const index = state.visits.findIndex(visit => visit._id === action.payload._id);
      if (index !== -1) {
        state.visits[index] = action.payload;
      }
    },

    removeVisitFromStore: (state, action) => {
      state.visits = state.visits.filter(visit => visit._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisits.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVisits.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.visits = action.payload;
      })
      .addCase(fetchVisits.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addVisitAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addVisitAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(addVisitAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateVisitStatusAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateVisitStatusAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.visits.findIndex(v => v._id === action.payload._id);
        if (index !== -1) {
          state.visits[index] = action.payload;
        }
      })
      .addCase(updateVisitStatusAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(hideVisitAsync.fulfilled, (state, action) => {
        const index = state.visits.findIndex(visit => visit._id === action.payload._id);
        if (index !== -1) {
          state.visits[index].isHidden = true;
        }
      })
      .addCase(deleteVisitAsync.fulfilled, (state, action) => {
        state.visits = state.visits.filter(visit => visit._id !== action.payload);
      });
  },
});

export const { addVisitToStore,removeVisitFromStore , updateVisitInStore, hideVisitInStore } = visitSlice.actions;

export default visitSlice.reducer;