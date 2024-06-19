import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { fetchUserComplaints } from '../services/complaintApi';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { listEnergyData } from '../services/energyConsumptionApi';
import { Complaint, ComplaintStatusCounts } from '../types/complaints';
import { DailyElectricityData, EnergyData } from '../types/energyConsumption';
import { formatDate, parseCustomDate } from '../utils/dateUtils';
import { DataTransformer } from 'powerdatautils';

interface PieChartData {
  name: string;
  value: number;
}


const peakRate = 0.20; // $0.20 per unit during peak hours
const offPeakRate = 0.10; // $0.10 per unit during off-peak hours
const TOKEN_KEY = 'token';



const HomeScreen: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [dailyElectricityData, setDailyElectricityData] = useState<DailyElectricityData[]>([]);
  const [peakOffPeakData, setPeakOffPeakData] = useState<PieChartData[]>([]);
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const auth = useSelector((state: RootState) => state.auth);
  const [sortKey, setSortKey] = useState<keyof DailyElectricityData | null>(null);
  const [sortOrder, setSortOrder] = useState<boolean>(true);

  const handleSortChange = (key: keyof DailyElectricityData) => {
    const newSortOrder = sortKey !== key || !sortOrder;
    setSortOrder(newSortOrder);
    const sortedData = DataTransformer.sortData(dailyElectricityData, key, newSortOrder);
    setDailyElectricityData(sortedData); 
    setSortKey(key); 
  };

  useEffect(() => {
    if (sortKey) {
      const sortedData = DataTransformer.sortData(dailyElectricityData, sortKey, sortOrder);
      setDailyElectricityData(sortedData);
    }
  }, [sortKey, sortOrder]);
  const fetchEnergyData = async () => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!auth.user || !auth.user.userId || !storedToken) {
        console.error('User or userId not found');
        return;
      }
      const response = await listEnergyData(auth.user.userId)
      const data = response.energyData;
      return data;
    } catch (error) {
      console.error('Error fetching energy data:', error);
      return [];
    }
  };

  

  const calculatePeakOffPeak = (energyData: EnergyData[]) => {
    let peakUnits = 0;
    let offPeakUnits = 0;
  
    energyData.forEach(data => {
      const date = parseCustomDate(data.timeStamp);
  
      if (date) {
        const hour = date.getHours();
        if (hour >= 17 && hour < 21) {
          peakUnits += data.energyConsumption;
        } else {
          offPeakUnits += data.energyConsumption;
        }
      }
    });
  
    return [
      { name: 'Peak Hours', value: Number(peakUnits.toFixed(4)) },
      { name: 'Off-Peak Hours', value: Number(offPeakUnits.toFixed(4)) }
    ];
  };
  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        try {
          const complaintsResponse = await fetchUserComplaints();
          setComplaints(complaintsResponse.complaints);
          const fetchedEnergyData = await fetchEnergyData();
          setEnergyData(fetchedEnergyData);


          const dailyDataAccumulator: Record<string, { totalUnits: number; totalCost: number; }> = {};
          fetchedEnergyData.forEach((data: EnergyData) => {
            const date = parseCustomDate(data.timeStamp);
            if (!date) return; 
          

            const dateKey = formatDate(date);
            if (!dailyDataAccumulator[dateKey]) {
              dailyDataAccumulator[dateKey] = { totalUnits: 0, totalCost: 0 };
            }
          
            const hour = date.getHours();
            const rate = hour >= 17 && hour < 21 ? peakRate : offPeakRate;
            dailyDataAccumulator[dateKey].totalUnits += data.energyConsumption;
            dailyDataAccumulator[dateKey].totalCost += data.energyConsumption * rate;
          });
          setDailyElectricityData(Object.entries(dailyDataAccumulator).map(([dateKey, data]) => ({
            day: new Date(dateKey).getDate(),
            totalUnits: data.totalUnits,
            totalCost: data.totalCost,
          })));
          
        const peakOffPeakData = calculatePeakOffPeak(fetchedEnergyData);
        setPeakOffPeakData(peakOffPeakData);


        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        setComplaints([]);
        setDailyElectricityData([]);
        setPeakOffPeakData([]);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const getStatusChartData = () => {
    const statusCounts = complaints.reduce<ComplaintStatusCounts>((acc, complaint) => {
      const statusKey = complaint.status as keyof ComplaintStatusCounts;
      acc[statusKey] = (acc[statusKey] || 0) + 1;
      return acc;
    }, { Pending: 0, Completed: 0 });

    return ['Pending', 'Completed'].map(status => ({
      name: status,
      count: statusCounts[status],
      fill: status === 'Pending' ? 'red' : 'green'
    }));
  };

  const COLORS = ['#0088FE', '#00C49F'];


  return (
    <Grid container spacing={2}>
      {/* Complaints Bar Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={{ padding: 2, margin: 2 }}>
          <CardContent>
            <Typography variant="h5">User Complaints</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getStatusChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Complaints">
                  {getStatusChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Daily Electricity Data Bar Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={{ padding: 2, margin: 2 }}>
          <CardContent>
            <Typography variant="h5">Daily Electricity Consumption and Cost</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyElectricityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day"/>
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Units (kWh)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Cost ($)', angle: 90, position: 'insideRight' }} />
              <Tooltip 
                formatter={(value, name, props) => [value, name]}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="totalUnits" fill="#8884d8" name="Total Electricity Units" onClick={() => handleSortChange('totalCost')}/>
              <Bar yAxisId="right" dataKey="totalCost" fill="#82ca9d" name="Total Cost" onClick={() => handleSortChange('totalCost')} />
            </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Peak and Off-Peak Pie Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={{ padding: 2, margin: 2 }}>
          <CardContent>
            <Typography variant="h5">Peak vs Off-Peak Electricity Usage</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={peakOffPeakData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {
                    peakOffPeakData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  }
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default HomeScreen;
