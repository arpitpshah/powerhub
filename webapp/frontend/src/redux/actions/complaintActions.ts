import { ADD_COMPLAINT } from "../constants/complaintConstant";

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: string;
  timeStamp: number;
  userId: string;
}

export const addComplaintSuccess = (complaint: Complaint) => ({
  type: ADD_COMPLAINT as typeof ADD_COMPLAINT,
  payload: complaint,
});
export { ADD_COMPLAINT };

