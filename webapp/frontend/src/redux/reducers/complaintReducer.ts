import { Reducer } from 'redux';
import { ADD_COMPLAINT } from '../constants/complaintConstant';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: string;
  timeStamp: number;
  userId: string;
}

interface ComplaintState {
  complaints: Complaint[];
}

const initialState: ComplaintState = {
  complaints: [],
};

type ComplaintAction = { type: typeof ADD_COMPLAINT; payload: Complaint };

const complaintReducer: Reducer<ComplaintState, ComplaintAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case ADD_COMPLAINT:
      return {
        ...state,
        complaints: [...state.complaints, action.payload],
      };
    default:
      return state;
  }
};

export default complaintReducer;
