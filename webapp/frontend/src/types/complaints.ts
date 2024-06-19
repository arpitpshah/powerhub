export interface Complaint {
    id: string;
    title: string;
    description: string;
    status: string;
    timeStamp: number;
    userId: string;
  }

export interface ComplaintStatusCounts {
    Pending: number;
    Completed: number;
    [key: string]: number;
  }

  export interface ComplaintData {
    id: string;
    description: string;
    status: 'Pending' | 'Completed';
  }