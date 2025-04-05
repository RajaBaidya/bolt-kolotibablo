import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Tabs,
  Tab,
  Alert,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { Users, DollarSign, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AdminNavbar from '../components/AdminNavbar';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEarnings: 0,
    pendingWithdrawals: 0
  });

  useEffect(() => {
    checkAdminAccess();
    fetchData();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return navigate('/login');

    const { data: profile } = await supabase
      .from('profiles')
      .select('*, users (*)')
      .eq('id', authUser.id)
      .single();

    if (!profile?.is_admin) {
      navigate('/dashboard');
      return;
    }

    setUser(profile);
  };

  const fetchData = async () => {
    try {
      // Fetch users with their profiles
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select(`
          *,
          users (
            earnings,
            completed_tasks
          )
        `);

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch withdrawal requests
      const { data: withdrawalsData, error: withdrawalsError } = await supabase
        .from('withdrawal_requests')
        .select(`
          *,
          profiles (username, email)
        `)
        .order('created_at', { ascending: false });

      if (withdrawalsError) throw withdrawalsError;
      setWithdrawals(withdrawalsData || []);

      // Calculate stats
      setStats({
        totalUsers: usersData?.length || 0,
        totalEarnings: usersData?.reduce((acc, user) => acc + (user.users?.earnings || 0), 0) || 0,
        pendingWithdrawals: withdrawalsData?.filter(w => w.status === 'pending').length || 0
      });
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBanUser = async (userId: string, isBanned: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: !isBanned })
        .eq('id', userId);

      if (error) throw error;
      fetchData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleWithdrawal = async (withdrawalId: string, status: 'approved' | 'denied') => {
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({
          status,
          processed_at: new Date().toISOString()
        })
        .eq('id', withdrawalId);

      if (error) throw error;
      fetchData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard min-h-screen bg-[#121212]">
      <AdminNavbar user={user} />
      
      <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
        <Typography variant="h4" className="dashboard-title text-white mb-6">
          Admin Dashboard
        </Typography>

        {error && <Alert severity="error" className="error-alert mb-2">{error}</Alert>}

        <Grid container spacing={4} className="stats-grid mb-6">
          <Grid item xs={12} md={4}>
            <Card className="stats-card bg-[#1a1a1a] text-white">
              <CardContent className="card-content flex items-center">
                <Users className="card-icon text-[#00ffff] mr-4" size={40} />
                <div>
                  <Typography variant="h6" className="stat-label text-gray-400">
                    Total Users
                  </Typography>
                  <Typography variant="h4" className="stat-value">
                    {stats.totalUsers}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="stats-card bg-[#1a1a1a] text-white">
              <CardContent className="card-content flex items-center">
                <DollarSign className="card-icon text-[#00ffff] mr-4" size={40} />
                <div>
                  <Typography variant="h6" className="stat-label text-gray-400">
                    Total Earnings
                  </Typography>
                  <Typography variant="h4" className="stat-value">
                    ${stats.totalEarnings}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="stats-card bg-[#1a1a1a] text-white">
              <CardContent className="card-content flex items-center">
                <AlertCircle className="card-icon text-[#00ffff] mr-4" size={40} />
                <div>
                  <Typography variant="h6" className="stat-label text-gray-400">
                    Pending Withdrawals
                  </Typography>
                  <Typography variant="h4" className="stat-value">
                    {stats.pendingWithdrawals}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper className="content-panel bg-[#1a1a1a]">
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            className="panel-tabs border-b border-gray-800"
            textColor="inherit"
            TabIndicatorProps={{
              style: { backgroundColor: '#00ffff' }
            }}
          >
            <Tab label="Users" className="tab-item text-white" />
            <Tab label="Withdrawals" className="tab-item text-white" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <TableContainer>
              <Table className="users-table">
                <TableHead>
                  <TableRow>
                    <TableCell className="table-header text-gray-400">Username</TableCell>
                    <TableCell className="table-header text-gray-400">Email</TableCell>
                    <TableCell align="right" className="table-header text-gray-400">Earnings</TableCell>
                    <TableCell align="right" className="table-header text-gray-400">Completed Tasks</TableCell>
                    <TableCell className="table-header text-gray-400">Status</TableCell>
                    <TableCell className="table-header text-gray-400">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="table-row">
                      <TableCell className="table-cell text-white">{user.username}</TableCell>
                      <TableCell className="table-cell text-white">{user.email}</TableCell>
                      <TableCell align="right" className="table-cell text-white">${user.users?.earnings || 0}</TableCell>
                      <TableCell align="right" className="table-cell text-white">{user.users?.completed_tasks || 0}</TableCell>
                      <TableCell className="table-cell">
                        {user.is_banned ? (
                          <Typography color="error" className="status-text">Banned</Typography>
                        ) : (
                          <Typography color="success" className="status-text">Active</Typography>
                        )}
                      </TableCell>
                      <TableCell className="table-cell">
                        <Button
                          variant="contained"
                          color={user.is_banned ? "success" : "error"}
                          onClick={() => handleBanUser(user.id, user.is_banned)}
                          className="action-button"
                        >
                          {user.is_banned ? "Unban" : "Ban"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <TableContainer>
              <Table className="withdrawals-table">
                <TableHead>
                  <TableRow>
                    <TableCell className="table-header text-gray-400">User</TableCell>
                    <TableCell align="right" className="table-header text-gray-400">Amount</TableCell>
                    <TableCell className="table-header text-gray-400">Status</TableCell>
                    <TableCell className="table-header text-gray-400">Requested</TableCell>
                    <TableCell className="table-header text-gray-400">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id} className="table-row">
                      <TableCell className="table-cell text-white">{withdrawal.profiles?.username}</TableCell>
                      <TableCell align="right" className="table-cell text-white">${withdrawal.amount}</TableCell>
                      <TableCell className="table-cell text-white">{withdrawal.status}</TableCell>
                      <TableCell className="table-cell text-white">
                        {new Date(withdrawal.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="table-cell">
                        {withdrawal.status === 'pending' && (
                          <Box className="action-buttons">
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{ mr: 1 }}
                              onClick={() => handleWithdrawal(withdrawal.id, 'approved')}
                              className="approve-button"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleWithdrawal(withdrawal.id, 'denied')}
                              className="deny-button"
                            >
                              Deny
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Paper>
      </Container>
    </div>
  );
}