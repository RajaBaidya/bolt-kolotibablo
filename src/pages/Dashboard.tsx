import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Grid, Card, CardContent } from '@mui/material';
import { Activity, DollarSign, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import UserNavbar from '../components/UserNavbar';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return navigate('/login');

        const { data: profile } = await supabase
          .from('profiles')
          .select(`
            *,
            users (
              earnings,
              completed_tasks,
              tokens
            )
          `)
          .eq('id', authUser.id)
          .single();

        if (profile?.is_admin) {
          navigate('/admin');
          return;
        }

        setUser({
          ...authUser,
          ...profile,
          earnings: profile?.users?.earnings || 0,
          completed_tasks: profile?.users?.completed_tasks || 0,
          tokens: profile?.users?.tokens || 0
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [navigate]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <UserNavbar user={user} />
      
      <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card className="dashboard-card bg-[#1a1a1a] text-white">
              <CardContent className="card-content flex items-center">
                <Activity className="card-icon text-[#00ffff] mr-4" size={40} />
                <div>
                  <Typography variant="h6" className="card-title text-gray-400">
                    Total Tasks
                  </Typography>
                  <Typography variant="h4" className="card-value">
                    {user.completed_tasks}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="dashboard-card bg-[#1a1a1a] text-white">
              <CardContent className="card-content flex items-center">
                <DollarSign className="card-icon text-[#00ffff] mr-4" size={40} />
                <div>
                  <Typography variant="h6" className="card-title text-gray-400">
                    Total Earnings
                  </Typography>
                  <Typography variant="h4" className="card-value">
                    ${user.earnings}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card className="dashboard-card bg-[#1a1a1a] text-white">
              <CardContent className="card-content flex items-center">
                <CheckCircle className="card-icon text-[#00ffff] mr-4" size={40} />
                <div>
                  <Typography variant="h6" className="card-title text-gray-400">
                    Available Tasks
                  </Typography>
                  <Typography variant="h4" className="card-value">
                    {user.tokens}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Paper className="tasks-container bg-[#1a1a1a] text-white p-6">
              <Typography variant="h5" gutterBottom className="section-title">
                Available Tasks
              </Typography>
              <Typography variant="body1" className="empty-state text-gray-400">
                No tasks available at the moment.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}