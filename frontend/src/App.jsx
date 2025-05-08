import LugaresCercanos from './components/LugaresCercanos'
import { Container } from '@mui/material';

function App() {
  return (
    <div className="App">
      <Container maxWidth="md" sx={{ py: 4 }}>
        <LugaresCercanos />
      </Container>
    </div>
  );
}

export default App 